import React from 'react';
import { GatehouseProvider, useGatehouse } from './context/GatehouseContext';
import { Topbar } from './components/layout/Topbar';
import { LandingPageView } from './components/views/LandingPageView';
import { DashboardView } from './components/views/DashboardView';
import { GuestListView } from './components/views/GuestListView';
import { CheckinView } from './components/views/CheckinView';
import { WalkinView } from './components/views/WalkinView';
import { EventCentresView } from './components/views/EventCentresView';
import { CentreDashboardView } from './components/views/CentreDashboardView';
import { PublicRegistrationView } from './components/views/PublicRegistrationView';
import { SettingsView } from './components/views/SettingsView';

const MainContent: React.FC = () => {
  const { activeTab } = useGatehouse();

  return (
    <main>
      {activeTab === 'landing' && <LandingPageView />}
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'guests' && <GuestListView />}
      {activeTab === 'checkin' && <CheckinView />}
      {activeTab === 'walkin' && <WalkinView />}
      {activeTab === 'centres' && <EventCentresView />}
      {activeTab === 'centre_portal' && <CentreDashboardView />}
      {activeTab === 'public_reg' && <PublicRegistrationView />}
      {activeTab === 'settings' && <SettingsView />}
    </main>
  );
};

export function App() {
  return (
    <GatehouseProvider>
      <div className="app">
        <Topbar />
        <MainContent />
      </div>
    </GatehouseProvider>
  );
}

export default App;
