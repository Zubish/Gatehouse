import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import { QRCodePass } from './QRCodePass';
import { ShieldCheck, QrCode, Camera, Lock, RefreshCw, Sparkles, Building, UserCheck } from 'lucide-react';
import type { ViewRoute } from '../../types';

interface DemoViewProps {
  onNavigate?: (view: ViewRoute) => void;
}

export const DemoView: React.FC<DemoViewProps> = ({ onNavigate }) => {
  const { guests, activeEvent, checkInGuest } = useGatehouse();

  const [simulatedGuestIndex, setSimulatedGuestIndex] = useState(0);
  const [scanResult, setScanResult] = useState<{ result: string; message: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const demoGuestList = guests.length > 0 ? guests : [
    {
      id: 'demo_1',
      name: 'Babajide Sanwo-Olu',
      email: 'b.sanwoolu@lagosstate.gov.ng',
      phone: '08023334444',
      category: 'VIP' as const,
      code: 'VIP-7821',
      qrPayload: 'GH1.eyJlaWQiOiJldnRfMjAyNl8wMSIsImdpZCI6ImRlbW9fMSIsImNvZGUiOiJWSVAtNzgyMSJ9.signature_hash_1',
      status: 'out' as const,
      organization: 'Lagos State Government',
    },
    {
      id: 'demo_2',
      name: 'Dr. Bosun Tijani',
      email: 'bosun@fmcide.gov.ng',
      phone: '08031112222',
      category: 'VIP' as const,
      code: 'VIP-9012',
      qrPayload: 'GH1.eyJlaWQiOiJldnRfMjAyNl8wMSIsImdpZCI6ImRlbW9fMiIsImNvZGUiOiJWSVAtOTAxMiJ9.signature_hash_2',
      status: 'out' as const,
      organization: 'Federal Ministry of Comms & Tech',
    },
    {
      id: 'demo_3',
      name: 'Oluwaseun Adeleke',
      email: 'seun@flutterwave.com',
      phone: '08129990000',
      category: 'Regular' as const,
      code: 'REG-1049',
      qrPayload: 'GH1.eyJlaWQiOiJldnRfMjAyNl8wMSIsImdpZCI6ImRlbW9fMyIsImNvZGUiOiJSRUctMTA0OSJ9.signature_hash_3',
      status: 'out' as const,
      organization: 'Flutterwave Nigeria',
    },
  ];

  const currentGuest = demoGuestList[simulatedGuestIndex % demoGuestList.length];

  const handleSimulateScan = async () => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(async () => {
      const res = await checkInGuest(currentGuest.id, 'Musa AI Demo Agent', 'qr');
      setScanResult(res);
      setIsScanning(false);
    }, 700);
  };

  const handleNextGuest = () => {
    setSimulatedGuestIndex((prev) => prev + 1);
    setScanResult(null);
  };

  return (
    <section className="view active space-y-6" id="view-demo">
      
      {/* DEMO SANDBOX BANNER */}
      <div className="p-4 rounded-2xl bg-[#1e3a5f]/60 border border-white/12 flex flex-wrap items-center justify-between gap-4 card-glow">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#5cbdb9]/20 border border-[#5cbdb9]/30 text-[#5cbdb9]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm text-[#e8edf3]">GATEHOUSE INTERACTIVE DEMO SANDBOX</span>
              <span className="text-[10px] font-mono font-bold bg-[#38ef7d]/10 text-[#38ef7d] px-2 py-0.5 rounded-full border border-[#38ef7d]/30">
                URL: /demo
              </span>
            </div>
            <p className="text-xs text-[#94a3b8]">Explore live gate verification, HMAC QR scanning, and hardware relays in a simulated environment.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => onNavigate && onNavigate('login')}
            className="px-3.5 py-2 rounded-xl bg-[#3b6fa0] text-[#e8edf3] font-bold hover:bg-[#3b6fa0]/90 cursor-pointer transition-all shadow-md"
          >
            Sign In to Real Account &rarr;
          </button>
        </div>
      </div>

      {/* METRICS & OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl border border-white/12 bg-[#1e3a5f]/40 space-y-1">
          <span className="text-[#94a3b8] text-[10px] uppercase font-bold">Active Demo Event</span>
          <div className="text-sm font-bold font-heading text-[#e8edf3] truncate">{activeEvent.name}</div>
          <div className="text-[10px] text-[#5cbdb9]">Capacity: {activeEvent.capacity.toLocaleString()} Attendees</div>
        </div>

        <div className="p-4 rounded-2xl border border-white/12 bg-[#1e3a5f]/40 space-y-1">
          <span className="text-[#94a3b8] text-[10px] uppercase font-bold">Scan Throughput</span>
          <div className="text-sm font-bold text-[#38ef7d]">2.5 Seconds / Pass</div>
          <div className="text-[10px] text-[#94a3b8]">Cryptographic HMAC-SHA256</div>
        </div>

        <div className="p-4 rounded-2xl border border-white/12 bg-[#1e3a5f]/40 space-y-1">
          <span className="text-[#94a3b8] text-[10px] uppercase font-bold">Turnstile Gate Barrier</span>
          <div className="text-sm font-bold text-[#38ef7d] flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" /> Relay Connected
          </div>
          <div className="text-[10px] text-[#94a3b8]">3000ms Unlock Pulse Output</div>
        </div>

        <div className="p-4 rounded-2xl border border-white/12 bg-[#1e3a5f]/40 space-y-1">
          <span className="text-[#94a3b8] text-[10px] uppercase font-bold">Musa AI Sentinel</span>
          <div className="text-sm font-bold text-[#5cbdb9] flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> Active Gate Watch
          </div>
          <div className="text-[10px] text-[#38ef7d]">Zero Double-Entry Guarantee</div>
        </div>
      </div>

      {/* DEMO WORKSPACE GRID */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN — LIVE PASS GENERATOR & SIMULATED SCANNER */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-white/12 bg-[#1e3a5f]/40 p-6 space-y-6 card-glow">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-[#5cbdb9]" />
                <h3 className="font-heading text-base font-bold text-[#e8edf3]">Simulated HMAC Pass Generator</h3>
              </div>
              <button
                onClick={handleNextGuest}
                className="px-3 py-1.5 rounded-xl border border-white/12 bg-[#0f1b3d] text-xs font-mono text-[#5cbdb9] hover:bg-white/5 cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Switch Demo Guest
              </button>
            </div>

            {/* PASS BADGE PREVIEW */}
            <div className="p-6 rounded-2xl bg-[#0f1b3d] border border-white/12 flex flex-col items-center text-center space-y-4">
              <QRCodePass value={currentGuest.qrPayload} size={160} />
              
              <div className="space-y-1 font-mono text-xs">
                <div className="text-sm font-bold font-heading text-[#e8edf3]">{currentGuest.name}</div>
                <div className="text-[#5cbdb9] font-bold">{currentGuest.code} ({currentGuest.category})</div>
                <div className="text-[11px] text-[#94a3b8]">{currentGuest.organization || 'VIP Guest'}</div>
                <div className="text-[10px] text-[#94a3b8] break-all max-w-sm pt-1">{currentGuest.qrPayload}</div>
              </div>
            </div>

            {/* SIMULATE SCAN CTA */}
            <button
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="w-full py-4 rounded-2xl bg-[#3b6fa0] hover:bg-[#3b6fa0]/90 text-[#e8edf3] font-mono font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#3b6fa0]/25 cursor-pointer transition-all disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-[#5cbdb9]" />
                  <span>Processing HMAC Token Verification…</span>
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 text-[#38ef7d]" />
                  <span>Simulate Gate Scan for {currentGuest.name}</span>
                </>
              )}
            </button>

            {/* SCAN RESULT FEEDBACK */}
            {scanResult && (
              <div
                className={`p-4 rounded-2xl border font-mono text-xs text-center font-bold animate-in fade-in duration-200 ${
                  scanResult.result === 'success'
                    ? 'bg-[#38ef7d]/10 border-[#38ef7d] text-[#38ef7d]'
                    : scanResult.result === 'duplicate'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                    : 'bg-red-500/10 border-red-500 text-red-400'
                }`}
              >
                <div className="text-sm font-heading">{scanResult.result.toUpperCase()}</div>
                <div>{scanResult.message}</div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN — FEATURE SIMULATIONS */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* CAMERA FEED SIMULATION */}
          <div className="rounded-3xl border border-white/12 bg-[#1e3a5f]/40 p-6 space-y-4 card-glow">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-[#5cbdb9]" />
                <h3 className="font-heading text-sm font-bold text-[#e8edf3]">Gate Camera Feed Relay</h3>
              </div>
              <span className="text-[10px] font-mono text-[#38ef7d]">Simulated 1080p Stream</span>
            </div>

            <div className="relative aspect-video rounded-2xl bg-[#0f1b3d] border border-white/12 flex items-center justify-center p-6 text-center space-y-2">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#5cbdb9]/10 text-[#5cbdb9] flex items-center justify-center mx-auto border border-[#5cbdb9]/30">
                  <Camera className="h-6 w-6" />
                </div>
                <div className="text-xs font-mono font-bold text-[#e8edf3]">Camera Stream Active</div>
                <div className="text-[10px] font-mono text-[#94a3b8]">HTML5 getUserMedia Native API</div>
              </div>
            </div>
          </div>

          {/* VENUE BOOKING SIMULATOR */}
          <div className="rounded-3xl border border-white/12 bg-[#1e3a5f]/40 p-6 space-y-4 card-glow">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-[#5cbdb9]" />
                <h3 className="font-heading text-sm font-bold text-[#e8edf3]">Venue Booking &amp; Gate Ushering</h3>
              </div>
              <span className="text-[10px] font-mono text-[#94a3b8]">Multi-Tenant Pipeline</span>
            </div>

            <div className="space-y-3 text-xs font-mono text-[#94a3b8]">
              <div className="p-3 rounded-xl bg-[#0f1b3d] border border-white/10 flex justify-between items-center">
                <span>Eko Convention Centre (Grand Ballroom)</span>
                <span className="text-[#38ef7d] font-bold">Approved</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0f1b3d] border border-white/10 flex justify-between items-center">
                <span>Harbour Point Event Centre</span>
                <span className="text-[#5cbdb9] font-bold">Available</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
