import type { User, EventItem, Guest, Booking } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ScanResponse {
  success: boolean;
  result: 'success' | 'duplicate' | 'invalid';
  message: string;
  guest?: Guest;
}

export class ApiClient {
  private static getHeaders(): HeadersInit {
    const token = localStorage.getItem('gatehouse_auth_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // ---------------- AUTH ----------------

  static async registerUser(payload: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    role?: string;
    organization?: string;
    organizerType?: string;
    venueName?: string;
    venueAddress?: string;
    venueCapacity?: string;
    country?: string;
  }): Promise<AuthResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error('API register error:', e);
      return null;
    }
  }

  static async loginUser(email: string, password?: string): Promise<AuthResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error('API login error:', e);
      return null;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.user || null;
    } catch (e) {
      return null;
    }
  }

  // ---------------- EVENTS ----------------

  static async fetchEvents(): Promise<EventItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/events`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  }

  static async createEvent(payload: {
    name: string;
    date: string;
    startTime?: string;
    capacity: number;
    eventCentreId?: string;
  }): Promise<EventItem | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  // ---------------- GUESTS & SCAN ----------------

  static async fetchGuests(eventId?: string): Promise<Guest[]> {
    try {
      const url = eventId ? `${API_BASE_URL}/guests?eventId=${eventId}` : `${API_BASE_URL}/guests`;
      const res = await fetch(url, { headers: this.getHeaders() });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  }

  static async createGuest(payload: {
    eventId: string;
    name: string;
    phone: string;
    email?: string;
    category?: 'VIP' | 'Regular';
    source?: string;
  }): Promise<Guest | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/guests`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  static async processScan(eventId: string, qrPayloadOrCode: string, scannedBy?: string): Promise<ScanResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/guests/scan`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ eventId, qrPayloadOrCode, scannedBy }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        return {
          success: false,
          result: 'invalid',
          message: errData.message || 'Pass scan validation failed.',
        };
      }
      return await res.json();
    } catch (e) {
      return {
        success: false,
        result: 'invalid',
        message: 'Network offline. Edge Mesh processing.',
      };
    }
  }

  // ---------------- BOOKINGS ----------------

  static async fetchBookings(): Promise<Booking[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, { headers: this.getHeaders() });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  }

  static async createBooking(payload: Partial<Booking>): Promise<Booking | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  static async updateBookingStatus(id: string, status: 'accepted' | 'declined'): Promise<Booking | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }
}
