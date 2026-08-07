import React from 'react';
import { ShieldCheck, Activity, Cpu, CheckCircle2 } from 'lucide-react';
import { Footer } from '../layout/Footer';
import type { ViewRoute } from '../../types';

interface SecuritySlaViewProps {
  onNavigate?: (view: ViewRoute) => void;
}

export const SecuritySlaView: React.FC<SecuritySlaViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between -mt-4 sm:-mt-6 lg:-mt-8">
      <main className="mx-auto max-w-4xl px-6 py-12 w-full space-y-10">
        
        {/* HEADER BANNER */}
        <div className="space-y-4 border-b border-border/40 pb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#38ef7d]/10 text-[#38ef7d] font-mono text-xs font-bold border border-[#38ef7d]/30">
            <Activity className="h-3.5 w-3.5" />
            99.99% AVAILABILITY &amp; 2.5S SCAN LATENCY SLA
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
            Security Architecture &amp; Service Level Agreement (SLA)
          </h1>
          <p className="text-muted-foreground text-sm font-mono">
            Enterprise Infrastructure SLA • Active Monitoring for High-Density Events in Nigeria
          </p>
        </div>

        {/* SLA CONTENT BODY */}
        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground font-sans">
          
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#38ef7d]" />
              1. System Availability Commitment (99.99% Uptime)
            </h2>
            <p>
              Gatehouse guarantees a 99.99% uptime availability for core gate verification APIs and Musa AI sentinel verification services during scheduled event operations across venue hubs in Nigeria.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <Cpu className="h-5 w-5 text-[#5cbdb9]" />
              2. 2.5-Second QR Scan Throughput SLA
            </h2>
            <p>
              Gatehouse gate scanning endpoints maintain an average verification latency of sub-2.5 seconds per guest pass check-in. In high-density mobile coverage areas, local edge mesh caching guarantees zero-latency gate throughput even during cellular network congestion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              3. Cryptographic HMAC-SHA256 Token Security
            </h2>
            <p>
              All digital QR access passes are signed using cryptographic HMAC-SHA256 keys (<code className="text-[#38ef7d] font-mono font-bold">GATEHOUSE-HMAC-SECURE-KEY-2026</code>). Any attempted tampering, screenshot forgery, or duplicate pass scanning is intercepted and blocked instantly by Musa AI.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#38ef7d]" />
              4. Offline Turnstile Hardware Relay Fallback
            </h2>
            <p>
              In the event of a total internet blackout at physical event facilities, Gatehouse mobile scanner units fallback to local Bluetooth/NFC mesh relays to unlock turnstile gates without interrupting gate entry.
            </p>
          </section>

        </div>

      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
