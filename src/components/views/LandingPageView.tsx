import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';

export const LandingPageView: React.FC = () => {
  const { setActiveTab } = useGatehouse();

  // Calculator State
  const [guestsCount, setGuestsCount] = useState(1500);
  const [gatesCount, setGatesCount] = useState(4);

  // Computed Calculator Metrics
  const avgScanTimeSec = 2.5; // 2.5s scan speed
  const throughputPerGatePerMin = 60 / avgScanTimeSec; // 24 guests/min per gate
  const totalThroughputPerMin = throughputPerGatePerMin * gatesCount; // 96 guests/min
  const totalEntryTimeMinutes = Math.round(guestsCount / totalThroughputPerMin);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Gatehouse eliminate entry gate bottlenecks?',
      a: 'Gatehouse uses cryptographically signed HMAC QR tokens that verify locally on gate devices in under 2.5 seconds. Even if venue Wi-Fi drops completely, edge devices continue scanning and validating guests offline with 100% security.',
    },
    {
      q: 'What are the 3 Guest Registration Paths?',
      a: 'Path A: Organizers import CSV lists or add guests manually. Path B: Event Centres register guests on behalf of hosts via delegated permissions. Path C: Guests self-register through custom event links with automatic capacity cap enforcement.',
    },
    {
      q: 'Do guests need to download an app or create an account?',
      a: 'No app download or account creation is required for guests. They instantly receive a scannable digital QR pass on their phone with a fallback badge code (e.g. EVT-TBK88).',
    },
    {
      q: 'Can Event Centres manage multiple organizers simultaneously?',
      a: 'Yes! Venue managers receive delegated permissions from event hosts to register VIPs, assign ushers, scan passes, and monitor real-time entry velocity across multiple halls in one portal.',
    },
  ];

  return (
    <div className="w-full text-[#EDEFF3] font-['Plus_Jakarta_Sans'] relative overflow-x-hidden">
      
      {/* AMBIENT BACKGROUND GLOW ORBS */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section id="overview" className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-20 grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Hero Content */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#173226] border border-[#3ED98A]/30 text-[#3ED98A] text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#3ED98A] animate-pulse" />
            GATEHOUSE 2.0 • 3-SIDED EVENT ACCESS &amp; VENUE CONTROL
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-['Space_Grotesk'] tracking-tight leading-[1.1]">
            Flawless Access.<br />
            <span className="bg-gradient-to-r from-[#3ED98A] via-emerald-300 to-[#F0A93B] bg-clip-text text-transparent">
              Unbreakable Control.
            </span><br />
            Zero Long Queues.
          </h1>

          <p className="text-base sm:text-lg text-[#94a3b8] max-w-2xl leading-relaxed font-['Inter']">
            The enterprise access management suite connecting <strong className="text-white">Event Centres</strong>, <strong className="text-white">Organizers</strong>, and <strong className="text-white">Guests</strong> seamlessly. Accelerate entry with signed HMAC QR passes, 2.5-second scans, and robust offline resilience.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="btn btn-go px-7 py-3.5 rounded-xl font-mono text-sm font-bold flex items-center gap-2 shadow-xl shadow-[#3ED98A]/20 hover:scale-[1.02] transition-transform"
            >
              Get Started with Control Room Platform &rarr;
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className="btn btn-ghost px-6 py-3.5 rounded-xl font-mono text-sm font-semibold border-[#262D38] hover:bg-[#1B2129] text-[#EDEFF3]"
            >
              Schedule a Demo
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#262D38]">
            <div>
              <div className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-white">2.5s</div>
              <div className="text-xs font-mono text-[#8B93A3] uppercase mt-1">Avg Scan Speed</div>
            </div>
            <div>
              <div className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#3ED98A]">99.9%</div>
              <div className="text-xs font-mono text-[#8B93A3] uppercase mt-1">Offline Mesh Uptime</div>
            </div>
            <div>
              <div className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#F0A93B]">100k+</div>
              <div className="text-xs font-mono text-[#8B93A3] uppercase mt-1">HMAC Passes Validated</div>
            </div>
          </div>

        </div>

        {/* Right Live Entry Terminal Stream Simulator */}
        <div className="lg:col-span-5">
          <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/80">
            
            {/* Terminal Header */}
            <div className="bg-[#0b0e14] px-4 py-3 border-b border-[#262D38] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#E5555C]" />
                <span className="w-3 h-3 rounded-full bg-[#F0A93B]" />
                <span className="w-3 h-3 rounded-full bg-[#3ED98A]" />
                <span className="text-xs font-mono text-[#8B93A3] ml-2">live_entry_stream.terminal</span>
              </div>
              <span className="text-[10px] font-mono bg-[#173226] text-[#3ED98A] px-2 py-0.5 rounded border border-[#3ED98A]/30 font-bold">
                LIVE GATE SIMULATOR
              </span>
            </div>

            {/* Terminal Body */}
            <div className="p-6 space-y-5 bg-[#0f172a]/90 backdrop-blur-xl">
              
              {/* Verified Pass Indicator */}
              <div className="p-4 rounded-xl bg-[#173226]/80 border border-[#3ED98A]/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#3ED98A] text-[#08150E] flex items-center justify-center font-bold text-lg">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">Guest #2847 Verified</div>
                    <div className="text-xs font-mono text-[#3ED98A]">HMAC Signature Validated • 2.1s</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#0D1015] text-[10px] font-mono font-bold text-[#F0A93B] border border-[#F0A93B]/30">
                  PATH A
                </span>
              </div>

              {/* Entry Velocity Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-[#262D38]">
                  <div className="text-[11px] font-mono text-[#8B93A3] uppercase">Entry Velocity</div>
                  <div className="text-lg font-bold text-white font-['Space_Grotesk'] mt-1">42 guests/min</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0b0e14] border border-[#262D38]">
                  <div className="text-[11px] font-mono text-[#8B93A3] uppercase">Sync Status</div>
                  <div className="text-lg font-bold text-[#3ED98A] font-['Space_Grotesk'] mt-1">Edge Mesh Active</div>
                </div>
              </div>

              {/* Log Terminal Console Output */}
              <div className="p-4 rounded-xl bg-[#080c14] border border-[#262D38] font-mono text-xs text-[#94a3b8] space-y-2">
                <p className="text-[#3ED98A]"><code>[10:14:02] PASS: EVT-98211 -&gt; VIP Entry Gate 01</code></p>
                <p className="text-[#3ED98A]"><code>[10:14:04] PASS: EVT-98212 -&gt; Main Entrance Gate 04</code></p>
                <p className="text-[#F0A93B]"><code>[10:14:05] ALERT: Offline Fallback Cache Enabled (Node 03)</code></p>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* 3 REGISTRATION PATHS BREAKDOWN */}
      <section className="border-t border-b border-[#262D38] bg-[#0d121c]/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
              3 Flexible Registration Paths
            </h2>
            <p className="text-sm text-[#94a3b8] font-['Inter']">
              Gatehouse provides complete operational freedom for any event workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Path A */}
            <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-4 hover:border-[#3ED98A]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#3ED98A]/10 border border-[#3ED98A]/30 text-[#3ED98A] font-mono font-bold flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">Path A: Direct Import</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Organizers upload guest CSV spreadsheets or manually add names directly to the control room dashboard.
              </p>
              <ul className="text-xs font-mono text-[#8B93A3] space-y-2 pt-2 border-t border-[#262D38]">
                <li className="flex items-center gap-2 text-white">
                  <span className="text-[#3ED98A]">✓</span> Multi-line CSV parser
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-[#3ED98A]">✓</span> Automatic VIP category tags
                </li>
              </ul>
            </div>

            {/* Path B */}
            <div className="glass-card p-8 rounded-2xl border border-[#3ED98A]/30 bg-gradient-to-b from-[#0f172a] to-[#173226]/20 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-[#F0A93B]/10 border border-[#F0A93B]/30 text-[#F0A93B] font-mono font-bold flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">Path B: Delegated Access</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Organizers delegate guest registration and gate ushering permissions directly to verified Event Centre teams.
              </p>
              <ul className="text-xs font-mono text-[#8B93A3] space-y-2 pt-2 border-t border-[#262D38]">
                <li className="flex items-center gap-2 text-white">
                  <span className="text-[#3ED98A]">✓</span> Scoped usher permissions
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-[#3ED98A]">✓</span> Venue booking synchronization
                </li>
              </ul>
            </div>

            {/* Path C */}
            <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-4 hover:border-[#3ED98A]/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">Path C: Public Link</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Guests self-register via custom public URLs (<code className="text-[#3ED98A]">/r/EVT-XXXXX</code>) with automatic event capacity caps.
              </p>
              <ul className="text-xs font-mono text-[#8B93A3] space-y-2 pt-2 border-t border-[#262D38]">
                <li className="flex items-center gap-2 text-white">
                  <span className="text-[#3ED98A]">✓</span> Instant digital pass download
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-[#3ED98A]">✓</span> Strict capacity enforcement
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* STAKEHOLDER SOLUTIONS GRID */}
      <section id="solutions" className="max-w-7xl mx-auto px-4 sm:px-8 py-20 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
            Built for Every Stakeholder
          </h2>
          <p className="text-sm text-[#94a3b8]">
            A unified access control ecosystem designed for organizers, venue managers, and attendees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">For Organizers</h3>
            <ul className="text-xs text-[#94a3b8] space-y-2 font-['Inter']">
              <li>• Book top verified event centres</li>
              <li>• Manage guest lists &amp; ticket tiers</li>
              <li>• Track live arrival velocity charts</li>
              <li>• Export real-time CSV audit logs</li>
            </ul>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-[#F0A93B] font-['Space_Grotesk']">For Event Centres</h3>
            <ul className="text-xs text-[#94a3b8] space-y-2 font-['Inter']">
              <li>• Accept/Decline venue booking requests</li>
              <li>• Manage delegated event access</li>
              <li>• Assign gate ushers &amp; scanner devices</li>
              <li>• Hall-level attendance analytics</li>
            </ul>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-[#3ED98A] font-['Space_Grotesk']">For Guests</h3>
            <ul className="text-xs text-[#94a3b8] space-y-2 font-['Inter']">
              <li>• Zero app download or login required</li>
              <li>• Instant scannable signed QR pass</li>
              <li>• Fallback code chip (<code className="text-[#3ED98A]">EVT-XXXXX</code>)</li>
              <li>• 2.5-second express gate entry</li>
            </ul>
          </div>

        </div>
      </section>

      {/* GATE THROUGHPUT VELOCITY CALCULATOR */}
      <section id="calculator" className="border-t border-b border-[#262D38] bg-[#0b0e14] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8 text-center">
          
          <div className="space-y-3">
            <div className="inline-block px-3 py-1 rounded-full bg-[#173226] text-[#3ED98A] font-mono text-xs font-bold border border-[#3ED98A]/30">
              INTERACTIVE GATE THROUGHPUT CALCULATOR
            </div>
            <h2 className="text-3xl font-bold font-['Space_Grotesk'] text-white">
              Calculate Your Event Gate Throughput
            </h2>
            <p className="text-sm text-[#94a3b8]">
              Estimate total entry clearance time based on guest volume and gate lanes.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-6 text-left">
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-mono text-[#8B93A3] uppercase block mb-2">
                  Total Expected Guests: <strong className="text-white">{guestsCount}</strong>
                </label>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full accent-[#3ED98A]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#8B93A3] uppercase block mb-2">
                  Active Gate Lanes / Scanner Guns: <strong className="text-[#3ED98A]">{gatesCount}</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={gatesCount}
                  onChange={(e) => setGatesCount(Number(e.target.value))}
                  className="w-full accent-[#3ED98A]"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#262D38] text-center">
              <div className="p-4 rounded-xl bg-[#080c14] border border-[#262D38]">
                <div className="text-[10px] font-mono text-[#8B93A3] uppercase">Scan Velocity</div>
                <div className="text-xl font-bold text-[#3ED98A] font-['Space_Grotesk'] mt-1">2.5s / guest</div>
              </div>

              <div className="p-4 rounded-xl bg-[#080c14] border border-[#262D38]">
                <div className="text-[10px] font-mono text-[#8B93A3] uppercase">Total Throughput</div>
                <div className="text-xl font-bold text-white font-['Space_Grotesk'] mt-1">{totalThroughputPerMin} guests/min</div>
              </div>

              <div className="p-4 rounded-xl bg-[#080c14] border border-[#262D38]">
                <div className="text-[10px] font-mono text-[#8B93A3] uppercase">Full Clearance Time</div>
                <div className="text-xl font-bold text-[#F0A93B] font-['Space_Grotesk'] mt-1">{totalEntryTimeMinutes} mins</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* PRICING TIERS */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-8 py-20 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
            Transparent SaaS Pricing
          </h2>
          <p className="text-sm text-[#94a3b8]">
            Scalable plans for independent organizers, luxury event centres, and enterprise venues.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Starter */}
          <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-6">
            <div>
              <div className="text-xs font-mono text-[#8B93A3] uppercase">Single Event</div>
              <h3 className="text-2xl font-bold text-white font-['Space_Grotesk'] mt-1">Pay-As-You-Go</h3>
              <div className="text-3xl font-extrabold text-white mt-4">₦45,000 <span className="text-xs text-[#8B93A3] font-normal">/ event</span></div>
            </div>
            <ul className="text-xs text-[#94a3b8] space-y-2.5 font-mono pt-4 border-t border-[#262D38]">
              <li>✓ Up to 1,000 Guests</li>
              <li>✓ HMAC Signed QR Passes</li>
              <li>✓ Path A &amp; Path C Self-Registration</li>
              <li>✓ CSV Audit Exports</li>
            </ul>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="btn btn-ghost w-full py-3 text-xs font-mono font-bold"
            >
              Get Started
            </button>
          </div>

          {/* Venue Enterprise */}
          <div className="glass-card p-8 rounded-2xl border border-[#3ED98A]/50 bg-gradient-to-b from-[#0f172a] to-[#173226]/40 space-y-6 shadow-2xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#3ED98A] text-[#08150E] text-[10px] font-mono font-bold">
              MOST POPULAR FOR VENUES
            </div>
            <div>
              <div className="text-xs font-mono text-[#3ED98A] uppercase">Event Centre Suite</div>
              <h3 className="text-2xl font-bold text-white font-['Space_Grotesk'] mt-1">Venue Enterprise</h3>
              <div className="text-3xl font-extrabold text-white mt-4">₦250,000 <span className="text-xs text-[#8B93A3] font-normal">/ month</span></div>
            </div>
            <ul className="text-xs text-[#94a3b8] space-y-2.5 font-mono pt-4 border-t border-[#262D38]">
              <li>✓ Unlimited Events &amp; Guests</li>
              <li>✓ Multi-Hall Delegated Access (Path B)</li>
              <li>✓ Scanned Gate Usher Accounts</li>
              <li>✓ Offline Edge Mesh Hardware Sync</li>
            </ul>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="btn btn-go w-full py-3 text-xs font-mono font-bold shadow-lg shadow-[#3ED98A]/20"
            >
              Subscribe Venue Plan
            </button>
          </div>

          {/* Custom Managed */}
          <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-6">
            <div>
              <div className="text-xs font-mono text-[#8B93A3] uppercase">High Security</div>
              <h3 className="text-2xl font-bold text-white font-['Space_Grotesk'] mt-1">Managed Turnkey</h3>
              <div className="text-3xl font-extrabold text-white mt-4">Custom <span className="text-xs text-[#8B93A3] font-normal">quote</span></div>
            </div>
            <ul className="text-xs text-[#94a3b8] space-y-2.5 font-mono pt-4 border-t border-[#262D38]">
              <li>✓ On-Site Gate Usher Personnel</li>
              <li>✓ Physical Turnstile Integration</li>
              <li>✓ Dedicated SLA Support Agent</li>
              <li>✓ Custom Branding &amp; SMS Integration</li>
            </ul>
            <button
              onClick={() => setActiveTab('login')}
              className="btn btn-ghost w-full py-3 text-xs font-mono font-bold"
            >
              Contact Sales
            </button>
          </div>

        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="border-t border-[#262D38] bg-[#0b0e14] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold font-['Space_Grotesk'] text-white">Frequently Asked Questions</h2>
            <p className="text-xs font-mono text-[#8B93A3]">Everything you need to know about Gatehouse access control.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="glass-card rounded-xl border border-[#262D38] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-sm text-white flex items-center justify-between"
                >
                  <span>{faq.q}</span>
                  <span className="text-[#3ED98A] font-mono text-base">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-[#94a3b8] leading-relaxed border-t border-[#262D38]/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#262D38] py-8 text-center text-xs font-mono text-[#8B93A3]">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div>© 2026 Gatehouse Technologies. Modern Event &amp; Access Operations.</div>
          <div className="flex gap-6">
            <a href="#overview" className="hover:text-white">Overview</a>
            <a href="#solutions" className="hover:text-white">Solutions</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
