import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useGatehouse } from '../../context/GatehouseContext';
import { LandingPageView } from '../views/LandingPageView';
import { AuthView } from '../views/AuthView';
import { DashboardView } from '../views/DashboardView';
import { GuestListView } from '../views/GuestListView';
import { CheckinView } from '../views/CheckinView';
import { WalkinView } from '../views/WalkinView';
import { EventCentresView } from '../views/EventCentresView';
import { CentreDashboardView } from '../views/CentreDashboardView';
import { PublicRegistrationView } from '../views/PublicRegistrationView';
import { MyPassesView } from '../views/MyPassesView';
import { SettingsView } from '../views/SettingsView';
import { AdminPortalView } from '../views/AdminPortalView';
import { PrivacyPolicyView } from '../views/PrivacyPolicyView';
import { TermsOfServiceView } from '../views/TermsOfServiceView';
import { SecuritySlaView } from '../views/SecuritySlaView';
import type { ViewRoute } from '../../types';

interface GuardProps {
  children: React.ReactNode;
}

// Protected Route Guard for Control Room Views
const ProtectedRoute: React.FC<GuardProps> = ({ children }) => {
  const { currentUser, loading } = useGatehouse();
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400 font-mono text-xs">
        Authenticating session...
      </div>
    );
  }
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Admin Route Guard for /admin: Revokes non-admin sessions & renders Admin Password Gate cleanly on FIRST attempt
const AdminRoute: React.FC = () => {
  const { currentUser, logoutUser, loading } = useGatehouse();

  useEffect(() => {
    if (!loading && currentUser && currentUser.role !== 'admin') {
      logoutUser();
    }
  }, [currentUser, loading, logoutUser]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400 font-mono text-xs">
        Verifying Admin Access...
      </div>
    );
  }

  return <AdminPortalView />;
};

export const AppRoutes: React.FC<{ onNavigate?: (view: ViewRoute) => void }> = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPageView />} />
      <Route path="/login" element={<AuthView mode="login" />} />
      <Route path="/register" element={<AuthView mode="register" />} />
      <Route path="/public-reg" element={<PublicRegistrationView />} />
      <Route path="/my-passes" element={<MyPassesView />} />
      <Route path="/centres" element={<EventCentresView />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyView />} />
      <Route path="/terms-of-service" element={<TermsOfServiceView />} />
      <Route path="/security-sla" element={<SecuritySlaView />} />

      {/* Admin Route with First-Try Password Gate Resolution */}
      <Route path="/admin" element={<AdminRoute />} />

      {/* Protected Control Room Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/guests"
        element={
          <ProtectedRoute>
            <GuestListView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkin"
        element={
          <ProtectedRoute>
            <CheckinView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/walkin"
        element={
          <ProtectedRoute>
            <WalkinView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/centre-dash"
        element={
          <ProtectedRoute>
            <CentreDashboardView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsView />
          </ProtectedRoute>
        }
      />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
