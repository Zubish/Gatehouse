/**
 * Gatehouse 2.0 Production API Client
 * Centralized typed network client with token authorization injection.
 */

import type { User, EventItem, EventCentre, Booking, Guest } from '../types';

const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('gatehouse_auth_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network request failed' }));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Health
  getHealth: () => fetchApi<{ status: string; database: string }>('/api/health'),

  // Auth
  register: (data: any) => fetchApi<{ token: string; user: User }>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => fetchApi<{ token: string; user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  adminLogin: (password: string) => fetchApi<{ token: string; user: User }>('/api/auth/admin-login', { method: 'POST', body: JSON.stringify({ password }) }),
  getMe: () => fetchApi<{ user: User }>('/api/auth/me'),

  // Event Centres / Venues
  getCentres: () => fetchApi<EventCentre[]>('/api/centres'),

  // Events
  getEvents: () => fetchApi<EventItem[]>('/api/events'),
  createEvent: (data: any) => fetchApi<EventItem>('/api/events', { method: 'POST', body: JSON.stringify(data) }),

  // Bookings
  getBookings: () => fetchApi<Booking[]>('/api/bookings'),
  createBooking: (data: any) => fetchApi<Booking>('/api/bookings', { method: 'POST', body: JSON.stringify(data) }),
  updateBookingStatus: (id: string, status: string) => fetchApi<Booking>(`/api/bookings/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Guests
  getGuests: (eventId?: string) => fetchApi<Guest[]>(eventId ? `/api/guests?eventId=${eventId}` : '/api/guests'),
  createGuest: (data: any) => fetchApi<Guest>('/api/guests', { method: 'POST', body: JSON.stringify(data) }),
  bulkImportGuests: (data: { eventId: string; csvData: string }) => fetchApi<{ added: number; errors: string[] }>('/api/guests/bulk', { method: 'POST', body: JSON.stringify(data) }),
  scanGuest: (data: { eventId?: string; qrPayloadOrCode: string; scannedBy?: string }) => fetchApi<{ success: boolean; result: string; message: string; guest?: Guest }>('/api/guests/scan', { method: 'POST', body: JSON.stringify(data) }),
  lookupGuests: (query: string) => fetchApi<Guest[]>(`/api/guests/lookup?query=${encodeURIComponent(query)}`),
  undoCheckin: (guestId: string) => fetchApi<Guest>(`/api/guests/${guestId}/undo`, { method: 'PATCH' }),
  deleteGuest: (guestId: string) => fetchApi<{ success: boolean }>(`/api/guests/${guestId}`, { method: 'DELETE' }),

  // Admin
  purgeData: () => fetchApi<{ success: boolean; message: string }>('/api/admin/purge-data', { method: 'POST' }),

  // Musa AI
  musaChat: (prompt: string, context?: any) =>
    fetchApi<{ reply: string }>('/api/musa/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt, context }),
    }),
};
