import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';

export const SettingsView: React.FC = () => {
  const { activeEvent, createEvent } = useGatehouse();

  const [name, setName] = useState(activeEvent.name);
  const [date, setDate] = useState(activeEvent.date);
  const [capacity, setCapacity] = useState(activeEvent.capacity);
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = async () => {
    const newEvt = await createEvent(name, date, '18:00', capacity, activeEvent.eventCentreId);
    if (newEvt) {
      setSavedMsg(`New Event Created: ${newEvt.name}`);
      setTimeout(() => setSavedMsg(''), 2500);
    }
  };

  return (
    <section className="view active" id="view-settings">
      <h2 className="section-title">Event Setup &amp; Management</h2>
      <div className="panel" style={{ maxWidth: 480 }}>
        <div className="field">
          <label>Event name</label>
          <input
            type="text"
            id="setEventName"
            placeholder="e.g. Bloom Xquisit Gala"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Event date</label>
          <input
            type="text"
            id="setEventDate"
            placeholder="e.g. Sat, 23 Aug 2026"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Max Guest Capacity Cap</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
        </div>

        <button className="btn btn-go" id="saveEventBtn" onClick={handleSave}>
          {savedMsg || 'Create / Save Event Record'}
        </button>

        <p className="helper" style={{ marginTop: 16 }}>
          Events are tied to organizer accounts and venue bookings. Public Link Token: <code>{activeEvent.registrationLinkToken}</code>
        </p>
      </div>
    </section>
  );
};
