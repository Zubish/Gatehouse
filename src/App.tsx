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
    <div className="min-h-screen bg-[#080c14] text-[#EDEFF3] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* BACKGROUND AMBIENT GLOW ORBS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#3ED98A]/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#11998e]/10 rounded-full blur-[120px]" />
      </div>

      {/* TOPBAR NAVIGATION */}
      <div className="relative z-20 border-b border-[#262D38]/80 bg-[#080c14]/90 backdrop-blur-md sticky top-0">
        <Topbar currentView={currentView} onNavigate={handleNavigate} />
      </div>

      {/* MAIN VIEW ROUTER */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'landing' && <LandingPageView />}
        {(currentView === 'login' || currentView === 'register') && (
          <AuthView mode={authMode} />
        )}
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'guests' && <GuestListView />}
        {currentView === 'checkin' && <CheckinView />}
        {currentView === 'walkin' && <WalkinView />}
        {currentView === 'centres' && <EventCentresView />}
        {currentView === 'centre-dash' && <CentreDashboardView />}
        {currentView === 'public-reg' && <PublicRegistrationView />}
        {currentView === 'settings' && <SettingsView />}
        {currentView === 'admin' && <AdminPortalView />}
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#262D38] py-8 text-center text-xs font-mono text-[#8B93A3] space-y-2">
        <div className="flex justify-center items-center gap-4">
          <span>Gatehouse 2.0 Access Control OS</span>
          <span>•</span>
          <span>Neon PostgreSQL + Vercel Serverless</span>
          <span>•</span>
          <span>Enterprise HMAC Cryptographic Standard</span>
        </div>
        <div>
          &copy; 2026 Gatehouse Technologies Inc. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
