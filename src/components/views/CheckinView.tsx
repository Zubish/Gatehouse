import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import { generateQrGrid } from '../../utils/qrGenerator';
import type { Guest } from '../../types';

function fmtTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export const CheckinView: React.FC = () => {
  const { guests, checkInGuest, processQrScan, activeEvent } = useGatehouse();

  const [inputVal, setInputVal] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [cameraSimulating, setCameraSimulating] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  const [statusBanner, setStatusBanner] = useState<{
    show: boolean;
    type: 'ok' | 'warn' | 'err';
    message: string;
  }>({ show: false, type: 'ok', message: '' });

  const handleInputChange = (val: string) => {
    setInputVal(val);
    const q = val.trim().toLowerCase();
    if (!q) {
      setSelectedGuest(null);
      setStatusBanner({ show: false, type: 'ok', message: '' });
      return;
    }

    const match = guests.find(
      (g) => g.code.toLowerCase() === q || g.name.toLowerCase() === q
    );

    if (match) {
      selectGuest(match);
    } else {
      setSelectedGuest(null);
      setStatusBanner({ show: false, type: 'ok', message: '' });
    }
  };

  const selectGuest = (g: Guest) => {
    setSelectedGuest(g);
    if (g.status === 'in') {
      setStatusBanner({
        show: true,
        type: 'warn',
        message: `⚠️ DUPLICATE ENTRY BLOCKED: Already checked in at ${g.checkinTime ? fmtTime(g.checkinTime) : 'earlier'}. Pass re-use prohibited.`,
      });
    } else {
      setStatusBanner({ show: false, type: 'ok', message: '' });
    }
  };

  const handleSimulateCameraScan = async () => {
    setCameraSimulating(true);
    setTimeout(async () => {
      setCameraSimulating(false);
      // Pick first guest or default token
      const target = guests.find((g) => g.status === 'out') || guests[0];
      if (target) {
        const res = await processQrScan(target.qrPayload);
        setSelectedGuest(target);
        setStatusBanner({
          show: true,
          type: res.result === 'success' ? 'ok' : res.result === 'duplicate' ? 'warn' : 'err',
          message: res.message,
        });
      }
    }, 1200);
  };

  const handleConfirmCheckin = async () => {
    if (!selectedGuest) return;
    const res = await checkInGuest(selectedGuest.id, 'Gate Camera Agent', 'manual_code');
    setStatusBanner({
      show: true,
      type: res.result === 'success' ? 'ok' : res.result === 'duplicate' ? 'warn' : 'err',
      message: res.message,
    });
    if (res.guest) {
      setSelectedGuest(res.guest);
    }
    setInputVal('');
  };

  const q = inputVal.trim().toLowerCase();
  const suggestions =
    q && !selectedGuest
      ? guests
          .filter((g) => g.name.toLowerCase().includes(q) || g.code.toLowerCase().includes(q))
          .slice(0, 6)
      : [];

  const qrGrid = selectedGuest ? generateQrGrid(selectedGuest.qrPayload) : [];

  return (
    <section className="view active" id="view-checkin">
      <div className="space-y-6">
        
        {/* HEADER & METRICS */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#262D38] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173226] text-[#3ED98A] font-mono text-xs font-bold border border-[#3ED98A]/30 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#3ED98A] animate-ping" />
              HMAC QR GATE CAMERA SCANNER ENGINE (PHASE 3)
            </div>
            <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-[#EDEFF3]">
              Gate Scanner &amp; Access Control
            </h2>
            <p className="text-xs font-mono text-[#8B93A3]">
              {activeEvent.name} • 2.5s Scan Velocity • Cryptographic HMAC Token Verification
            </p>
          </div>

          {/* OFFLINE EDGE MESH TOGGLE */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOfflineMode(!offlineMode)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                offlineMode
                  ? 'bg-[#332A14] border-[#F0A93B] text-[#F0A93B]'
                  : 'bg-[#173226] border-[#3ED98A] text-[#3ED98A]'
              }`}
            >
              {offlineMode ? '⚡ Offline Edge Cache Active' : '🌐 Cloud Sync Online'}
            </button>
          </div>
        </div>

        {/* SCANNER GRID */}
        <div className="checkin-grid">
          
          {/* LEFT: CAMERA SIMULATOR & INPUT */}
          <div className="panel scan-box space-y-4">
            
            {/* CAMERA RETICLE BOX */}
            <div className="relative h-48 bg-[#080c14] rounded-xl border-2 border-dashed border-[#262D38] flex flex-col items-center justify-center overflow-hidden group">
              
              {/* Animated Laser Reticle Line */}
              {cameraSimulating && (
                <div className="absolute inset-x-0 h-1 bg-[#3ED98A] shadow-[0_0_15px_#3ED98A] animate-bounce z-10" />
              )}

              <div className="text-center space-y-2 p-4">
                <div className="w-12 h-12 rounded-full bg-[#173226] text-[#3ED98A] flex items-center justify-center mx-auto text-xl font-bold border border-[#3ED98A]/30">
                  📷
                </div>
                <div className="text-xs font-mono text-[#EDEFF3] font-bold">
                  {cameraSimulating ? '⚡ Scanning HMAC QR Token...' : 'Align QR Pass Code in Frame'}
                </div>
                <div className="text-[11px] font-mono text-[#8B93A3]">
                  Supports 2.5s instant verification &amp; duplicate blocking
                </div>
              </div>

              {/* Trigger Button */}
              <button
                onClick={handleSimulateCameraScan}
                disabled={cameraSimulating}
                className="btn btn-go text-xs font-mono font-bold px-4 py-2 mt-2 shadow-lg shadow-[#3ED98A]/20"
              >
                {cameraSimulating ? 'Scanning Token…' : '📷 Trigger Camera Scan'}
              </button>
            </div>

            <div className="divider" />

            {/* MANUAL CODE & NAME SEARCH */}
            <div className="space-y-2 text-left">
              <label>Enter Check-In Code or Search Guest Name</label>
              <input
                type="text"
                id="checkinInput"
                placeholder="e.g. EVT-TBK88 or type guest name"
                value={inputVal}
                onChange={(e) => handleInputChange(e.target.value)}
                className="text-center font-mono text-lg uppercase tracking-wider"
                autoFocus
              />
            </div>

            {/* SUGGESTION DROPDOWN */}
            {q && !selectedGuest && (
              <div className="suggest-list bg-[#0b0e14] border border-[#262D38] rounded-xl p-2 max-h-48 overflow-y-auto">
                {suggestions.length > 0 ? (
                  suggestions.map((g) => (
                    <div
                      key={g.id}
                      className="suggest-row p-2 rounded-lg hover:bg-[#1B2129] cursor-pointer flex justify-between items-center text-xs"
                      onClick={() => selectGuest(g)}
                    >
                      <span className="font-bold text-white">{g.name}</span>
                      <span className="font-mono text-[#8B93A3]">
                        {g.code} · {g.status === 'in' ? 'CHECKED IN' : 'READY'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="empty text-xs p-3">No matching guest found.</div>
                )}
              </div>
            )}

            <div className="scan-hint text-[11px] text-[#565E6D] font-mono">
              Signed HMAC Token: <code>e:eventId, g:guestId, c:code, sig:HMAC</code>
            </div>

          </div>

          {/* RIGHT: BADGE PREVIEW & STATUS BANNERS */}
          <div className="space-y-4">
            
            {selectedGuest ? (
              <div className="badge max-w-full p-6 bg-[#1B2129] border border-[#262D38] rounded-2xl flex items-center gap-6 shadow-2xl">
                
                {/* SVG QR CODE */}
                <div className="w-28 h-28 bg-white rounded-xl p-2 shrink-0 flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 21 21" className="w-full h-full">
                    {qrGrid.map((row, r) =>
                      row.map((cell, c) =>
                        cell ? (
                          <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#0D1015" />
                        ) : null
                      )
                    )}
                  </svg>
                </div>

                <div className="badge-info space-y-1.5 flex-1">
                  <div className="name text-xl font-bold font-['Space_Grotesk'] text-white">
                    {selectedGuest.name}
                  </div>
                  <div className="code text-xs font-mono text-[#3ED98A] font-bold">
                    {selectedGuest.code}
                  </div>
                  <div className="text-[11px] font-mono text-[#8B93A3]">
                    Source: {selectedGuest.source} • Registered: {activeEvent.name}
                  </div>
                  <div>
                    <span
                      className={`tag inline-block ${
                        selectedGuest.category === 'VIP' ? 'tag-vip' : 'tag-regular'
                      }`}
                    >
                      {selectedGuest.category} PASS
                    </span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="panel text-center py-16 space-y-2 border-dashed">
                <div className="text-3xl">🎫</div>
                <div className="font-bold text-sm text-[#EDEFF3]">No Guest Selected</div>
                <div className="text-xs font-mono text-[#8B93A3]">
                  Scan a QR code or type a guest name/code to inspect badge details.
                </div>
              </div>
            )}

            {/* STATUS BANNER */}
            {statusBanner.show && (
              <div
                className={`status-banner show ${statusBanner.type} p-4 rounded-xl font-mono text-xs font-bold`}
              >
                {statusBanner.message}
              </div>
            )}

            {/* CONFIRM CHECK-IN BUTTON */}
            {selectedGuest && selectedGuest.status === 'out' && (
              <button
                className="btn btn-go w-full py-4 font-mono font-bold text-sm shadow-xl shadow-[#3ED98A]/20"
                onClick={handleConfirmCheckin}
              >
                Confirm Gate Check-In &rarr;
              </button>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
