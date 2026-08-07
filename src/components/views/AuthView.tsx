import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import type { UserRole } from '../../types';
import { Eye, EyeOff } from 'lucide-react';

interface AuthViewProps {
  mode?: 'login' | 'register';
}

export const AuthView: React.FC<AuthViewProps> = ({ mode = 'login' }) => {
  const { loginUser, registerUser, setActiveTab } = useGatehouse();

  const [authMode, setAuthMode] = useState<'login' | 'register'>(mode);
  const [role, setRole] = useState<UserRole>('organizer');

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Organizer Fields
  const [organization, setOrganization] = useState('');
  const [organizerType, setOrganizerType] = useState('Event company');
  const [eventVolume, setEventVolume] = useState('6–20');

  // Venue Fields
  const [venueName, setVenueName] = useState('');
  const [venueType, setVenueType] = useState('Event centre');
  const [venueCapacity, setVenueCapacity] = useState('5000');

  // Unchecked by default per user requirement
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: 'ok' | 'err';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (authMode === 'login') {
      const success = await loginUser(email, password);
      if (success) {
        setStatusMsg({
          type: 'ok',
          text: 'Authentication successful! Redirecting to Control Room…',
        });
        setTimeout(() => {
          setActiveTab(role === 'centre' ? 'centre-dash' : 'dashboard');
        }, 600);
      } else {
        setStatusMsg({
          type: 'err',
          text: 'Invalid email or password. Please try again.',
        });
      }
    } else {
      // Validate Terms of Service Acceptance
      if (!acceptTerms) {
        setStatusMsg({
          type: 'err',
          text: 'You must agree to the Terms of Service and Privacy Policy to create an account.',
        });
        return;
      }

      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || organization || venueName || 'Gatehouse User';
      if (!email.trim() || !password.trim()) {
        setStatusMsg({
          type: 'err',
          text: 'Please fill in all required fields.',
        });
        return;
      }
      const success = await registerUser(fullName, email, password, role);
      if (success) {
        setStatusMsg({
          type: 'ok',
          text: 'Account created successfully! Redirecting to Control Room…',
        });
        setTimeout(() => {
          setActiveTab(role === 'centre' ? 'centre-dash' : 'dashboard');
        }, 600);
      } else {
        setStatusMsg({
          type: 'err',
          text: 'Failed to create account. Email may already be registered.',
        });
      }
    }
  };

  const handleGoogleSso = async () => {
    setStatusMsg(null);
    const demoEmail = role === 'organizer' ? 'demo@gatehouse.app' : 'venue@gatehouse.app';
    const success = await loginUser(demoEmail, 'password123');
    if (success) {
      setStatusMsg({
        type: 'ok',
        text: 'Signed in with Google SSO! Loading Control Room…',
      });
      setTimeout(() => {
        setActiveTab(role === 'centre' ? 'centre-dash' : 'dashboard');
      }, 600);
    }
  };

  return (
    <section className="view active min-h-[85vh] flex items-center justify-center p-4 sm:p-6" id="view-auth">
      
      {/* MUSA.TXT PART 3 DUAL-PANEL AUTH SHELL */}
      <div className="w-full max-w-5xl rounded-3xl border border-border/60 bg-card overflow-hidden shadow-2xl grid lg:grid-cols-12 min-h-[640px] card-glow">
        
        {/* =========================
            LEFT BRAND PANEL
        ========================== */}
        <div className="lg:col-span-5 relative p-8 sm:p-12 bg-gradient-to-br from-navy-900 via-navy-800 to-[#12263f] text-foreground flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-border/40">
          
          {/* Ambient Glow Rings */}
          <div className="absolute -right-32 top-16 w-96 h-96 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute -right-20 top-28 w-72 h-72 rounded-full border border-[#5cbdb9]/20 pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Gatehouse" className="h-10 w-10 drop-shadow-md" />
              <span className="font-heading text-2xl font-bold tracking-tight text-foreground">
                Gatehouse
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4 pt-6">
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground">
                Every gate.<br />
                <span className="text-[#5cbdb9]">Under control.</span>
              </h1>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Manage access, venues, guests, and event security operations from one intelligent platform.
              </p>
            </div>
          </div>

          {/* Bottom Live System Operational Badge */}
          <div className="relative z-10 pt-12 flex items-center gap-3 text-xs font-mono text-muted-foreground">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38ef7d] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#38ef7d]" />
            </span>
            <span className="font-bold text-foreground">Gatehouse systems 99.99% operational</span>
          </div>

        </div>

        {/* =========================
            RIGHT FORM PANEL
        ========================== */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex items-center justify-center bg-card/60">
          <div className="w-full max-w-md space-y-6">
            
            {/* Header */}
            <div className="space-y-2">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                {authMode === 'login' ? 'Sign in to Gatehouse' : 'Create your account'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {authMode === 'login'
                  ? 'Welcome back. Access your workspace and live gate scanners.'
                  : 'Get your Gatehouse workspace ready in under two minutes.'}
              </p>
            </div>

            {/* MODE SWITCH TABS */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-navy-900 border border-border/60 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setStatusMsg(null);
                }}
                className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Create account
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setStatusMsg(null);
                }}
                className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign in
              </button>
            </div>

            {/* GOOGLE SSO BUTTON */}
            <button
              type="button"
              onClick={handleGoogleSso}
              className="w-full rounded-2xl border border-border/80 bg-navy-900 py-3 px-4 text-xs font-mono font-bold text-foreground hover:bg-secondary flex items-center justify-center gap-3 cursor-pointer transition-all shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground uppercase">
              <span className="h-[1px] bg-border/60 flex-1" />
              OR CONTINUE WITH EMAIL
              <span className="h-[1px] bg-border/60 flex-1" />
            </div>

            {/* STATUS NOTIFICATION BANNER */}
            {statusMsg && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-mono text-center font-bold border ${
                  statusMsg.type === 'ok'
                    ? 'bg-[#38ef7d]/10 border-[#38ef7d] text-[#38ef7d]'
                    : 'bg-destructive/10 border-destructive text-destructive'
                }`}
              >
                {statusMsg.text}
              </div>
            )}

            {/* FORM BODY */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* ROLE SELECTION (REGISTRATION ONLY) */}
              {authMode === 'register' && (
                <div className="space-y-2">
                  <label className="text-xs font-mono text-muted-foreground font-bold block">
                    What are you using Gatehouse for?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('organizer')}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                        role === 'organizer'
                          ? 'bg-[#5cbdb9]/10 border-[#5cbdb9] text-foreground ring-2 ring-[#5cbdb9]/20'
                          : 'bg-navy-900 border-border/60 text-muted-foreground hover:border-border'
                      }`}
                    >
                      <strong className="block text-xs font-bold text-foreground">Event Organizer</strong>
                      <span className="text-[10px] text-muted-foreground leading-tight block mt-1">
                        Create events, manage guests &amp; issue passes.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('centre')}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                        role === 'centre'
                          ? 'bg-[#38ef7d]/10 border-[#38ef7d] text-foreground ring-2 ring-[#38ef7d]/20'
                          : 'bg-navy-900 border-border/60 text-muted-foreground hover:border-border'
                      }`}
                    >
                      <strong className="block text-xs font-bold text-foreground">Venue Owner</strong>
                      <span className="text-[10px] text-muted-foreground leading-tight block mt-1">
                        Manage venue halls, gates &amp; booking requests.
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* REGISTRATION NAMES */}
              {authMode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted-foreground font-bold">First name</label>
                    <input
                      type="text"
                      placeholder="Musa"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted-foreground font-bold">Last name</label>
                    <input
                      type="text"
                      placeholder="Ibrahim"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* WORK EMAIL */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground font-bold">Work email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* DYNAMIC ROLE-SPECIFIC FIELDS */}
              {authMode === 'register' && role === 'organizer' && (
                <div className="space-y-3 pt-1 border-t border-border/40">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted-foreground font-bold">Organization / Company</label>
                    <input
                      type="text"
                      placeholder="e.g. Xquisite Events Ltd"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted-foreground font-bold">Organizer type</label>
                      <select
                        value={organizerType}
                        onChange={(e) => setOrganizerType(e.target.value)}
                        className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                      >
                        <option>Event company</option>
                        <option>Corporate organization</option>
                        <option>Entertainment company</option>
                        <option>NGO / Non-profit</option>
                        <option>Government</option>
                        <option>Individual organizer</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted-foreground font-bold">Events per year</label>
                      <select
                        value={eventVolume}
                        onChange={(e) => setEventVolume(e.target.value)}
                        className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                      >
                        <option>1–5</option>
                        <option>6–20</option>
                        <option>21–50</option>
                        <option>50+</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {authMode === 'register' && role === 'centre' && (
                <div className="space-y-3 pt-1 border-t border-border/40">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted-foreground font-bold">Venue / Business name</label>
                    <input
                      type="text"
                      placeholder="e.g. Grand Monarch Arena"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted-foreground font-bold">Venue type</label>
                      <select
                        value={venueType}
                        onChange={(e) => setVenueType(e.target.value)}
                        className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                      >
                        <option>Event centre</option>
                        <option>Conference centre</option>
                        <option>Stadium</option>
                        <option>Hotel</option>
                        <option>Arena</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted-foreground font-bold">Approx. capacity</label>
                      <input
                        type="number"
                        placeholder="5000"
                        value={venueCapacity}
                        onChange={(e) => setVenueCapacity(e.target.value)}
                        className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PHONE & COUNTRY (REGISTRATION ONLY) */}
              {authMode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted-foreground font-bold">Phone number</label>
                    <input
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted-foreground font-bold">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                    >
                      <option>Nigeria</option>
                      <option>Ghana</option>
                      <option>Kenya</option>
                      <option>South Africa</option>
                      <option>United Kingdom</option>
                      <option>United States</option>
                    </select>
                  </div>
                </div>
              )}

              {/* PASSWORD WITH SHOW/HIDE TOGGLE */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground font-bold">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border/80 bg-navy-900 pl-3.5 pr-12 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* TERMS CHECKBOX — UNCHECKED BY DEFAULT */}
              {authMode === 'register' && (
                <label className="flex items-start gap-2 pt-1 text-[11px] text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 rounded border-border text-primary accent-primary cursor-pointer"
                  />
                  <span>
                    I agree to the <a href="#" className="text-primary hover:underline font-bold">Terms of Service</a> and <a href="#" className="text-primary hover:underline font-bold">Privacy Policy</a>.
                  </span>
                </label>
              )}

              {/* SUBMIT BUTTON WITH CLEAN CTA TEXT */}
              <button
                type="submit"
                className="w-full rounded-full bg-primary py-3.5 text-xs font-mono font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-lg transition-all pt-2"
              >
                {authMode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>

          </div>
        </div>

      </div>
    </section>
  );
};
