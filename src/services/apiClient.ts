import { api } from '../lib/api-client';

// Backwards-compatible wrapper for the older `ApiClient` surface.
export class ApiClient {
  static async registerUser(payload: any) {
    return api.register(payload);
  }

  static async loginUser(email: string, password?: string) {
    return api.login({ email, password });
  }

  static async getCurrentUser() {
    const res = await api.getMe();
    return res?.user ?? null;
  }

  static async fetchEvents() {
    return api.getEvents();
  }

  static async createEvent(payload: any) {
    return api.createEvent(payload);
  }

  static async fetchGuests(eventId?: string) {
    return api.getGuests(eventId);
  }

  static async createGuest(payload: any) {
    return api.createGuest(payload);
  }

  static async processScan(eventId: string, qrPayloadOrCode: string, scannedBy?: string) {
    return api.scanGuest({ eventId, qrPayloadOrCode, scannedBy });
  }

  static async fetchBookings() {
    return api.getBookings();
  }

  static async createBooking(payload: any) {
    return api.createBooking(payload);
  }

  static async updateBookingStatus(id: string, status: 'accepted' | 'declined') {
    return api.updateBookingStatus(id, status);
  }
}
