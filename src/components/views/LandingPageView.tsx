import React, { useState } from 'react';
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Check,
  Clock,
  Radio,
  ShieldCheck,
  Users,
  Sparkles,
  Activity,
} from 'lucide-react';
import type { ViewRoute } from '../../types';
import { Footer } from '../layout/Footer';

interface LandingPageViewProps {
  onNavigate?: (view: ViewRoute) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onNavigate }) => {
  const handleNav = (v: ViewRoute) => {
    if (onNavigate) onNavigate(v);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between -mt-4 sm:-mt-6 lg:-mt-8">
      <main className="space-y-16 lg:space-y-28 pb-12">
        {/* HERO SECTION WITH IMAGE 1 */}
        <HeroSection onNavigate={handleNav} />

        {/* MEET MUSA AI SECTION WITH IMAGE 5 */}
        <MeetMusaAiSection onNavigate={handleNav} />

        {/* PLATFORM OVERVIEW WITH IMAGE 2 */}
        <PlatformOverviewSection />

        {/* SMART VENUE MANAGEMENT WITH IMAGE 3 */}
        <SmartVenueSection />

        {/* FAST CHECK-IN & MOBILE SCANNER WITH IMAGE 4 */}
        <MobileScannerSection />

        {/* ANALYTICS INTELLIGENCE WITH IMAGE 6 */}
        <AnalyticsIntelligenceSection />

        {/* ECOSYSTEM CONNECTED ARCHITECTURE WITH IMAGE 7 */}
        <EcosystemSection />

        {/* EMOTIONAL BRANDING WITH IMAGE 8 */}
        <EmotionalBrandingSection />

        {/* ENTERPRISE INTEGRATIONS WITH IMAGE 9 */}
        <EnterpriseIntegrationsSection />

        {/* AUDIENCE & 3 REGISTRATION PATHS */}
        <AudienceAndPathsSection />

        {/* INTERACTIVE CALCULATOR */}
        <CalculatorSection />

        {/* CLOSING CTA WITH IMAGE 10 */}
        <CTASection onNavigate={handleNav} />
      </main>

      {/* REUSABLE ENTERPRISE FOOTER */}
      <Footer onNavigate={handleNav} />
    </div>
  );
};

