import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import { useFormDraft } from '../../hooks/useFormDraft';

export const WalkinView: React.FC = () => {
  const { addGuest, checkInGuest } = useGatehouse();

  // 5-Minute Auto-Save Form Draft
  const [formData, setFormData, clearDraft] = useFormDraft('walkin_registration', {
    name: '',
    phone: '',
    category: 'Regular' as 'VIP' | 'Regular',
  });

  const [statusBanner, setStatusBanner] = useState<{
    show: boolean;
    type: 'ok' | 'err';
    message: string;
  }>({ show: false, type: 'ok', message: '' });

  const handleRegisterAndCheckin = async () => {
    if (!formData.name.trim()) {
      setStatusBanner({
        show: true,
        type: 'err',
        message: 'Enter a name to register this guest.',
      });
      return;
    }

    const g = await addGuest({
      name: formData.name,
      phone: formData.phone || '+234 800 000 0000',
      category: formData.category,
      organization: 'Walk-In Guest',
    });
    if (g) {
      await checkInGuest(g.id);
      setStatusBanner({
        show: true,
        type: 'ok',
        message: `${g.name} registered and checked in — pass code ${g.code}.`,
      });
      clearDraft(); // Clears draft input on successful submission
    }
  };

  return (
    <section className="view active" id="view-walkin">
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="space-y-2 border-b border-border/40 pb-4">
          <h2 className="font-heading text-2xl font-bold text-foreground">Walk-In Registration</h2>
          <p className="text-xs font-mono text-muted-foreground">
            For guests arriving without an advance QR pass. Added to list and checked in instantly.
          </p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 lg:p-8 card-glow space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-mono text-muted-foreground font-bold">Full Name *</label>
            <input
              type="text"
              id="walkinName"
              placeholder="e.g. Chukwuma Adebayo"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-muted-foreground font-bold">Phone / WhatsApp</label>
            <input
              type="tel"
              id="walkinPhone"
              placeholder="0803 000 0000"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-muted-foreground font-bold">Guest Pass Category</label>
            <select
              id="walkinCategory"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value as 'VIP' | 'Regular' }))
              }
              className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
            >
              <option value="Regular">Regular Attendee</option>
              <option value="VIP">VIP Guest</option>
            </select>
          </div>

          <button
            className="w-full rounded-full bg-primary py-3.5 text-xs font-mono font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-md transition-all pt-2"
            id="walkinBtn"
            onClick={handleRegisterAndCheckin}
          >
            Register &amp; Issue Express Check-In &rarr;
          </button>

          {statusBanner.show && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-mono text-center font-bold ${
                statusBanner.type === 'ok'
                  ? 'bg-[#38ef7d]/10 border border-[#38ef7d] text-[#38ef7d]'
                  : 'bg-destructive/10 border border-destructive text-destructive'
              }`}
              id="walkinStatus"
            >
              {statusBanner.message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
