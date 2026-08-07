import { useState } from "react";
import { useGatehouse } from "./context/GatehouseContext";
import { Topbar } from "./components/layout/Topbar";
import { LandingPageView } from "./components/views/LandingPageView";
import { AuthView } from "./components/views/AuthView";
import { DashboardView } from "./components/views/DashboardView";
import { GuestListView } from "./components/views/GuestListView";
import { CheckinView } from "./components/views/CheckinView";
import { WalkinView } from "./components/views/WalkinView";
import { EventCentresView } from "./components/views/EventCentresView";
import { CentreDashboardView } from "./components/views/CentreDashboardView";
import { PublicRegistrationView } from "./components/views/PublicRegistrationView";
import { SettingsView } from "./components/views/SettingsView";
import { AdminPortalView } from "./components/views/AdminPortalView";
import type { ViewRoute } from "./types";

export function App() {
  const { activeTab, setActiveTab } = useGatehouse();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const handleNavigate = (view: ViewRoute) => {
    if (view === "login") {
      setAuthMode("login");
    } else if (view === "register") {
      setAuthMode("register");
    }
    setActiveTab(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentView = activeTab;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* TOPBAR NAVIGATION */}
      <Topbar currentView={currentView} onNavigate={handleNavigate} />

      {/* MAIN VIEW ROUTER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === "landing" && (
          <LandingPageView onNavigate={handleNavigate} />
        )}
        {(currentView === "login" || currentView === "register") && (
          <AuthView mode={authMode} />
        )}
        {currentView === "dashboard" && <DashboardView />}
        {currentView === "guests" && <GuestListView />}
        {currentView === "checkin" && <CheckinView />}
        {currentView === "walkin" && <WalkinView />}
        {currentView === "centres" && <EventCentresView />}
        {currentView === "centre-dash" && <CentreDashboardView />}
        {currentView === "public-reg" && <PublicRegistrationView />}
        {currentView === "settings" && <SettingsView />}
        {currentView === "admin" && <AdminPortalView />}
      </main>

      {/* FOOTER (rendered in LandingPageView for home, or simple bar for app) */}
      {currentView !== "landing" && (
        <footer className="border-t border-border/40 py-8 text-center text-xs font-mono text-muted-foreground space-y-2">
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <span>Gatehouse 2.0 Access Control OS</span>
            <span>•</span>
            <span>Neon PostgreSQL + Vercel Serverless</span>
            <span>•</span>
            <span>Musa AI Gatekeeper Engine</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Gatehouse. Built for event
            security at scale.
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
