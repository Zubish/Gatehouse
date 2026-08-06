import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import type { EventCentre } from '../../types';

export const EventCentresView: React.FC = () => {
  const { eventCentres, createBookingRequest } = useGatehouse();

  // Search & Filter state
  const [cityFilter, setCityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVenueModal, setSelectedVenueModal] = useState<EventCentre | null>(null);

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingVenue, setBookingVenue] = useState<EventCentre | null>(null);
  const [eventName, setEventName] = useState('');
  const [requestedDate, setRequestedDate] = useState('');
  const [guestEstimate, setGuestEstimate] = useState(500);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  const filteredCentres = eventCentres.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQ = !q || c.name.toLowerCase().includes(q) || c.address.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    const matchesCity = cityFilter === 'all' || c.city.toLowerCase() === cityFilter.toLowerCase();
    return matchesQ && matchesCity;
  });

  const handleOpenBooking = (centre: EventCentre) => {
    setBookingVenue(centre);
    setSelectedVenueModal(null);
    setShowBookingModal(true);
  };

  const handleSendBookingRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingVenue || !eventName.trim() || !requestedDate.trim()) return;

    await createBookingRequest(
      bookingVenue.id,
      eventName,
      requestedDate,
      guestEstimate,
      bookingMessage
    );

    setBookingSuccessMsg(`Booking request sent to ${bookingVenue.name}! The venue management team will review and approve.`);
    setTimeout(() => {
      setBookingSuccessMsg('');
      setShowBookingModal(false);
      setEventName('');
      setRequestedDate('');
      setBookingMessage('');
    }, 2000);
  };

  return (
    <section className="view active" id="view-venues">
      <div className="space-y-6">
        
        {/* HEADER & FILTERS */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="section-title">Verified Event Centres Directory</h2>
            <p className="text-xs font-mono text-[#8B93A3]">
              Discover premium venues, inspect capacity limits, and send direct booking requests.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by venue name or location…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs text-xs font-mono"
            />
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-auto text-xs font-mono bg-[#151A22] border border-[#262D38] text-[#EDEFF3] rounded-md px-3 py-2"
            >
              <option value="all">All Cities</option>
              <option value="lagos">Lagos</option>
              <option value="abuja">Abuja</option>
              <option value="port harcourt">Port Harcourt</option>
            </select>
          </div>
        </div>

        {/* VENUES GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCentres.map((centre) => (
            <div
              key={centre.id}
              className="glass-card rounded-xl border border-[#262D38] overflow-hidden flex flex-col justify-between hover:border-[#3ED98A]/50 transition-all group"
            >
              <div>
                {/* Photo Thumbnail */}
                <div className="h-44 bg-[#1B2129] relative overflow-hidden">
                  <img
                    src={centre.photos[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'}
                    alt={centre.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#0D1015]/80 backdrop-blur text-[10px] font-mono text-[#3ED98A] font-bold border border-[#3ED98A]/30">
                    VERIFIED VENUE
                  </div>
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-[#0D1015]/90 text-[11px] font-mono text-[#EDEFF3]">
                    📍 {centre.city}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#EDEFF3] group-hover:text-[#3ED98A] transition-colors">
                    {centre.name}
                  </h3>
                  <p className="text-xs text-[#8B93A3] line-clamp-2 leading-relaxed">
                    {centre.description}
                  </p>

                  <div className="text-xs font-mono text-[#94a3b8] pt-2 border-t border-[#262D38]">
                    Capacity: <strong className="text-white">{centre.capacityMin} - {centre.capacityMax.toLocaleString()} guests</strong>
                  </div>

                  <div className="text-xs font-mono text-[#F0A93B] font-semibold">
                    {centre.priceRange}
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {centre.amenities.map((a, i) => (
                      <span key={i} className="text-[10px] font-mono bg-[#1B2129] text-[#8B93A3] px-2 py-0.5 rounded border border-[#262D38]">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedVenueModal(centre)}
                  className="btn btn-ghost text-xs font-mono"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleOpenBooking(centre)}
                  className="btn btn-go text-xs font-mono font-bold"
                >
                  Request Booking
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* VENUE DETAIL MODAL */}
        {selectedVenueModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-card max-w-xl w-full rounded-2xl border border-[#3ED98A]/30 overflow-hidden space-y-4 p-6 bg-[#0f172a]">
              
              <div className="flex items-center justify-between border-b border-[#262D38] pb-3">
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#EDEFF3]">
                  {selectedVenueModal.name}
                </h3>
                <button
                  onClick={() => setSelectedVenueModal(null)}
                  className="text-sm font-mono text-[#8B93A3] hover:text-white"
                >
                  ✕ Close
                </button>
              </div>

              <div className="h-56 rounded-xl overflow-hidden bg-[#1B2129]">
                <img
                  src={selectedVenueModal.photos[0]}
                  alt={selectedVenueModal.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-xs text-[#94a3b8]">
                <p><strong>Address:</strong> {selectedVenueModal.address}, {selectedVenueModal.city}</p>
                <p>{selectedVenueModal.description}</p>
                <p><strong>Capacity:</strong> {selectedVenueModal.capacityMin} to {selectedVenueModal.capacityMax.toLocaleString()} guests</p>
                <p><strong>Price Range:</strong> <span className="text-[#F0A93B] font-bold">{selectedVenueModal.priceRange}</span></p>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setSelectedVenueModal(null)}
                  className="btn btn-ghost flex-1 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleOpenBooking(selectedVenueModal)}
                  className="btn btn-go flex-1 text-xs font-mono font-bold"
                >
                  Book Venue Now &rarr;
                </button>
              </div>

            </div>
          </div>
        )}

        {/* BOOKING REQUEST MODAL */}
        {showBookingModal && bookingVenue && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-card max-w-md w-full rounded-2xl border border-[#3ED98A]/50 p-6 bg-[#0f172a] space-y-4">
              
              <div className="flex items-center justify-between border-b border-[#262D38] pb-3">
                <div>
                  <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                    Request Booking: {bookingVenue.name}
                  </h3>
                  <div className="text-[11px] font-mono text-[#3ED98A]">
                    {bookingVenue.city} • Capacity Max: {bookingVenue.capacityMax.toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-xs font-mono text-[#8B93A3] hover:text-white"
                >
                  ✕
                </button>
              </div>

              {bookingSuccessMsg ? (
                <div className="p-4 rounded-xl bg-[#173226] border border-[#3ED98A] text-[#3ED98A] text-xs font-mono text-center font-bold">
                  {bookingSuccessMsg}
                </div>
              ) : (
                <form onSubmit={handleSendBookingRequest} className="space-y-3">
                  <div className="field">
                    <label>Event Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Lagos Tech Summit 2026"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Requested Event Date *</label>
                    <input
                      type="text"
                      placeholder="e.g. Sat, 15 Nov 2026"
                      value={requestedDate}
                      onChange={(e) => setRequestedDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Estimated Guest Count</label>
                    <input
                      type="number"
                      min={100}
                      max={bookingVenue.capacityMax}
                      value={guestEstimate}
                      onChange={(e) => setGuestEstimate(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Special Instructions / Requirements</label>
                    <textarea
                      rows={3}
                      placeholder="Specify stage setup, VIP lounge access, sound setup..."
                      value={bookingMessage}
                      onChange={(e) => setBookingMessage(e.target.value)}
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowBookingModal(false)}
                      className="btn btn-ghost flex-1 text-xs font-mono"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-go flex-1 text-xs font-mono font-bold shadow-lg shadow-[#3ED98A]/20"
                    >
                      Send Request to Venue &rarr;
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
