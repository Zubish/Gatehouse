import React from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import type { ViewRoute } from '../../types';
import {
  LayoutDashboard,
  Users,
  QrCode,
  UserPlus,
  Building2,
  Building,
  Link,
  Settings,
  ShieldAlert,
  LogOut,
  Home,
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewRoute;
  onNavigate: (view: ViewRoute) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { currentUser, logoutUser } = useGatehouse();

  // Primary Control Room Navigation Items
  const navItems = [
    {
      id: 'dashboard' as ViewRoute,
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['organizer', 'centre', 'admin', 'staff'],
    },
    {
      id: 'guests' as ViewRoute,
      label: 'Guest List',
      icon: Users,
      roles: ['organizer', 'admin', 'staff'],
    },
    {
      id: 'checkin' as ViewRoute,
      label: 'Gate Scanner',
      icon: QrCode,
      roles: ['organizer', 'centre', 'admin', 'staff'],
    },
    {
      id: 'walkin' as ViewRoute,
      label: 'Walk-In Entry',
      icon: UserPlus,
      roles: ['organizer', 'admin', 'staff'],
    },
    {
      id: 'centres' as ViewRoute,
      label: 'Book Venues',
      icon: Building2,
      roles: ['organizer', 'admin', 'staff'],
    },
    {
      id: 'centre-dash' as ViewRoute,
      label: 'Venue Portal',
      icon: Building,
      roles: ['centre', 'admin'],
    },
    {
      id: 'public-reg' as ViewRoute,
      label: 'Public Self-Reg',
      icon: Link,
      roles: ['organizer', 'admin'],
    },
    {
      id: 'settings' as ViewRoute,
      label: 'Settings',
      icon: Settings,
      roles: ['organizer', 'centre', 'admin', 'staff'],
    },
    {
      id: 'admin' as ViewRoute,
      label: 'System Admin',
      icon: ShieldAlert,
      roles: ['admin'],
    },
  ];

  // Filter items relevant to current user role
  const visibleItems = navItems.filter((item) =>
    currentUser?.role ? item.roles.includes(currentUser.role) || currentUser.role === 'admin' : true
  );

  return (
    <aside className="w-64 shrink-0 border-r border-border/40 bg-navy-900/95 backdrop-blur-xl flex flex-col justify-between min-h-screen p-4 space-y-6">
      
      {/* NAVIGATION ITEMS LIST */}
      <div className="space-y-6">
        
        {/* BRAND LOGO HEADER IN SIDEBAR */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer group border-b border-border/40 pb-4"
        >
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center transition-transform group-hover:scale-105">
            <img src="/logo.png" alt="Gatehouse Logo" className="h-full w-full object-contain rounded-lg" />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight text-foreground">
            Gatehouse
          </span>
        </div>

        {/* WORKSPACE USER HEADER */}
        <div className="px-3 py-1 space-y-1">
          <div className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider">
            Workspace Control Room
          </div>
          <div className="text-sm font-bold font-heading text-foreground truncate">
            {currentUser ? currentUser.name : 'Guest User'}
          </div>
          <div className="text-xs font-mono text-[#5cbdb9] font-bold">
            {currentUser?.role === 'centre'
              ? '🏢 Venue Manager'
              : currentUser?.role === 'admin'
              ? '⚡ System Admin'
              : '🎟️ Event Host'}
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md ring-1 ring-primary/40'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/60'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => onNavigate('landing')}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all cursor-pointer mt-4"
          >
            <Home className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">Public Home</span>
          </button>
        </nav>

      </div>

      {/* FOOTER USER ACCOUNT BAR */}
      <div className="pt-4 border-t border-border/40 space-y-3">
        <div className="p-3 rounded-2xl bg-card/60 border border-border/60 flex items-center justify-between">
          <div className="truncate pr-2">
            <div className="text-xs font-bold text-foreground truncate">
              {currentUser?.name || 'Account'}
            </div>
            <div className="text-[10px] font-mono text-muted-foreground truncate">
              {currentUser?.email || 'Not signed in'}
            </div>
          </div>
          <button
            onClick={logoutUser}
            title="Sign Out"
            className="p-2 rounded-xl text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

    </aside>
  );
};
