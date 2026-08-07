import type {
  EventCentre,
  EventItem,
  Booking,
  Delegation,
  Guest,
} from "../types";
import { signQrToken } from "../utils/qrGenerator";

export const MOCK_EVENT_CENTRES: EventCentre[] = [
  {
    id: "c1",
    userId: "u_centre_1",
    name: "Eko Convention Centre",
    description:
      "Premier multipurpose event facility in Lagos, accommodating large scale galas, summits, and grand exhibitions.",
    address: "Plot 1415 Adetokunbo Ademola Street, Victoria Island",
    city: "Lagos",
    capacityMin: 500,
    capacityMax: 5000,
    priceRange: "₦2,500,000 - ₦8,000,000 / day",
    photos: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    ],
    amenities: [
      "VIP Lounge",
      "Full Aircon",
      "High Security",
      "Ample Parking",
      "Sound & Stage Setup",
    ],
    status: "approved",
  },
  {
    id: "c2",
    userId: "u_centre_2",
    name: "Harbour Point Event Centre",
    description:
      "Waterfront luxury event space with state-of-the-art audiovisual infrastructure.",
    address: "4 Wilmot Point Road, Victoria Island",
    city: "Lagos",
    capacityMin: 300,
    capacityMax: 2000,
    priceRange: "₦1,800,000 - ₦4,500,000 / day",
    photos: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    ],
    amenities: [
      "Waterfront View",
      "Full Aircon",
      "Catering Prep Kitchen",
      "Backup Generators",
    ],
    status: "approved",
  },
  {
    id: "c3",
    userId: "u_centre_3",
    name: "The Dome International Hall",
    description:
      "Executive convention centre located in the heart of Abuja for summits and VIP banquets.",
    address: "Central Business District",
    city: "Abuja",
    capacityMin: 200,
    capacityMax: 1500,
    priceRange: "₦1,500,000 - ₦3,800,000 / day",
    photos: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
    ],
    amenities: [
      "Presidential Suite",
      "Helipad Access",
      "Fiber Optic Wi-Fi",
      "Security Screening",
    ],
    status: "approved",
  },
];

export const MOCK_EVENTS: EventItem[] = [
  {
    id: "evt_bloom",
    organizerId: "u_org_1",
    eventCentreId: "c1",
    name: "Bloom Xquisit Gala 2026",
    date: "Sat, 23 Aug 2026",
    startTime: "18:00",
    capacity: 500,
    status: "confirmed",
    registrationLinkToken: "EVT-9F2K1",
  },
  {
    id: "evt_tech",
    organizerId: "u_org_1",
    eventCentreId: "c2",
    name: "Lagos Tech & Product Summit",
    date: "Fri, 12 Sep 2026",
    startTime: "09:00",
    capacity: 1000,
    status: "confirmed",
    registrationLinkToken: "EVT-TECH8",
  },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "b1",
    eventId: "evt_bloom",
    eventCentreId: "c1",
    organizerId: "u_org_1",
    organizerName: "Chidinma Okoro (Xquisit Events)",
    eventName: "Bloom Xquisit Gala 2026",
    requestedDate: "Sat, 23 Aug 2026",
    guestEstimate: 450,
    status: "accepted",
    message: "We require VIP ushering and full hall setup.",
    createdAt: "2026-08-01",
  },
];

export const MOCK_DELEGATIONS: Delegation[] = [
  {
    id: "d1",
    eventId: "evt_bloom",
    eventCentreId: "c1",
    permissions: ["register_guests", "scan_guests"],
    grantedBy: "u_org_1",
  },
];

export const MOCK_INITIAL_GUESTS: Guest[] = [
  {
    id: "g1",
    eventId: "evt_bloom",
    name: "Tunde Bakare",
    phone: "08031112222",
    email: "tunde@bakare.ng",
    category: "VIP",
    source: "organizer",
    code: "EVT-TBK88",
    qrPayload: signQrToken("evt_bloom", "g1", "EVT-TBK88"),
    status: "out",
    checkinTime: null,
  },
  {
    id: "g2",
    eventId: "evt_bloom",
    name: "Amaka Chukwu",
    phone: "08033334444",
    email: "amaka@gmail.com",
    category: "Regular",
    source: "organizer",
    code: "EVT-AMC12",
    qrPayload: signQrToken("evt_bloom", "g2", "EVT-AMC12"),
    status: "out",
    checkinTime: null,
  },
  {
    id: "g3",
    eventId: "evt_bloom",
    name: "Ifeoma Nnamdi",
    phone: "08055556666",
    email: "ifeoma@nnamdi.com",
    category: "Regular",
    source: "self_registered",
    code: "EVT-IFN44",
    qrPayload: signQrToken("evt_bloom", "g3", "EVT-IFN44"),
    status: "out",
    checkinTime: null,
  },
  {
    id: "g4",
    eventId: "evt_bloom",
    name: "Segun Adeyemi",
    phone: "08077778888",
    email: "segun@adeyemi.ng",
    category: "VIP",
    source: "centre_import",
    code: "EVT-SEG99",
    qrPayload: signQrToken("evt_bloom", "g4", "EVT-SEG99"),
    status: "out",
    checkinTime: null,
  },
];
