export type UserRole = 'organizer' | 'centre' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  token?: string;
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
  status: 'pending' | 'approved' | 'suspended';
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
  status: 'requested' | 'accepted' | 'declined' | 'cancelled';
  message: string;
  createdAt: string;
}

export interface Delegation {
  id: string;
  eventId: string;
  eventCentreId: string;
  permissions: ('register_guests' | 'scan_guests')[];
  grantedBy: string;
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
  status: 'in' | 'out';
  checkinTime: Date | null;
  checkedInBy?: string;
}

export interface CheckinLog {
  id: string;
  guestId: string;
  eventId: string;
  guestName: string;
  scannedBy: string;
  timestamp: Date;
  method: 'qr_scan' | 'manual_code' | 'search_match';
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
  | 'venues' 
  | 'centres'
  | 'centre_portal' 
  | 'public_reg' 
  | 'settings';

export type ViewTab = ViewRoute;
