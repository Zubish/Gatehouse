import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import { Building, Calendar, Clock, Plus, UserPlus, Check, X, FileSpreadsheet } from 'lucide-react';

export const CentreDashboardView: React.FC = () => {
  const { selectedCentre, bookings, updateBookingStatus, addGuest, bulkImportGuests } = useGatehouse();

  // Delegated Usher State
  const [delegatedGuestName, setDelegatedGuestName] = useState('');
  const [delegatedGuestPhone, setDelegatedGuestPhone] = useState('');
  const [delegatedCategory, setDelegatedCategory] = useState<'VIP' | 'Regular'>('VIP');
  const [delegatedSuccessMsg, setDelegatedSuccessMsg] = useState('');
  const [delegatedBulkText, setDelegatedBulkText] = useState('');
  const [bulkImportStatus, setBulkImportStatus] = useState('');

  // Venue Hall Management State
  const [halls, setHalls] = useState(
    selectedCentre?.halls || [
      { id: 'h_1', name: 'Grand Ballroom', capacity: 3000, pricePerDay: '₦5,500,000' },
      { id: 'h_2', name: 'Ocean View Marquee', capacity: 2000, pricePerDay: '₦3,800,000' },
    ]
  );
  const [newHallName, setNewHallName] = useState('');
  const [newHallCap, setNewHallCap] = useState('');
  const [newHallPrice, setNewHallPrice] = useState('');
  const [showAddHallModal, setShowAddHallModal] = useState(false);

  const handleAddHall = () => {
    if (!newHallName.trim() || !newHallCap) return;
    const newH = {
      id: `h_${Date.now()}`,
      name: newHallName,
      capacity: Number(newHallCap),
      pricePerDay: newHallPrice ? `₦${Number(newHallPrice).toLocaleString()}` : '₦3,000,000',
    };
    setHalls((prev) => [...prev, newH]);
    setNewHallName('');
    setNewHallCap('');
    setNewHallPrice('');
    setShowAddHallModal(false);
  };

  const handleRegisterDelegatedGuest = async () => {
    if (!delegatedGuestName.trim()) return;
    const newGuest = addGuest({
      name: delegatedGuestName,
      phone: delegatedGuestPhone || '+234 800 000 0000',
      category: delegatedCategory,
      organization: 'Delegated Venue Guest',
    });
    if (newGuest) {
      setDelegatedSuccessMsg(
        `Delegated VIP Guest registered: ${newGuest.name} (Pass: ${newGuest.code})`
      );
      setDelegatedGuestName('');
      setDelegatedGuestPhone('');
      setTimeout(() => setDelegatedSuccessMsg(''), 3000);
    }
  };

  const handleDelegatedBulkImport = async () => {
    if (!delegatedBulkText.trim()) return;
    const added = bulkImportGuests(delegatedBulkText);
    setDelegatedBulkText('');
    setBulkImportStatus(
      `Delegated venue import added ${added} guest${added !== 1 ? 's' : ''}.`
    );
    setTimeout(() => setBulkImportStatus(''), 3000);
  };

  return (
    <section className="view active space-y-8" id="view-centre-dash">
      
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5cbdb9]/10 text-[#5cbdb9] font-mono text-xs font-bold border border-[#5cbdb9]/30">
            <Building className="h-3.5 w-3.5" />
            VENUE OWNER PORTAL &amp; HALL CONTROL
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            {selectedCentre ? selectedCentre.name : 'Eko Hotels & Suites Convention Centre'}
          </h2>
          <p className="text-xs font-mono text-muted-foreground">
            📍 {selectedCentre?.address || 'Victoria Island, Lagos'} • Managing Hall Bookings &amp; Gate Delegations
          </p>
        </div>

        <button
          onClick={() => setShowAddHallModal(true)}
          className="rounded-full bg-primary px-5 py-2.5 text-xs font-mono font-bold text-primary-foreground hover:bg-primary/90 flex items-center gap-2 cursor-pointer shadow-md transition-all"
        >
          <Plus className="h-4 w-4" /> Add Hall Facility
        </button>
      </div>

      {/* HALL LISTINGS & BOOKINGS GRID */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN — MANAGED HALL FACILITIES */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-4 card-glow">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="font-heading text-lg font-bold text-foreground">Managed Hall Facilities</h3>
              <span className="text-xs font-mono text-[#38ef7d] font-bold">{halls.length} Active Halls</span>
            </div>

            <div className="space-y-3">
              {halls.map((h) => (
                <div key={h.id} className="p-4 rounded-2xl bg-navy-900 border border-border/60 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold font-heading text-foreground">{h.name}</div>
                    <div className="text-xs font-mono text-muted-foreground">Capacity: {h.capacity.toLocaleString()} guests</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-[#5cbdb9] font-bold">{h.pricePerDay} / day</div>
                    <span className="text-[10px] font-mono text-[#38ef7d] bg-[#38ef7d]/10 px-2 py-0.5 rounded-full border border-[#38ef7d]/30 font-bold">
                      Available
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DELEGATED USHERING GUEST PASS GENERATION */}
          <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-4 card-glow">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-[#5cbdb9]" />
                <h3 className="font-heading text-base font-bold text-foreground">Delegated VIP Pass Generation</h3>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">Path B Venue Permission</span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Delegated Guest Name"
                  value={delegatedGuestName}
                  onChange={(e) => setDelegatedGuestName(e.target.value)}
                  className="rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={delegatedGuestPhone}
                  onChange={(e) => setDelegatedGuestPhone(e.target.value)}
                  className="rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-between items-center gap-3 pt-1">
                <select
                  value={delegatedCategory}
                  onChange={(e) => setDelegatedCategory(e.target.value as 'VIP' | 'Regular')}
                  className="rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="VIP">VIP Venue Guest</option>
                  <option value="Regular">Regular Attendee</option>
                </select>

                <button
                  onClick={handleRegisterDelegatedGuest}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-mono font-bold text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
                >
                  + Issue Delegated Pass
                </button>
              </div>

              {delegatedSuccessMsg && (
                <div className="p-3 rounded-xl bg-[#38ef7d]/10 border border-[#38ef7d] text-[#38ef7d] text-xs font-mono font-bold text-center">
                  {delegatedSuccessMsg}
                </div>
              )}

              <div className="pt-3 border-t border-border/40 space-y-2">
                <label className="text-muted-foreground font-bold flex items-center gap-2">
                  <FileSpreadsheet className="h-3.5 w-3.5 text-[#5cbdb9]" /> Delegated Bulk CSV Roster
                </label>
                <textarea
                  rows={2}
                  placeholder={`Musa Ibrahim, 08031112222, VIP\nAmina Bello, 08023334444, Regular`}
                  value={delegatedBulkText}
                  onChange={(e) => setDelegatedBulkText(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-navy-900 px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                />
                <div className="flex justify-between items-center">
                  <button
                    onClick={handleDelegatedBulkImport}
                    className="rounded-xl border border-[#5cbdb9]/40 bg-[#5cbdb9]/10 text-[#5cbdb9] px-3.5 py-1.5 text-xs font-mono font-bold hover:bg-[#5cbdb9]/20 transition-all cursor-pointer"
                  >
                    Import Delegated Roster
                  </button>
                  {bulkImportStatus && (
                    <span className="text-xs font-mono text-[#38ef7d] font-bold">
                      {bulkImportStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — INCOMING BOOKING REQUESTS */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-4 card-glow">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Incoming Hall Booking Requests
              </h3>
              <span className="text-xs font-mono text-muted-foreground">{bookings.length} Requests</span>
            </div>

            <div className="space-y-4">
              {bookings.length > 0 ? (
                bookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl bg-navy-900 border border-border/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold font-heading text-foreground">{b.eventName}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                        b.status === 'accepted'
                          ? 'bg-[#38ef7d]/10 text-[#38ef7d] border-[#38ef7d]/30'
                          : b.status === 'declined'
                          ? 'bg-destructive/10 text-destructive border-destructive/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono text-muted-foreground">
                      <div>Organizer: <strong className="text-foreground">{b.organizerName}</strong></div>
                      <div>Date: <strong className="text-foreground">{b.requestedDate}</strong></div>
                      <div>Est. Guests: <strong className="text-foreground">{b.guestEstimate.toLocaleString()}</strong></div>
                    </div>

                    {b.status === 'requested' && (
                      <div className="flex gap-2 pt-2 border-t border-border/40">
                        <button
                          onClick={() => updateBookingStatus(b.id, 'accepted')}
                          className="flex-1 py-2 rounded-xl bg-[#38ef7d] text-navy-900 text-xs font-mono font-bold hover:bg-[#38ef7d]/90 cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Check className="h-4 w-4" /> Approve Booking
                        </button>
                        <button
                          onClick={() => updateBookingStatus(b.id, 'declined')}
                          className="flex-1 py-2 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-xs font-mono font-bold hover:bg-destructive/20 cursor-pointer flex items-center justify-center gap-1"
                        >
                          <X className="h-4 w-4" /> Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs font-mono text-muted-foreground bg-navy-900/40 rounded-2xl border border-border/40 space-y-2">
                  <Clock className="h-8 w-8 text-muted-foreground/60 mx-auto" />
                  <div>No pending booking requests. Incoming organizer requests will appear here.</div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ADD HALL MODAL */}
      {showAddHallModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-navy-900 border border-border/60 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading text-lg font-bold text-foreground">Add New Hall Facility</h3>
            <div className="space-y-3 text-xs font-mono">
              <input
                type="text"
                placeholder="Hall Name (e.g. VIP Marquee)"
                value={newHallName}
                onChange={(e) => setNewHallName(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-card px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
              <input
                type="number"
                placeholder="Capacity Cap (e.g. 2500)"
                value={newHallCap}
                onChange={(e) => setNewHallCap(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-card px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
              />
              <input
                type="number"
                placeholder="Daily Price in NGN (e.g. 4500000)"
                value={newHallPrice}
                onChange={(e) => setNewHallPrice(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-card px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddHallModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-border/60 bg-card text-xs font-mono text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHall}
                className="flex-1 py-2.5 rounded-xl bg-primary text-xs font-mono font-bold text-primary-foreground cursor-pointer"
              >
                Save Hall Facility
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
