---
name: gatehouse-dev-standards
description: Core design, UX, and architectural principles for the Gatehouse platform.
---

# Gatehouse Platform — Engineering & Design Standards

This skill documents the mandatory development style, UX guidelines, and architectural standards for all future work on the Gatehouse platform.

---

## 1. 🎨 Visual Aesthetics & Enterprise Polish
- **Stripe / Linear Quality Standard**: Every view and component must look state-of-the-art with dark mode glassmorphism (`bg-card/60`, `backdrop-blur-xl`, `card-glow`), curated HSL color tokens (`--navy-900: #0f1b3d`, `--glow: #5cbdb9`, `--accent-green: #38ef7d`), and modern typography (`Space Grotesk` headings, `DM Sans` body, `JetBrains Mono` code chips).
- **Brand Assets & Transparency**: Use official vector brand logos (`/logo.svg`) with 100% transparent backgrounds. Never enclose logos in grey boxes or opaque backgrounds.

---

## 2. 🚫 Zero Technical Noise & Jargon in User-Facing UI
- **No Developer Jargon**: Never expose internal backend technologies, database engines (e.g. `Neon PostgreSQL`), cloud infrastructure providers (e.g. `Vercel Serverless`), or internal code secrets to end users in footers, headers, or marketing sections.
- **Clean Footer Styling**:
  - **Auth Screens (`/login`, `/register`)**: Minimal 1-line legal copyright bar: `© 2026 Gatehouse Inc. All rights reserved. • Terms of Service • Privacy Policy`.
  - **Control Room App Footers**: Clean enterprise operational status bar: `Gatehouse Enterprise OS • Secure Access & Venue Operations • All Systems Operational`.

---

## 3. 🔐 User Privacy & Explicit Consent
- **No Default-Checked Consent**: Agreement checkboxes (e.g. Terms of Service, Privacy Policy, Newsletter consent) must always start **unchecked by default**. Users must explicitly check the box to confirm consent.
- **Enforced Consent Validation**: Submitting registration forms without explicit consent must trigger clear validation feedback.

---

## 4. 👥 Role-Aware Progressive Disclosure
- **Distinct Platform Roles**: Maintain strict architectural separation between **Event Organizers** (event hosts, guest management, pass issuance) and **Venue Owners** (facility managers, gate turnstiles, venue bookings).
- **Progressive Field Disclosure**: Disclose only role-relevant form fields dynamically when switching roles.

---

## 5. 🧩 Uncluttered Interfaces & Navbar Tooling
- **Dedicated Navbar Tooling**: Secondary tools and sandbox utilities (such as "View Demo" shortcuts) belong in topbar navbar dropdown menus, keeping primary authentication forms focused exclusively on sign-in and account creation.

---

## 6. 🇳🇬 Real-World Regional Context
- **Local Location Intelligence**: Implement multi-tiered location filtering adapted to real-world Nigerian market conventions (e.g. Jiji.ng style cascading filters for Lagos State, Ikeja, Victoria Island, Lekki, Ojuelegba, Yaba, Abuja, Port Harcourt, Ibadan).
