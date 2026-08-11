import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewRoute;
  onNavigate: (view: ViewRoute) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { currentUser, logoutUser } = useGatehouse();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('gatehouse_sidebar_collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('gatehouse_sidebar_collapsed', isCollapsed ? 'true' : 'false');
  }, [isCollapsed]);

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
    <aside
      className={`shrink-0 border-r border-border/40 bg-navy-900/95 backdrop-blur-xl flex flex-col justify-between min-h-screen p-3 space-y-6 transition-all duration-300 ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* NAVIGATION ITEMS LIST */}
      <div className="space-y-4">
        
        {/* COLLAPSE / EXPAND TOGGLE BAR (NO LOGO) */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-border/40 pb-3 pt-1`}>
          {!isCollapsed && (
            <div className="px-2">
              <span className="text-xs font-bold font-heading uppercase text-foreground tracking-wider">
                Control Room
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="p-2 rounded-xl bg-card/60 hover:bg-card border border-border/60 text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-sm"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* WORKSPACE USER HEADER (EXPANDED ONLY) */}
        {!isCollapsed && (
          <div className="px-2 space-y-0.5">
            <div className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider">
              Active Organization
            </div>
            <div className="text-sm font-bold font-heading text-foreground truncate">
              {currentUser ? currentUser.name : 'Guest Account'}
            </div>
            <div className="text-xs font-mono text-[#5cbdb9] font-bold">
              {currentUser?.role === 'centre'
                ? '🏢 Venue Manager'
                : currentUser?.role === 'admin'
                ? '⚡ System Admin'
                : '🎟️ Event Host'}
            </div>
          </div>
        )}

        {/* NAV LINKS */}
        <nav className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md ring-1 ring-primary/40'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/60'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

      </div>

      {/* FOOTER USER ACCOUNT BAR */}
      <div className="sticky bottom-0 z-20 bg-navy-900/95 backdrop-blur-xl border-t border-border/40 pt-3 pb-3 mt-auto space-y-3">
        <div className={`p-2.5 rounded-2xl bg-card/60 border border-border/60 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="truncate pr-2">
              <div className="text-xs font-bold text-foreground truncate">
                {currentUser?.name || 'User Account'}
              </div>
              <div className="text-[10px] font-mono text-muted-foreground truncate">
                {currentUser?.email || 'Active Session'}
              </div>
            </div>
          )}
          <button
            onClick={logoutUser}
            title="Sign Out"
            className="p-2 rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

    </aside>
  );
};
