import React from 'react';
import { useGatehouse } from '../../context/GatehouseContext';
import { ShieldAlert, Server, Database, Activity, Building, Users, Calendar } from 'lucide-react';

export const AdminPortalView: React.FC = () => {
  const { eventCentres, events, guests, bookings } = useGatehouse();

  return (
    <section className="view active space-y-8" id="view-admin">
      
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive font-mono text-xs font-bold border border-destructive/30">
            <ShieldAlert className="h-3.5 w-3.5" />
            SYSTEM MASTER CONTROL ROOM
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            Gatehouse Platform Admin Control
          </h2>
          <p className="text-xs font-mono text-muted-foreground">
            Master Infrastructure Status • Database Connections &amp; License Verifications
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-[#38ef7d]/30 bg-[#38ef7d]/10 px-3.5 py-1.5 text-xs font-mono text-[#38ef7d]">
          <span className="h-2 w-2 rounded-full bg-[#38ef7d] animate-pulse" />
          Neon PostgreSQL Connected • 99.99% SLA Uptime
        </div>
      </div>

      {/* MASTER METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-2 card-glow">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono uppercase font-bold">Active Events</span>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-foreground">{events.length}</div>
          <div className="text-[10px] font-mono text-muted-foreground">Platform Registered Events</div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-2 card-glow">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono uppercase font-bold">Verified Venues</span>
            <Building className="h-4 w-4 text-[#5cbdb9]" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-foreground">{eventCentres.length}</div>
          <div className="text-[10px] font-mono text-muted-foreground">Nigerian Event Facilities</div>
        </div>

        <div className="rounded-3xl border border-[#38ef7d]/40 bg-card/60 p-6 space-y-2 card-glow">
          <div className="flex items-center justify-between text-[#38ef7d]">
            <span className="text-xs font-mono uppercase font-bold">Issued Guest Passes</span>
            <Users className="h-4 w-4 text-[#38ef7d]" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-[#38ef7d]">{guests.length}</div>
          <div className="text-[10px] font-mono text-muted-foreground">Cryptographic QR Tokens</div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-2 card-glow">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono uppercase font-bold">Booking Requests</span>
            <Activity className="h-4 w-4 text-amber-400" />
          </div>
          <div className="font-heading text-3xl font-extrabold text-foreground">{bookings.length}</div>
          <div className="text-[10px] font-mono text-muted-foreground">Venue Reservations</div>
        </div>

      </div>

      {/* DATABASE & SYSTEM HEALTH PANEL */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* DATABASE STATUS */}
        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-4 card-glow">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-[#38ef7d]" />
              <h3 className="font-heading text-base font-bold text-foreground">Database Engine Health</h3>
            </div>
            <span className="text-xs font-mono text-[#38ef7d]">Connected</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-navy-900 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">Primary Database Provider</span>
              <span className="text-foreground font-bold">Neon Serverless PostgreSQL</span>
            </div>
            <div className="p-3 rounded-2xl bg-navy-900 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">Connection Pool Size</span>
              <span className="text-foreground font-bold">20 Max Connections</span>
            </div>
            <div className="p-3 rounded-2xl bg-navy-900 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">SSL Encryption</span>
              <span className="text-[#38ef7d] font-bold">TLS 1.3 Active</span>
            </div>
          </div>
        </div>

        {/* SECURITY & COMPLIANCE */}
        <div className="rounded-3xl border border-border/60 bg-card/60 p-6 space-y-4 card-glow">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-[#5cbdb9]" />
              <h3 className="font-heading text-base font-bold text-foreground">Statutory &amp; Data Compliance</h3>
            </div>
            <span className="text-xs font-mono text-[#5cbdb9]">NDPA 2023 Compliant</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-navy-900 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">Jurisdiction Realm</span>
              <span className="text-foreground font-bold">Federal Republic of Nigeria</span>
            </div>
            <div className="p-3 rounded-2xl bg-navy-900 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">Data Controller Reg</span>
              <span className="text-foreground font-bold">NDPC Registered</span>
            </div>
            <div className="p-3 rounded-2xl bg-navy-900 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">Pass Signature Security</span>
              <span className="text-[#38ef7d] font-bold">HMAC-SHA256 Protocol</span>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
