import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import type { UserRole } from '../../types';

export const AuthView: React.FC<{ mode?: 'login' | 'register' }> = ({ mode = 'login' }) => {
  const { loginUser, registerUser, setActiveTab } = useGatehouse();

  const [authMode, setAuthMode] = useState<'login' | 'register'>(mode);
  const [role, setRole] = useState<UserRole>('organizer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (authMode === 'login') {
      const success = await loginUser(email, password);
      if (success) {
        setStatusMsg({ type: 'ok', text: 'Authentication successful! Redirecting to Control Room…' });
        setTimeout(() => {
          setActiveTab(role === 'centre' ? 'centre-dash' : 'dashboard');
        }, 800);
      } else {
        setStatusMsg({ type: 'err', text: 'Invalid email or password. Please try again.' });
      }
    } else {
      if (!name.trim()) {
        setStatusMsg({ type: 'err', text: 'Full name or organization name is required.' });
        return;
      }
      const success = await registerUser(name, email, password, role);
      if (success) {
        setStatusMsg({ type: 'ok', text: 'Account created successfully! Redirecting to Control Room…' });
        setTimeout(() => {
          setActiveTab(role === 'centre' ? 'centre-dash' : 'dashboard');
        }, 800);
      } else {
        setStatusMsg({ type: 'err', text: 'Failed to create account. Email may already be registered.' });
      }
    }
  };

  const handleDemoLogin = async (targetRole: UserRole) => {
    setStatusMsg(null);
    const demoEmail = targetRole === 'organizer' ? 'chidinma@xquisitevents.ng' : 'events@ekohotels.com';
    const success = await loginUser(demoEmail, 'password123');
    if (success) {
      setStatusMsg({ type: 'ok', text: `Logged in as Demo ${targetRole === 'organizer' ? 'Organizer' : 'Venue Manager'}.` });
      setTimeout(() => {
        setActiveTab(targetRole === 'centre' ? 'centre-dash' : 'dashboard');
      }, 600);
    }
  };

  return (
    <section className="view active" id="view-auth">
      <div className="max-w-md mx-auto space-y-6 py-6 font-['Inter']">
        
        {/* BRAND & HEADER */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173226] text-[#3ED98A] text-xs font-mono font-bold border border-[#3ED98A]/30">
            <span className="w-2 h-2 rounded-full bg-[#3ED98A] animate-ping" />
            GATEHOUSE SECURE JWT AUTHENTICATION
          </div>
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-[#EDEFF3]">
            {authMode === 'login' ? 'Sign In to Control Room' : 'Create Gatehouse Account'}
          </h2>
          <p className="text-xs text-[#8B93A3]">
            Access your event dashboards, venue bookings, and gate entry scanners.
          </p>
        </div>

        {/* LOGIN / REGISTER TOGGLE */}
        <div className="panel space-y-4">
          <div className="flex border-b border-[#262D38] pb-3">
            <button
              onClick={() => {
                setAuthMode('login');
                setStatusMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-mono font-bold transition-all ${
                authMode === 'login'
                  ? 'text-[#3ED98A] border-b-2 border-[#3ED98A]'
                  : 'text-[#8B93A3] hover:text-[#EDEFF3]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
                setStatusMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-mono font-bold transition-all ${
                authMode === 'register'
                  ? 'text-[#3ED98A] border-b-2 border-[#3ED98A]'
                  : 'text-[#8B93A3] hover:text-[#EDEFF3]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* ROLE SELECTOR */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-[#8B93A3] uppercase">Select Your Platform Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('organizer')}
                className={`p-3 rounded-lg border text-left text-xs font-mono transition-all ${
                  role === 'organizer'
                    ? 'bg-[#173226] border-[#3ED98A] text-[#3ED98A] font-bold'
                    : 'bg-[#1B2129] border-[#262D38] text-[#8B93A3]'
                }`}
              >
                <div className="font-bold">Event Organizer</div>
                <div className="text-[10px] opacity-70">Book venues &amp; manage guests</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('centre')}
                className={`p-3 rounded-lg border text-left text-xs font-mono transition-all ${
                  role === 'centre'
                    ? 'bg-[#332A14] border-[#F0A93B] text-[#F0A93B] font-bold'
                    : 'bg-[#1B2129] border-[#262D38] text-[#8B93A3]'
                }`}
              >
                <div className="font-bold">Event Centre</div>
                <div className="text-[10px] opacity-70">Venue owner &amp; gate ushering</div>
              </button>
            </div>
          </div>

          {/* STATUS BANNER */}
          {statusMsg && (
            <div
              className={`p-3 rounded-lg text-xs font-mono font-bold text-center border ${
                statusMsg.type === 'ok'
                  ? 'bg-[#173226] border-[#3ED98A] text-[#3ED98A]'
                  : 'bg-[#331B1D] border-[#E5555C] text-[#E5555C]'
              }`}
            >
              {statusMsg.text}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            {authMode === 'register' && (
              <>
                <div className="field">
                  <label>Full Name / Organization Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Chidinma Okoro (Xquisit Events)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label>Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="08031234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="field">
              <label>Work Email Address *</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Password *</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-go w-full py-3 text-xs font-bold shadow-lg shadow-[#3ED98A]/20">
              {authMode === 'login' ? 'Sign In to Gatehouse' : 'Create Account &amp; Access Dashboard'}
            </button>
          </form>

          {/* QUICK DEMO LOGIN BUTTONS */}
          <div className="pt-3 border-t border-[#262D38] space-y-2">
            <span className="text-[10px] font-mono text-[#565E6D] uppercase block text-center">
              Quick 1-Click Demo Logins
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('organizer')}
                className="btn btn-ghost btn-sm text-[11px] font-mono"
              >
                Demo Organizer
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('centre')}
                className="btn btn-ghost btn-sm text-[11px] font-mono text-[#F0A93B]"
              >
                Demo Venue Manager
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
