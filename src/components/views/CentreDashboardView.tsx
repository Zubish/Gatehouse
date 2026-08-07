import React, { useState } from "react";
import { useGatehouse } from "../../context/GatehouseContext";

export const CentreDashboardView: React.FC = () => {
  const {
    bookings,
    updateBookingStatus,
    delegations,
    addGuest,
    bulkImportGuests,
  } = useGatehouse();

  // Centre Delegated Guest Registration State
  const [delegatedGuestName, setDelegatedGuestName] = useState("");
  const [delegatedGuestPhone, setDelegatedGuestPhone] = useState("");
  const [delegatedCategory, setDelegatedCategory] = useState<"VIP" | "Regular">(
    "VIP",
  );
  const [delegatedSuccessMsg, setDelegatedSuccessMsg] = useState("");

  // Centre Delegated Bulk State
  const [delegatedBulkText, setDelegatedBulkText] = useState("");
  const [bulkImportStatus, setBulkImportStatus] = useState("");

  // Multi-Hall Venue Spaces State
  const [selectedHall, setSelectedHall] = useState("Grand Ballroom");
  const [usherName, setUsherName] = useState("");
  const [assignedUshers, setAssignedUshers] = useState<
    { id: string; name: string; hall: string; lane: string }[]
  >([
    {
      id: "ush_1",
      name: "Emeka Nnamdi",
      hall: "Grand Ballroom",
      lane: "VIP Gate Lane 01",
    },
    {
      id: "ush_2",
      name: "Fatima Bello",
      hall: "Hall A",
      lane: "Main Gate Lane 03",
    },
  ]);
  const [usherAssignMsg, setUsherAssignMsg] = useState("");

  const pendingBookings = bookings.filter((b) => b.status === "requested");
  const acceptedBookings = bookings.filter((b) => b.status === "accepted");

  const handleAcceptBooking = async (id: string) => {
    await updateBookingStatus(id, "accepted");
  };

  const handleDeclineBooking = async (id: string) => {
    await updateBookingStatus(id, "declined");
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
      setDelegatedGuestName("");
      setDelegatedGuestPhone("");
      setTimeout(() => setDelegatedSuccessMsg(""), 3000);
    }
  };

  const handleDelegatedBulkImport = async () => {
    if (!delegatedBulkText.trim()) return;
    const added = bulkImportGuests(delegatedBulkText);
    setDelegatedBulkText("");
    setBulkImportStatus(
      `Delegated venue import added ${added} guest${added !== 1 ? "s" : ""}.`
    );
    setTimeout(() => setBulkImportStatus(""), 3000);
  };

  const handleAssignUsher = () => {
    if (!usherName.trim()) return;
    const newUsh = {
      id: "ush_" + Math.random().toString(36).substring(2, 7),
      name: usherName.trim(),
      hall: selectedHall,
      lane: `Lane #${assignedUshers.length + 1}`,
    };
    setAssignedUshers((prev) => [...prev, newUsh]);
    setUsherAssignMsg(`Usher ${newUsh.name} assigned to ${newUsh.hall}!`);
    setUsherName("");
    setTimeout(() => setUsherAssignMsg(""), 2500);
  };

  return (
    <section className="view active" id="view-centre-dashboard">
      <div className="space-y-6">
        {/* PORTAL TITLE & METRICS */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#262D38] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#332A14] text-[#F0A93B] font-mono text-xs font-bold border border-[#F0A93B]/30 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#F0A93B] animate-pulse" />
              MULTI-HALL VENUE &amp; USHERING OPERATIONS (PHASE 7)
            </div>
            <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-[#EDEFF3]">
              Venue Manager Operations &amp; Delegations
            </h2>
            <p className="text-xs font-mono text-[#8B93A3]">
              Review organizer venue bookings, assign hall ushers, and manage
              delegated gate access.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="p-3 rounded-xl bg-[#151A22] border border-[#262D38] text-center font-mono">
              <div className="text-xs text-[#8B93A3] uppercase">
                Pending Requests
              </div>
              <div className="text-xl font-bold text-[#F0A93B] font-['Space_Grotesk']">
                {pendingBookings.length}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#151A22] border border-[#262D38] text-center font-mono">
              <div className="text-xs text-[#8B93A3] uppercase">
                Active Delegations
              </div>
              <div className="text-xl font-bold text-[#3ED98A] font-['Space_Grotesk']">
                {delegations.length}
              </div>
            </div>
          </div>
        </div>

        {/* PENDING VENUE BOOKING REQUESTS */}
        <div className="panel space-y-4">
          <div className="panel-head">
            <h3>Incoming Venue Booking Requests</h3>
            <span className="text-xs font-mono text-[#8B93A3]">
              {pendingBookings.length} request
              {pendingBookings.length !== 1 ? "s" : ""} awaiting action
            </span>
          </div>

          {pendingBookings.length > 0 ? (
            <div className="space-y-3">
              {pendingBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl bg-[#1B2129] border border-[#262D38] flex flex-wrap items-center justify-between gap-4 hover:border-[#F0A93B]/40 transition-all"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-[#EDEFF3] font-['Space_Grotesk']">
                      {b.eventName}
                    </div>
                    <div className="text-xs font-mono text-[#94a3b8]">
                      Host:{" "}
                      <strong className="text-white">{b.organizerName}</strong>{" "}
                      • Date:{" "}
                      <strong className="text-[#3ED98A]">
                        {b.requestedDate}
                      </strong>
                    </div>
                    <div className="text-xs font-mono text-[#8B93A3]">
                      Est. Guests: {b.guestEstimate} • Notes: "
                      {b.message || "No special requests"}"
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeclineBooking(b.id)}
                      className="btn btn-danger btn-sm font-mono"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAcceptBooking(b.id)}
                      className="btn btn-go btn-sm font-mono font-bold"
                    >
                      Accept Booking &amp; Grant Access &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">No pending booking requests right now.</div>
          )}
        </div>

        {/* MULTI-HALL VENUE SPACE USHER ASSIGNMENT MATRIX */}
        <div className="panel space-y-4">
          <div className="panel-head">
            <h3>Multi-Hall Venue Spaces &amp; Gate Usher Matrix</h3>
            <span className="text-xs font-mono text-[#3ED98A]">
              Hardware Gate Lanes
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Assign Usher Form */}
            <div className="space-y-3">
              <div className="field">
                <label>Select Venue Hall / Space</label>
                <select
                  value={selectedHall}
                  onChange={(e) => setSelectedHall(e.target.value)}
                >
                  <option value="Grand Ballroom">
                    Grand Ballroom (Capacity: 3,000)
                  </option>
                  <option value="Hall A">Hall A (Capacity: 1,200)</option>
                  <option value="Executive VIP Suite">
                    Executive VIP Suite (Capacity: 300)
                  </option>
                </select>
              </div>

              <div className="field">
                <label>Usher / Scanner Officer Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Samuel Okon"
                  value={usherName}
                  onChange={(e) => setUsherName(e.target.value)}
                />
              </div>

              {usherAssignMsg && (
                <div className="p-3 rounded-lg bg-[#173226] border border-[#3ED98A] text-[#3ED98A] text-xs font-mono text-center font-bold">
                  {usherAssignMsg}
                </div>
              )}

              <button
                onClick={handleAssignUsher}
                className="btn btn-go w-full font-mono font-bold text-xs py-3"
              >
                + Assign Usher &amp; Provision Scanner Gun
              </button>
            </div>

            {/* Assigned Ushers List */}
            <div className="space-y-2">
              <label>Assigned Hall Ushers &amp; Gate Lanes</label>
              <div className="space-y-2">
                {assignedUshers.map((u) => (
                  <div
                    key={u.id}
                    className="p-3 rounded-xl bg-[#080c14] border border-[#262D38] flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span className="font-bold text-white block">
                        {u.name}
                      </span>
                      <span className="text-[#8B93A3]">
                        {u.hall} • {u.lane}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#173226] text-[#3ED98A] font-bold">
                      SCANNER ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DELEGATED PATH B GUEST REGISTRATION PORTAL */}
        <div className="panel space-y-4">
          <div className="panel-head">
            <h3>Path B: Delegated Venue Guest Registration</h3>
            <span className="text-xs font-mono text-[#3ED98A]">
              Delegated Permission Active
            </span>
          </div>

          <p className="text-xs text-[#8B93A3]">
            Event Centre teams can register VIP guests or import gate lists
            directly on behalf of host organizers.
          </p>

          {delegatedSuccessMsg && (
            <div className="p-3 rounded-lg bg-[#173226] border border-[#3ED98A] text-[#3ED98A] text-xs font-mono font-bold text-center">
              {delegatedSuccessMsg}
            </div>
          )}

          <div className="field-row">
            <div className="field">
              <label>Guest Full Name</label>
              <input
                type="text"
                placeholder="e.g. Chief Adeleke Johnson"
                value={delegatedGuestName}
                onChange={(e) => setDelegatedGuestName(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Phone / WhatsApp</label>
              <input
                type="tel"
                placeholder="080..."
                value={delegatedGuestPhone}
                onChange={(e) => setDelegatedGuestPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Category</label>
              <select
                value={delegatedCategory}
                onChange={(e) =>
                  setDelegatedCategory(e.target.value as "VIP" | "Regular")
                }
              >
                <option value="VIP">VIP Guest</option>
                <option value="Regular">Regular Guest</option>
              </select>
            </div>
            <div className="field flex items-end">
              <button
                onClick={handleRegisterDelegatedGuest}
                className="btn btn-go w-full font-mono font-bold"
              >
                + Register Delegated Guest
              </button>
            </div>
          </div>

          <div className="divider" />

          <div className="space-y-2">
            <label>
              Delegated Bulk CSV Import (One guest per line: Name, Phone,
              VIP/Regular)
            </label>
            <textarea
              rows={3}
              placeholder={`Alhaji Aliko Dangote, 08031112222, VIP\nDr. Ngozi Okonjo, 08099998888, VIP`}
              value={delegatedBulkText}
              onChange={(e) => setDelegatedBulkText(e.target.value)}
            />
            <button
              onClick={handleDelegatedBulkImport}
              className="btn btn-ghost font-mono text-xs"
            >
              {bulkImportStatus || "Import Delegated Venue List"}
            </button>
          </div>
        </div>

        {/* ACCEPTED BOOKINGS SUMMARY */}
        <div className="panel space-y-4">
          <div className="panel-head">
            <h3>Approved Venue Events &amp; Delegated Access History</h3>
          </div>

          {acceptedBookings.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Event &amp; Host</th>
                  <th>Requested Date</th>
                  <th>Guests Est.</th>
                  <th>Permissions Granted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {acceptedBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <b>{b.eventName}</b>
                      <br />
                      <span className="text-[11px] text-[#8B93A3]">
                        {b.organizerName}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-[#3ED98A]">
                        {b.requestedDate}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs">
                        {b.guestEstimate}
                      </span>
                    </td>
                    <td>
                      <span className="code-chip text-[10px] text-[#3ED98A]">
                        register_guests, scan_guests
                      </span>
                    </td>
                    <td>
                      <span className="status-pill in">Approved</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty">No approved booking history yet.</div>
          )}
        </div>
      </div>
    </section>
  );
};
