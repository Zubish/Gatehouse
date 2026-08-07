import React from 'react';
import { ShieldCheck, CheckCircle2, Lock, Activity } from 'lucide-react';
import { useGatehouse } from '../../context/GatehouseContext';
import type { ViewRoute } from '../../types';

interface FooterProps {
  onNavigate?: (view: ViewRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { currentUser, loginUser } = useGatehouse();

  const handleNav = (v: ViewRoute) => {
    if (onNavigate) onNavigate(v);
  };

  // Feature Click Handler: Automatically logs into Demo Sandbox if not currently signed in!
  const handleFeatureClick = async (targetView: ViewRoute, preferredRole: 'organizer' | 'centre' = 'organizer') => {
    if (!currentUser) {
      const demoEmail = preferredRole === 'centre' ? 'venue@gatehouse.app' : 'demo@gatehouse.app';
      await loginUser(demoEmail, 'password123');
    }
    handleNav(targetView);
  };

  return (
    <footer className="relative border-t border-border/40 bg-navy-900/90 text-foreground pt-16 pb-12 overflow-hidden">
      {/* BACKGROUND BLUEPRINT LINES OVERLAY */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url('/assets/footer_blueprint_1786085147998.jpg')` }}
      />

      <div className="relative mx-auto max-w-7xl px-6 space-y-12">
        {/* TOP BRAND & NAVIGATION GRID */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          
          {/* BRAND COLUMN */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('landing')}>
              <img src="/logo.png" alt="Gatehouse Logo" className="h-8 w-8 object-contain rounded-md" />
              <span className="font-heading text-xl font-bold tracking-tight text-foreground">
                Gatehouse
              </span>
            </div>

            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
              The enterprise 3-sided access management platform connecting Event Facilities, Organizers, and Guests in Nigeria with 2.5s scan velocity and HMAC security.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#5cbdb9]/30 bg-[#5cbdb9]/10 px-3 py-1 text-xs font-mono text-[#5cbdb9]">
              <span className="h-2 w-2 rounded-full bg-[#38ef7d] animate-pulse" />
              System Status: 99.99% Operational
            </div>
          </div>

          {/* PRODUCT COLUMN — AUTO DEMO REDIRECT IF UNAUTHENTICATED */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li>
                <button onClick={() => handleFeatureClick('dashboard', 'organizer')} className="hover:text-foreground transition-colors cursor-pointer text-left">
                  Command Center Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => handleFeatureClick('checkin', 'organizer')} className="hover:text-foreground transition-colors cursor-pointer text-left">
                  Musa AI Gate Sentinel
                </button>
              </li>
              <li>
                <button onClick={() => handleFeatureClick('checkin', 'organizer')} className="hover:text-foreground transition-colors cursor-pointer text-left">
                  2.5s HMAC QR Scanner
                </button>
              </li>
              <li>
                <button onClick={() => handleFeatureClick('centre-dash', 'centre')} className="hover:text-foreground transition-colors cursor-pointer text-left">
                  Multi-Hall Venue Portal
                </button>
              </li>
              <li>
                <button onClick={() => handleFeatureClick('public-reg', 'organizer')} className="hover:text-foreground transition-colors cursor-pointer text-left">
                  Public Link Token Engine
                </button>
              </li>
            </ul>
          </div>

          {/* VENUES DIRECTORY COLUMN */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
              Verified Venues (Nigeria)
            </h4>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li>
                <button onClick={() => handleNav('centres')} className="hover:text-foreground transition-colors cursor-pointer text-left">
                  Lagos Hubs (Ikeja, VI, Lekki, Ojuelegba)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('centres')} className="hover:text-foreground transition-colors cursor-pointer text-left">
                  Abuja FCT (Maitama, Gwarinpa)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('centres')} className="hover:text-foreground transition-colors cursor-pointer text-left">
                  Port Harcourt (GRA Phase 2)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('centres')} className="hover:text-foreground transition-colors cursor-pointer text-left">
                  Ibadan (Bodija, Ring Road)
                </button>
              </li>
            </ul>
          </div>

          {/* SECURITY & TRUST COLUMN */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
              Security &amp; Integrity
            </h4>
            <ul className="space-y-2 text-xs font-medium text-muted-foreground">
              <li className="flex items-center gap-1.5 text-[#38ef7d]">
                <ShieldCheck className="h-3.5 w-3.5" />
                HMAC Token Encryption
              </li>
              <li className="flex items-center gap-1.5 text-[#5cbdb9]">
                <Activity className="h-3.5 w-3.5" />
                Offline Edge Mesh Cache
              </li>
              <li className="flex items-center gap-1.5 text-foreground">
                <Lock className="h-3.5 w-3.5 text-primary" />
                Audit Trail Security Logs
              </li>
              <li className="flex items-center gap-1.5 text-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#38ef7d]" />
                Duplicate Scan Blocking
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & LEGAL BAR WITH WORKING LINKS */}
        <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <p>© {new Date().getFullYear()} Gatehouse Technologies Nigeria Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => handleNav('privacy-policy')} className="hover:text-foreground cursor-pointer transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => handleNav('terms-of-service')} className="hover:text-foreground cursor-pointer transition-colors">
              Terms of Service
            </button>
            <button onClick={() => handleNav('security-sla')} className="hover:text-foreground cursor-pointer transition-colors">
              Security SLA
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
