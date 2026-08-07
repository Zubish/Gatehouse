import { useState } from 'react';
import { useGatehouse } from './context/GatehouseContext';
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
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
import { PrivacyPolicyView } from './components/views/PrivacyPolicyView';
import { TermsOfServiceView } from './components/views/TermsOfServiceView';
import { SecuritySlaView } from './components/views/SecuritySlaView';
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

  // Pages where footer is explicitly allowed: ONLY landing, login, register, privacy-policy, terms-of-service, security-sla
  const isFooterAllowedPage = [
    'landing',
    'login',
    'register',
    'privacy-policy',
    'terms-of-service',
    'security-sla',
  ].includes(currentView);

  // Pages that use the full-width layout without sidebar
  const isPublicFullWidthPage = [
    'landing',
    'login',
    'register',
    'privacy-policy',
    'terms-of-service',
    'security-sla',
  ].includes(currentView);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* TOPBAR NAVIGATION */}
      <Topbar currentView={currentView} onNavigate={handleNavigate} />

      {/* APP BODY LAYOUT */}
      <div className="flex-1 flex w-full">
        
        {/* LEFT SIDEBAR NAVIGATION (For Control Room App Views Only) */}
        {!isPublicFullWidthPage && (
          <Sidebar currentView={currentView} onNavigate={handleNavigate} />
        )}

        {/* MAIN VIEW CONTENT CONTAINER */}
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

          {/* DEDICATED NIGERIAN LAW LEGAL PAGES */}
          {currentView === 'privacy-policy' && (
            <PrivacyPolicyView onNavigate={handleNavigate} />
          )}
          {currentView === 'terms-of-service' && (
            <TermsOfServiceView onNavigate={handleNavigate} />
          )}
          {currentView === 'security-sla' && (
            <SecuritySlaView onNavigate={handleNavigate} />
          )}
        </main>
      </div>

      {/* FOOTER - REMOVED FROM ALL CONTROL ROOM VIEWS, ALLOWED ONLY ON LANDING AND AUTH/LEGAL PAGES */}
      {isFooterAllowedPage && !['landing', 'privacy-policy', 'terms-of-service', 'security-sla'].includes(currentView) && (
        <footer className="border-t border-border/40 py-6 text-center text-xs font-mono text-muted-foreground">
          <div className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Gatehouse Inc. All rights reserved. &bull;{' '}
            <button onClick={() => handleNavigate('terms-of-service')} className="hover:underline hover:text-foreground cursor-pointer">
              Terms of Service
            </button>{' '}
            &bull;{' '}
            <button onClick={() => handleNavigate('privacy-policy')} className="hover:underline hover:text-foreground cursor-pointer">
              Privacy Policy
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
