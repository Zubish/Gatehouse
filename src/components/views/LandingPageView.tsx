import React, { useState } from 'react';
import { useGatehouse } from '../../context/GatehouseContext';

export const LandingPageView: React.FC = () => {
  const { setActiveTab } = useGatehouse();

  const [activeRegPath, setActiveRegPath] = useState<'pathA' | 'pathB' | 'pathC'>('pathA');
  const [guestCountSlider, setGuestCountSlider] = useState<number>(1200);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Throughput calculations
  const paperScanMinutes = Math.round((guestCountSlider * 45) / 60); // 45 seconds per paper check-in
  const gatehouseScanMinutes = Math.round((guestCountSlider * 2.5) / 60); // 2.5 seconds per QR scan
  const hoursSaved = ((paperScanMinutes - gatehouseScanMinutes) / 60).toFixed(1);

  const faqs = [
    {
      q: 'Does Gatehouse require internet access at the gate?',
      a: 'No. Gatehouse includes offline browser caching. The guest list and signed HMAC tokens are stored locally on gate devices. Scans process instantly offline and sync to the cloud automatically when connectivity returns.',
    },
    {
      q: 'How does Gatehouse prevent forged or duplicate QR codes?',
      a: 'Every QR pass contains a cryptographically signed HMAC token ({ eventId, guestId, code, signature }). Even if someone attempts to copy or alter a QR pass, the signature check fails. If a pass is scanned twice, Gatehouse immediately blocks the entry with a timestamped duplicate alert.',
    },
    {
      q: 'How does delegation work between Event Centres and Organizers?',
      a: 'Organizers can grant Event Centres specific permissions (such as `register_guests` or `scan_guests`) for an event hosted at their venue. Venue ushering staff log into their Centre Portal and only see the guests for that specific event.',
    },
    {
      q: 'Can guests register themselves without downloading an app?',
      a: 'Yes! Every event gets a unique registration link (e.g. `gatehouse.app/r/EVT-9F2K1`). Guests open the link in any mobile browser, register in seconds, and receive an instant scannable QR pass with zero login required.',
    },
    {
      q: 'Can we export post-event attendance data?',
      a: 'Absolutely. Organizers and venue admins can export detailed CSV reports including guest name, phone, check-in timestamp, category, and entry method.',
    },
  ];

  return (
    <div className="space-y-16 py-4 animate-in fade-in duration-300 font-['Inter'] text-[#EDEFF3]">
      
      {/* 1. HERO SECTION */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#151A22] via-[#0D1015] to-[#0D1015] border border-[#262D38] p-6 md:p-12 overflow-hidden text-center space-y-8 shadow-2xl">
        
        {/* Glow backdrop decorative accent */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#3ED98A]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Product Release Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#173226] border border-[#3ED98A]/40 text-[#3ED98A] text-xs font-mono font-bold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-[#3ED98A] animate-ping" />
          GATEHOUSE 2.0 • 3-SIDED EVENT ENTRY &amp; VENUE CONTROL PLATFORM
        </div>

        {/* Main Headline */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#EDEFF3] font-['Space_Grotesk'] tracking-tight leading-tight">
            Flawless Event Access.<br />
            <span className="bg-gradient-to-r from-[#3ED98A] via-[#F0A93B] to-[#3ED98A] bg-clip-text text-transparent">
              Zero Long Queues. Unbreakable Control.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#8B93A3] max-w-2xl mx-auto leading-relaxed">
            The enterprise entry management platform connecting <strong>Event Centres</strong>, <strong>Organizers</strong>, and <strong>Guests</strong> with signed HMAC QR passes, 2.5-second gate scans, and offline resilience.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="btn btn-go py-3.5 px-8 text-sm font-bold shadow-lg shadow-[#3ED98A]/20 hover:scale-105 transition-transform"
          >
            Launch Control Room Platform →
          </button>
          
          <button
            onClick={() => setActiveTab('centres')}
            className="btn btn-ghost py-3.5 px-6 text-sm font-semibold hover:bg-[#1B2129] transition-colors"
          >
            Browse Venue Directory
          </button>

          <button
            onClick={() => setActiveTab('public_reg')}
            className="btn btn-ghost py-3.5 px-6 text-sm font-semibold border-[#F0A93B]/40 text-[#F0A93B] hover:bg-[#332A14]"
          >
            Try Guest Self-Reg (Path C)
          </button>
        </div>

        {/* INTERACTIVE DEMO PREVIEW CONTAINER */}
        <div className="mt-8 max-w-4xl mx-auto rounded-xl bg-[#151A22] border border-[#262D38] p-4 md:p-6 text-left shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#262D38] pb-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#3ED98A] shadow-[0_0_10px_#3ED98A]" />
              <strong className="text-[#EDEFF3]">LIVE GATE SIMULATOR #01</strong>
            </div>
            <span className="text-[#8B93A3]">Eko Convention Centre • Gate A</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1B2129] p-3 rounded-lg border border-[#262D38] space-y-1">
              <span className="text-[10px] font-mono text-[#565E6D] uppercase">Live Checked In</span>
              <div className="text-2xl font-extrabold font-['Space_Grotesk'] text-[#3ED98A]">1,428 / 1,500</div>
              <div className="text-[10px] font-mono text-[#8B93A3]">95.2% Attendance Velocity</div>
            </div>

            <div className="bg-[#1B2129] p-3 rounded-lg border border-[#262D38] space-y-1">
              <span className="text-[10px] font-mono text-[#565E6D] uppercase">Average Gate Throughput</span>
              <div className="text-2xl font-extrabold font-['Space_Grotesk'] text-[#EDEFF3]">2.1 sec / scan</div>
              <div className="text-[10px] font-mono text-[#3ED98A]">100% Signature Verified</div>
            </div>

            <div className="bg-[#1B2129] p-3 rounded-lg border border-[#262D38] space-y-1">
              <span className="text-[10px] font-mono text-[#565E6D] uppercase">Offline Sync Buffer</span>
              <div className="text-2xl font-extrabold font-['Space_Grotesk'] text-[#F0A93B]">0 Pending</div>
              <div className="text-[10px] font-mono text-[#8B93A3]">Local Storage Cache Active</div>
            </div>
          </div>
        </div>

      </div>

      {/* 2. STATS & VENUE PARTNERS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="panel space-y-1">
          <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-[#3ED98A]">500K+</div>
          <div className="text-xs font-mono text-[#8B93A3] uppercase">Guests Scanned</div>
        </div>
        <div className="panel space-y-1">
          <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-[#EDEFF3]">&lt; 2.5s</div>
          <div className="text-xs font-mono text-[#8B93A3] uppercase">Scan Verification</div>
        </div>
        <div className="panel space-y-1">
          <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-[#F0A93B]">99.99%</div>
          <div className="text-xs font-mono text-[#8B93A3] uppercase">Gate Reliability</div>
        </div>
        <div className="panel space-y-1">
          <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-[#EDEFF3]">300+</div>
          <div className="text-xs font-mono text-[#8B93A3] uppercase">Verified Venues</div>
        </div>
      </div>

      {/* 3. THE 3 GUEST REGISTRATION PATHS SHOWCASE */}
      <div className="panel space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-mono text-[#3ED98A] uppercase font-bold tracking-wider">
            Architecture Blueprint
          </span>
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-[#EDEFF3]">
            The Three Flexible Guest Registration Paths
          </h2>
          <p className="text-xs text-[#8B93A3]">
            Whether you manage guests directly, delegate to venue ushers, or send a public link, Gatehouse stores everything under a unified event record.
          </p>
        </div>

        {/* Path Selector Buttons */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-[#262D38] pb-4">
          <button
            onClick={() => setActiveRegPath('pathA')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeRegPath === 'pathA'
                ? 'bg-[#3ED98A] text-[#08150E]'
                : 'bg-[#1B2129] text-[#8B93A3] hover:text-[#EDEFF3]'
            }`}
          >
            Path A: Organizer Direct Add
          </button>
          <button
            onClick={() => setActiveRegPath('pathB')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeRegPath === 'pathB'
                ? 'bg-[#F0A93B] text-[#08150E]'
                : 'bg-[#1B2129] text-[#8B93A3] hover:text-[#EDEFF3]'
            }`}
          >
            Path B: Event Centre Delegation
          </button>
          <button
            onClick={() => setActiveRegPath('pathC')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeRegPath === 'pathC'
                ? 'bg-[#E5555C] text-[#EDEFF3]'
                : 'bg-[#1B2129] text-[#8B93A3] hover:text-[#EDEFF3]'
            }`}
          >
            Path C: Public Self-Registration Link
          </button>
        </div>

        {/* Path Content Cards */}
        <div className="bg-[#1B2129] border border-[#262D38] rounded-xl p-6 space-y-4">
          {activeRegPath === 'pathA' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#173226] text-[#3ED98A] font-mono text-xs font-bold">PATH A</span>
                <h3 className="font-bold text-base text-[#EDEFF3] font-['Space_Grotesk']">
                  Direct Registration &amp; Bulk CSV Import
                </h3>
              </div>
              <p className="text-xs text-[#8B93A3] leading-relaxed">
                Organizers add single guests or paste multi-line text (`Name, Phone, Category`) to generate 1,000+ guest records and QR tokens in seconds.
              </p>
              <div className="p-3 rounded bg-[#0D1015] border border-[#262D38] text-xs font-mono text-[#3ED98A]">
                ✓ Full organizer control • Instant badge code assignment • Immediate CSV export
              </div>
            </div>
          )}

          {activeRegPath === 'pathB' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#332A14] text-[#F0A93B] font-mono text-xs font-bold">PATH B</span>
                <h3 className="font-bold text-base text-[#EDEFF3] font-['Space_Grotesk']">
                  Event Centre Delegation &amp; Ushering Control
                </h3>
              </div>
              <p className="text-xs text-[#8B93A3] leading-relaxed">
                Organizers delegate guest list creation or gate scanning to the booked venue. Venue managers access the Centre Portal to register guests and operate gate scanners without seeing unrelated events.
              </p>
              <div className="p-3 rounded bg-[#0D1015] border border-[#262D38] text-xs font-mono text-[#F0A93B]">
                ✓ Scoped venue permissions • Host usher coordination • Zero PII leak across events
              </div>
            </div>
          )}

          {activeRegPath === 'pathC' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#331B1D] text-[#E5555C] font-mono text-xs font-bold">PATH C</span>
                <h3 className="font-bold text-base text-[#EDEFF3] font-['Space_Grotesk']">
                  Public Link Self-Registration (`gatehouse.app/r/EVT-9F2K1`)
                </h3>
              </div>
              <p className="text-xs text-[#8B93A3] leading-relaxed">
                Guests open an unauthenticated public link, fill out their details, and receive an instant scannable QR pass on their phone with automatic event capacity caps.
              </p>
              <div className="p-3 rounded bg-[#0D1015] border border-[#262D38] text-xs font-mono text-[#E5555C]">
                ✓ Zero app download • Automatic capacity enforcement • Signed HMAC QR pass
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. THREE-SIDED PLATFORM AUDIENCE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="panel space-y-3 border-[#3ED98A]/30">
          <div className="w-10 h-10 rounded-xl bg-[#173226] text-[#3ED98A] flex items-center justify-center font-bold font-mono">
            01
          </div>
          <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#EDEFF3]">For Organizers</h3>
          <ul className="text-xs text-[#8B93A3] space-y-2 font-mono">
            <li>• Book verified event centres</li>
            <li>• 3 Guest Registration Paths</li>
            <li>• Live arrival velocity charts</li>
            <li>• Real-time CSV audit reports</li>
          </ul>
        </div>

        <div className="panel space-y-3 border-[#F0A93B]/30">
          <div className="w-10 h-10 rounded-xl bg-[#332A14] text-[#F0A93B] flex items-center justify-center font-bold font-mono">
            02
          </div>
          <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#EDEFF3]">For Event Centres</h3>
          <ul className="text-xs text-[#8B93A3] space-y-2 font-mono">
            <li>• Accept/Decline booking requests</li>
            <li>• Venue profile &amp; directory listing</li>
            <li>• Scoped usher &amp; scanner portal</li>
            <li>• Venue-level attendance analytics</li>
          </ul>
        </div>

        <div className="panel space-y-3 border-[#E5555C]/30">
          <div className="w-10 h-10 rounded-xl bg-[#331B1D] text-[#E5555C] flex items-center justify-center font-bold font-mono">
            03
          </div>
          <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#EDEFF3]">For Guests</h3>
          <ul className="text-xs text-[#8B93A3] space-y-2 font-mono">
            <li>• Zero app download or login</li>
            <li>• Instant scannable QR pass</li>
            <li>• Fallback badge code EVT-XXXXX</li>
            <li>• Re-downloadable pass link</li>
          </ul>
        </div>
      </div>

      {/* 5. INTERACTIVE ENTRY THROUGHPUT CALCULATOR */}
      <div className="panel space-y-6 bg-gradient-to-br from-[#151A22] to-[#1B2129]">
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#3ED98A] uppercase font-bold">
            Interactive Calculator
          </span>
          <h2 className="text-xl font-bold font-['Space_Grotesk'] text-[#EDEFF3]">
            Calculate Gate Entry Time Saved with Gatehouse
          </h2>
          <p className="text-xs text-[#8B93A3]">
            Adjust your expected guest count to compare paper check-in bottlenecks against Gatehouse camera QR scans.
          </p>
        </div>

        {/* Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-[#EDEFF3]">
            <span>Guest Count: <strong>{guestCountSlider.toLocaleString()} Guests</strong></span>
            <span>2.5s / scan</span>
          </div>
          <input
            type="range"
            min="200"
            max="5000"
            step="100"
            value={guestCountSlider}
            onChange={(e) => setGuestCountSlider(Number(e.target.value))}
            className="w-full accent-[#3ED98A] cursor-pointer"
          />
        </div>

        {/* Comparison Result Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono">
          <div className="p-4 rounded-xl bg-[#331B1D] border border-[#E5555C]/40 space-y-1">
            <span className="text-[10px] text-[#E5555C] uppercase">Traditional Paper List</span>
            <div className="text-2xl font-bold text-[#E5555C]">{paperScanMinutes} mins</div>
            <div className="text-[10px] text-[#8B93A3]">45 sec / check-in queue</div>
          </div>

          <div className="p-4 rounded-xl bg-[#173226] border border-[#3ED98A]/40 space-y-1">
            <span className="text-[10px] text-[#3ED98A] uppercase">Gatehouse QR Scan</span>
            <div className="text-2xl font-bold text-[#3ED98A]">{gatehouseScanMinutes} mins</div>
            <div className="text-[10px] text-[#3ED98A]">2.5 sec / gate scan</div>
          </div>

          <div className="p-4 rounded-xl bg-[#332A14] border border-[#F0A93B]/40 space-y-1">
            <span className="text-[10px] text-[#F0A93B] uppercase">Total Time Saved</span>
            <div className="text-2xl font-bold text-[#F0A93B]">{hoursSaved} Hours</div>
            <div className="text-[10px] text-[#F0A93B]">94% Queue Reduction</div>
          </div>
        </div>
      </div>

      {/* 6. B2B PRICING TIERS */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-[#EDEFF3]">
            Transparent B2B Platform Pricing
          </h2>
          <p className="text-xs text-[#8B93A3]">
            No hidden costs. Scale your events seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter */}
          <div className="panel space-y-4 border-[#262D38] flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono text-[#8B93A3] uppercase">Starter</span>
              <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-[#EDEFF3]">FREE</div>
              <p className="text-xs text-[#8B93A3]">Ideal for small private events up to 200 guests.</p>
              <ul className="text-xs text-[#8B93A3] space-y-2 font-mono pt-2 border-t border-[#262D38]">
                <li>✓ Up to 200 guests / event</li>
                <li>✓ Camera QR scanning</li>
                <li>✓ Manual guest add &amp; import</li>
                <li>✓ CSV report export</li>
              </ul>
            </div>
            <button onClick={() => setActiveTab('dashboard')} className="btn btn-ghost w-full">
              Start Free Event
            </button>
          </div>

          {/* Pro Organizer */}
          <div className="panel space-y-4 border-[#3ED98A] bg-[#151A22] relative shadow-xl flex flex-col justify-between">
            <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#3ED98A] text-[#08150E] text-[10px] font-mono font-bold">
              MOST POPULAR
            </span>
            <div className="space-y-3">
              <span className="text-xs font-mono text-[#3ED98A] uppercase">Pro Organizer</span>
              <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-[#EDEFF3]">₦35,000</div>
              <p className="text-xs text-[#8B93A3]">For large conferences, galas, and summits up to 2,500 guests.</p>
              <ul className="text-xs text-[#EDEFF3] space-y-2 font-mono pt-2 border-t border-[#262D38]">
                <li>✓ Up to 2,500 guests / event</li>
                <li>✓ 3 Guest Registration Paths</li>
                <li>✓ Venue delegation permissions</li>
                <li>✓ Signed HMAC QR security</li>
                <li>✓ Priority offline gate sync</li>
              </ul>
            </div>
            <button onClick={() => setActiveTab('dashboard')} className="btn btn-go w-full font-bold">
              Get Pro Pass
            </button>
          </div>

          {/* Event Centre Enterprise */}
          <div className="panel space-y-4 border-[#F0A93B]/40 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono text-[#F0A93B] uppercase">Event Centre Enterprise</span>
              <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-[#EDEFF3]">₦120,000</div>
              <p className="text-xs text-[#8B93A3]">For event centres and convention halls hosting weekly events.</p>
              <ul className="text-xs text-[#8B93A3] space-y-2 font-mono pt-2 border-t border-[#262D38]">
                <li>✓ Verified Venue Directory Listing</li>
                <li>✓ Unlimited hosted events</li>
                <li>✓ Delegated Ushering Portal</li>
                <li>✓ Multi-gate scanner syncing</li>
                <li>✓ Dedicated account manager</li>
              </ul>
            </div>
            <button onClick={() => setActiveTab('centre_portal')} className="btn btn-ghost w-full text-[#F0A93B]">
              List Venue Centre
            </button>
          </div>
        </div>
      </div>

      {/* 7. FAQ ACCORDION */}
      <div className="panel space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-[#EDEFF3]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[#8B93A3]">Everything you need to know about Gatehouse.</p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-[#1B2129] border border-[#262D38] rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-left font-bold text-sm text-[#EDEFF3] flex justify-between items-center"
              >
                <span>{faq.q}</span>
                <span className="text-[#3ED98A] font-mono">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-xs text-[#8B93A3] leading-relaxed border-t border-[#262D38]/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 8. FOOTER */}
      <div className="pt-8 border-t border-[#262D38] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8B93A3]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3ED98A] animate-ping" />
          <span>Gatehouse Platform Operational • 99.99% Gate Uptime</span>
        </div>

        <div>
          © 2026 Gatehouse Inc. All rights reserved. Built for Event Centres, Organizers &amp; Guests.
        </div>
      </div>

    </div>
  );
};
