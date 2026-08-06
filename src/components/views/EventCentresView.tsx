import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import type { EventCentre } from '../../types';

export const EventCentresView: React.FC = () => {
  const { eventCentres, createBookingRequest, activeEvent } = useGatehouse();

  const [searchCity, setSearchCity] = useState('');
  const [selectedCentre, setSelectedCentre] = useState<EventCentre | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const [eventName, setEventName] = useState(activeEvent.name);
  const [requestedDate, setRequestedDate] = useState('2026-08-23');
  const [guestEstimate, setGuestEstimate] = useState(450);
  const [message, setMessage] = useState('Requesting booking for our annual gala.');
  const [sentNotice, setSentNotice] = useState(false);

  const filteredCentres = eventCentres.filter(
    (c) =>
      !searchCity ||
      c.city.toLowerCase().includes(searchCity.toLowerCase()) ||
      c.name.toLowerCase().includes(searchCity.toLowerCase())
  );

  const handleOpenBooking = (centre: EventCentre) => {
    setSelectedCentre(centre);
    setBookingModalOpen(true);
  };

  const handleSendBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCentre) {
      createBookingRequest(
        selectedCentre.id,
        eventName,
        requestedDate,
        guestEstimate,
        message
      );
      setSentNotice(true);
      setTimeout(() => {
        setSentNotice(false);
        setBookingModalOpen(false);
      }, 2000);
    }
  };

  return (
    <section className="view active" id="view-centres">
      <h2 className="section-title">Event Centre Directory & Booking</h2>

      <div className="panel">
        <div className="toolbar">
          <input
            type="text"
            placeholder="Search venue by name or city (e.g. Lagos, Abuja)..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCentres.map((centre) => (
            <div
              key={centre.id}
              className="bg-[#151A22] border border-[#262D38] rounded-xl overflow-hidden p-4 space-y-3"
            >
              <img
                src={centre.photos[0]}
                alt={centre.name}
                className="w-full h-40 object-cover rounded-lg border border-[#262D38]"
              />

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#EDEFF3] font-['Space_Grotesk']">
                    {centre.name}
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#173226] text-[#3ED98A] font-semibold border border-[#3ED98A]/30">
                    Verified Venue
                  </span>
                </div>
                <p className="text-xs text-[#8B93A3] font-mono">{centre.address}, {centre.city}</p>
              </div>

              <p className="text-xs text-[#EDEFF3] leading-relaxed">{centre.description}</p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {centre.amenities.map((am, i) => (
                  <span key={i} className="text-[10px] font-mono bg-[#1B2129] text-[#8B93A3] px-2 py-0.5 rounded border border-[#262D38]">
                    {am}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-[#262D38] flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-[#565E6D] text-[10px] uppercase block">Capacity</span>
                  <strong className="text-[#EDEFF3]">{centre.capacityMin.toLocaleString()} - {centre.capacityMax.toLocaleString()} guests</strong>
                </div>
                <div className="text-right">
                  <span className="text-[#565E6D] text-[10px] uppercase block">Pricing</span>
                  <strong className="text-[#3ED98A]">{centre.priceRange}</strong>
                </div>
              </div>

              <button
                onClick={() => handleOpenBooking(centre)}
                className="btn btn-go w-full mt-2 font-bold"
              >
                Request Booking Date
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* BOOKING REQUEST MODAL */}
      {bookingModalOpen && selectedCentre && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#151A22] border border-[#262D38] rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262D38] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#EDEFF3] font-['Space_Grotesk']">
                  Request Venue: {selectedCentre.name}
                </h3>
                <p className="text-xs text-[#8B93A3] font-mono">{selectedCentre.city}</p>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="text-[#8B93A3] hover:text-[#EDEFF3] text-sm font-mono"
              >
                ✕
              </button>
            </div>

            {sentNotice ? (
              <div className="p-4 rounded-lg bg-[#173226] border border-[#3ED98A] text-[#3ED98A] text-xs font-mono font-bold text-center">
                Booking request submitted! Pending centre approval.
              </div>
            ) : (
              <form onSubmit={handleSendBooking} className="space-y-3">
                <div className="field">
                  <label>Event Name</label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                  />
                </div>

                <div className="field-row">
                  <div className="field">
                    <label>Requested Date</label>
                    <input
                      type="date"
                      value={requestedDate}
                      onChange={(e) => setRequestedDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Estimated Guests</label>
                    <input
                      type="number"
                      value={guestEstimate}
                      onChange={(e) => setGuestEstimate(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Message / Setup Notes</label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-go w-full">
                  Send Booking Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
