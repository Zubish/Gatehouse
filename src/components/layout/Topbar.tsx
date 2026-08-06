import React from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import type { ViewRoute } from '../../types';

interface TopbarProps {
  currentView: ViewRoute;
  onNavigate: (view: ViewRoute) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ currentView, onNavigate }) => {
  const { currentUser, logoutUser } = useGatehouse();

  const isPublicMarketingPage = ['landing', 'login', 'register'].includes(currentView);

  return (
    <header className="brand-bar">
      <div className="brand-inner flex items-center justify-between w-full max-w-7xl mx-auto px-4 py-3">
        
        {/* LOGO */}
        <div
          className="brand flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('landing')}
        >
          <div className="logo-box relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#3ED98A] to-[#173226] p-0.5 flex items-center justify-center shadow-lg shadow-[#3ED98A]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#080c14] rounded-[10px] flex items-center justify-center">
              <span className="font-mono text-lg font-black text-[#3ED98A] tracking-tighter">GH</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-['Space_Grotesk'] text-lg font-black tracking-tight text-[#EDEFF3] flex items-center gap-1.5">
              GATEHOUSE
              <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-[#173226] text-[#3ED98A] border border-[#3ED98A]/30">
                PRO 2.0
              </span>
            </span>
            <span className="text-[10px] font-mono text-[#8B93A3] tracking-widest uppercase">
              Access Control &amp; Venue OS
            </span>
          </div>
        </div>

        {/* PUBLIC MARKETING NAVIGATION */}
        {isPublicMarketingPage ? (
          <div className="hidden md:flex items-center gap-6 text-xs font-mono">
            <button onClick={() => onNavigate('landing')} className="hover:text-[#3ED98A] text-[#EDEFF3] transition-colors">Overview</button>
            <button onClick={() => onNavigate('centres')} className="hover:text-[#3ED98A] text-[#94a3b8] transition-colors">Venues Directory</button>
            <button onClick={() => onNavigate('login')} className="hover:text-[#3ED98A] text-[#94a3b8] transition-colors">Organizers</button>
          </div>
        ) : (
          /* AUTHENTICATED INTERNAL CONTROL ROOM TABS */
          <nav className="hidden lg:flex items-center gap-1 bg-[#0f172a]/90 p-1.5 rounded-xl border border-[#262D38] text-xs font-mono">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'dashboard' ? 'bg-[#173226] text-[#3ED98A] font-bold border border-[#3ED98A]/30' : 'text-[#8B93A3] hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('guests')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'guests' ? 'bg-[#173226] text-[#3ED98A] font-bold border border-[#3ED98A]/30' : 'text-[#8B93A3] hover:text-white'
              }`}
            >
              Guest List
            </button>
            <button
              onClick={() => onNavigate('checkin')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'checkin' ? 'bg-[#173226] text-[#3ED98A] font-bold border border-[#3ED98A]/30' : 'text-[#8B93A3] hover:text-white'
              }`}
            >
              Gate Scanner
            </button>
            <button
              onClick={() => onNavigate('walkin')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'walkin' ? 'bg-[#173226] text-[#3ED98A] font-bold border border-[#3ED98A]/30' : 'text-[#8B93A3] hover:text-white'
              }`}
            >
              Walk-In
            </button>
            <button
              onClick={() => onNavigate('centres')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'centres' ? 'bg-[#173226] text-[#3ED98A] font-bold border border-[#3ED98A]/30' : 'text-[#8B93A3] hover:text-white'
              }`}
            >
              Book Venues
            </button>
            <button
              onClick={() => onNavigate('centre-dash')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'centre-dash' ? 'bg-[#173226] text-[#3ED98A] font-bold border border-[#3ED98A]/30' : 'text-[#8B93A3] hover:text-white'
              }`}
            >
              Venue Portal
            </button>
            <button
              onClick={() => onNavigate('public-reg')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'public-reg' ? 'bg-[#173226] text-[#3ED98A] font-bold border border-[#3ED98A]/30' : 'text-[#8B93A3] hover:text-white'
              }`}
            >
              Public Link
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'settings' ? 'bg-[#173226] text-[#3ED98A] font-bold border border-[#3ED98A]/30' : 'text-[#8B93A3] hover:text-white'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentView === 'admin' ? 'bg-[#331B1D] text-[#E5555C] font-bold border border-[#E5555C]/40' : 'text-[#8B93A3] hover:text-white'
              }`}
            >
              Admin
            </button>
          </nav>
        )}

        {/* AUTH BUTTONS OR USER BADGE */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-[#EDEFF3]">{currentUser.name}</span>
                <span className="text-[10px] font-mono text-[#3ED98A]">
                  {currentUser.role === 'centre' ? '🏢 Event Facility' : '🎟️ Event Host'}
                </span>
              </div>

              <button
                onClick={logoutUser}
                className="btn btn-ghost btn-sm font-mono text-xs text-[#E5555C] border-[#E5555C]/30 hover:bg-[#331B1D]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={() => onNavigate('login')}
                className="px-3 py-2 rounded-lg text-[#EDEFF3] hover:text-white hover:bg-[#1B2129] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="btn btn-go btn-sm font-bold shadow-lg shadow-[#3ED98A]/20"
              >
                Launch Control Room &rarr;
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
