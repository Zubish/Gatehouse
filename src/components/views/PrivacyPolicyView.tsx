import React from 'react';
import { ShieldCheck, Scale, Lock, FileText } from 'lucide-react';
import { Footer } from '../layout/Footer';
import type { ViewRoute } from '../../types';

interface PrivacyPolicyViewProps {
  onNavigate?: (view: ViewRoute) => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between -mt-4 sm:-mt-6 lg:-mt-8">
      <main className="mx-auto max-w-4xl px-6 py-12 w-full space-y-10">
        
        {/* HEADER BANNER */}
        <div className="space-y-4 border-b border-border/40 pb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5cbdb9]/10 text-[#5cbdb9] font-mono text-xs font-bold border border-[#5cbdb9]/30">
            <Scale className="h-3.5 w-3.5" />
            NIGERIA DATA PROTECTION ACT (NDPA 2023) COMPLIANT
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
            Privacy Policy &amp; Data Protection Notice
          </h1>
          <p className="text-muted-foreground text-sm font-mono">
            Effective Date: January 1, 2026 • Governing Jurisdiction: Federal Republic of Nigeria
          </p>
        </div>

        {/* POLICY CONTENT BODY */}
        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground font-sans">
          
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#5cbdb9]" />
              1. Statutory Framework &amp; Data Controller
            </h2>
            <p>
              Gatehouse Technologies Nigeria Limited (&quot;Gatehouse&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the Gatehouse access management, venue booking, and QR entry control platform. This Privacy Policy governs data processing activities within the Federal Republic of Nigeria in compliance with the <strong>Nigeria Data Protection Act 2023 (NDPA)</strong> and guidelines issued by the <strong>Nigeria Data Protection Commission (NDPC)</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#38ef7d]" />
              2. Information We Collect &amp; Process
            </h2>
            <p>We process personal data necessary for event security, guest pass generation, and venue booking operations:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Attendee &amp; Guest Data:</strong> Full Name, Phone Number, WhatsApp Contact, Email Address, Ticket Category (VIP/Regular), and HMAC-SHA256 Encrypted Gate Access Hashes.</li>
              <li><strong>Organizer &amp; Venue Owner Data:</strong> Organization Name, Registered Business Name, CAC Registration Numbers, Work Email, Contact Phone, and Banking settlement details.</li>
              <li><strong>Gate Scanner Audit Trail:</strong> Timestamped QR scan verification logs, entry gate IDs, and scanner operator names.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              3. Data Retention &amp; Cryptographic Security
            </h2>
            <p>
              In accordance with Section 34 of the NDPA 2023, attendee QR gate access codes are encrypted using HMAC-SHA256 protocol. Personal data processed solely for event check-in verification is retained for no longer than thirty (30) calendar days post-event before automatic deletion or anonymization, unless a longer retention period is required by Nigerian law or court order.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-foreground">
              4. Data Subject Rights under Nigerian Law
            </h2>
            <p>Under the NDPA 2023, Data Subjects in Nigeria maintain the following statutory rights:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Right to request access to personal data processed by Gatehouse.</li>
              <li>Right to request rectification of inaccurate phone numbers or guest details.</li>
              <li>Right to object to data processing or withdraw consent.</li>
              <li>Right to file complaints directly with the Nigeria Data Protection Commission (NDPC).</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-border/40 pt-6">
            <h2 className="font-heading text-xl font-bold text-foreground">
              5. Data Protection Officer (DPO) Contact
            </h2>
            <p className="font-mono text-xs">
              Data Protection Officer (DPO)<br />
              Gatehouse Technologies Nigeria Ltd<br />
              Commercial Avenue, Yaba, Lagos State, Nigeria<br />
              Email: <span className="text-[#5cbdb9] underline">dpo@gatehouse.app</span>
            </p>
          </section>

        </div>

      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
