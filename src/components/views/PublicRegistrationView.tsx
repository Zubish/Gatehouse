import React, { useState } from "react";
import { useGatehouse } from "../../context/GatehouseContext";
import { generateQrGrid } from "../../utils/qrGenerator";
import type { Guest } from "../../types";

export const PublicRegistrationView: React.FC = () => {
  const { activeEvent, guests, addGuest } = useGatehouse();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<"VIP" | "Regular">("Regular");
  const [registeredGuest, setRegisteredGuest] = useState<Guest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLinkMsg, setCopiedLinkMsg] = useState("");

  const currentCount = guests.length;
  const capacityReached = currentCount >= activeEvent.capacity;
  const spotsLeft = Math.max(0, activeEvent.capacity - currentCount);

  const publicLink = `${window.location.origin}/r/${activeEvent.registrationLinkToken}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink);
    setCopiedLinkMsg("Copied to clipboard!");
    setTimeout(() => setCopiedLinkMsg(""), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const newGuest = await addGuest(
      name,
      phone,
      category,
      "self_registered",
      email,
    );
    setIsSubmitting(false);

    if (newGuest) {
      setRegisteredGuest(newGuest);
    }
  };

  const qrGrid = registeredGuest
    ? generateQrGrid(registeredGuest.qrPayload)
    : [];

  return (
    <section className="view active" id="view-public-reg">
      <div className="max-w-xl mx-auto space-y-6">
        {/* EVENT PUBLIC HEADER BANNER */}
        <div className="panel text-center space-y-3 border-[#3ED98A]/40 bg-gradient-to-b from-[#0f172a] to-[#173226]/30 p-8 rounded-2xl shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173226] text-[#3ED98A] font-mono text-xs font-bold border border-[#3ED98A]/30">
            <span className="w-2 h-2 rounded-full bg-[#3ED98A] animate-pulse" />
            PUBLIC SELF-REGISTRATION LINK (PATH C)
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-[#EDEFF3]">
            {activeEvent.name}
          </h2>

          <p className="text-xs text-[#94a3b8] font-mono">
            🗓️ {activeEvent.date} at {activeEvent.startTime} • Public Token:{" "}
            <code className="text-[#3ED98A] font-bold">
              [{activeEvent.registrationLinkToken}]
            </code>
          </p>

          {/* SHAREABLE PUBLIC LINK BAR */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-[#080c14] border border-[#262D38] text-xs font-mono text-[#8B93A3] max-w-md mx-auto">
            <span className="truncate flex-1 pl-2 text-left">{publicLink}</span>
            <button
              onClick={handleCopyLink}
              className="btn btn-go btn-sm font-mono font-bold shrink-0"
            >
              {copiedLinkMsg || "Copy Link"}
            </button>
          </div>

          {/* CAPACITY METRICS */}
          <div className="flex justify-center items-center gap-4 text-xs font-mono pt-2">
            <span className="text-[#8B93A3]">
              Registered: <strong className="text-white">{currentCount}</strong>{" "}
              / {activeEvent.capacity}
            </span>
            <span className="text-[#262D38]">|</span>
            <span
              className={
                spotsLeft > 0
                  ? "text-[#3ED98A] font-bold"
                  : "text-[#E5555C] font-bold"
              }
            >
              {spotsLeft > 0
                ? `🔥 ${spotsLeft} Spots Remaining`
                : "⛔ Event Sold Out"}
            </span>
          </div>
        </div>

        {/* REGISTRATION FORM OR QR PASS CONFIRMATION */}
        {!registeredGuest ? (
          <div className="panel space-y-4">
            {capacityReached ? (
              <div className="p-6 rounded-xl bg-[#331B1D] border border-[#E5555C] text-[#E5555C] text-xs font-mono text-center font-bold space-y-2">
                <div className="text-xl">⛔ REGISTRATION CLOSED</div>
                <div>
                  Capacity cap reached ({activeEvent.capacity} guests max). No
                  further self-registrations allowed.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="field-row">
                  <div className="field">
                    <label>Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      placeholder="08031234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Email Address (For Pass Copy)</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Select Ticket Tier</label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as "VIP" | "Regular")
                    }
                  >
                    <option value="Regular">Regular Pass (Free Access)</option>
                    <option value="VIP">VIP Access Pass</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-go w-full py-4 text-xs font-mono font-bold shadow-xl shadow-[#3ED98A]/20 hover:scale-[1.01] transition-transform"
                >
                  {isSubmitting
                    ? "Registering…"
                    : "🎟️ Register & Claim Digital QR Gate Pass"}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* INSTANT QR PASS BADGE RENDER */
          <div className="panel text-center space-y-6 border-[#3ED98A]/60 bg-[#0f172a] p-8 rounded-2xl shadow-2xl">
            <div className="p-3 rounded-xl bg-[#173226] text-[#3ED98A] text-xs font-mono font-bold border border-[#3ED98A]/40">
              🎉 REGISTRATION SUCCESSFUL! YOUR GATEPASS QR CODE IS ACTIVE.
            </div>

            {/* BADGE CONTAINER */}
            <div className="badge max-w-sm mx-auto flex-col p-6 space-y-4 bg-[#1B2129] border border-[#262D38] rounded-2xl shadow-xl">
              {/* SVG 21x21 QR Code Rendering */}
              <div className="w-48 h-48 bg-white rounded-xl p-3 mx-auto shadow-2xl flex items-center justify-center">
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
                      ) : null,
                    ),
                  )}
                </svg>
              </div>

              <div className="badge-info text-center space-y-1.5">
                <div className="name text-xl font-bold font-['Space_Grotesk'] text-[#EDEFF3]">
                  {registeredGuest.name}
                </div>
                <div className="text-xs font-mono text-[#8B93A3]">
                  {activeEvent.name}
                </div>
                <div className="code-chip inline-block mt-2 font-mono text-sm font-bold tracking-widest text-[#3ED98A]">
                  {registeredGuest.code}
                </div>
                <div>
                  <span
                    className={`tag inline-block ${
                      registeredGuest.category === "VIP"
                        ? "tag-vip"
                        : "tag-regular"
                    }`}
                  >
                    {registeredGuest.category} PASS
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#8B93A3] font-mono max-w-md mx-auto">
              Show this QR pass or code chip{" "}
              <code className="text-[#3ED98A] font-bold">
                {registeredGuest.code}
              </code>{" "}
              at the gate entrance for express 2.5-second scan verification.
            </p>

            <button
              onClick={() => setRegisteredGuest(null)}
              className="btn btn-ghost text-xs font-mono"
            >
              Register Another Guest
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
