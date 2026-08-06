import React from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import type { ViewRoute } from '../../types';

export const Topbar: React.FC = () => {
  const { 
    currentUser,
    logoutUser,
    userRole, 
    setUserRole, 
    guests, 
    activeTab, 
    setActiveTab, 
    events, 
    activeEventId, 
    setActiveEventId 
  } = useGatehouse();

  const isPublicPage = activeTab === 'landing' || activeTab === 'login' || activeTab === 'register';
  const totalCount = guests.length;

  const appTabs: { id: ViewRoute; label: string; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'guests', label: 'Guest List', count: totalCount },
    { id: 'checkin', label: 'Gate Scanner' },
    { id: 'walkin', label: 'Walk-In' },
    { id: 'venues', label: 'Book Venues' },
    { id: 'centre_portal', label: 'Venue Portal' },
    { id: 'public_reg', label: 'Public Link' },
    { id: 'settings', label: 'Event Setup' },
  ];

  // 1. PUBLIC MARKETING NAVBAR (Landing, Login, Register)
  if (isPublicPage) {
    return (
      <header className="sticky top-0 z-50 bg-[#080c14]/90 backdrop-blur-md border-b border-white/10 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('landing')}
          >
            <div className="w-9 h-9 rounded-xl bg-[#3ED98A]/10 border border-[#3ED98A]/30 flex items-center justify-center group-hover:scale-105 transition-all">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3ED98A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <span className="font-['Space_Grotesk'] text-lg font-bold tracking-tight text-[#EDEFF3]">Gatehouse</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono text-[#3ED98A] bg-[#173226] px-2 py-0.5 rounded border border-[#3ED98A]/20">v2.0 Enterprise</span>
            </div>
          </div>

          {/* Public Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium font-['Inter'] text-[#94a3b8]">
            <a href="#overview" onClick={() => setActiveTab('landing')} className="hover:text-white transition-colors">Overview</a>
            <a href="#solutions" onClick={() => setActiveTab('landing')} className="hover:text-white transition-colors">Solutions</a>
            <a href="#calculator" onClick={() => setActiveTab('landing')} className="hover:text-white transition-colors">Velocity Calculator</a>
            <a href="#pricing" onClick={() => setActiveTab('landing')} className="hover:text-white transition-colors">Pricing</a>
          </nav>

          {/* Public Actions */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#3ED98A]">
                  Hi, {currentUser.name.split(' ')[0]} ({currentUser.role})
                </span>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="btn btn-go text-xs font-mono font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-lg shadow-[#3ED98A]/20 hover:scale-105 transition-all"
                >
                  Control Room &rarr;
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-xs font-mono font-semibold px-4 py-2 text-[#EDEFF3] hover:text-[#3ED98A] transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="btn btn-go text-xs font-mono font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-lg shadow-[#3ED98A]/20 hover:scale-105 transition-all"
                >
                  Launch Control Room &rarr;
                </button>
              </>
            )}
          </div>

        </div>
      </header>
    );
  }

  // 2. INTERNAL APP CONTROL ROOM HEADER (Authenticated Dashboard / Operations)
  return (
    <div className="topbar">
      <div className="brand-row">
        
        {/* Brand & Live Light */}
        <div className="brand cursor-pointer" onClick={() => setActiveTab('landing')}>
          <svg className="logo-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3ED98A" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <div className="gate-light live" id="gateLight" />
          <div>
            <h1 className="font-['Space_Grotesk'] font-bold text-base">Gatehouse Control Room</h1>
            <div className="sub text-[10px]">Live Gate Access &amp; Operations</div>
          </div>
        </div>

        {/* Role Switcher & Active Event Picker */}
        <div className="flex items-center gap-3">
          
          {/* User Profile Badge */}
          {currentUser && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#151A22] border border-[#262D38] text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#3ED98A]" />
              <span className="font-bold text-[#EDEFF3]">{currentUser.name}</span>
            </div>
          )}

          {/* Active Event Dropdown */}
          <select
            value={activeEventId}
            onChange={(e) => setActiveEventId(e.target.value)}
            className="bg-[#151A22] border border-[#262D38] text-[#EDEFF3] rounded-md px-2.5 py-1.5 text-xs font-mono font-semibold focus:outline-none focus:border-[#3ED98A]"
          >
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.name} ({evt.date})
              </option>
            ))}
          </select>

          {/* Role Pill */}
          <div className="flex items-center bg-[#151A22] border border-[#262D38] rounded-md p-0.5 text-xs font-mono">
            <button
              onClick={() => setUserRole('organizer')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                userRole === 'organizer'
                  ? 'bg-[#3ED98A] text-[#08150E]'
                  : 'text-[#8B93A3] hover:text-[#EDEFF3]'
              }`}
            >
              Organizer
            </button>
            <button
              onClick={() => setUserRole('centre')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                userRole === 'centre'
                  ? 'bg-[#F0A93B] text-[#08150E]'
                  : 'text-[#8B93A3] hover:text-[#EDEFF3]'
              }`}
            >
              Event Centre
            </button>
          </div>

          {/* Sign Out / Exit Button */}
          {currentUser ? (
            <button
              onClick={logoutUser}
              className="btn btn-ghost text-xs px-3 py-1 font-mono text-[#E5555C] border-[#E5555C]/30 hover:bg-[#331B1D]"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('landing')}
              className="btn btn-ghost text-xs px-3 py-1 font-mono text-[#8B93A3] hover:text-white"
            >
              Exit Control Room
            </button>
          )}

        </div>
      </div>

      {/* Internal Operational Tabs */}
      <nav className="tabs">
        {appTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={activeTab === t.id ? 'active' : ''}
          >
            {t.label}
            {t.count !== undefined && (
              <span className="count">
                ({t.count})
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};
