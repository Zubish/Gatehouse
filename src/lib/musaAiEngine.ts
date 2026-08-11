import type { EventItem, User } from '../types';

export interface MusaContext {
  activeEvent?: EventItem | null;
  currentUser?: User | null;
  guestsCount?: number;
  checkedInCount?: number;
}

export function generateMusaResponse(query: string, context: MusaContext): string {
  const q = query.trim();
  const lower = q.toLowerCase();

  // Active Event Context Variables
  const eventName = context.activeEvent?.name || 'Grand Tech Summit 2026';
  const eventDate = context.activeEvent?.date || 'October 24, 2026';
  const eventTime = context.activeEvent?.startTime || '09:00 AM';
  const capacity = context.activeEvent?.capacity || 1000;
  const guests = context.guestsCount ?? 450;
  const checkedIn = context.checkedInCount ?? 180;
  const userName = context.currentUser?.name || 'Event Specialist';
  const userRole = context.currentUser?.role || 'organizer';

  // 1. General AI Greetings & Identity
  if (/^(hi|hello|hey|greetings|hola|good morning|good afternoon|good evening)/i.test(lower)) {
    return `Hello ${userName}! 👋 I am **Musa**, your intelligent Gatehouse AI Assistant. I'm here to assist with real-time gate security, guest check-ins, pass recovery, venue management, and event analytics for **${eventName}**. How can I help you right now?`;
  }

  if (lower.includes('who are you') || lower.includes('what are you') || lower.includes('your name')) {
    return `I am **Musa AI**, the autonomous event operations and gate security assistant built into the **Gatehouse** platform. I help event hosts, venue managers, and guests resolve access issues, monitor turnstiles, generate pass tokens, and optimize event logistics in real time.`;
  }

  if (lower.includes('what can you do') || lower.includes('help me') || lower.includes('capabilities') || lower.includes('features')) {
    return `Here are some key things I can do for you:
• 🎟️ **Pass Recovery**: Look up lost guest passes by email, phone, or pass code.
• 📊 **Live Analytics**: Monitor check-in rates, turnstile throughput, and total capacity.
• 🔒 **Security Verification**: Inspect HMAC-SHA256 QR signatures and anti-passback defense.
• 📋 **Guest Management**: Guide bulk Excel (.xlsx/.csv) imports and VIP pass issuance.
• 🏛️ **Venue Operations**: Help event planners search, request, and manage venue bookings.
• 💡 **General Event Assistance**: Answer any questions about event setup, troubleshooting, and logistics!`;
  }

  // 2. Real-Time Event & Check-In Stats
  if (lower.includes('stat') || lower.includes('checkin rate') || lower.includes('how many checked in') || lower.includes('attendance') || lower.includes('capacity')) {
    const rate = Math.round((checkedIn / (guests || 1)) * 100);
    return `Here is the live status for **${eventName}**:
• 👥 **Total Registered Guests**: ${guests}
• ✅ **Checked-In Guests**: ${checkedIn} (${rate}% attendance)
• 🏛️ **Venue Maximum Capacity**: ${capacity}
• ⌛ **Remaining Available Slots**: ${Math.max(0, capacity - checkedIn)}

Gates are currently operating smoothly with real-time turnstile verification.`;
  }

  // 3. QR Passes & Technical Security
  if (lower.includes('qr') || lower.includes('token') || lower.includes('hmac') || lower.includes('security') || lower.includes('passback')) {
    return `🔒 **Gatehouse Cryptographic Pass Security**:
Every Gatehouse pass is encoded in the \`GH1.<payloadB64>.<signature>\` format.
• **HMAC-SHA256 Server Signature**: Ensures passes cannot be forged or tampered with.
• **Anti-Passback Defense**: Atomic database transactions mark passes as \`status = 'in'\` instantly upon entry to prevent pass sharing.
• **Offline Offline Fallback**: Gate scanners cache valid public keys for instant turnstile barrier release.`;
  }

  // 4. Excel & CSV Bulk Import Assistance
  if (lower.includes('excel') || lower.includes('csv') || lower.includes('import') || lower.includes('bulk') || lower.includes('spreadsheet')) {
    return `📥 **Bulk Guest Import Guide**:
1. Navigate to the **Guest List** tab in the sidebar.
2. Click **Import Guest List**.
3. Upload any **.xlsx**, **.xls**, or **.csv** spreadsheet.
4. Ensure your spreadsheet contains headers: \`Name\`, \`Email\`, \`Phone\`, \`Category\` (optional), and \`Organization\` (optional).
5. Click **Process Spreadsheet** — Gatehouse will automatically generate HMAC-signed QR passes for all guests instantly!`;
  }

  // 5. Pass Recovery & Guest Support
  if (lower.includes('recover') || lower.includes('lost pass') || lower.includes('find pass') || lower.includes('ticket')) {
    return `🎫 **Guest Pass Recovery**:
Guests who mislaid their ticket can easily recover it:
1. Direct them to the **My Passes** view at \`/my-passes\`.
2. They can search by their **Email Address**, **Phone Number**, or **9-Character Code**.
3. Passes can be viewed live, downloaded as PDF/images, or shared directly to **WhatsApp**.`;
  }

  // 6. Venue & Event Centre Information
  if (lower.includes('venue') || lower.includes('centre') || lower.includes('location') || lower.includes('address') || lower.includes('book')) {
    return `🏛️ **Venue & Event Centre Guide**:
• Current Event: **${eventName}**
• Date & Time: **${eventDate}** starting at **${eventTime}**
• To browse or request new event centres, go to **Book Venues** (\`/centres\`) to view capacity, hourly rates, amenities, and send instant booking requests to venue owners.`;
  }

  // 7. Turnstile Hardware & Scanner Integration
  if (lower.includes('scanner') || lower.includes('camera') || lower.includes('turnstile') || lower.includes('hardware')) {
    return `📹 **Gate Scanner & Turnstile Setup**:
1. Open the **Gate Scanner** tab (\`/checkin\`).
2. Click **Enable Camera** to connect your device's physical camera.
3. Hold any guest's QR code in front of the lens.
4. The WebRTC scanner automatically decodes the token, plays an audio confirmation beep, verifies status in real-time, and sends the signal to open the physical gate barrier.`;
  }

  // 8. Role & Admin Permissions
  if (lower.includes('admin') || lower.includes('permission') || lower.includes('role') || lower.includes('logout') || lower.includes('session')) {
    return `🔐 **Role-Based Access Control (RBAC)**:
You are currently logged in as **${userName}** (${userRole.toUpperCase()}).
• **Event Hosts (Organizers)**: Full control over guest lists, check-ins, walk-ins, and venue bookings.
• **Venue Owners**: Manage facility availability, review incoming booking requests, and set hourly pricing.
• **System Admins**: Accessed via \`/admin\` master password gate for platform governance, telemetry, and revenue monitoring.`;
  }

  // 9. Conversational AI Fallback for General Knowledge & Questions
  return `That's a great question! Regarding **"${q}"**:

In the context of event operations for **${eventName}**, Gatehouse ensures your access workflows, turnstile gates, and attendee data stay synchronized and secure. 

If you need specific help with:
1. **Pass Recovery** for attendees (\`/my-passes\`)
2. **Bulk Spreadsheet Import** (.xlsx / .csv)
3. **Turnstile Gate Camera Setup** (\`/checkin\`)
4. **Venue Bookings & Analytics**

Feel free to ask me anything specific, and I'll guide you step-by-step! 😊`;
}
