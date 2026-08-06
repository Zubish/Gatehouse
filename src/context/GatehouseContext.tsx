import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  UserRole, 
  EventCentre, 
  EventItem, 
  Booking, 
  Delegation, 
  Guest, 
  CheckinLog, 
  ViewTab 
} from '../types';

const API_BASE = 'http://localhost:3001/api';

interface GatehouseContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;

  // Event Centres
  eventCentres: EventCentre[];
  selectedCentre: EventCentre | null;
  setSelectedCentre: (centre: EventCentre | null) => void;
  createBookingRequest: (centreId: string, eventName: string, requestedDate: string, guestEstimate: number, message: string) => Promise<void>;

  // Bookings & Delegations
  bookings: Booking[];
  updateBookingStatus: (bookingId: string, status: 'accepted' | 'declined') => Promise<void>;
  delegations: Delegation[];

  // Events & Active Selection
  events: EventItem[];
  activeEventId: string;
  setActiveEventId: (eventId: string) => void;
  activeEvent: EventItem;
  createEvent: (name: string, date: string, startTime: string, capacity: number, centreId?: string | null) => Promise<EventItem | null>;

  // Guests (Scoped to active event in Neon DB)
  guests: Guest[];
  addGuest: (name: string, phone: string, category: 'VIP' | 'Regular', source?: 'organizer' | 'centre_import' | 'self_registered', email?: string) => Promise<Guest | null>;
  checkInGuest: (guestId: string, scannedBy?: string, method?: 'qr_scan' | 'manual_code' | 'search_match') => Promise<{ success: boolean; result: 'success' | 'duplicate' | 'invalid'; message: string; guest?: Guest }>;
  undoCheckin: (guestId: string) => Promise<void>;
  removeGuest: (guestId: string) => Promise<void>;
  bulkImportGuests: (rawText: string, source?: 'organizer' | 'centre_import') => Promise<number>;

  // QR Scanning & Camera Engine
  processQrScan: (qrPayloadOrCode: string) => Promise<{ success: boolean; result: 'success' | 'duplicate' | 'invalid'; message: string; guest?: Guest }>;

  // Analytics & Logs
  checkinLogs: CheckinLog[];
  checkinTimeline: Date[];
  exportCsvReport: () => void;
  loading: boolean;
}

const GatehouseContext = createContext<GatehouseContextType | undefined>(undefined);

