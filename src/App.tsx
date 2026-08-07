import { useState } from 'react';
import { useGatehouse } from './context/GatehouseContext';
import { Topbar } from './components/layout/Topbar';
import { LandingPageView } from './components/views/LandingPageView';
import { AuthView } from './components/views/AuthView';
import { DashboardView } from './components/views/DashboardView';
import { GuestListView } from './components/views/GuestListView';
import { CheckinView } from './components/views/CheckinView';
import { WalkinView } from './components/views/WalkinView';
import { EventCentresView } from './components/views/EventCentresView';
import { CentreDashboardView } from './components/views/CentreDashboardView';
import { PublicRegistrationView } from './components/views/PublicRegistrationView';
import { SettingsView } from './components/views/SettingsView';
import { AdminPortalView } from './components/views/AdminPortalView';
import type { ViewRoute } from './types';

export function App() {
  const { activeTab, setActiveTab } = useGatehouse();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleNavigate = (view: ViewRoute) => {
    if (view === 'login') {
      setAuthMode('login');
    } else if (view === 'register') {
      setAuthMode('register');
    }
    setActiveTab(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentView = activeTab;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* TOPBAR NAVIGATION */}
      <Topbar currentView={currentView} onNavigate={handleNavigate} />

      {/* MAIN VIEW ROUTER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'landing' && (
          <LandingPageView onNavigate={handleNavigate} />
        )}
        {(currentView === 'login' || currentView === 'register') && (
          <AuthView mode={authMode} />
        )}
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'guests' && <GuestListView />}
        {currentView === 'checkin' && <CheckinView />}
        {currentView === 'walkin' && <WalkinView />}
        {currentView === 'centres' && <EventCentresView onNavigate={handleNavigate} />}
        {currentView === 'centre-dash' && <CentreDashboardView />}
        {currentView === 'public-reg' && <PublicRegistrationView />}
        {currentView === 'settings' && <SettingsView />}
        {currentView === 'admin' && <AdminPortalView />}
      </main>

      {/* FOOTER rendering rules for auth pages and control room views */}
      {!['landing', 'centres'].includes(currentView) && (
        <footer className="border-t border-border/40 py-6 text-center text-xs font-mono text-muted-foreground space-y-2">
          {['login', 'register'].includes(currentView) ? (
            /* MINIMAL 1-LINE LEGAL BAR FOR AUTH PAGES */
            <div className="text-muted-foreground">
              &copy; {new Date().getFullYear()} Gatehouse Inc. All rights reserved. &bull;{' '}
              <a href="#" className="hover:underline hover:text-foreground">Terms of Service</a> &bull;{' '}
              <a href="#" className="hover:underline hover:text-foreground">Privacy Policy</a>
            </div>
          ) : (
            /* CLEAN ENTERPRISE STATUS BAR FOR CONTROL ROOM VIEWS */
            <div className="space-y-1">
              <div className="flex justify-center items-center gap-3 flex-wrap font-bold text-foreground">
                <span>Gatehouse Enterprise OS</span>
                <span>&bull;</span>
                <span>Secure Access &amp; Venue Operations</span>
                <span>&bull;</span>
                <span className="text-[#38ef7d] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#38ef7d] animate-pulse" />
                  All Systems Operational
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground">
                &copy; {new Date().getFullYear()} Gatehouse Inc. Built for event security &amp; venue control.
              </div>
            </div>
          )}
        </footer>
      )}
    </div>
  );
}

export default App;
