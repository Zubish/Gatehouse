import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import { Settings, Calendar, Smartphone, Mail, Send, CheckCircle2 } from 'lucide-react';

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
    const newEvt = await createEvent(name, date, '18:00', capacity);
    if (newEvt) {
      setSavedMsg(`New Event Instance Created: ${newEvt.name}`);
      setTimeout(() => setSavedMsg(''), 2500);
    }
  };

  const handleSendTestSms = () => {
    if (!testPhone.trim()) return;
    setSmsTestMsg(
      `📱 Simulated SMS Pass dispatched to ${testPhone}: "Your GatePass QR code for ${activeEvent.name} is active."`
    );
    setTimeout(() => setSmsTestMsg(''), 4000);
  };

  return (
    <section className="view active space-y-8 max-w-3xl mx-auto" id="view-settings">
      
      {/* HEADER */}
      <div className="space-y-1 border-b border-border/40 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5cbdb9]/10 text-[#5cbdb9] font-mono text-xs font-bold border border-[#5cbdb9]/30">
          <Settings className="h-3.5 w-3.5" />
          EVENT SETUP &amp; DISPATCH GATEWAYS
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
          Event Setup &amp; Gate Settings
        </h2>
        <p className="text-xs font-mono text-muted-foreground">
          Configure event parameters, SMS/Email pass dispatch gateways, and capacity caps.
        </p>
      </div>

      {/* EVENT PARAMETERS FORM */}
      <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-6 card-glow">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            General Event Parameters
          </h3>
          <span className="text-xs font-mono text-[#38ef7d] font-bold">
            Active Event Token: Active
          </span>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div className="space-y-1">
            <label className="text-muted-foreground font-bold">Event Title</label>
            <input
              type="text"
              placeholder="e.g. Lagos Tech Fest & Gala 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-muted-foreground font-bold">Event Date</label>
              <input
                type="text"
                placeholder="2026-08-15"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-muted-foreground font-bold">Max Venue Capacity Cap</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {savedMsg && (
            <div className="p-3.5 rounded-2xl bg-[#38ef7d]/10 border border-[#38ef7d] text-[#38ef7d] text-xs font-mono text-center font-bold">
              {savedMsg}
            </div>
          )}

          <button
            onClick={handleSave}
            className="w-full rounded-2xl bg-primary py-3.5 text-xs font-mono font-bold text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shadow-md mt-2"
          >
            Save Event Parameters &amp; Create Instance
          </button>
        </div>
      </div>

      {/* AUTOMATED SMS / EMAIL PASS NOTIFICATION DISPATCHER */}
      <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-6 card-glow">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-[#5cbdb9]" />
            Automated Pass Dispatcher
          </h3>
          <span className="text-xs font-mono text-[#5cbdb9] font-bold">
            Termii / SMS Gateway Active
          </span>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-2xl bg-navy-900 border border-border/40">
              <input
                type="checkbox"
                checked={enableSms}
                onChange={(e) => setEnableSms(e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer"
              />
              <span className="text-foreground font-bold flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-[#5cbdb9]" /> Automated SMS Pass Dispatch on Registration
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-2xl bg-navy-900 border border-border/40">
              <input
                type="checkbox"
                checked={enableEmail}
                onChange={(e) => setEnableEmail(e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer"
              />
              <span className="text-foreground font-bold flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> Email Digital QR Badge Attachment
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-border/40 space-y-3">
            <label className="text-muted-foreground font-bold block">Test SMS Pass Gateway Dispatcher</label>
            <div className="flex gap-3">
              <input
                type="tel"
                placeholder="08031234567"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="flex-1 rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
              />
              <button
                onClick={handleSendTestSms}
                className="rounded-xl bg-secondary text-foreground px-5 py-2.5 text-xs font-mono font-bold hover:bg-card transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Send className="h-4 w-4 text-[#38ef7d]" /> Send Test SMS Pass
              </button>
            </div>
          </div>

          {smsTestMsg && (
            <div className="p-3.5 rounded-2xl bg-[#38ef7d]/10 border border-[#38ef7d] text-[#38ef7d] text-xs font-mono font-bold animate-in fade-in flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> {smsTestMsg}
            </div>
          )}
        </div>
      </div>

    </section>
  );
};
