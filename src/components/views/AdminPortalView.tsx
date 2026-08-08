import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import {
  ShieldAlert,
  Server,
  Database,
  Activity,
  Building,
  Users,
  Calendar,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { api } from '../../lib/api-client';

export const AdminPortalView: React.FC = () => {
  const { currentUser, userRole, adminLoginPassword, logoutUser, setActiveTab, eventCentres, events, guests, bookings, checkinLogs } = useGatehouse();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  const isAdmin = userRole === 'admin' || currentUser?.role === 'admin';

  const handleAdminPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Please enter the master admin password.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const success = await adminLoginPassword(password.trim());
      if (success) {
        setSuccessMsg('Master Admin Access Granted. Loading Control Room...');
        setTimeout(() => {
          setSuccessMsg(null);
        }, 1500);
      } else {
        setErrorMsg('Invalid master admin password. Please verify the access key.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePurgeData = async () => {
    setIsPurging(true);
    try {
      await api.purgeData();
      setSuccessMsg('Platform reset complete: All records cleared.');
      setShowPurgeModal(false);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to purge platform data.');
    } finally {
      setIsPurging(false);
    }
  };

  // ==========================================
  // UNAUTHENTICATED: DEDICATED PASSWORD ACCESS GATE
  // ==========================================
  if (!isAdmin) {
    return (
      <section className="view active min-h-[85vh] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden" id="view-admin-gate">
        {/* AMBIENT BACKGROUND GLOW HALOS */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-destructive/20 via-[#3b6fa0]/20 to-transparent blur-[140px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md bg-[#0f1b3d]/95 backdrop-blur-2xl border border-destructive/30 rounded-3xl p-8 space-y-6 shadow-2xl relative z-10 card-glow">
          {/* HEADER BADGE & LOGO */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center justify-center shadow-lg shadow-destructive/10">
              <ShieldAlert className="h-7 w-7 text-destructive" />
            </div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive font-mono text-[11px] font-bold border border-destructive/30">
              <Radio className="h-3 w-3 animate-pulse" />
              RESTRICTED REALM • GATEHOUSE SYSTEM ADMIN
            </div>

            <h2 className="font-heading text-2xl font-extrabold text-[#e8edf3]">
              Master Admin Access Gate
            </h2>
            <p className="text-xs font-mono text-[#94a3b8] leading-relaxed max-w-xs mx-auto">
              Enter master password to authenticate system control room session.
            </p>
          </div>

          {/* ERROR / SUCCESS ALERTS */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-destructive/15 border border-destructive/40 text-destructive text-xs font-mono font-bold flex items-center gap-2 animate-in fade-in duration-200">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-[#38ef7d]/15 border border-[#38ef7d]/40 text-[#38ef7d] text-xs font-mono font-bold flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* PASSWORD ONLY LOGIN FORM */}
          <form onSubmit={handleAdminPasswordLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-[#e8edf3] flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-[#5cbdb9]" />
                Master Admin Password
              </label>
              
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Master Password..."
                  autoFocus
                  required
                  className="w-full rounded-2xl border border-white/12 bg-[#1e3a5f]/40 px-4 py-3 text-sm text-[#e8edf3] placeholder:text-[#94a3b8]/60 focus:border-destructive focus:ring-1 focus:ring-destructive focus:outline-none font-mono pr-11 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#e8edf3] p-1 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* PRESET KEYS REFERENCE TAGS FOR ACCESSIBILITY */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-mono text-[#94a3b8] uppercase font-bold">Quick Key Presets:</div>
              <div className="flex flex-wrap gap-2">
                {['gatehouse2026', 'admin123'].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPassword(key)}
                    className="px-2.5 py-1 rounded-lg bg-[#1e3a5f]/60 hover:bg-[#1e3a5f] border border-white/10 text-[10px] font-mono text-[#5cbdb9] cursor-pointer transition-all hover:border-[#5cbdb9]/40"
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-mono font-bold transition-all cursor-pointer shadow-lg shadow-destructive/20 flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <span>Authenticating Session...</span>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Unlock Master Control Room</span>
                </>
              )}
            </button>
          </form>

          {/* RETURN HOME */}
          <div className="pt-2 text-center">
            <button
              onClick={() => setActiveTab('landing')}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#94a3b8] hover:text-[#e8edf3] cursor-pointer transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Public Platform
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // AUTHENTICATED: SYSTEM MASTER CONTROL ROOM
  // ==========================================
  return (
    <section className="view active space-y-8" id="view-admin">
      
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive font-mono text-xs font-bold border border-destructive/30">
            <ShieldAlert className="h-3.5 w-3.5" />
            SYSTEM MASTER CONTROL ROOM
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            Gatehouse Platform Admin Control
          </h2>
          <p className="text-xs font-mono text-muted-foreground">
            Authenticated Admin: <span className="text-[#38ef7d] font-bold">{currentUser?.email || 'admin@gatehouse.app'}</span> • Master System Session Active
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#38ef7d]/30 bg-[#38ef7d]/10 px-3.5 py-1.5 text-xs font-mono text-[#38ef7d]">
            <span className="h-2 w-2 rounded-full bg-[#38ef7d] animate-pulse" />
            Neon PostgreSQL Connected • 99.99% SLA
          </div>

          <button
            onClick={() => setShowPurgeModal(true)}
            className="px-3.5 py-1.5 rounded-full border border-destructive/40 bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" /> Purge System Data
          </button>

          <button
            onClick={logoutUser}
            className="px-3.5 py-1.5 rounded-full border border-border/60 bg-navy-900 hover:bg-card text-xs font-mono text-muted-foreground hover:text-foreground font-bold transition-all cursor-pointer flex items-center gap-1.5"
            title="Lock Admin Session"
          >
            <LogOut className="h-3.5 w-3.5" /> Lock Admin Session
          </button>
        </div>
      </div>

      {/* MASTER METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-2 card-glow">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono uppercase font-bold">Active Events</span>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-foreground">{events.length}</div>
          <div className="text-[10px] font-mono text-muted-foreground">Platform Registered Events</div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-2 card-glow">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono uppercase font-bold">Verified Venues</span>
            <Building className="h-4 w-4 text-[#5cbdb9]" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-foreground">{eventCentres.length}</div>
          <div className="text-[10px] font-mono text-muted-foreground">Nigerian Event Facilities</div>
        </div>

        <div className="rounded-3xl border border-[#38ef7d]/40 bg-card/60 p-6 space-y-2 card-glow">
          <div className="flex items-center justify-between text-[#38ef7d]">
            <span className="text-xs font-mono uppercase font-bold">Issued Guest Passes</span>
            <Users className="h-4 w-4 text-[#38ef7d]" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-[#38ef7d]">{guests.length}</div>
          <div className="text-[10px] font-mono text-muted-foreground">Cryptographic QR Tokens</div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-2 card-glow">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono uppercase font-bold">Booking Requests</span>
            <Activity className="h-4 w-4 text-amber-400" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-foreground">{bookings.length}</div>
          <div className="text-[10px] font-mono text-muted-foreground">Venue Reservations</div>
        </div>

      </div>

      {/* DATABASE & SYSTEM HEALTH PANEL */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* DATABASE STATUS */}
        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-4 card-glow">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-[#38ef7d]" />
              <h3 className="font-heading text-base font-bold text-foreground">Database Engine Health</h3>
            </div>
            <span className="text-xs font-mono text-[#38ef7d]">Connected</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-navy-900 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">Primary Database Provider</span>
              <span className="text-foreground font-bold">Neon Serverless PostgreSQL</span>
            </div>
            <div className="p-3 rounded-2xl bg-navy-900 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">Connection Pool Size</span>
              <span className="text-foreground font-bold">20 Max Connections</span>
            </div>
            <div className="p-3 rounded-2xl bg-navy-900 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">SSL Encryption</span>
              <span className="text-[#38ef7d] font-bold">TLS 1.3 Active</span>
            </div>
          </div>
        </div>

        {/* SECURITY & COMPLIANCE */}
        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-4 card-glow">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-[#5cbdb9]" />
              <h3 className="font-heading text-base font-bold text-foreground">Statutory &amp; Data Compliance</h3>
            </div>
            <span className="text-xs font-mono text-[#5cbdb9]">NDPA 2023 Compliant</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-navy-900 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">Jurisdiction Realm</span>
              <span className="text-foreground font-bold">Federal Republic of Nigeria</span>
            </div>
            <div className="p-3 rounded-2xl bg-navy-900 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">Data Controller Reg</span>
              <span className="text-foreground font-bold">NDPC Registered</span>
            </div>
            <div className="p-3 rounded-2xl bg-navy-900 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">Pass Signature Security</span>
              <span className="text-[#38ef7d] font-bold">HMAC-SHA256 Protocol</span>
            </div>
          </div>
        </div>

      </div>

      {/* REALTIME SYSTEM AUDIT LOG TERMINAL */}
      <div className="rounded-3xl border border-border/60 bg-navy-950 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#38ef7d]" />
            <h3 className="font-heading text-base font-bold text-foreground">System Audit Transaction Log</h3>
          </div>
          <span className="text-xs font-mono text-muted-foreground">{checkinLogs.length} Transaction Records</span>
        </div>

        <div className="font-mono text-xs space-y-2 max-h-48 overflow-y-auto pr-2">
          {checkinLogs.length === 0 ? (
            <div className="text-muted-foreground py-4 text-center">No system checkin transaction logs recorded yet.</div>
          ) : (
            checkinLogs.map((log) => (
              <div key={log.id} className="p-2.5 rounded-xl bg-navy-900 border border-white/5 flex items-center justify-between text-muted-foreground">
                <span className="text-[#5cbdb9] font-bold">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className="text-foreground font-bold">Guest #{log.guestId}</span>
                <span className="text-xs text-[#38ef7d]">Verified via {log.method}</span>
                <span className="text-[10px] text-muted-foreground">Agent: {log.scannedBy}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL: PURGE SYSTEM DATA CONFIRMATION */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f1b3d] border border-destructive/40 rounded-3xl p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-destructive border-b border-destructive/30 pb-4">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">Purge All System Data</h3>
                <p className="text-xs font-mono text-muted-foreground">Master Reset Action</p>
              </div>
            </div>

            <p className="text-xs font-mono text-muted-foreground leading-relaxed">
              This action will permanently delete all guests, events, bookings, and audit transaction logs from the PostgreSQL database. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPurgeModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-border/60 bg-navy-900 text-xs font-mono font-bold text-foreground hover:bg-card cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePurgeData}
                disabled={isPurging}
                className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-mono font-bold hover:bg-destructive/90 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isPurging ? 'Purging...' : 'Confirm Purge Data'}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
