import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import { ShieldCheck, CheckCircle2, User, Building, Eye, EyeOff } from 'lucide-react';

interface AuthViewProps {
  mode?: 'login' | 'register';
}

export const AuthView: React.FC<AuthViewProps> = ({ mode = 'login' }) => {
  const { loginUser, registerUser, setActiveTab } = useGatehouse();

  // Mode & Role State
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

  // Terms Checkbox
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Status Notification
  const [statusMsg, setStatusMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);


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


  return (
    <section className="view active min-h-[90vh] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-[#0f1b3d]" id="view-auth">
      
      {/* BRAND SYSTEM NAVY TRUST AMBIENT GRADIENT LIGHTS */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#1e3a5f]/60 via-[#5cbdb9]/20 to-transparent blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-br from-[#38ef7d]/15 via-[#3b6fa0]/25 to-transparent blur-[130px] rounded-full pointer-events-none" />

      {/* MINIMALIST ELEGANT AUTHENTICATION CONTAINER */}
      <div className="w-full max-w-5xl rounded-[2rem] border border-white/12 bg-[#1e3a5f]/40 backdrop-blur-2xl overflow-hidden shadow-2xl grid lg:grid-cols-12 min-h-[640px] card-glow relative z-10">
        
        {/* =========================
            LEFT PANEL — BRAND SYSTEM TYPOGRAPHY & GRADIENT AMBIENCE
        ========================== */}
        <div className="lg:col-span-5 relative p-8 sm:p-12 bg-gradient-to-br from-[#0f1b3d]/95 via-[#1e3a5f]/80 to-[#0f1b3d]/95 text-[#e8edf3] flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-white/12">
          
          {/* Subtle Concentric Rings */}
          <div className="absolute -right-32 top-16 w-96 h-96 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute -right-20 top-28 w-72 h-72 rounded-full border border-[#5cbdb9]/20 pointer-events-none" />
          
          {/* Top Brand Header */}
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3b6fa0] via-[#5cbdb9] to-[#38ef7d] flex items-center justify-center shadow-lg shadow-[#5cbdb9]/20">
                <ShieldCheck className="h-6 w-6 text-[#0f1b3d]" />
              </div>
              <span className="font-heading text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#e8edf3] via-[#e8edf3] to-[#94a3b8] bg-clip-text text-transparent flex items-center">
                <img src="/logo.png" alt="G" className="h-7 w-7 object-contain inline-block -mr-0.5" />
                <span>atehouse</span>
              </span>
            </div>

            {/* Typography Headline */}
            <div className="space-y-4 pt-4">
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.08] tracking-tight bg-gradient-to-r from-[#e8edf3] via-[#e8edf3] to-[#5cbdb9] bg-clip-text text-transparent">
                Every gate.<br />
                Every guest.<br />
                <span className="bg-gradient-to-r from-[#38ef7d] via-[#5cbdb9] to-[#3b6fa0] bg-clip-text text-transparent">
                  Zero friction.
                </span>
              </h1>
              <p className="text-[#94a3b8] text-xs sm:text-sm leading-relaxed max-w-xs font-sans">
                Access control, cryptographic pass verification, and venue management built for enterprise operations in Nigeria.
              </p>
            </div>
          </div>

          {/* Sentinel Live Badge */}
          <div className="relative z-10 pt-10 space-y-4">
            <div className="text-xs font-mono text-[#38ef7d] font-bold flex items-center gap-2.5 bg-[#38ef7d]/10 px-3.5 py-1.5 rounded-full border border-[#38ef7d]/30 w-fit">
              <span className="h-2 w-2 rounded-full bg-[#38ef7d] animate-pulse shrink-0" />
              Gatehouse Sentinel Live • 99.99% Operational
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#94a3b8]">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#5cbdb9]" /> HMAC Token Security</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#38ef7d]" /> 2.5s Verification</span>
            </div>
          </div>

        </div>

        {/* =========================
            RIGHT PANEL — MINIMALIST FORM UX
        ========================== */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6 bg-[#1e3a5f]/30 backdrop-blur-xl text-[#e8edf3]">
          <div className="space-y-6 max-w-md mx-auto w-full">
            
            {/* MINIMALIST TAB SWITCHER */}
            <div className="grid grid-cols-2 p-1 bg-[#0f1b3d]/90 rounded-2xl border border-white/12 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setStatusMsg(null);
                }}
                className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-[#1e3a5f] text-[#e8edf3] shadow-md border border-white/10'
                    : 'text-[#94a3b8] hover:text-[#e8edf3]'
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
                    ? 'bg-[#1e3a5f] text-[#e8edf3] shadow-md border border-white/10'
                    : 'text-[#94a3b8] hover:text-[#e8edf3]'
                }`}
              >
                Sign in
              </button>
            </div>

            {/* STATUS BANNER */}
            {statusMsg && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-mono text-center font-bold border ${
                  statusMsg.type === 'ok'
                    ? 'bg-[#38ef7d]/10 border-[#38ef7d] text-[#38ef7d]'
                    : 'bg-red-500/10 border-red-500 text-red-400'
                }`}
              >
                {statusMsg.text}
              </div>
            )}

            {/* AUTH FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* ROLE CARDS (REGISTRATION ONLY) */}
              {authMode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#94a3b8] uppercase font-bold">Select Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('organizer')}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        role === 'organizer'
                          ? 'border-[#3b6fa0] bg-[#3b6fa0]/20 ring-1 ring-[#3b6fa0]/40'
                          : 'border-white/12 bg-[#0f1b3d]/60 hover:border-white/20'
                      }`}
                    >
                      <User className={`h-5 w-5 ${role === 'organizer' ? 'text-[#5cbdb9]' : 'text-[#94a3b8]'}`} />
                      <div>
                        <div className="text-xs font-bold text-[#e8edf3]">Event Host</div>
                        <div className="text-[10px] text-[#94a3b8] font-mono">Organize &amp; scan guests</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('centre')}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        role === 'centre'
                          ? 'border-[#5cbdb9] bg-[#5cbdb9]/20 ring-1 ring-[#5cbdb9]/40'
                          : 'border-white/12 bg-[#0f1b3d]/60 hover:border-white/20'
                      }`}
                    >
                      <Building className={`h-5 w-5 ${role === 'centre' ? 'text-[#5cbdb9]' : 'text-[#94a3b8]'}`} />
                      <div>
                        <div className="text-xs font-bold text-[#e8edf3]">Venue Owner</div>
                        <div className="text-[10px] text-[#94a3b8] font-mono font-normal">Manage hall &amp; bookings</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* FULL NAME (REGISTRATION ONLY) */}
              {authMode === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#94a3b8] font-bold">Full name</label>
                  <input
                    type="text"
                    required
                    placeholder="Musa Ibrahim"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-white/12 bg-[#0f1b3d] px-3.5 py-2.5 text-xs text-[#e8edf3] focus:border-[#3b6fa0] focus:outline-none"
                  />
                </div>
              )}

              {/* EMAIL */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-[#94a3b8] font-bold">Email address</label>
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/12 bg-[#0f1b3d] px-3.5 py-2.5 text-xs text-[#e8edf3] focus:border-[#3b6fa0] focus:outline-none"
                />
              </div>

              {/* DYNAMIC ROLE FIELDS */}
              {authMode === 'register' && role === 'organizer' && (
                <div className="space-y-3 pt-1 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[#94a3b8] font-bold">Organization / Company</label>
                      <input
                        type="text"
                        placeholder="e.g. Lagos Tech Summit"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className="w-full rounded-xl border border-white/12 bg-[#0f1b3d] px-3 py-2 text-xs text-[#e8edf3] focus:border-[#3b6fa0] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[#94a3b8] font-bold">Organizer type</label>
                      <select
                        value={organizerType}
                        onChange={(e) => setOrganizerType(e.target.value)}
                        className="w-full rounded-xl border border-white/12 bg-[#0f1b3d] px-3 py-2 text-xs text-[#e8edf3] focus:border-[#3b6fa0] focus:outline-none"
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
                <div className="space-y-3 pt-1 border-t border-white/10">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#94a3b8] font-bold">Venue name</label>
                    <input
                      type="text"
                      placeholder="e.g. Eko Convention Centre"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      className="w-full rounded-xl border border-white/12 bg-[#0f1b3d] px-3 py-2 text-xs text-[#e8edf3] focus:border-[#5cbdb9] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[#94a3b8] font-bold">Venue address</label>
                      <input
                        type="text"
                        placeholder="Victoria Island, Lagos"
                        value={venueAddress}
                        onChange={(e) => setVenueAddress(e.target.value)}
                        className="w-full rounded-xl border border-white/12 bg-[#0f1b3d] px-3 py-2 text-xs text-[#e8edf3] focus:border-[#5cbdb9] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-mono text-[#94a3b8] font-bold">Approx. capacity</label>
                      <input
                        type="number"
                        placeholder="3500"
                        value={venueCapacity}
                        onChange={(e) => setVenueCapacity(e.target.value)}
                        className="w-full rounded-xl border border-white/12 bg-[#0f1b3d] px-3 py-2 text-xs text-[#e8edf3] focus:border-[#5cbdb9] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {authMode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#94a3b8] font-bold">Phone number</label>
                    <input
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-white/12 bg-[#0f1b3d] px-3 py-2 text-xs text-[#e8edf3] focus:border-[#3b6fa0] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#94a3b8] font-bold">Country</label>
                    <input
                      type="text"
                      placeholder="Nigeria"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-xl border border-white/12 bg-[#0f1b3d] px-3 py-2 text-xs text-[#e8edf3] focus:border-[#3b6fa0] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* PASSWORD */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-[#94a3b8] font-bold">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/12 bg-[#0f1b3d] px-3.5 py-2.5 text-xs text-[#e8edf3] focus:border-[#3b6fa0] focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#e8edf3] cursor-pointer"
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
                    className="mt-0.5 rounded border-white/12 bg-[#0f1b3d] text-[#3b6fa0] focus:ring-[#3b6fa0] cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-[#94a3b8] leading-snug cursor-pointer">
                    I agree to the Gatehouse{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('terms-of-service')}
                      className="text-[#5cbdb9] hover:underline font-bold"
                    >
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('privacy-policy')}
                      className="text-[#5cbdb9] hover:underline font-bold"
                    >
                      Privacy Policy
                    </button>
                    .
                  </label>
                </div>
              )}

              {/* BRAND CTA BUTTON */}
              <button
                type="submit"
                className="w-full rounded-2xl bg-[#3b6fa0] hover:bg-[#3b6fa0]/90 py-3.5 px-4 text-xs font-mono font-extrabold text-[#e8edf3] flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-[#3b6fa0]/25"
              >
                <span>{authMode === 'register' ? 'Create Gatehouse Account' : 'Sign In to Workspace'}</span>
              </button>
            </form>

            <div className="text-center text-xs text-[#94a3b8]">
              {authMode === 'register' ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-[#5cbdb9] font-bold hover:underline"
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
                    className="text-[#5cbdb9] font-bold hover:underline"
                  >
                    Create one
                  </button>
                </span>
              )}
            </div>

          </div>
        </div>

      </div>


    </section>
  );
};
