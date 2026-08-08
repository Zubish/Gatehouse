import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import { generateQrGrid } from '../../utils/qrGenerator';
import type { Guest } from '../../types';
import { useFormDraft } from '../../hooks/useFormDraft';

export const PublicRegistrationView: React.FC = () => {
  const { activeEvent, guests, addGuest } = useGatehouse();

  // 5-Minute Form Draft Persistence Hook
  const [formData, setFormData, clearDraft] = useFormDraft('public_registration', {
    name: '',
    phone: '',
    email: '',
    category: 'Regular' as 'VIP' | 'Regular',
  });

  const [registeredGuest, setRegisteredGuest] = useState<Guest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLinkMsg, setCopiedLinkMsg] = useState('');

  const currentCount = guests.length;
  const capacityReached = currentCount >= activeEvent.capacity;
  const spotsLeft = Math.max(0, activeEvent.capacity - currentCount);

  const publicLink = `${window.location.origin}/r/${activeEvent.registrationLinkToken}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink);
    setCopiedLinkMsg('Copied to clipboard!');
    setTimeout(() => setCopiedLinkMsg(''), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const newGuest = await addGuest({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '+234 800 000 0000',
      category: formData.category,
      organization: 'Self Registered Guest',
    });
    setIsSubmitting(false);

    if (newGuest) {
      setRegisteredGuest(newGuest);
      clearDraft(); // Clears form draft upon successful pass creation
    }
  };

  const qrGrid = registeredGuest ? generateQrGrid(registeredGuest.qrPayload) : [];

  return (
    <section className="view active" id="view-public-reg">
      <div className="max-w-xl mx-auto space-y-6">
        {/* EVENT PUBLIC HEADER BANNER */}
        <div className="rounded-3xl border border-[#5cbdb9]/40 bg-gradient-to-b from-navy-900 to-navy-800 p-8 text-center space-y-4 shadow-xl card-glow">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900 text-[#5cbdb9] font-mono text-xs font-bold border border-[#5cbdb9]/30">
            <span className="w-2 h-2 rounded-full bg-[#5cbdb9] animate-pulse" />
            PUBLIC SELF-REGISTRATION LINK (PATH C)
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
            {activeEvent.name}
          </h2>

          <p className="text-xs text-muted-foreground font-mono">
            🗓️ {activeEvent.date} at {activeEvent.startTime} • Token:{' '}
            <code className="text-[#5cbdb9] font-bold">[{activeEvent.registrationLinkToken}]</code>
          </p>

          {/* SHAREABLE PUBLIC LINK BAR */}
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-navy-900 border border-border/60 text-xs font-mono text-muted-foreground max-w-md mx-auto">
            <span className="truncate flex-1 pl-2 text-left">{publicLink}</span>
            <button
              onClick={handleCopyLink}
              className="rounded-full bg-primary px-4 py-2 text-xs font-mono font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer shrink-0"
            >
              {copiedLinkMsg || 'Copy Link'}
            </button>
          </div>

          {/* CAPACITY METRICS */}
          <div className="flex justify-center items-center gap-4 text-xs font-mono pt-2">
            <span className="text-muted-foreground">
              Registered: <strong className="text-foreground">{currentCount}</strong> / {activeEvent.capacity}
            </span>
            <span className="text-border">|</span>
            <span className={spotsLeft > 0 ? 'text-[#38ef7d] font-bold' : 'text-destructive font-bold'}>
              {spotsLeft > 0 ? `🔥 ${spotsLeft} Spots Remaining` : '⛔ Event Sold Out'}
            </span>
          </div>
        </div>

        {/* REGISTRATION FORM OR QR PASS CONFIRMATION */}
        {!registeredGuest ? (
          <div className="rounded-3xl border border-border/60 bg-card/60 p-6 lg:p-8 card-glow space-y-4">
            {capacityReached ? (
              <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive text-destructive text-xs font-mono text-center font-bold space-y-2">
                <div className="text-xl">⛔ REGISTRATION CLOSED</div>
                <div>
                  Capacity cap reached ({activeEvent.capacity} guests max). No further self-registrations allowed.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground font-bold">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Babatunde Raji"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted-foreground font-bold">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="08031234567"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                      className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted-foreground font-bold">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground font-bold">Select Ticket Tier</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as 'VIP' | 'Regular' }))}
                    className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="Regular">Regular Pass (Free Access)</option>
                    <option value="VIP">VIP Access Pass</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-primary py-3.5 text-xs font-mono font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-lg transition-all pt-2"
                >
                  {isSubmitting ? 'Registering…' : '🎟️ Register & Claim Digital QR Gate Pass'}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* INSTANT QR PASS BADGE RENDER */
          <div className="rounded-3xl border border-[#38ef7d]/60 bg-navy-900 p-8 text-center space-y-6 shadow-2xl">
            <div className="p-3.5 rounded-2xl bg-[#38ef7d]/10 border border-[#38ef7d] text-[#38ef7d] text-xs font-mono font-bold">
              🎉 REGISTRATION SUCCESSFUL! YOUR GATEPASS QR CODE IS ACTIVE.
            </div>

            {/* BADGE CONTAINER */}
            <div className="max-w-sm mx-auto p-6 space-y-4 bg-navy-800 border border-border/60 rounded-3xl shadow-xl">
              {/* SVG 21x21 QR Code Rendering */}
              <div className="w-48 h-48 bg-white rounded-2xl p-3 mx-auto shadow-2xl flex items-center justify-center">
                <svg viewBox="0 0 21 21" className="w-full h-full">
                  {qrGrid.map((row, r) =>
                    row.map((cell, c) =>
                      cell ? (
                        <rect
                          key={`${r}-${c}`}
                          x={c}
                          y={r}
                          width="1"
                          height="1"
                          fill="#0D1015"
                        />
                      ) : null
                    )
                  )}
                </svg>
              </div>

              <div className="space-y-1.5 text-center">
                <div className="text-xl font-bold font-heading text-foreground">
                  {registeredGuest.name}
                </div>
                <div className="text-xs font-mono text-muted-foreground">
                  {activeEvent.name}
                </div>
                <div className="inline-block mt-2 font-mono text-sm font-bold tracking-widest text-[#38ef7d] bg-navy-900 px-3 py-1 rounded-full border border-[#38ef7d]/40">
                  {registeredGuest.code}
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-primary/20 text-primary border border-primary/30 mt-2">
                    {registeredGuest.category} PASS
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground font-mono max-w-md mx-auto">
              Show this QR pass or code chip <code className="text-[#38ef7d] font-bold">{registeredGuest.code}</code> at the gate entrance for express 2.5-second scan verification.
            </p>

            <button
              onClick={() => setRegisteredGuest(null)}
              className="rounded-full border border-border/60 bg-card px-6 py-2.5 text-xs font-mono text-foreground hover:bg-secondary cursor-pointer"
            >
              Register Another Guest
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
