import React, { useState } from "react";
import { useGatehouse } from "../../context/GatehouseContext";

export const WalkinView: React.FC = () => {
  const { addGuest, checkInGuest } = useGatehouse();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState<"VIP" | "Regular">("Regular");
  const [statusBanner, setStatusBanner] = useState<{
    show: boolean;
    type: "ok" | "err";
    message: string;
  }>({ show: false, type: "ok", message: "" });

  const handleRegisterAndCheckin = async () => {
    if (!name.trim()) {
      setStatusBanner({
        show: true,
        type: "err",
        message: "Enter a name to register this guest.",
      });
      return;
    }

    const g = await addGuest(name, phone, category);
    if (g) {
      await checkInGuest(g.id);
      setStatusBanner({
        show: true,
        type: "ok",
        message: `${g.name} registered and checked in — code ${g.code}.`,
      });
      setName("");
      setPhone("");
    }
  };

  return (
    <section className="view active" id="view-walkin">
      <h2 className="section-title">Walk-In Registration</h2>
      <div className="panel" style={{ maxWidth: 480 }}>
        <p className="helper" style={{ marginBottom: 16 }}>
          For guests arriving without a code. They're added to the list and
          checked in immediately.
        </p>

        <div className="field">
          <label>Name</label>
          <input
            type="text"
            id="walkinName"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Phone / WhatsApp</label>
          <input
            type="tel"
            id="walkinPhone"
            placeholder="080..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Category</label>
          <select
            id="walkinCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value as "VIP" | "Regular")}
          >
            <option value="Regular">Regular</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        <button
          className="btn btn-go"
          style={{ width: "100%" }}
          id="walkinBtn"
          onClick={handleRegisterAndCheckin}
        >
          Register &amp; check in
        </button>

        {statusBanner.show && (
          <div
            className={`status-banner show ${statusBanner.type}`}
            id="walkinStatus"
          >
            {statusBanner.message}
          </div>
        )}
      </div>
    </section>
  );
};
