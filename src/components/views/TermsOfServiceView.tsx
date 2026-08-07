import React from 'react';
import { Scale, FileCheck, AlertTriangle } from 'lucide-react';
import { Footer } from '../layout/Footer';
import type { ViewRoute } from '../../types';

interface TermsOfServiceViewProps {
  onNavigate?: (view: ViewRoute) => void;
}

export const TermsOfServiceView: React.FC<TermsOfServiceViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between -mt-4 sm:-mt-6 lg:-mt-8">
      <main className="mx-auto max-w-4xl px-6 py-12 w-full space-y-10">
        
        {/* HEADER BANNER */}
        <div className="space-y-4 border-b border-border/40 pb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold border border-primary/30">
            <Scale className="h-3.5 w-3.5" />
            GOVERNED BY LAWS OF THE FEDERAL REPUBLIC OF NIGERIA
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
            Terms of Service &amp; User Agreement
          </h1>
          <p className="text-muted-foreground text-sm font-mono">
            Effective Date: January 1, 2026 • Primary Jurisdiction: High Court of Lagos State &amp; Federal High Court
          </p>
        </div>

        {/* TERMS CONTENT BODY */}
        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground font-sans">
          
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              1. Acceptance &amp; Platform Scope
            </h2>
            <p>
              By accessing or creating an account on Gatehouse (&quot;Platform&quot;), you agree to be bound by these Terms of Service. Gatehouse provides access management, digital QR gate pass generation, venue directory listings, and turnstile hardware integration for events operating within the Federal Republic of Nigeria.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <Scale className="h-5 w-5 text-[#5cbdb9]" />
              2. Event Organizer Responsibilities
            </h2>
            <p>Event Organizers utilizing Gatehouse agree to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Accurately declare event capacity limits and guest list details.</li>
              <li>Ensure all guest communications comply with the Nigerian Cybercrimes (Prohibition, Prevention, etc.) Act 2015/2024.</li>
              <li>Refrain from issuing forged, fraudulent, or unauthorized access passes.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#38ef7d]" />
              3. Event Centre &amp; Venue Owner Obligations
            </h2>
            <p>
              Venue Owners listing facilities on the Gatehouse Directory warrant that listed venues possess valid state fire safety permits, physical security infrastructure, and capacity licenses required by municipal authorities in Nigeria (e.g. Lagos State Safety Commission).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-foreground">
              4. Governing Law &amp; Dispute Resolution
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any legal suit, action, or proceeding arising out of these Terms shall be instituted exclusively in the High Court of Lagos State or the Federal High Court of Nigeria, Lagos Judicial Division.
            </p>
          </section>

        </div>

      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};
