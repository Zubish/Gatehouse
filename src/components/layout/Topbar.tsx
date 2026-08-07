import React from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import type { ViewRoute } from '../../types';

interface TopbarProps {
  currentView: ViewRoute;
  onNavigate: (view: ViewRoute) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ currentView, onNavigate }) => {
  const { currentUser, logoutUser } = useGatehouse();

  const isPublicMarketingPage = ['landing', 'login', 'register'].includes(currentView);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-3.5 sm:flex sm:flex-wrap sm:justify-between">
        
        {/* LOGO */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex min-w-0 items-center gap-2.5 cursor-pointer group"
        >
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/20 text-primary transition-transform group-hover:scale-105">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="truncate font-heading text-lg font-semibold tracking-tight text-foreground">
              Gatehouse
            </span>
            <span className="hidden rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground sm:inline">
              v2.0 Enterprise
            </span>
          </div>
        </div>

        {/* PUBLIC MARKETING NAVIGATION */}
        {isPublicMarketingPage ? (
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <button onClick={() => onNavigate('landing')} className="transition-colors hover:text-foreground cursor-pointer">
              Overview
            </button>
            <button onClick={() => onNavigate('centres')} className="transition-colors hover:text-foreground cursor-pointer">
              Venues Directory
            </button>
            <button onClick={() => onNavigate('public-reg')} className="transition-colors hover:text-foreground cursor-pointer">
              Public Link
            </button>
            <button onClick={() => onNavigate('login')} className="transition-colors hover:text-foreground cursor-pointer">
              Organizers
            </button>
          </nav>
        ) : (
          /* AUTHENTICATED INTERNAL CONTROL ROOM TABS */
          <nav className="hidden lg:flex items-center gap-1 bg-navy-800/80 p-1.5 rounded-xl border border-border/60 text-xs font-mono">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'dashboard' ? 'bg-primary text-primary-foreground font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('guests')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'guests' ? 'bg-primary text-primary-foreground font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Guest List
            </button>
            <button
              onClick={() => onNavigate('checkin')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'checkin' ? 'bg-primary text-primary-foreground font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Gate Scanner
            </button>
            <button
              onClick={() => onNavigate('walkin')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'walkin' ? 'bg-primary text-primary-foreground font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Walk-In
            </button>
            <button
              onClick={() => onNavigate('centres')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'centres' ? 'bg-primary text-primary-foreground font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Book Venues
            </button>
            <button
              onClick={() => onNavigate('centre-dash')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'centre-dash' ? 'bg-primary text-primary-foreground font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Venue Portal
            </button>
            <button
              onClick={() => onNavigate('public-reg')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'public-reg' ? 'bg-primary text-primary-foreground font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Public Link
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'settings' ? 'bg-primary text-primary-foreground font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'admin' ? 'bg-destructive text-destructive-foreground font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Admin
            </button>
          </nav>
        )}

        {/* AUTH BUTTONS OR USER BADGE */}
        <div className="flex shrink-0 items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-foreground">{currentUser.name}</span>
                <span className="text-[10px] font-mono text-[#5cbdb9]">
                  {currentUser.role === 'centre' ? '🏢 Event Facility' : '🎟️ Event Host'}
                </span>
              </div>

              <button
                onClick={logoutUser}
                className="btn btn-ghost btn-sm font-mono text-xs text-[#e5555c] border-[#e5555c]/30 hover:bg-[#331b1d]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('login')}
                className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline cursor-pointer"
              >
                Sign in
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md cursor-pointer"
              >
                <span className="hidden sm:inline">Launch Control Room</span>
                <span className="sm:hidden">Launch</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