export const GatehouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('organizer');
  const [activeTab, setActiveTab] = useState<ViewTab>('landing');

  const [eventCentres, setEventCentres] = useState<EventCentre[]>([]);
  const [selectedCentre, setSelectedCentre] = useState<EventCentre | null>(null);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeEventId, setActiveEventId] = useState<string>('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);

  const [checkinLogs] = useState<CheckinLog[]>([]);
  const [checkinTimeline, setCheckinTimeline] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data from Express + Neon DB API
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [centresRes, eventsRes, bookingsRes, delegationsRes] = await Promise.all([
        fetch(`${API_BASE}/centres`).then((r) => r.json()),
        fetch(`${API_BASE}/events`).then((r) => r.json()),
        fetch(`${API_BASE}/bookings`).then((r) => r.json()),
        fetch(`${API_BASE}/delegations`).then((r) => r.json()),
      ]);

      setEventCentres(centresRes);
      if (centresRes.length > 0) setSelectedCentre(centresRes[0]);

      setEvents(eventsRes);
      if (eventsRes.length > 0) {
        setActiveEventId(eventsRes[0].id);
        fetchGuestsForEvent(eventsRes[0].id);
      }

      setBookings(bookingsRes);
      setDelegations(delegationsRes);
    } catch (e) {
      console.error('Failed to connect to Gatehouse Express / Neon DB API:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuestsForEvent = async (eventId: string) => {
    if (!eventId) return;
    try {
      const res = await fetch(`${API_BASE}/guests?eventId=${eventId}`);
      const data = await res.json();
      setGuests(
        data.map((g: any) => ({
          ...g,
          checkinTime: g.checkinTime ? new Date(g.checkinTime) : null,
        }))
      );
    } catch (e) {
      console.error('Failed to fetch guests for event:', e);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (activeEventId) {
      fetchGuestsForEvent(activeEventId);
    }
  }, [activeEventId]);

  const activeEvent: EventItem = events.find((e) => e.id === activeEventId) || {
    id: 'evt_fallback',
    organizerId: 'u_org_1',
    name: 'Bloom Xquisit Gala 2026',
    date: 'Sat, 23 Aug 2026',
    startTime: '18:00',
    capacity: 500,
    status: 'confirmed',
    registrationLinkToken: 'EVT-9F2K1',
  };

  // Create Booking Request
  const createBookingRequest = async (
    centreId: string,
    eventName: string,
    requestedDate: string,
    guestEstimate: number,
    message: string
  ) => {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventCentreId: centreId,
          eventName,
          requestedDate,
          guestEstimate,
          message,
        }),
      });
      const newBooking = await res.json();
      setBookings((prev) => [newBooking, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  // Update Booking Status (Centre Portal)
  const updateBookingStatus = async (bookingId: string, status: 'accepted' | 'declined') => {
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
      // Refresh events & delegations
      fetchAllData();
    } catch (e) {
      console.error(e);
    }
  };

  // Create Event
  const createEvent = async (
    name: string,
    date: string,
    startTime: string,
    capacity: number,
    centreId?: string | null
  ): Promise<EventItem | null> => {
    try {
      const res = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date, startTime, capacity, eventCentreId: centreId }),
      });
      const newEvt = await res.json();
      setEvents((prev) => [...prev, newEvt]);
      setActiveEventId(newEvt.id);
      return newEvt;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  // Add Guest
  const addGuest = async (
    name: string,
    phone: string,
    category: 'VIP' | 'Regular',
    source: 'organizer' | 'centre_import' | 'self_registered' = 'organizer',
    email?: string
  ): Promise<Guest | null> => {
    try {
      const res = await fetch(`${API_BASE}/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: activeEventId,
          name,
          phone,
          category,
          source,
          email,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to add guest');
        return null;
      }

      const newGuest = await res.json();
      const parsed = {
        ...newGuest,
        checkinTime: newGuest.checkinTime ? new Date(newGuest.checkinTime) : null,
      };
      setGuests((prev) => [parsed, ...prev]);
      return parsed;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  // Check In Guest directly
  const checkInGuest = async (
    guestId: string,
    scannedBy = 'Gate Staff',
    method: 'qr_scan' | 'manual_code' | 'search_match' = 'manual_code'
  ) => {
    try {
      const res = await fetch(`${API_BASE}/guests/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: activeEventId,
          qrPayloadOrCode: guestId,
          scannedBy,
          method,
        }),
      });

      const data = await res.json();
      if (data.guest) {
        const parsedGuest = {
          ...data.guest,
          checkinTime: data.guest.checkinTime ? new Date(data.guest.checkinTime) : null,
        };
        setGuests((prev) => prev.map((g) => (g.id === parsedGuest.id ? parsedGuest : g)));
        if (data.success) {
          setCheckinTimeline((prev) => [...prev, new Date()]);
        }
        return { ...data, guest: parsedGuest };
      }
      return data;
    } catch (e) {
      return { success: false, result: 'invalid' as const, message: 'Server connection error.' };
    }
  };

  // Process QR Scan
  const processQrScan = async (qrPayloadOrCode: string) => {
    try {
      const res = await fetch(`${API_BASE}/guests/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: activeEventId,
          qrPayloadOrCode,
          scannedBy: 'Gate Camera Agent',
          method: 'qr_scan',
        }),
      });
      const data = await res.json();
      if (data.guest) {
        const parsedGuest = {
          ...data.guest,
          checkinTime: data.guest.checkinTime ? new Date(data.guest.checkinTime) : null,
        };
        setGuests((prev) => prev.map((g) => (g.id === parsedGuest.id ? parsedGuest : g)));
        if (data.success) {
          setCheckinTimeline((prev) => [...prev, new Date()]);
        }
        return { ...data, guest: parsedGuest };
      }
      return data;
    } catch (e) {
      return { success: false, result: 'invalid' as const, message: 'Server connection error.' };
    }
  };

  const undoCheckin = async (guestId: string) => {
    try {
      const res = await fetch(`${API_BASE}/guests/${guestId}/undo`, { method: 'PATCH' });
      const updated = await res.json();
      setGuests((prev) => prev.map((g) => (g.id === guestId ? { ...updated, checkinTime: null } : g)));
    } catch (e) {
      console.error(e);
    }
  };

  const removeGuest = async (guestId: string) => {
    try {
      await fetch(`${API_BASE}/guests/${guestId}`, { method: 'DELETE' });
      setGuests((prev) => prev.filter((g) => g.id !== guestId));
    } catch (e) {
      console.error(e);
    }
  };

  const bulkImportGuests = async (rawText: string, source: 'organizer' | 'centre_import' = 'organizer'): Promise<number> => {
    try {
      const res = await fetch(`${API_BASE}/guests/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: activeEventId, rawText, source }),
      });
      const data = await res.json();
      fetchGuestsForEvent(activeEventId);
      return data.addedCount || 0;
    } catch (e) {
      console.error(e);
      return 0;
    }
  };

  const exportCsvReport = () => {
    const rows = [['Event', 'Name', 'Phone', 'Email', 'Category', 'Source', 'Status', 'Check-in Time', 'Code']];
    guests.forEach((g) => {
      const timeStr = g.checkinTime
        ? g.checkinTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';
      rows.push([
        activeEvent.name,
        g.name,
        g.phone || '',
        g.email || '',
        g.category,
        g.source,
        g.status === 'in' ? 'Checked in' : 'No-show',
        timeStr,
        g.code,
      ]);
    });
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeEvent.name.replace(/\s+/g, '_')}_guest_report.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <GatehouseContext.Provider
      value={{
        userRole,
        setUserRole,
        activeTab,
        setActiveTab,
        eventCentres,
        selectedCentre,
        setSelectedCentre,
        createBookingRequest,
        bookings,
        updateBookingStatus,
        delegations,
        events,
        activeEventId,
        setActiveEventId,
        activeEvent,
        createEvent,
        guests,
        addGuest,
        checkInGuest,
        undoCheckin,
        removeGuest,
        bulkImportGuests,
        processQrScan,
        checkinLogs,
        checkinTimeline,
        exportCsvReport,
        loading,
      }}
    >
      {children}
    </GatehouseContext.Provider>
  );
};

export const useGatehouse = () => {
  const context = useContext(GatehouseContext);
  if (!context) {
    throw new Error('useGatehouse must be used within a GatehouseProvider');
  }
  return context;
};
