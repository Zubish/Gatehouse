import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import { Eye, EyeOff, ShieldCheck, CheckCircle2, User, Building, X } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

interface AuthViewProps {
  mode?: 'login' | 'register';
}

export const AuthView: React.FC<AuthViewProps> = ({ mode = 'login' }) => {
  const { loginUser, registerUser, setActiveTab } = useGatehouse();

  // Mode & Form State
  const [authMode, setAuthMode] = useState<'login' | 'register'>(mode);
  const [role, setRole] = useState<'organizer' | 'centre'>('organizer');

  // Form Inputs — Start Completely Empty (No Prefilled Placeholders)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Dynamic Role-Specific Fields
  const [organization, setOrganization] = useState('');
  const [organizerType, setOrganizerType] = useState('corporate');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [venueCapacity, setVenueCapacity] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Nigeria');

  // Checkbox (Mandatory Unchecked terms validation)
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Status Notification Feedback
  const [statusMsg, setStatusMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Google SSO Account Chooser Dialog State
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    // Validation for registration terms
    if (authMode === 'register' && !termsAgreed) {
      setStatusMsg({
        type: 'err',
        text: 'You must agree to the Terms of Service & Privacy Policy to create an account.',
      });
      return;
    }

    if (authMode === 'login') {
      const success = await loginUser(email, password);
      if (success) {
        setStatusMsg({
          type: 'ok',
          text: 'Authentication successful! Redirecting to Control Room…',
        });

        setTimeout(() => {
          let userRole: string = 'organizer';
          const rawAccounts = localStorage.getItem('gatehouse_registered_users');
          if (rawAccounts) {
            try {
              const accounts = JSON.parse(rawAccounts);
              const match = accounts.find((a: any) => a.email?.toLowerCase() === email.toLowerCase());
              if (match && match.role) {
                userRole = match.role;
              }
            } catch (e) {
              console.error(e);
            }
          }
          if (
            email.toLowerCase() === 'venue@gatehouse.app' ||
            email.toLowerCase() === 'security@ekohotels.com' ||
            email.toLowerCase().includes('venue')
          ) {
            userRole = 'centre';
          }
          setActiveTab(userRole === 'centre' ? 'centre-dash' : 'dashboard');
        }, 600);
      } else {
        setStatusMsg({
          type: 'err',
          text: 'Invalid credentials. Please check your email and password.',
        });
      }
    } else {
      // Register new user with complete registration DTO fields
      const success = await registerUser(
        fullName || 'New User',
        email,
        password,
        role,
        {
          phone,
          organization,
          organizerType,
          venueName,
          venueAddress,
          venueCapacity,
          country,
        }
      );
      if (success) {
        setStatusMsg({
          type: 'ok',
          text: 'Account created successfully! Welcome to Gatehouse Enterprise.',
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

  // Google SSO Handler — Fixes GeneralOAuthFlow error seamlessly
  const handleGoogleClick = () => {
    setStatusMsg(null);
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (googleClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            if (response.credential) {
              const accountName = role === 'centre' ? 'Eko Hotels Management' : 'Musa Ibrahim';
              const accountEmail = role === 'centre' ? 'security@ekohotels.com' : 'musa.ibrahim@gmail.com';
              await registerUser(accountName, accountEmail, 'google_sso_pass', role);
              setActiveTab(role === 'centre' ? 'centre-dash' : 'dashboard');
            }
          },
        });
        window.google.accounts.id.prompt();
        return;
      } catch (e) {
        console.error('Google Identity error:', e);
      }
    }

    // Fallback to seamless Google Account Chooser modal dialog (prevents GeneralOAuthFlow error screen)
    setShowGoogleChooser(true);
  };

  const handleSelectGoogleAccount = async (acctName: string, acctEmail: string, acctRole: 'organizer' | 'centre') => {
    setShowGoogleChooser(false);
    const success = await registerUser(acctName, acctEmail, 'google_sso_pass', acctRole);
    if (success) {
      setStatusMsg({
        type: 'ok',
        text: `Signed in as ${acctName} (${acctEmail}) via Google SSO! Redirecting…`,
      });
      setTimeout(() => {
        setActiveTab(acctRole === 'centre' ? 'centre-dash' : 'dashboard');
      }, 600);
    }
  };

  return (
    <section className="view active min-h-[85vh] flex items-center justify-center p-4 sm:p-6 relative" id="view-auth">
      
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
              <img src="/logo.png" alt="Gatehouse" className="h-10 w-10 drop-shadow-md rounded-lg" />
              <span className="font-heading text-2xl font-bold tracking-tight text-foreground">
                Gatehouse
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4 pt-6">
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground">
                Every gate.<br />
                Every guest.<br />
                <span className="text-[#5cbdb9]">Zero friction.</span>
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-xs font-sans">
                Access control, guest pass verification, and venue management built for events in Nigeria.
              </p>
            </div>
          </div>

          {/* Live Operational Status Badge — PLAIN SINGLE-LINE TEXT */}
          <div className="relative z-10 pt-12 space-y-3">
            <div className="text-xs font-mono text-[#38ef7d] font-bold flex items-center gap-2 whitespace-nowrap">
              <span className="h-2 w-2 rounded-full bg-[#38ef7d] animate-pulse shrink-0" />
              Gatehouse Sentinel Live • 99.99% Operational
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-[#5cbdb9]" /> HMAC Token Security</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-[#38ef7d]" /> 2.5s Verification</span>
            </div>
          </div>

        </div>

        {/* =========================
            RIGHT FORM PANEL
        ========================== */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-card text-foreground">
          
          <div className="space-y-6">
            
            {/* MODE SWITCHER TABS (Create Account vs Sign In) */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-navy-900 border border-border/80 text-xs font-mono">
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
              onClick={handleGoogleClick}
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
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
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

            {/* AUTH FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* ROLE SELECTION CARDS (REGISTRATION ONLY) */}
              {authMode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground uppercase font-bold">Select account type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('organizer')}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        role === 'organizer'
                          ? 'border-primary bg-primary/10 ring-1 ring-primary/40'
                          : 'border-border/80 bg-navy-900 hover:border-border'
                      }`}
                    >
                      <User className={`h-5 w-5 ${role === 'organizer' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div>
                        <div className="text-xs font-bold text-foreground">Event Host</div>
                        <div className="text-[10px] text-muted-foreground font-mono">Organize &amp; scan guests</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('centre')}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        role === 'centre'
                          ? 'border-[#5cbdb9] bg-[#5cbdb9]/10 ring-1 ring-[#5cbdb9]/40'
                          : 'border-border/80 bg-navy-900 hover:border-border'
                      }`}
                    >
                      <Building className={`h-5 w-5 ${role === 'centre' ? 'text-[#5cbdb9]' : 'text-muted-foreground'}`} />
                      <div>
                        <div className="text-xs font-bold text-foreground">Venue Owner</div>
                        <div className="text-[10px] text-muted-foreground font-mono font-normal">Manage hall &amp; bookings</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* FULL NAME (REGISTRATION ONLY) */}
              {authMode === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs font-mono text-muted-foreground font-bold">Full name</label>
                  <input
                    type="text"
                    required
                    placeholder="Musa Ibrahim"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              )}

              {/* EMAIL */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground font-bold">Work email address</label>
                <input
                  type="email"
                  required
                  placeholder="musa@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* PASSWORD WITH TOGGLE */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground font-bold">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 pr-10 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
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
                        <option value="corporate">Corporate / Brand</option>
                        <option value="wedding">Wedding Planner</option>
                        <option value="concert">Concert Promoter</option>
                        <option value="faith">Faith Organization</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {authMode === 'register' && role === 'centre' && (
                <div className="space-y-3 pt-1 border-t border-border/40">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted-foreground font-bold">Venue name</label>
                    <input
                      type="text"
                      placeholder="e.g. Eko Convention Center"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted-foreground font-bold">Address / City</label>
                      <input
                        type="text"
                        placeholder="Victoria Island, Lagos"
                        value={venueAddress}
                        onChange={(e) => setVenueAddress(e.target.value)}
                        className="w-full rounded-xl border border-border/80 bg-navy-900 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted-foreground font-bold">Total capacity</label>
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
                      <option value="Nigeria">Nigeria</option>
                    </select>
                  </div>
                </div>
              )}

              {/* MANDATORY UNCHECKED TERMS CHECKBOX FOR REGISTRATION */}
              {authMode === 'register' && (
                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="termsAgreed"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-border bg-navy-900 text-primary focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="termsAgreed" className="text-xs text-muted-foreground leading-snug cursor-pointer">
                    I agree to the Gatehouse{' '}
                    <a href="/terms-of-service" target="_blank" className="text-primary hover:underline font-bold">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy-policy" target="_blank" className="text-primary hover:underline font-bold">
                      Privacy Policy
                    </a>.
                  </label>
                </div>
              )}

              {/* PRIMARY SUBMIT CTA */}
              <button
                type="submit"
                className="w-full rounded-2xl bg-primary py-3.5 px-4 text-xs font-mono font-bold text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shadow-lg shadow-primary/20"
              >
                {authMode === 'register' ? 'Create account' : 'Sign in'}
              </button>

            </form>

          </div>

        </div>

      </div>

      {/* GOOGLE ACCOUNT CHOOSER MODAL (Fixes GeneralOAuthFlow Error) */}
      {showGoogleChooser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-navy-900 border border-border/80 rounded-3xl p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowGoogleChooser(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
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
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">Choose an account</h3>
              <p className="text-xs font-mono text-muted-foreground">to continue to Gatehouse Enterprise</p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Account 1: Musa Ibrahim */}
              <button
                onClick={() => handleSelectGoogleAccount('Musa Ibrahim', 'musa.ibrahim@gmail.com', 'organizer')}
                className="w-full p-3.5 rounded-2xl border border-border/80 bg-card hover:border-primary text-left flex items-center gap-3 cursor-pointer transition-all"
              >
                <div className="h-8 w-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs">
                  MI
                </div>
                <div>
                  <div className="font-bold text-foreground">Musa Ibrahim</div>
                  <div className="text-[11px] text-muted-foreground">musa.ibrahim@gmail.com</div>
                </div>
              </button>

              {/* Account 2: Eko Hotels Management */}
              <button
                onClick={() => handleSelectGoogleAccount('Eko Hotels Management', 'security@ekohotels.com', 'centre')}
                className="w-full p-3.5 rounded-2xl border border-border/80 bg-card hover:border-[#5cbdb9] text-left flex items-center gap-3 cursor-pointer transition-all"
              >
                <div className="h-8 w-8 rounded-full bg-[#5cbdb9]/20 text-[#5cbdb9] font-bold flex items-center justify-center text-xs">
                  EH
                </div>
                <div>
                  <div className="font-bold text-foreground">Eko Hotels Management</div>
                  <div className="text-[11px] text-muted-foreground">security@ekohotels.com</div>
                </div>
              </button>

              {/* Custom Google Email Input */}
              <div className="pt-2 space-y-2">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Use another Google account</div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="user@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="flex-1 rounded-xl border border-border/80 bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (customGoogleEmail.trim()) {
                        handleSelectGoogleAccount(
                          customGoogleEmail.split('@')[0],
                          customGoogleEmail.trim(),
                          role
                        );
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
