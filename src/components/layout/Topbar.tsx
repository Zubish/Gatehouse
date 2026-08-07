import React, { useState, useRef, useEffect } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import type { ViewRoute, UserRole } from '../../types';
import { ChevronDown, Play } from 'lucide-react';

interface TopbarProps {
  currentView: ViewRoute;
  onNavigate: (view: ViewRoute) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ currentView, onNavigate }) => {
  const { currentUser, loginUser, logoutUser } = useGatehouse();
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Show public landing page navbar for landing page AND public venue directory
  const isPublicMarketingPage = ['landing', 'login', 'register', 'centres'].includes(currentView);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDemoDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (currentView !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDemoLogin = async (targetRole: UserRole) => {
    setIsDemoDropdownOpen(false);
    const demoEmail = targetRole === 'organizer' ? 'demo@gatehouse.app' : 'venue@gatehouse.app';
    const success = await loginUser(demoEmail, 'password123');
    if (success) {
      onNavigate(targetRole === 'centre' ? 'centre-dash' : 'dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        
        {/* BRAND LOGO WITH TRANSPARENT SVG */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center transition-transform group-hover:scale-105">
            <img src="/logo.png" alt="Gatehouse Shield Logo" className="h-full w-full object-contain rounded-lg" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            Gatehouse
          </span>
        </div>

        {/* PUBLIC MARKETING NAVIGATION */}
        {isPublicMarketingPage ? (
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <button
              onClick={() => scrollToSection('audience-paths')}
              className="transition-colors hover:text-foreground cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('meet-musa-ai')}
              className="transition-colors hover:text-foreground cursor-pointer"
            >
              Meet Musa AI
            </button>
            <button
              onClick={() => scrollToSection('platform-overview')}
              className="transition-colors hover:text-foreground cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => onNavigate('centres')}
              className={`transition-colors cursor-pointer ${
                currentView === 'centres'
                  ? 'text-[#5cbdb9] font-bold'
                  : 'hover:text-foreground'
              }`}
            >
              Venues Directory
            </button>
            <button
              onClick={() => scrollToSection('calculator-section')}
              className="transition-colors hover:text-foreground cursor-pointer"
            >
              Calculator
            </button>
          </nav>
        ) : (
          /* AUTHENTICATED INTERNAL CONTROL ROOM TABS */
          <nav className="hidden lg:flex items-center gap-1 bg-navy-800/80 p-1.5 rounded-xl border border-border/60 text-xs font-mono">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('guests')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'guests'
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Guest List
            </button>
            <button
              onClick={() => onNavigate('checkin')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'checkin'
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Gate Scanner
            </button>
            <button
              onClick={() => onNavigate('walkin')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'walkin'
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Walk-In
            </button>
            <button
              onClick={() => onNavigate('centres')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'centres'
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Book Venues
            </button>
            <button
              onClick={() => onNavigate('centre-dash')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'centre-dash'
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Venue Portal
            </button>
            <button
              onClick={() => onNavigate('public-reg')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'public-reg'
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Public Link
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'settings'
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-destructive text-destructive-foreground font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Admin
            </button>
          </nav>
        )}

        {/* AUTH ACTIONS & VIEW DEMO DROPDOWN */}
        <div className="flex shrink-0 items-center gap-3">
          
          {/* VIEW DEMO DROPDOWN MENU */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#5cbdb9]/40 bg-[#5cbdb9]/10 px-4 py-2 text-xs font-mono font-bold text-[#5cbdb9] hover:bg-[#5cbdb9]/20 transition-all cursor-pointer shadow-sm"
            >
              <Play className="h-3 w-3 fill-current" />
              View Demo
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isDemoDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDemoDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-border/80 bg-navy-900 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-mono text-muted-foreground uppercase font-bold border-b border-border/40 mb-1">
                  Select Sandbox Demo
                </div>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('organizer')}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold text-foreground hover:bg-card flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span>⚡ Event Organizer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('centre')}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono font-bold text-[#38ef7d] hover:bg-card flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span>🏛️ Venue Owner</span>
                </button>
              </div>
            )}
          </div>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-foreground">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-mono text-[#5cbdb9]">
                  {currentUser.role === 'centre'
                    ? '🏢 Event Facility'
                    : '🎟️ Event Host'}
                </span>
              </div>

              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer"
              >
                Control Room
              </button>

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
                className="rounded-full border border-border/60 bg-card px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary cursor-pointer"
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
