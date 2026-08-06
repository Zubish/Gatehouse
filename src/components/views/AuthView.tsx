import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import type { UserRole } from '../../types';

export const AuthView: React.FC<{ mode?: 'login' | 'register' }> = ({ mode = 'login' }) => {
  const { setUserRole, setActiveTab } = useGatehouse();

  const [authMode, setAuthMode] = useState<'login' | 'register'>(mode);
  const [role, setRole] = useState<UserRole>('organizer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserRole(role);
    setSuccessMsg(`Welcome to Gatehouse! Logged in as ${role === 'organizer' ? 'Event Organizer' : 'Event Centre Owner'}.`);
    setTimeout(() => {
      if (role === 'centre') {
        setActiveTab('centre_portal');
      } else {
        setActiveTab('dashboard');
      }
    }, 1200);
  };

  const handleDemoLogin = (targetRole: UserRole) => {
    setUserRole(targetRole);
    setSuccessMsg(`Authenticated as Demo ${targetRole === 'organizer' ? 'Organizer' : 'Event Centre Owner'}.`);
    setTimeout(() => {
      if (targetRole === 'centre') {
        setActiveTab('centre_portal');
      } else {
        setActiveTab('dashboard');
      }
    }, 800);
  };

  return (
    <section className="view active" id="view-auth">
      <div className="max-w-md mx-auto space-y-6 py-6 font-['Inter']">
        
        {/* BRAND & HEADER */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173226] text-[#3ED98A] text-xs font-mono font-bold border border-[#3ED98A]/30">
            <span className="w-2 h-2 rounded-full bg-[#3ED98A] animate-ping" />
            GATEHOUSE AUTHENTICATION PORTAL
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
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-xs font-mono font-bold transition-all ${
                authMode === 'login'
                  ? 'text-[#3ED98A] border-b-2 border-[#3ED98A]'
                  : 'text-[#8B93A3] hover:text-[#EDEFF3]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
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

          {/* FORM */}
          {successMsg ? (
            <div className="p-4 rounded-lg bg-[#173226] border border-[#3ED98A] text-[#3ED98A] text-xs font-mono text-center font-bold">
              {successMsg}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              {authMode === 'register' && (
                <div className="field">
                  <label>Full Name / Organization Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Chidinma Okoro (Xquisit Events)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="field">
                <label>Work Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-go w-full py-3 text-xs font-bold">
                {authMode === 'login' ? 'Sign In to Gatehouse' : 'Create Account &amp; Access Dashboard'}
              </button>
            </form>
          )}

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
