import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';

export const SettingsView: React.FC = () => {
  const { activeEvent, createEvent } = useGatehouse();

  const [name, setName] = useState(activeEvent.name);
  const [date, setDate] = useState(activeEvent.date);
  const [capacity, setCapacity] = useState(activeEvent.capacity);
  const [savedMsg, setSavedMsg] = useState('');

  // Notification Config State
  const [enableSms, setEnableSms] = useState(true);
  const [enableEmail, setEnableEmail] = useState(true);
  const [testPhone, setTestPhone] = useState('08031234567');
  const [smsTestMsg, setSmsTestMsg] = useState('');

  const handleSave = async () => {
    const newEvt = await createEvent(name, date, '18:00', capacity, activeEvent.eventCentreId);
    if (newEvt) {
      setSavedMsg(`New Event Created: ${newEvt.name}`);
      setTimeout(() => setSavedMsg(''), 2500);
    }
  };

  const handleSendTestSms = () => {
    if (!testPhone.trim()) return;
    setSmsTestMsg(`📱 Simulated SMS Pass sent to ${testPhone}: "Your GatePass QR code for ${activeEvent.name} is active. Code: ${activeEvent.registrationLinkToken}"`);
    setTimeout(() => setSmsTestMsg(''), 4000);
  };

  return (
    <section className="view active" id="view-settings">
      <div className="space-y-6 max-w-2xl mx-auto">
        
        {/* HEADER */}
        <div className="border-b border-[#262D38] pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173226] text-[#3ED98A] font-mono text-xs font-bold border border-[#3ED98A]/30 mb-2">
            EVENT CONFIGURATION &amp; NOTIFICATION SYSTEM
          </div>
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-[#EDEFF3]">
            Event Setup &amp; Gate Settings
          </h2>
          <p className="text-xs font-mono text-[#8B93A3]">
            Configure event parameters, SMS/Email pass dispatching, and capacity thresholds.
          </p>
        </div>

        {/* EVENT DETAILS FORM */}
        <div className="panel space-y-4">
          <div className="panel-head">
            <h3>General Event Settings</h3>
            <span className="text-xs font-mono text-[#3ED98A]">Active Token: [{activeEvent.registrationLinkToken}]</span>
          </div>

          <div className="field">
            <label>Event Name</label>
            <input
              type="text"
              placeholder="e.g. Bloom Xquisit Gala"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Event Date</label>
              <input
                type="text"
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
          </div>

          {savedMsg && (
            <div className="p-3 rounded-lg bg-[#173226] border border-[#3ED98A] text-[#3ED98A] text-xs font-mono text-center font-bold">
              {savedMsg}
            </div>
          )}

          <button className="btn btn-go font-mono font-bold w-full py-3" onClick={handleSave}>
            Save Event Settings &amp; Re-Issue Token
          </button>
        </div>

        {/* AUTOMATED SMS / EMAIL PASS NOTIFICATION DISPATCHER */}
        <div className="panel space-y-4">
          <div className="panel-head">
            <h3>Automated Pass Dispatch &amp; SMS Dispatcher</h3>
            <span className="text-xs font-mono text-[#F0A93B]">Twilio / Termii Gateway</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableSms}
                onChange={(e) => setEnableSms(e.target.checked)}
                className="w-4 h-4 accent-[#3ED98A]"
              />
              <span className="text-white">Enable Automated SMS Pass Dispatch on Registration</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableEmail}
                onChange={(e) => setEnableEmail(e.target.checked)}
                className="w-4 h-4 accent-[#3ED98A]"
              />
              <span className="text-white">Enable Email Digital QR Badge Attachment</span>
            </label>
          </div>

          <div className="divider" />

          {/* SMS SIMULATOR */}
          <div className="space-y-2">
            <label>Test SMS Pass Dispatcher</label>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="08031234567"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="text-xs font-mono"
              />
              <button
                onClick={handleSendTestSms}
                className="btn btn-go text-xs font-mono font-bold shrink-0"
              >
                Send Test SMS Pass
              </button>
            </div>
          </div>

          {smsTestMsg && (
            <div className="p-3 rounded-lg bg-[#1B2129] border border-[#3ED98A]/40 text-[#3ED98A] text-xs font-mono">
              {smsTestMsg}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