/* ---------------- HERO SECTION (IMAGE 1) ---------------- */
function HeroSection({ onNavigate }: { onNavigate: (v: ViewRoute) => void }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 lg:py-16">
      <div className="absolute inset-0 subtle-grid" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
          
          {/* LEFT 7-COL BENTO CARD */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8 rounded-3xl border border-border/60 bg-card/40 p-8 lg:p-12 card-glow">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/60 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-[#5cbdb9] animate-ping" />
                3-Sided Event Access &amp; Venue Control
              </span>

              <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Flawless Access. <br />
                <span className="text-gradient">Unbreakable Control.</span> <br />
                Zero Long Queues.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                The enterprise access management suite connecting{' '}
                <span className="font-medium text-foreground">Event Centres</span>,{' '}
                <span className="font-medium text-foreground">Organizers</span>, and{' '}
                <span className="font-medium text-foreground">Guests</span> seamlessly. Accelerate
                entry with signed HMAC QR passes, 2.5-second scans, and robust offline resilience.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                onClick={() => onNavigate('login')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md cursor-pointer group"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="inline-flex items-center justify-center rounded-full border border-border/60 bg-card px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary cursor-pointer"
              >
                Sign In to Account
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-border/40 pt-8">
              <Stat value="2.5s" label="Avg Scan Speed" />
              <Stat value="99.9%" label="Offline Mesh Uptime" />
              <Stat value="100k+" label="HMAC Passes Validated" />
            </div>
          </div>

          {/* RIGHT 5-COL BENTO CARD (IMAGE 1: HERO COMMAND CENTER) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative flex-1 overflow-hidden rounded-3xl border border-border/60 bg-card/40 card-glow group">
              <img
                src="/assets/hero_command_center_1786085006377.jpg"
                alt="Gatehouse Command Center Operations Dashboard"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-navy-900/90 backdrop-blur-md border border-border/60 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#38ef7d] animate-pulse" />
                  <span className="font-bold text-white">Musa AI Active Watch</span>
                </div>
                <span className="text-[#5cbdb9]">8 Gates Monitored</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border/60 bg-secondary/60 p-5">
                <div className="flex items-center gap-2 text-[#5cbdb9]">
                  <Radio className="h-4 w-4 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Live Gate</span>
                </div>
                <p className="mt-2 font-heading text-2xl font-semibold">42 guests/min</p>
                <p className="mt-1 text-xs text-muted-foreground">Entry velocity at Gate A</p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-secondary/60 p-5">
                <div className="flex items-center gap-2 text-[#38ef7d]">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Sync Status</span>
                </div>
                <p className="mt-2 font-heading text-2xl font-semibold">Edge Mesh</p>
                <p className="mt-1 text-xs text-muted-foreground">Active across 12 nodes</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-heading text-2xl font-bold text-foreground sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

/* ---------------- MEET MUSA AI SECTION (IMAGE 5) ---------------- */
function MeetMusaAiSection({ onNavigate }: { onNavigate: (v: ViewRoute) => void }) {
  return (
    <section id="meet-musa-ai" className="relative px-6">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-navy-800/80 via-navy-900 to-navy-800/60 p-8 lg:p-14 card-glow">
          
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            
            {/* STORYTEXT LEFT */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#5cbdb9]">
                <Sparkles className="h-4 w-4" />
                The Story Behind the Intelligence
              </span>

              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
                Every gate has a story. <br />
                <span className="text-gradient">Meet Musa AI.</span>
              </h2>

              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                Inspired by the iconic Nigerian proverb <em className="text-foreground font-medium">"Wetin Musa no go see for gate?"</em> — meaning the gatekeeper who has seen it all: experience, vigilance, and unbreakable watchfulness.
              </p>

              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                Some gates end in bottleneck queues. Others in fake tickets or gate crashes. Around here, <strong className="text-foreground">Musa AI</strong> watches every entrance, flags suspicious duplicate scans in real-time, predicts venue congestion, and instructs ushers before queues build up.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl border border-border/60 bg-navy-900/60 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5cbdb9]">
                    <ShieldCheck className="h-4 w-4" />
                    Vigilant Sentinel
                  </div>
                  <div className="text-xs text-muted-foreground">Validates cryptographically signed HMAC passes instantly.</div>
                </div>

                <div className="p-4 rounded-2xl border border-border/60 bg-navy-900/60 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#38ef7d]">
                    <Activity className="h-4 w-4" />
                    Predictive Velocity
                  </div>
                  <div className="text-xs text-muted-foreground">Predicts gate lane bottlenecks 12 minutes before congestion hits.</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 cursor-pointer"
                >
                  Explore Musa AI Gate Sentinel
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* IMAGE 5: MUSA AI ASSISTANT RIGHT */}
            <div className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-navy-900 shadow-2xl group">
                <img
                  src="/assets/musa_ai_assistant_1786085062160.jpg"
                  alt="Musa AI Intelligent Assistant Interface"
                  className="w-full h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent p-6 flex flex-col justify-end">
                  <div className="p-4 rounded-2xl bg-navy-900/90 backdrop-blur-md border border-border/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xs font-bold text-[#5cbdb9]">MUSA AI CONGESTION ALERT</span>
                      <span className="text-[10px] font-mono text-muted-foreground">PREDICTION +41%</span>
                    </div>
                    <p className="text-xs font-mono text-white">"Gate B is becoming congested. Opening overflow Gate D (Lane 3) recommended."</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

/* ---------------- PLATFORM OVERVIEW SECTION (IMAGE 2) ---------------- */
function PlatformOverviewSection() {
  return (
    <section id="platform-overview" className="px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#5cbdb9] font-bold">
            PLATFORM OVERVIEW
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Complete Event Operations Command Center
          </h2>
          <p className="text-muted-foreground text-base">
            From single-room conferences to 50,000-seat stadiums, Gatehouse provides total operational awareness across every door.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-4 lg:p-6 card-glow">
          <img
            src="/assets/event_ops_dashboard_1786085019963.jpg"
            alt="Event Operations Desktop Dashboard"
            className="w-full h-[420px] lg:h-[540px] object-cover rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------- SMART VENUE MANAGEMENT (IMAGE 3) ---------------- */
function SmartVenueSection() {
  return (
    <section className="px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8 items-center rounded-3xl border border-border/60 bg-card/40 p-8 lg:p-12 card-glow">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono uppercase tracking-wider text-[#38ef7d] font-bold">
              SMART VENUE MAP INTELLIGENCE
            </span>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Visualize Crowd Flow in Real Time
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Orchestrate multiple halls, VIP lounges, emergency exit routes, and staff lanes on an interactive 3D floorplan heatmap.
            </p>
            <ul className="space-y-3 font-mono text-xs">
              <li className="flex items-center gap-2 text-foreground">
                <Check className="h-4 w-4 text-[#38ef7d]" /> Multi-Hall Space Partitioning
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <Check className="h-4 w-4 text-[#38ef7d]" /> Real-time Crowd Density Heatmaps
              </li>
              <li className="flex items-center gap-2 text-foreground">
                <Check className="h-4 w-4 text-[#38ef7d]" /> Automatic Usher Allocation
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <img
              src="/assets/venue_map_intelligence_1786085035346.jpg"
              alt="Interactive Venue Map Intelligence"
              className="w-full h-80 lg:h-96 object-cover rounded-2xl border border-border/60"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ---------------- MOBILE SCANNER APP (IMAGE 4) ---------------- */
function MobileScannerSection() {
  return (
    <section className="px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8 items-center rounded-3xl border border-border/60 bg-card/40 p-8 lg:p-12 card-glow">
          
          <div className="lg:col-span-6 order-2 lg:order-1">
            <img
              src="/assets/mobile_scanner_app_1786085048210.jpg"
              alt="Gatehouse Mobile Scanner App in Action"
              className="w-full h-80 lg:h-96 object-cover rounded-2xl border border-border/60"
            />
          </div>

          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#5cbdb9] font-bold">
              FIELD OPERATIONS MOBILE APP
            </span>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              2.5-Second Gate Clearance Velocity
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ushers scan attendee passes with laser speed. Even if venue Wi-Fi drops completely, edge devices validate signed HMAC QR tokens offline.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-navy-900 border border-border/40">
                <div className="font-heading text-2xl font-bold text-[#5cbdb9]">&lt;2.5s</div>
                <div className="text-xs text-muted-foreground font-mono">Scan Verification</div>
              </div>
              <div className="p-4 rounded-2xl bg-navy-900 border border-border/40">
                <div className="font-heading text-2xl font-bold text-[#38ef7d]">100%</div>
                <div className="text-xs text-muted-foreground font-mono">Offline Edge Mesh</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ---------------- ANALYTICS INTELLIGENCE (IMAGE 6) ---------------- */
function AnalyticsIntelligenceSection() {
  return (
    <section className="px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8 items-center rounded-3xl border border-border/60 bg-card/40 p-8 lg:p-12 card-glow">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-mono uppercase tracking-wider text-[#5cbdb9] font-bold">
              EXECUTIVE ANALYTICS INTELLIGENCE
            </span>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Post-Event Audit &amp; Attendance Insights
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Track VIP vs Regular arrival velocity, peak entry hours, fraud attempt prevention logs, and download audit reports in one click.
            </p>
            <div className="p-4 rounded-2xl bg-navy-900 border border-border/40 font-mono text-xs text-muted-foreground space-y-1">
              <div>CSV Audit Export: <span className="text-foreground">Attendance_Audit_Report.csv</span></div>
              <div>Security Verification: <span className="text-[#38ef7d]">Zero Duplicate Passes Allowed</span></div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <img
              src="/assets/analytics_intelligence_1786085075530.jpg"
              alt="Executive Analytics Intelligence Dashboard"
              className="w-full h-80 lg:h-96 object-cover rounded-2xl border border-border/60"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ---------------- ECOSYSTEM SECTION (IMAGE 7) ---------------- */
function EcosystemSection() {
  return (
    <section className="px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#5cbdb9] font-bold">
            CONNECTED ECOSYSTEM ARCHITECTURE
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            How Gatehouse Connects Every Stakeholder
          </h2>
          <p className="text-muted-foreground text-base">
            Organizers, Event Facilities, Musa AI, Security Ushers, and Guests operating on a single unified platform.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-4 lg:p-6 card-glow">
          <img
            src="/assets/ecosystem_diagram_1786085092807.jpg"
            alt="Gatehouse Connected Ecosystem Architecture Diagram"
            className="w-full h-[380px] lg:h-[460px] object-cover rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------- EMOTIONAL BRANDING (IMAGE 8) ---------------- */
function EmotionalBrandingSection() {
  return (
    <section className="px-6">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-navy-900 card-glow">
          <img
            src="/assets/nothing_gets_past_gate_1786085106951.jpg"
            alt="Nothing Gets Past the Gate Emotional Brand Visual"
            className="w-full h-[400px] lg:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-transparent p-8 lg:p-14 flex flex-col justify-end max-w-2xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#5cbdb9] font-bold">
              UNBREAKABLE SECURITY
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
              Nothing Gets Past the Gate.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              When thousands of guests arrive, your entrance gate is your brand statement. Gatehouse guarantees security, speed, and peace of mind.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- ENTERPRISE INTEGRATIONS (IMAGE 9) ---------------- */
function EnterpriseIntegrationsSection() {
  return (
    <section className="px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#5cbdb9] font-bold">
            ENTERPRISE INTEGRATIONS
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Integrates with Your Existing Stack
          </h2>
          <p className="text-muted-foreground text-base">
            Connect payment gateways, calendars, team chat, and custom webhooks effortlessly.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-4 lg:p-6 card-glow">
          <img
            src="/assets/enterprise_integrations_1786085121603.jpg"
            alt="Enterprise Payment & Software Integrations"
            className="w-full h-[360px] lg:h-[440px] object-cover rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------- AUDIENCE & 3 REGISTRATION PATHS ---------------- */
function AudienceAndPathsSection() {
  const audiences = [
    {
      icon: Building2,
      title: "Event Centres",
      description: "Control every gate, lane, and entry point from a single operational layer.",
      features: ["Multi-gate orchestration", "Offline fallback", "Real-time capacity"],
    },
    {
      icon: CalendarCheck,
      title: "Organizers",
      description: "Build events, invite teams, and delegate access without engineering support.",
      features: ["Delegated permissions", "Pass analytics", "Guest segmentation"],
    },
    {
      icon: Users,
      title: "Guests",
      description: "Receive secure, wallet-ready passes that scan in under three seconds.",
      features: ["HMAC-signed QR passes", "Instant QR Pass generation", "Express entrance"],
    },
  ];

  const paths = [
    {
      step: "01",
      title: "Direct Import",
      description: "Sync existing guest lists via API or CSV. Bulk-import thousands of VIPs in seconds.",
    },
    {
      step: "02",
      title: "Delegated Access",
      description: "Let sponsors, vendors, and venue teams issue passes within your established access policies.",
    },
    {
      step: "03",
      title: "Public Link",
      description: "Open a controlled public registration page with real-time capacity cap enforcement.",
    },
  ];

  return (
    <section id="audience-paths" className="px-6 space-y-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Built for every side of the door
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Gatehouse aligns the three parties that make an event run: the venue, the organizer, and the guest.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {audiences.map((audience) => (
            <div
              key={audience.title}
              className="group flex flex-col justify-between rounded-3xl border border-border/60 bg-card/40 p-8 transition-all hover:border-primary/30 hover:bg-card/60 card-glow"
            >
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary">
                  <audience.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-heading text-xl font-semibold">{audience.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {audience.description}
                </p>
              </div>
              <ul className="mt-8 space-y-3">
                {audience.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#5cbdb9]" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 3 REGISTRATION PATHS */}
      <div className="mx-auto max-w-7xl">
        <div className="border-t border-border/40 pt-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              3 Flexible Registration Paths
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Gatehouse provides complete operational freedom for any event workflow.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {paths.map((path) => (
              <div
                key={path.step}
                className="relative rounded-3xl border border-border/60 bg-background p-8 transition-all hover:border-primary/30"
              >
                <span className="font-heading text-5xl font-bold text-border/80">{path.step}</span>
                <h3 className="mt-4 font-heading text-xl font-semibold">{path.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{path.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- INTERACTIVE CALCULATOR SECTION ---------------- */
function CalculatorSection() {
  const [guestsCount, setGuestsCount] = useState(1500);
  const [gatesCount, setGatesCount] = useState(4);

  const avgScanTimeSec = 2.5;
  const throughputPerGatePerMin = 60 / avgScanTimeSec;
  const totalThroughputPerMin = throughputPerGatePerMin * gatesCount;
  const totalEntryTimeMinutes = Math.round(guestsCount / totalThroughputPerMin);

  return (
    <section id="calculator-section" className="px-6">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-border/60 bg-card/40 p-8 lg:p-12 card-glow space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-[#5cbdb9] font-bold">
              INTERACTIVE THROUGHPUT CALCULATOR
            </span>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Calculate Your Gate Clearance Velocity
            </h2>
            <p className="mt-2 text-muted-foreground">
              See how Gatehouse 2.5-second scans clear attendee crowds in record time.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-heading font-bold">
                  <span>Expected Attendees</span>
                  <span className="text-[#5cbdb9]">{guestsCount.toLocaleString()} Guests</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="10000"
                  step="100"
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-navy-900 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-heading font-bold">
                  <span>Active Gate Lanes</span>
                  <span className="text-[#38ef7d]">{gatesCount} Lanes</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  step="1"
                  value={gatesCount}
                  onChange={(e) => setGatesCount(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-navy-900 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl border border-border/60 bg-navy-900 space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Estimated Clearance Time
              </div>
              <div className="font-heading text-4xl font-extrabold text-[#38ef7d]">
                {totalEntryTimeMinutes} Minutes
              </div>
              <div className="text-xs font-mono text-muted-foreground border-t border-border/40 pt-3 space-y-1">
                <div>Total Velocity: <strong className="text-foreground">{Math.round(totalThroughputPerMin)} guests/min</strong></div>
                <div>Per Lane: <strong className="text-foreground">24 guests/min</strong> (at 2.5s/scan)</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

/* ---------------- CLOSING CTA SECTION (IMAGE 10) ---------------- */
function CTASection({ onNavigate }: { onNavigate: (v: ViewRoute) => void }) {
  return (
    <section className="px-6">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-navy-900 p-8 lg:p-14 card-glow">
          <img
            src="/assets/closing_cta_venue_1786085136089.jpg"
            alt="Futuristic Stadium Gate Entrance"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl text-foreground">
              Ready to eliminate entry friction?
            </h2>
            <p className="text-lg text-muted-foreground">
              Start issuing signed passes and controlling gates in minutes — not weeks.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('login')}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 cursor-pointer"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 backdrop-blur-md px-8 py-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary cursor-pointer"
              >
                Talk to Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
