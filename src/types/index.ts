export type UserRole = 'organizer' | 'centre' | 'staff' | 'guest' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
  status?: 'active' | 'suspended';
  createdAt?: string;
}

export interface EventCentre {
  id: string;
  userId: string;
  name: string;
  description: string;
  address: string;
  city: string;
  capacityMin: number;
  capacityMax: number;
  priceRange: string;
  photos: string[];
  amenities: string[];
  status: 'pending' | 'approved' | 'rejected';
}

export interface EventItem {
  id: string;
  organizerId: string;
  eventCentreId?: string | null;
  name: string;
  date: string;
  startTime: string;
  capacity: number;
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled';
  registrationLinkToken: string;
  eventCentre?: EventCentre;
}

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

export interface Delegation {
  id: string;
  eventId: string;
  eventCentreId: string;
  permissions: Array<'register_guests' | 'scan_guests'>;
  grantedBy: string;
  createdAt?: string;
}

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  phone: string;
  email?: string;
  category: 'VIP' | 'Regular';
  source: 'organizer' | 'centre_import' | 'self_registered';
  code: string;
  qrPayload: string;
  status: 'out' | 'in';
  checkinTime?: Date | null;
  checkedInBy?: string | null;
}

export interface CheckinLog {
  id: string;
  guestId: string;
  eventId: string;
  scannedBy: string;
  timestamp: Date;
  method: 'qr_scan' | 'manual_code' | 'face_id';
  result: 'success' | 'duplicate' | 'invalid';
}

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
  | 'settings'
  | 'admin';

export type ViewTab = ViewRoute;
