import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarCheck,
  Check,
  Clock,
  Lock,
  QrCode,
  Radio,
  ShieldCheck,
  Users,
  Zap,
  Sparkles,
  Bot,
  MessageSquare,
  Cpu,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import type { ViewRoute } from '../../types';

interface LandingPageViewProps {
  onNavigate?: (view: ViewRoute) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onNavigate }) => {
  const handleNav = (v: ViewRoute) => {
    if (onNavigate) onNavigate(v);
  };

  return (
    <div className="min-h-screen bg-background text-foreground space-y-16 lg:space-y-24 -mt-4 sm:-mt-6 lg:-mt-8">
      {/* HERO SECTION */}
      <HeroSection onNavigate={handleNav} />

      {/* MEET MUSA AI STORYTELLING SECTION */}
      <MeetMusaAiSection onNavigate={handleNav} />

      {/* AUDIENCE SECTION */}
      <AudienceSection />

      {/* 3 REGISTRATION PATHS SECTION */}
      <PathsSection />

      {/* CORE FEATURES SECTION */}
      <FeatureSection />

      {/* INTERACTIVE CALCULATOR SECTION */}
      <CalculatorSection />

      {/* CTA SECTION */}
      <CTASection onNavigate={handleNav} />
    </div>
  );
};

/* ---------------- HERO SECTION ---------------- */
function HeroSection({ onNavigate }: { onNavigate: (v: ViewRoute) => void }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 lg:py-16">
      <div className="absolute inset-0 subtle-grid" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
          
          {/* LEFT 7-COL BENTO CARD */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8 rounded-3xl border border-border/60 bg-card/40 p-8 lg:p-12 card-glow">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/60 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5cbdb9] animate-ping" />
                Gatehouse 2.0 · 3-Sided Event Access &amp; Venue Control
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
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md cursor-pointer"
              >
                Get Started with Control Room
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="inline-flex items-center justify-center rounded-full border border-border/60 bg-card px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary cursor-pointer"
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

          {/* RIGHT 5-COL BENTO CARD */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* LIVE COMMAND MONITOR PANEL */}
            <div className="relative flex-1 overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-6 card-glow flex flex-col justify-between space-y-4">
              
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5cbdb9] animate-pulse" />
                  <span className="font-heading text-sm font-bold tracking-tight">Gatehouse Control Room</span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-navy-900/60 px-2 py-0.5 rounded-md border border-border/40">
                  LIVE STREAM
                </span>
              </div>

              {/* TERMINAL MOCKUP STACK */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-navy-900/80 border border-border/40 space-y-1">
                  <div className="flex justify-between text-[11px] text-[#5cbdb9]">
                    <span>⚡ HMAC_TOKEN_VERIFIED</span>
                    <span>10:14:02</span>
                  </div>
                  <div className="text-white font-bold">Babatunde Raji · EVT-TBK88</div>
                  <div className="text-[10px] text-muted-foreground">Scan duration: 2.1s · Verified by Gate Camera Agent</div>
                </div>

                <div className="p-3 rounded-xl bg-navy-900/80 border border-border/40 space-y-1">
                  <div className="flex justify-between text-[11px] text-[#38ef7d]">
                    <span>🏢 VENUE_DELEGATION_GRANTED</span>
                    <span>10:11:45</span>
                  </div>
                  <div className="text-white font-bold">Eko Convention Centre · Main Arena</div>
                  <div className="text-[10px] text-muted-foreground">Permissions: ['register_guests', 'scan_guests']</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground">System Health</span>
                <span className="text-[#38ef7d] font-bold">100% Operational</span>
              </div>

            </div>

            {/* 2 METRIC CARDS */}
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border/60 bg-secondary/60 p-5">
                <div className="flex items-center gap-2 text-[#5cbdb9]">
                  <Radio className="h-4 w-4" />
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

/* ---------------- MEET MUSA AI STORYTELLING SECTION ---------------- */
function MeetMusaAiSection({ onNavigate }: { onNavigate: (v: ViewRoute) => void }) {
  return (
    <section className="relative px-6">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-navy-800/80 via-navy-900 to-navy-800/60 p-8 lg:p-14 card-glow">
          
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            
            {/* STORYTEXT LEFT */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#5cbdb9]">
                <Sparkles className="h-4 w-4" />
                The Story Behind the Intelligence
              </span>

              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
                Every gate has a story. <br />
                <span className="text-gradient">Meet Musa AI.</span>
              </h2>

              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                Inspired by the iconic Nigerian proverb <em className="text-foreground font-medium">"Wetin Musa no go see for gate?"</em> — meaning the gatekeeper who has seen it all, experience, vigilance, and unbreakable watchfulness.
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
                  onClick={() => onNavigate('checkin')}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
                >
                  Test Musa AI Scanner Engine
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* MUSA AI TERMINAL CHAT MOCKUP RIGHT */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-border/60 bg-navy-900 p-6 space-y-4 shadow-2xl">
                
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#5cbdb9]/20 text-[#5cbdb9] border border-[#5cbdb9]/30">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-heading text-sm font-bold text-foreground">Musa AI Assistant</div>
                      <div className="text-[10px] font-mono text-muted-foreground">Gatekeeper Protocol v2.0</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#173226] text-[#38ef7d] border border-[#38ef7d]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38ef7d] animate-pulse" />
                    ACTIVE WATCH
                  </span>
                </div>

                {/* CONVERSATION STREAM */}
                <div className="space-y-3 font-mono text-xs">
                  
                  <div className="p-3 rounded-2xl bg-card/60 border border-border/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#5cbdb9] font-bold">
                      <MessageSquare className="h-3 w-3" />
                      MUSA GATE ALERT · 10:12 AM
                    </div>
                    <p className="text-foreground">"Gate B is becoming congested. 48 guests arriving per min."</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-primary/20 border border-primary/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#38ef7d] font-bold">
                      <Cpu className="h-3 w-3" />
                      RECOMMENDED ACTION
                    </div>
                    <p className="text-foreground font-bold">Open Overflow Gate D (Lane #03).</p>
                    <p className="text-[11px] text-muted-foreground">Predicted queue reduction: <strong>41%</strong> in 4 mins.</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-card/60 border border-border/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#f0a93b] font-bold">
                      <AlertTriangle className="h-3 w-3" />
                      SECURITY DETECTED
                    </div>
                    <p className="text-foreground">"Musa flagged 1 duplicate QR pass attempt. Re-entry blocked."</p>
                  </div>

                </div>

                <div className="text-[11px] text-center text-muted-foreground font-mono pt-1">
                  "Wetin Musa no go see for gate?" · Powered by Gatehouse Core
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

/* ---------------- AUDIENCE SECTION ---------------- */
function AudienceSection() {
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

  return (
    <section className="px-6 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Built for every side of the door
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Gatehouse aligns the three parties that make an event run: the venue, the organizer, and
            the guest.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
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
    </section>
  );
}

/* ---------------- PATHS SECTION ---------------- */
function PathsSection() {
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
    <section className="border-y border-border/40 bg-secondary/30 px-6 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            3 Flexible Registration Paths
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Gatehouse provides complete operational freedom for any event workflow.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
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
    </section>
  );
}

/* ---------------- FEATURE SECTION ---------------- */
function FeatureSection() {
  const features = [
    {
      icon: QrCode,
      title: "Signed HMAC QR Passes",
      description: "Every pass is cryptographically signed and validated locally at the gate in <1ms.",
    },
    {
      icon: Zap,
      title: "2.5-Second Scan Velocity",
      description: "Optimized scanning pipeline built for high-throughput entry lanes and zero queues.",
    },
    {
      icon: ShieldCheck,
      title: "Offline Mesh Resilience",
      description: "Gates keep validating even when network drops completely. Sync resumes automatically.",
    },
    {
      icon: BarChart3,
      title: "Operational Analytics",
      description: "Real-time capacity, VIP ratio flow rates, and anomaly detection for event control.",
    },
    {
      icon: Lock,
      title: "Role-Based Access Control",
      description: "Granular roles for Organizers, Venue Managers, Ushers, Security, and Guests.",
    },
    {
      icon: Radio,
      title: "Live Entry Stream",
      description: "Monitor every gate from a centralized control room with instant alerts.",
    },
  ];

  return (
    <section className="px-6 py-12 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Engineering-grade event security
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Enterprise controls without the enterprise complexity.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-border/60 bg-card/40 p-6 transition-all hover:bg-card/60"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
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
  const throughputPerGatePerMin = 60 / avgScanTimeSec; // 24 guests/min per gate
  const totalThroughputPerMin = throughputPerGatePerMin * gatesCount;
  const totalEntryTimeMinutes = Math.round(guestsCount / totalThroughputPerMin);

  return (
    <section className="px-6 py-12 lg:py-16">
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
            
            {/* SLIDERS LEFT */}
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

            {/* RESULTS RIGHT */}
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

/* ---------------- CTA SECTION ---------------- */
function CTASection({ onNavigate }: { onNavigate: (v: ViewRoute) => void }) {
  return (
    <section className="px-6 pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-primary/10 px-8 py-16 lg:px-16 lg:py-20">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to eliminate entry friction?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start issuing signed passes and controlling gates in minutes — not weeks.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md cursor-pointer"
              >
                Launch Control Room
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary cursor-pointer"
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
