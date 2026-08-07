import React, { useState, useMemo } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import type { EventCentre, ViewRoute } from '../../types';
import { Footer } from '../layout/Footer';
import { MapPin, Search, Filter, Users, Building2, ShieldCheck } from 'lucide-react';
import { useFormDraft } from '../../hooks/useFormDraft';

interface EventCentresViewProps {
  onNavigate?: (view: ViewRoute) => void;
}

export const EventCentresView: React.FC<EventCentresViewProps> = ({ onNavigate }) => {
  const { eventCentres, createBookingRequest } = useGatehouse();

  // Multi-Tiered Jiji.ng Style Filter State
  const [selectedState, setSelectedState] = useState('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxCapacityFilter, setMaxCapacityFilter] = useState(25000);

  // Modals
  const [selectedVenueModal, setSelectedVenueModal] = useState<EventCentre | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingVenue, setBookingVenue] = useState<EventCentre | null>(null);

  // 5-Minute Auto-Saved Booking Form Draft
  const [bookingFormData, setBookingFormData, clearBookingDraft] = useFormDraft('venue_booking_draft', {
    eventName: '',
    requestedDate: '',
    guestEstimate: 500,
    bookingMessage: '',
  });

  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  // Jiji.ng Location Data Mapping
  const locationMap: Record<string, string[]> = {
    Lagos: ['All Neighborhoods', 'Ikeja', 'Victoria Island', 'Lekki', 'Ojuelegba', 'Yaba', 'Surulere', 'Ikoyi'],
    Abuja: ['All Neighborhoods', 'Maitama', 'Gwarinpa', 'Wuse II', 'Asokoro', 'Jabi', 'Central Business District'],
    'Port Harcourt': ['All Neighborhoods', 'GRA Phase 2', 'Trans Amadi', 'Old GRA', 'Rumuola'],
    Ibadan: ['All Neighborhoods', 'Bodija', 'Ring Road', 'Jericho', 'Iyaganku'],
  };

  const categories = [
    'All Categories',
    'Grand Ballroom',
    'Outdoor Garden',
    'Conference Auditorium',
    'Exhibition Hall',
    'VIP Banquet Suite',
  ];

  // Perform multi-tiered search & filtering
  const filteredCentres = useMemo(() => {
    return eventCentres.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        c.amenities.some((a: string) => a.toLowerCase().includes(q));

      const matchesState =
        selectedState === 'all' || c.city.toLowerCase() === selectedState.toLowerCase();

      const matchesNeighborhood =
        selectedNeighborhood === 'all' ||
        selectedNeighborhood === 'All Neighborhoods' ||
        c.address.toLowerCase().includes(selectedNeighborhood.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' ||
        selectedCategory === 'All Categories' ||
        c.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (c.description || '').toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesCapacity = (c.capacityMax || c.capacity || 5000) <= maxCapacityFilter;

      return matchesSearch && matchesState && matchesNeighborhood && matchesCategory && matchesCapacity;
    });
  }, [eventCentres, searchQuery, selectedState, selectedNeighborhood, selectedCategory, maxCapacityFilter]);

  const handleOpenBooking = (centre: EventCentre) => {
    setBookingVenue(centre);
    setSelectedVenueModal(null);
    setShowBookingModal(true);
  };

  const handleSendBookingRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingVenue || !bookingFormData.eventName.trim() || !bookingFormData.requestedDate.trim()) return;

    await createBookingRequest(
      bookingVenue.id,
      bookingFormData.eventName,
      bookingFormData.requestedDate,
      bookingFormData.guestEstimate,
      bookingFormData.bookingMessage
    );

    setBookingSuccessMsg(
      `Booking request sent to ${bookingVenue.name}! The venue management team will review and approve.`
    );
    setTimeout(() => {
      setBookingSuccessMsg('');
      setShowBookingModal(false);
      clearBookingDraft(); // Clears booking draft on successful submission
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between -mt-4 sm:-mt-6 lg:-mt-8">
      
      {/* MAIN CONTENT AREA */}
      <main className="mx-auto max-w-7xl px-6 py-10 w-full space-y-10">
        
        {/* PAGE HEADER */}
        <div className="space-y-3 border-b border-border/40 pb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#5cbdb9] uppercase tracking-wider font-bold">
            <Building2 className="h-4 w-4" />
            Verified Event Centres Directory
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
            Find &amp; Book Verified Venues in Nigeria
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            Filter by state, neighborhood, capacity limits, and pricing. Send direct venue booking requests and issue delegated access passes instantly.
          </p>
        </div>

        {/* JIJI.NG STYLE MULTI-TIERED SEARCH & FILTER BAR */}
        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 lg:p-8 card-glow space-y-6">
          
          {/* SEARCH INPUT ROW */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by venue name, address, or neighborhood (e.g. Ojuelegba, Ikeja, Maitama)…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border/80 bg-navy-900 pl-12 pr-4 py-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* FILTER DROPDOWNS ROW */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* STATE FILTER */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase font-bold flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#5cbdb9]" /> State / Region
              </label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedNeighborhood('all');
                }}
                className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">All States / Cities</option>
                <option value="Lagos">Lagos State</option>
                <option value="Abuja">Abuja (FCT)</option>
                <option value="Port Harcourt">Rivers (Port Harcourt)</option>
                <option value="Ibadan">Oyo (Ibadan)</option>
              </select>
            </div>

            {/* NEIGHBORHOOD FILTER */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase font-bold flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-[#38ef7d]" /> City / Neighborhood
              </label>
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                disabled={selectedState === 'all'}
                className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
              >
                <option value="all">All Neighborhoods</option>
                {selectedState !== 'all' &&
                  locationMap[selectedState]?.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
              </select>
            </div>

            {/* CATEGORY FILTER */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase font-bold flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary" /> Facility Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* CAPACITY FILTER */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground uppercase font-bold flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-[#5cbdb9]" /> Max Capacity
                </span>
                <span className="text-[#5cbdb9] font-bold">{maxCapacityFilter.toLocaleString()} guests</span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="500"
                value={maxCapacityFilter}
                onChange={(e) => setMaxCapacityFilter(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-navy-900 rounded-lg cursor-pointer"
              />
            </div>

          </div>

        </div>

        {/* RESULTS COUNT HEADER */}
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
          <div>
            Showing <strong className="text-foreground">{filteredCentres.length}</strong> verified event facilities
          </div>
          {(selectedState !== 'all' || searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSelectedState('all');
                setSelectedNeighborhood('all');
                setSelectedCategory('all');
                setSearchQuery('');
                setMaxCapacityFilter(25000);
              }}
              className="text-[#5cbdb9] hover:underline cursor-pointer font-bold"
            >
              Reset Filters ✕
            </button>
          )}
        </div>

        {/* VENUES GRID */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCentres.map((centre) => (
            <div
              key={centre.id}
              className="group flex flex-col justify-between rounded-3xl border border-border/60 bg-card/40 overflow-hidden transition-all hover:border-primary/40 card-glow"
            >
              <div>
                {/* PHOTO THUMBNAIL */}
                <div className="relative h-48 bg-navy-900 overflow-hidden">
                  <img
                    src={
                      (centre.photos && centre.photos[0]) ||
                      centre.image ||
                      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={centre.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-navy-900/90 backdrop-blur text-[10px] font-mono text-[#38ef7d] font-bold border border-[#38ef7d]/30 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> VERIFIED VENUE
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-navy-900/90 text-xs font-mono text-foreground border border-border/60">
                    📍 {centre.city}
                  </div>
                </div>

                {/* CARD CONTENT */}
                <div className="p-6 space-y-3">
                  <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-[#5cbdb9] transition-colors">
                    {centre.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {centre.description || ''}
                  </p>

                  <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-border/40">
                    <span className="text-muted-foreground">Capacity:</span>
                    <strong className="text-foreground">
                      {centre.capacityMin || 500} - {(centre.capacityMax || centre.capacity || 5000).toLocaleString()} guests
                    </strong>
                  </div>

                  <div className="text-xs font-mono text-[#5cbdb9] font-bold">
                    Price: {centre.priceRange}
                  </div>

                  {/* AMENITIES */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {centre.amenities.map((a, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono bg-navy-900 text-muted-foreground px-2.5 py-0.5 rounded-md border border-border/60"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD ACTIONS */}
              <div className="p-6 pt-0 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedVenueModal(centre)}
                  className="rounded-full border border-border/60 bg-card px-4 py-2.5 text-xs font-mono text-foreground hover:bg-secondary cursor-pointer transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleOpenBooking(centre)}
                  className="rounded-full bg-primary px-4 py-2.5 text-xs font-mono font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm transition-colors"
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
            <div className="max-w-xl w-full rounded-3xl border border-border/60 bg-navy-900 p-6 lg:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <h3 className="font-heading text-2xl font-bold text-foreground">
                  {selectedVenueModal.name}
                </h3>
                <button
                  onClick={() => setSelectedVenueModal(null)}
                  className="text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <div className="h-60 rounded-2xl overflow-hidden bg-navy-800">
                <img
                  src={(selectedVenueModal.photos && selectedVenueModal.photos[0]) || selectedVenueModal.image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'}
                  alt={selectedVenueModal.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-xs text-muted-foreground">
                <p><strong className="text-foreground">Address:</strong> {selectedVenueModal.address}, {selectedVenueModal.city}</p>
                <p>{selectedVenueModal.description || ''}</p>
                <p><strong className="text-foreground">Capacity Limit:</strong> {selectedVenueModal.capacityMin || 500} to {(selectedVenueModal.capacityMax || selectedVenueModal.capacity || 5000).toLocaleString()} guests</p>
                <p><strong className="text-foreground">Pricing:</strong> <span className="text-[#5cbdb9] font-bold">{selectedVenueModal.priceRange || 'Contact Venue'}</span></p>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setSelectedVenueModal(null)}
                  className="rounded-full border border-border/60 bg-card flex-1 py-3 text-xs font-mono text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleOpenBooking(selectedVenueModal)}
                  className="rounded-full bg-primary flex-1 py-3 text-xs font-mono font-bold text-primary-foreground cursor-pointer"
                >
                  Book Venue Now &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BOOKING REQUEST MODAL */}
        {showBookingModal && bookingVenue && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full rounded-3xl border border-border/60 bg-navy-900 p-6 lg:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    Request Booking: {bookingVenue.name}
                  </h3>
                  <div className="text-xs font-mono text-[#5cbdb9]">
                    {bookingVenue.city} • Capacity: {(bookingVenue.capacityMax || bookingVenue.capacity || 5000).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {bookingSuccessMsg ? (
                <div className="p-4 rounded-2xl bg-[#38ef7d]/10 border border-[#38ef7d] text-[#38ef7d] text-xs font-mono text-center font-bold">
                  {bookingSuccessMsg}
                </div>
              ) : (
                <form onSubmit={handleSendBookingRequest} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted-foreground font-bold">Event Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Lagos Tech Summit 2026"
                      value={bookingFormData.eventName}
                      onChange={(e) => setBookingFormData((prev) => ({ ...prev, eventName: e.target.value }))}
                      required
                      className="w-full rounded-xl border border-border/80 bg-navy-800 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted-foreground font-bold">Requested Event Date *</label>
                    <input
                      type="text"
                      placeholder="e.g. Sat, 15 Nov 2026"
                      value={bookingFormData.requestedDate}
                      onChange={(e) => setBookingFormData((prev) => ({ ...prev, requestedDate: e.target.value }))}
                      required
                      className="w-full rounded-xl border border-border/80 bg-navy-800 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted-foreground font-bold">Estimated Guest Count</label>
                    <input
                      type="number"
                      min={100}
                      max={bookingVenue.capacityMax}
                      value={bookingFormData.guestEstimate}
                      onChange={(e) => setBookingFormData((prev) => ({ ...prev, guestEstimate: Number(e.target.value) }))}
                      required
                      className="w-full rounded-xl border border-border/80 bg-navy-800 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted-foreground font-bold">Special Instructions</label>
                    <textarea
                      rows={3}
                      placeholder="Specify stage setup, VIP lounge access, sound setup..."
                      value={bookingFormData.bookingMessage}
                      onChange={(e) => setBookingFormData((prev) => ({ ...prev, bookingMessage: e.target.value }))}
                      className="w-full rounded-xl border border-border/80 bg-navy-800 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowBookingModal(false)}
                      className="rounded-full border border-border/60 bg-card flex-1 py-3 text-xs font-mono text-foreground cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-full bg-primary flex-1 py-3 text-xs font-mono font-bold text-primary-foreground cursor-pointer"
                    >
                      Send Request &rarr;
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </main>

      {/* REUSABLE ENTERPRISE FOOTER */}
      <Footer onNavigate={onNavigate} />

    </div>
  );
};
