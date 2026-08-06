import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import { generateQrGrid } from '../../utils/qrGenerator';
import type { Guest } from '../../types';

export const PublicRegistrationView: React.FC = () => {
  const { activeEvent, guests, addGuest } = useGatehouse();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'VIP' | 'Regular'>('Regular');
  const [registeredGuest, setRegisteredGuest] = useState<Guest | null>(null);

  const capacityReached = guests.length >= activeEvent.capacity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newGuest = await addGuest(name, phone, category, 'self_registered', email);
    if (newGuest) {
      setRegisteredGuest(newGuest);
    }
  };

  const qrGrid = registeredGuest ? generateQrGrid(registeredGuest.qrPayload) : [];

  return (
    <section className="view active" id="view-public-reg">
      <div className="max-w-md mx-auto space-y-4">
        
        {/* EVENT BANNER HEADER */}
        <div className="panel text-center space-y-2 border-emerald-500/30">
          <div className="inline-block px-3 py-1 rounded-full bg-[#173226] text-[#3ED98A] font-mono text-xs font-bold border border-[#3ED98A]/30">
            Self-Service Guest Registration (Path C)
          </div>
          <h2 className="font-bold text-xl text-[#EDEFF3] font-['Space_Grotesk']">
            {activeEvent.name}
          </h2>
          <p className="text-xs text-[#8B93A3] font-mono">
            {activeEvent.date} at {activeEvent.startTime} • Public Link Token: [{activeEvent.registrationLinkToken}]
          </p>

          <div className="text-[11px] text-[#565E6D] font-mono pt-1">
            Registered: <strong className="text-[#EDEFF3]">{guests.length}</strong> / {activeEvent.capacity} Capacity
          </div>
        </div>

        {/* REGISTRATION FORM OR QR PASS CONFIRMATION */}
        {!registeredGuest ? (
          <div className="panel space-y-4">
            {capacityReached ? (
              <div className="p-4 rounded-lg bg-[#331B1D] border border-[#E5555C] text-[#E5555C] text-xs font-mono text-center font-bold">
                Capacity cap reached ({activeEvent.capacity} guests). Registration closed for this event.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Babatunde Raji"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label>Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    placeholder="080..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label>Email Address (For Digital QR Pass)</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Ticket Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as 'VIP' | 'Regular')}
                  >
                    <option value="Regular">Regular Guest</option>
                    <option value="VIP">VIP Guest</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-go w-full py-3 font-bold text-sm">
                  Register &amp; Claim QR Gate Pass
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="panel text-center space-y-4 border-[#3ED98A]/50">
            <div className="p-3 rounded-lg bg-[#173226] text-[#3ED98A] text-xs font-mono font-bold">
              🎉 Registration Confirmed! Your GatePass QR Code is Ready.
            </div>

            {/* BADGE QR PASS CONTAINER */}
            <div className="badge max-w-sm mx-auto flex-col p-6 space-y-3 bg-[#1B2129] border border-[#262D38]">
              {/* SVG QR Code Rendering */}
              <div className="w-48 h-48 bg-white rounded-xl p-3 mx-auto shadow-xl flex items-center justify-center">
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

              <div className="badge-info text-center space-y-1">
                <div className="name text-lg text-[#EDEFF3] font-['Space_Grotesk'] font-bold">
                  {registeredGuest.name}
                </div>
                <div className="text-xs text-[#8B93A3] font-mono">{activeEvent.name}</div>
                <div className="code-chip inline-block mt-2 font-mono text-sm tracking-wider font-bold">
                  {registeredGuest.code}
                </div>
                <div>
                  <span
                    className={`tag ${
                      registeredGuest.category === 'VIP' ? 'tag-vip' : 'tag-regular'
                    }`}
                  >
                    {registeredGuest.category} PASS
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#8B93A3] font-mono">
              Show this QR code at the entrance gate on event day for instant check-in.
            </p>

            <button
              onClick={() => setRegisteredGuest(null)}
              className="btn btn-ghost text-xs"
            >
              Register Another Guest
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
