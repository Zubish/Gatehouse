import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import {
  ShieldAlert,
  Activity,
  Building,
  Users,
  Calendar,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Radio,
  ArrowRight,
  DollarSign,
  Sliders,
} from 'lucide-react';
import { api } from '../../lib/api-client';

export const AdminPortalView: React.FC = () => {
  const { currentUser, userRole, adminLoginPassword, logoutUser, eventCentres, events, guests, bookings, checkinLogs } = useGatehouse();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'command' | 'venues' | 'access' | 'revenue' | 'settings'>('command');

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

  const handlePurgeAllData = async () => {
    setIsPurging(true);
    setErrorMsg(null);
    try {
      await api.purgeData();
      setSuccessMsg('System reset complete. All test data purged.');
      setShowPurgeModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to purge data.');
    } finally {
      setIsPurging(false);
    }
  };

  // ---------------- GATED PASSWORD VIEW ----------------
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mb-2">
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Restricted System Realm
          </h2>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            Authorized Gatehouse Platform Administrators only. Master Access Key required.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 shadow-2xl border border-slate-800 rounded-2xl sm:px-10">
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleAdminPasswordLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Master Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-12 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center space-x-2 text-sm"
              >
                {isSubmitting ? (
                  <span>Authenticating Key...</span>
                ) : (
                  <>
                    <span>Authenticate Admin Access</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- AUTHORIZED CONTROL CENTER ----------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 lg:p-10 space-y-8">
      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold tracking-tight text-white">Gatehouse Command Center</h1>
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Platform Control Plane • Operational Health & Audit Management</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPurgeModal(true)}
            className="px-4 py-2 bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-300 text-xs font-semibold rounded-xl flex items-center space-x-2 transition-all shadow-sm"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            <span>Purge Test Data</span>
          </button>
          <button
            onClick={logoutUser}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl flex items-center space-x-2 transition-all"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Exit Control Room</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs scrollbar-none">
        <button
          onClick={() => setActiveAdminTab('command')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
            activeAdminTab === 'command'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Command Center</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('venues')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
            activeAdminTab === 'venues'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Venues ({eventCentres.length})</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('access')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
            activeAdminTab === 'access'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Access & Security</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('revenue')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
            activeAdminTab === 'revenue'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Revenue & Billing</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('settings')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
            activeAdminTab === 'settings'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>System Settings</span>
        </button>
      </div>

      {/* TAB 1: COMMAND & ACTION CENTER */}
      {activeAdminTab === 'command' && (
        <div className="space-y-8">
          {/* Urgent Action Center */}
          <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-red-300">Urgent Action Center</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Pending Venue Verifications</span>
                  <span className="text-lg font-bold text-white">0 Requires Action</span>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">All Clear</span>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Anti-Passback Blocked Scans</span>
                  <span className="text-lg font-bold text-white">2 Intercepted</span>
                </div>
                <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20">Secured</span>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Database Sync Latency</span>
                  <span className="text-lg font-bold text-white">12ms (Optimal)</span>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">Neon Postgres</span>
              </div>
            </div>
          </div>

          {/* Master Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Active Event Instances</span>
                <Calendar className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">{events.length}</div>
              <span className="text-[11px] text-emerald-400">Synced to PostgreSQL</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Verified Venue Centres</span>
                <Building className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">{eventCentres.length}</div>
              <span className="text-[11px] text-slate-400">Lagos & Regional Facilities</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Issued QR Passes</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">{guests.length}</div>
              <span className="text-[11px] text-indigo-400">HMAC-SHA256 Signed</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Facility Reservations</span>
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">{bookings.length}</div>
              <span className="text-[11px] text-purple-400">Venue Requests</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VENUE MANAGEMENT */}
      {activeAdminTab === 'venues' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Registered Event Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventCentres.map((centre) => (
              <div key={centre.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">{centre.name}</h3>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Verified</span>
                </div>
                <p className="text-xs text-slate-400">{centre.address} • Capacity: {centre.capacity} Guests</p>
                <div className="text-[11px] text-indigo-300 font-mono">Contact: {centre.contactEmail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ACCESS & SECURITY AUDIT */}
      {activeAdminTab === 'access' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Realtime Gate Sentinel Check-In Logs</h2>
          <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs max-h-96 overflow-y-auto space-y-2 border border-slate-800">
            {checkinLogs.length === 0 ? (
              <div className="text-slate-500 text-center py-4">No scan transactions logged yet.</div>
            ) : (
              checkinLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-emerald-400">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    <span className="text-white font-bold">{(log as any).guestName || 'Verified Guest'}</span>
                    <span className="text-slate-400">scanned by {log.scannedBy}</span>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px]">
                    {log.result.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: REVENUE & BILLING */}
      {activeAdminTab === 'revenue' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white">Platform Revenue & Billing Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 uppercase">Starter Host Plan</span>
              <div className="text-2xl font-bold text-white">₦0 / Month</div>
              <p className="text-xs text-slate-400">Up to 200 Guests • Standard QR Passes</p>
            </div>
            <div className="bg-slate-950 p-6 rounded-xl border border-indigo-500/40 space-y-2">
              <span className="text-xs text-indigo-400 uppercase">Pro Host Plan</span>
              <div className="text-2xl font-bold text-white">₦45,000 / Month</div>
              <p className="text-xs text-slate-400">Up to 2,000 Guests • Anti-Passback turnstile sync</p>
            </div>
            <div className="bg-slate-950 p-6 rounded-xl border border-amber-500/40 space-y-2">
              <span className="text-xs text-amber-400 uppercase">Enterprise Gatehouse</span>
              <div className="text-2xl font-bold text-white">Custom Tier</div>
              <p className="text-xs text-slate-400">Unlimited Capacity • Dedicated Musa AI Gate Sentinel</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM SETTINGS */}
      {activeAdminTab === 'settings' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white">System Governance & Feature Flags</h2>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <span className="font-semibold text-white block">Musa AI Gate Sentinel Defense</span>
                <span className="text-slate-400">Automated duplicate pass interception & fraud detection</span>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">ENABLED</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <span className="font-semibold text-white block">NDPA 2023 Data Privacy Retention</span>
                <span className="text-slate-400">Guest PII encrypted & auto-purged post-event</span>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">COMPLIANT</span>
            </div>
          </div>
        </div>
      )}

      {/* PURGE DATA CONFIRMATION MODAL */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3 text-red-400">
              <AlertTriangle className="w-8 h-8" />
              <h3 className="text-lg font-bold text-white">Confirm System Reset</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to purge all test data? This will clear all events, guest passes, and check-in logs from the database.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowPurgeModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handlePurgeAllData}
                disabled={isPurging}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-red-600/20"
              >
                {isPurging ? 'Purging Data...' : 'Confirm Purge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
