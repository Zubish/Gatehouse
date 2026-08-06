import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import { generateQrGrid } from '../../utils/qrGenerator';
import type { Guest } from '../../types';

function fmtTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const CheckinView: React.FC = () => {
  const { guests, checkInGuest, processQrScan } = useGatehouse();

  const [inputVal, setInputVal] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [cameraSimulating, setCameraSimulating] = useState(false);

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

    // Code match or name match
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
        message: `Already checked in at ${g.checkinTime ? fmtTime(g.checkinTime) : ''}. Duplicate entry blocked.`,
      });
    } else {
      setStatusBanner({ show: false, type: 'ok', message: '' });
    }
  };

  const handleSimulateCameraScan = async () => {
    setCameraSimulating(true);
    setTimeout(async () => {
      setCameraSimulating(false);
      // Pick first un-checked guest or default token
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

  // Suggest list for partial name/code matches
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
      <h2 className="section-title">Gate Camera Check-In</h2>
      <div className="checkin-grid">
        
        {/* Left Scan / Input Box */}
        <div className="panel scan-box space-y-3">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-[#8B93A3]">Scanner Method</span>
            <button
              onClick={handleSimulateCameraScan}
              disabled={cameraSimulating}
              className="px-3 py-1 rounded bg-[#173226] text-[#3ED98A] font-bold border border-[#3ED98A]/30 hover:brightness-110"
            >
              {cameraSimulating ? '⚡ Scanning Camera...' : '📷 Simulate Camera Scan'}
            </button>
          </div>

          <label style={{ textAlign: 'left' }}>Enter check-in code or search name</label>
          <input
            type="text"
            id="checkinInput"
            placeholder="e.g. EVT-TBK88 or type a name"
            value={inputVal}
            onChange={(e) => handleInputChange(e.target.value)}
            autoFocus
          />

          {/* Suggestion List */}
          {q && !selectedGuest && (
            <div className="suggest-list" id="checkinSuggest">
              {suggestions.length > 0 ? (
                suggestions.map((g) => (
                  <div
                    key={g.id}
                    className="suggest-row"
                    onClick={() => selectGuest(g)}
                    data-pick={g.id}
                  >
                    <span className="n">{g.name}</span>
                    <span className="c">
                      {g.code} · {g.status === 'in' ? 'IN' : '—'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="empty">No match. Check the code, or register as a walk-in.</div>
              )}
            </div>
          )}

          <div className="scan-hint">
            Signed HMAC token verification active. Front desk can type code, scan QR pass, or search guest name.
          </div>
        </div>

        {/* Right Badge Preview & Action */}
        <div>
          {selectedGuest && (
            <div className="badge" id="badgeCard">
              <div className="w-20 h-20 bg-white rounded p-1 shrink-0 flex items-center justify-center">
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

              <div className="badge-info">
                <div className="name" id="badgeName">
                  {selectedGuest.name}
                </div>
                <div className="code" id="badgeCode">
                  {selectedGuest.code}
                </div>
                <div className="text-[10px] text-[#8B93A3] font-mono">Source: {selectedGuest.source}</div>
                <span
                  className={`tag ${
                    selectedGuest.category === 'VIP' ? 'tag-vip' : 'tag-regular'
                  }`}
                  id="badgeTag"
                >
                  {selectedGuest.category}
                </span>
              </div>
            </div>
          )}

          {/* Status Banner */}
          {statusBanner.show && (
            <div
              className={`status-banner show ${statusBanner.type}`}
              id="checkinStatus"
            >
              {statusBanner.message}
            </div>
          )}

          {/* Confirm Button */}
          {selectedGuest && selectedGuest.status === 'out' && (
            <button
              className="btn btn-go"
              id="confirmCheckinBtn"
              style={{ width: '100%', marginTop: 14 }}
              onClick={handleConfirmCheckin}
            >
              Confirm check-in
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
