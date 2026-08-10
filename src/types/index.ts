/**
 * Gatehouse 2.0 Enterprise TypeScript Interfaces & Data Contracts
 */

/** User Role Authorization Levels */
export type UserRole = 'organizer' | 'centre' | 'staff' | 'guest' | 'admin';

/** Registered User Account Schema */
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
  organization?: string;
  status?: 'active' | 'suspended';
  createdAt?: string;
}

/** Event Centre Facility Listing */
export interface EventCentre {
  id: string;
  userId?: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  capacity?: number;
  capacityMin?: number;
  capacityMax?: number;
  priceRange?: string;
  photos?: string[];
  image?: string;
  amenities: string[];
  halls?: Array<{ id: string; name: string; capacity: number; pricePerDay: string }>;
  contactEmail?: string;
  contactPhone?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export type VenueCentre = EventCentre;

/** Host Event Instance */
export interface EventItem {
  id: string;
  organizerId?: string;
  eventCentreId?: string | null;
  name: string;
  date: string;
  startTime: string;
  capacity: number;
  registeredCount?: number;
  checkedInCount?: number;
  centreName?: string;
  status?: 'draft' | 'confirmed' | 'completed' | 'cancelled';
  registrationLinkToken?: string;
  eventCentre?: EventCentre;
}

export type EventDetails = EventItem;

/** Organizer Venue Booking Request */
export interface Booking {
  id: string;
  eventId?: string;
  eventCentreId: string;
  organizerId: string;
  organizerName: string;
  eventName: string;
  requestedDate: string;
  guestEstimate: number;
  status: 'requested' | 'accepted' | 'declined';
  message?: string;
  createdAt?: string;
}

/** Path B Venue Ushering Delegation Permissions */
export interface Delegation {
  id: string;
  eventId: string;
  eventCentreId: string;
  permissions: Array<'register_guests' | 'scan_guests'>;
  grantedBy: string;
  createdAt?: string;
}

/** Attendee Guest Pass Record */
export interface Guest {
  id: string;
  eventId?: string;
  name: string;
  phone: string;
  email?: string;
  category: 'VIP' | 'Regular';
  source?: 'organizer' | 'centre_import' | 'self_registered';
  organization?: string;
  code: string;
  qrPayload: string;
  status: 'out' | 'in';
  checkinTime?: Date | null;
  checkedInBy?: string | null;
}

/** Audit Checkin Transaction Log */
export interface CheckinLog {
  id: string;
  guestId: string;
  eventId: string;
  scannedBy: string;
  timestamp: Date;
  method: 'qr_scan' | 'manual_code' | 'face_id';
  result: 'success' | 'duplicate' | 'invalid';
}

/** Active Navigation Route Tab */
export type ViewRoute =
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'guests'
  | 'checkin'
  | 'walkin'
  | 'centres'
  | 'centre-dash'
  | 'public-reg'
  | 'my-passes'
  | 'settings'
  | 'admin'
  | 'privacy-policy'
  | 'terms-of-service'
  | 'security-sla'
  | 'demo';

export type ViewTab = ViewRoute;
