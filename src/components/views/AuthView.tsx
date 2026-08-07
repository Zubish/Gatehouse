import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import { Eye, EyeOff, ShieldCheck, CheckCircle2, User, Building, X } from 'lucide-react';

interface AuthViewProps {
  mode?: 'login' | 'register';
}

export const AuthView: React.FC<AuthViewProps> = ({ mode = 'login' }) => {
  const { loginUser, registerUser, setActiveTab } = useGatehouse();

  // Mode & Form State
  const [authMode, setAuthMode] = useState<'login' | 'register'>(mode);
  const [role, setRole] = useState<'organizer' | 'centre'>('organizer');

  // Form Inputs
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

  // Checkbox Validation
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Status Feedback
  const [statusMsg, setStatusMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Google SSO Modal State
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

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
          text: 'Authentication successful! Redirecting to workspace…',
        });

        setTimeout(() => {
          let userRole = role;
          if (email.toLowerCase().includes('venue') || email.toLowerCase().includes('centre')) {
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

  const handleSelectGoogleAccount = async (acctName: string, acctEmail: string, acctRole: 'organizer' | 'centre') => {
    setShowGoogleChooser(false);
    
    let success = await loginUser(acctEmail, 'google_sso_pass');
    if (!success) {
      success = await registerUser(acctName, acctEmail, 'google_sso_pass', acctRole, {
        phone: '+234 800 000 0000',
        organization: acctRole === 'centre' ? 'Venue Facility' : 'Event Host',
        country: 'Nigeria',
      });
    }

    let targetRole = acctRole;
    if (
      acctEmail.toLowerCase().includes('ekohotels') ||
      acctEmail.toLowerCase().includes('venue') ||
      acctEmail.toLowerCase() === 'security@ekohotels.com'
    ) {
      targetRole = 'centre';
    }

    setStatusMsg({
      type: 'ok',
      text: `Signed in as ${acctName} (${acctEmail}) via Google SSO! Redirecting…`,
    });

    setTimeout(() => {
      setActiveTab(targetRole === 'centre' ? 'centre-dash' : 'dashboard');
    }, 400);
  };

  return (
    <section className="view active min-h-[88vh] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden" id="view-auth">
      
      {/* VIBRANT BACKGROUND AMBIENT GLOW MESH */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-primary/20 via-[#5cbdb9]/15 to-transparent blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#38ef7d]/15 via-primary/10 to-transparent blur-[110px] rounded-full pointer-events-none" />

      {/* SLEEK GLASSMORPHISM DUAL-PANEL CONTAINER */}
      <div className="w-full max-w-5xl rounded-3xl border border-border/60 bg-card/75 backdrop-blur-2xl overflow-hidden shadow-2xl grid lg:grid-cols-12 min-h-[640px] card-glow relative z-10">
        
        {/* =========================
            LEFT BRAND PANEL — GRADIENT & TYPOGRAPHY
        ========================== */}
        <div className="lg:col-span-5 relative p-8 sm:p-12 bg-gradient-to-br from-navy-950/95 via-navy-900/85 to-navy-950/95 text-foreground flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-border/60">
          
          {/* Subtle Ambient Rings */}
          <div className="absolute -right-32 top-16 w-96 h-96 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute -right-20 top-28 w-72 h-72 rounded-full border border-[#5cbdb9]/15 pointer-events-none" />
          <div className="absolute -left-20 bottom-10 w-64 h-64 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

          {/* Top Brand & Headline */}
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Gatehouse" className="h-10 w-10 drop-shadow-md rounded-xl" />
              <span className="font-heading text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Gatehouse
              </span>
            </div>

            {/* Typography Headline */}
            <div className="space-y-4 pt-4">
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.08] tracking-tight bg-gradient-to-r from-foreground via-slate-100 to-[#5cbdb9] bg-clip-text text-transparent">
                Every gate.<br />
                Every guest.<br />
                <span className="bg-gradient-to-r from-[#38ef7d] via-[#5cbdb9] to-[#11998e] bg-clip-text text-transparent">
                  Zero friction.
                </span>
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-xs font-sans">
                Access control, cryptographic pass verification, and venue management built for events in Nigeria.
              </p>
            </div>
          </div>

          {/* Live Operational Status Badge */}
          <div className="relative z-10 pt-10 space-y-4">
            <div className="text-xs font-mono text-[#38ef7d] font-bold flex items-center gap-2.5 bg-[#38ef7d]/10 px-3.5 py-1.5 rounded-full border border-[#38ef7d]/30 w-fit">
              <span className="h-2 w-2 rounded-full bg-[#38ef7d] animate-pulse shrink-0" />
              Gatehouse Sentinel Live • 99.99% Operational
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#5cbdb9]" /> HMAC Token Security</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#38ef7d]" /> 2.5s Verification</span>
            </div>
          </div>

        </div>

        {/* =========================
            RIGHT FORM PANEL — MINIMALIST & SIMPLE
        ========================== */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6 bg-card/60 backdrop-blur-xl text-foreground">
          <div className="space-y-6 max-w-md mx-auto w-full">
            
            {/* TAB SELECTOR */}
            <div className="grid grid-cols-2 p-1 bg-navy-950/80 rounded-2xl border border-border/60 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setStatusMsg(null);
                }}
                className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-card text-foreground shadow-md'
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
                    ? 'bg-card text-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign in
              </button>
            </div>

            {/* CONTINUE WITH GOOGLE BUTTON */}
            <button
              type="button"
              onClick={() => setShowGoogleChooser(true)}
              className="w-full rounded-2xl border border-border/80 bg-navy-950/60 hover:bg-navy-900/90 py-3 px-4 text-xs font-mono font-bold text-foreground flex items-center justify-center gap-3 cursor-pointer transition-all shadow-sm hover:border-primary/50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
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
                          : 'border-border/80 bg-navy-950/60 hover:border-border'
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
                          : 'border-border/80 bg-navy-950/60 hover:border-border'
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
                    className="w-full rounded-xl border border-border/80 bg-navy-950/70 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              )}

              {/* EMAIL */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground font-bold">Email address</label>
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-navy-950/70 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* DYNAMIC ROLE-SPECIFIC REGISTRATION FIELDS */}
              {authMode === 'register' && role === 'organizer' && (
                <div className="space-y-3 pt-1 border-t border-border/40">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted-foreground font-bold">Organization / Company</label>
                      <input
                        type="text"
                        placeholder="e.g. Lagos Tech Summit"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className="w-full rounded-xl border border-border/80 bg-navy-950/70 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted-foreground font-bold">Organizer type</label>
                      <select
                        value={organizerType}
                        onChange={(e) => setOrganizerType(e.target.value)}
                        className="w-full rounded-xl border border-border/80 bg-navy-950/70 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                      >
                        <option value="corporate">Corporate / Business</option>
                        <option value="agency">Event Planning Agency</option>
                        <option value="government">Government / Ministry</option>
                        <option value="association">Association / NGO</option>
                        <option value="individual">Individual Host</option>
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
                      placeholder="e.g. Eko Convention Centre"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-navy-950/70 px-3 py-2 text-xs text-foreground focus:border-[#5cbdb9] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted-foreground font-bold">Venue address</label>
                      <input
                        type="text"
                        placeholder="Victoria Island, Lagos"
                        value={venueAddress}
                        onChange={(e) => setVenueAddress(e.target.value)}
                        className="w-full rounded-xl border border-border/80 bg-navy-950/70 px-3 py-2 text-xs text-foreground focus:border-[#5cbdb9] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-muted-foreground font-bold">Approx. capacity</label>
                      <input
                        type="number"
                        placeholder="3500"
                        value={venueCapacity}
                        onChange={(e) => setVenueCapacity(e.target.value)}
                        className="w-full rounded-xl border border-border/80 bg-navy-950/70 px-3 py-2 text-xs text-foreground focus:border-[#5cbdb9] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {authMode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted-foreground font-bold">Phone number</label>
                    <input
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-navy-950/70 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-muted-foreground font-bold">Country</label>
                    <input
                      type="text"
                      placeholder="Nigeria"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-navy-950/70 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* PASSWORD */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground font-bold">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-navy-950/70 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none pr-10"
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

              {/* TERMS CHECKBOX (REGISTRATION ONLY) */}
              {authMode === 'register' && (
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-border/80 bg-navy-900 text-primary focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-muted-foreground leading-snug cursor-pointer">
                    I agree to the Gatehouse{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('terms-of-service')}
                      className="text-primary hover:underline font-bold"
                    >
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('privacy-policy')}
                      className="text-primary hover:underline font-bold"
                    >
                      Privacy Policy
                    </button>
                    .
                  </label>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-primary via-[#5cbdb9] to-[#38ef7d] py-3.5 px-4 text-xs font-mono font-extrabold text-navy-950 hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40"
              >
                <span>{authMode === 'register' ? 'Create Gatehouse Account' : 'Sign In to Workspace'}</span>
              </button>
            </form>

            <div className="text-center text-xs text-muted-foreground">
              {authMode === 'register' ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-primary font-bold hover:underline"
                  >
                    Sign in
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="text-primary font-bold hover:underline"
                  >
                    Create one
                  </button>
                </span>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* GOOGLE ACCOUNT CHOOSER MODAL DIALOG */}
      {showGoogleChooser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-navy-950 border border-border/80 rounded-3xl p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowGoogleChooser(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-xl hover:bg-card/60"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">Choose an account</h3>
              <p className="text-xs font-mono text-muted-foreground">to continue to Gatehouse Enterprise</p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <button
                onClick={() => handleSelectGoogleAccount('Musa Ibrahim', 'musa.ibrahim@gmail.com', 'organizer')}
                className="w-full p-3.5 rounded-2xl border border-border/80 bg-card hover:border-primary text-left flex items-center justify-between cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center border border-primary/30 text-xs">
                    MI
                  </div>
                  <div>
                    <div className="font-bold text-foreground group-hover:text-primary transition-colors">Musa Ibrahim</div>
                    <div className="text-[11px] text-muted-foreground">musa.ibrahim@gmail.com</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#38ef7d] bg-[#38ef7d]/10 px-2 py-0.5 rounded-full border border-[#38ef7d]/30 font-bold">
                  Event Host
                </span>
              </button>

              <button
                onClick={() => handleSelectGoogleAccount('Eko Hotels Management', 'security@ekohotels.com', 'centre')}
                className="w-full p-3.5 rounded-2xl border border-border/80 bg-card hover:border-[#5cbdb9] text-left flex items-center justify-between cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#5cbdb9]/20 text-[#5cbdb9] font-bold flex items-center justify-center border border-[#5cbdb9]/30 text-xs">
                    EH
                  </div>
                  <div>
                    <div className="font-bold text-foreground group-hover:text-[#5cbdb9] transition-colors">Eko Hotels Management</div>
                    <div className="text-[11px] text-muted-foreground">security@ekohotels.com</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#5cbdb9] bg-[#5cbdb9]/10 px-2 py-0.5 rounded-full border border-[#5cbdb9]/30 font-bold">
                  Venue Owner
                </span>
              </button>

              <div className="pt-2 space-y-2">
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Or enter another Google email</div>
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
