import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';

export const CentreDashboardView: React.FC = () => {
  const { bookings, updateBookingStatus, delegations, events, guests, bulkImportGuests, checkInGuest } = useGatehouse();

  const [bulkText, setBulkText] = useState('');
  const [importNotice, setImportNotice] = useState('');

  const handleImport = () => {
    if (!bulkText.trim()) return;
    const added = bulkImportGuests(bulkText, 'centre_import');
    setBulkText('');
    setImportNotice(`Centre registered ${added} guests on behalf of organizer.`);
    setTimeout(() => setImportNotice(''), 3000);
  };

  return (
    <section className="view active" id="view-centre-portal">
      <h2 className="section-title">Event Centre Operations Portal</h2>

      {/* INCOMING BOOKINGS */}
      <div className="panel space-y-3">
        <div className="panel-head">
          <h3>Incoming Venue Booking Requests</h3>
        </div>

        {bookings.length === 0 ? (
          <div className="empty">No booking requests pending.</div>
        ) : (
          <div className="space-y-2">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-3 bg-[#1B2129] border border-[#262D38] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-[#EDEFF3] flex items-center gap-2">
                    <span>{b.eventName}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#332A14] text-[#F0A93B] font-bold">
                      {b.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8B93A3] font-mono mt-0.5">
                    Organizer: {b.organizerName} • Date: {b.requestedDate} • Est. Guests: {b.guestEstimate}
                  </div>
                  <div className="text-[11px] text-[#565E6D] mt-1 font-mono italic">"{b.message}"</div>
                </div>

                {b.status === 'requested' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateBookingStatus(b.id, 'accepted')}
                      className="btn btn-go btn-sm"
                    >
                      Accept Booking
                    </button>
                    <button
                      onClick={() => updateBookingStatus(b.id, 'declined')}
                      className="btn btn-danger btn-sm"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DELEGATED EVENTS & GUEST REGISTRATION (PATH B) */}
      <div className="panel space-y-4">
        <div className="panel-head">
          <h3>Delegated Event Registration & Gate Control (Path B)</h3>
        </div>

        <p className="helper">
          Organizers who host at your venue can delegate guest list management or gate scanning duties to your staff.
        </p>

        {delegations.length === 0 ? (
          <div className="empty">No events currently delegated to this venue.</div>
        ) : (
          <div className="space-y-4">
            {delegations.map((del) => {
              const evt = events.find((e) => e.id === del.eventId);
              return (
                <div key={del.id} className="p-4 bg-[#1B2129] border border-[#262D38] rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-[#262D38] pb-2">
                    <div>
                      <h4 className="font-bold text-sm text-[#EDEFF3] font-['Space_Grotesk']">
                        {evt?.name || 'Delegated Event'}
                      </h4>
                      <div className="text-xs text-[#8B93A3] font-mono">
                        Date: {evt?.date} • Delegated Rights: {del.permissions.join(', ')}
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-[#173226] text-[#3ED98A] text-[10px] font-mono font-bold">
                      DELEGATION ACTIVE
                    </span>
                  </div>

                  {/* Delegated Registration Import Form */}
                  <div className="space-y-2 pt-1">
                    <label>Register Guests for Host (Name, Phone, Category)</label>
                    <textarea
                      rows={2}
                      placeholder={`Bisi Adebayo, 08022223333, VIP\nChuka Nnamdi, 08044445555, Regular`}
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                      <button onClick={handleImport} className="btn btn-go btn-sm">
                        + Register Guests on Behalf of Organizer
                      </button>
                      {importNotice && (
                        <span className="text-xs font-mono text-[#3ED98A] font-bold">
                          {importNotice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Scoped Guest Check-in List */}
                  <div className="space-y-2 pt-2 border-t border-[#262D38]">
                    <div className="text-xs font-mono font-bold text-[#8B93A3]">
                      Venue Guest Check-in ({guests.length} Registered)
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                      {guests.map((g) => (
                        <div
                          key={g.id}
                          className="p-2 bg-[#151A22] rounded border border-[#262D38] flex items-center justify-between text-xs font-mono"
                        >
                          <div>
                            <span className="font-bold text-[#EDEFF3]">{g.name}</span>
                            <span className="text-[10px] text-[#8B93A3] ml-2">({g.source})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="code-chip">{g.code}</span>
                            {g.status === 'in' ? (
                              <span className="status-pill in">Checked in</span>
                            ) : (
                              <button
                                onClick={() => checkInGuest(g.id, 'Centre Staff')}
                                className="btn btn-go btn-sm"
                              >
                                Scan / Gate Check-in
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
