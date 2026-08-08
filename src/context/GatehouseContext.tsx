import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole, Guest, EventItem, EventCentre, Booking, Delegation, CheckinLog, ViewRoute } from '../types';

export type ViewTab = ViewRoute;

interface GatehouseContextType {
  currentUser: User | null;
  userRole: UserRole | null;
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  loginUser: (email: string, password?: string) => Promise<boolean>;
  registerUser: (
    name: string,
    email: string,
    password?: string,
    role?: UserRole,
    extra?: {
      phone?: string;
      organization?: string;
      organizerType?: string;
      venueName?: string;
      venueAddress?: string;
      venueCapacity?: string;
      country?: string;
    }
  ) => Promise<boolean>;
  logoutUser: () => void;
  guests: Guest[];
  addGuest: (guest: Omit<Guest, 'id' | 'code' | 'qrPayload' | 'status'>) => Guest;
  undoCheckin: (guestId: string) => void;
  removeGuest: (guestId: string) => void;
  bulkImportGuests: (rawCsv: string) => number;
  checkInGuest: (guestId: string, agentName?: string, method?: 'qr' | 'manual_code' | 'walkin') => Promise<{ result: string; message: string; guest?: Guest }>;
  processQrScan: (qrPayload: string) => Promise<{ result: string; message: string; guest?: Guest }>;
  activeEvent: EventItem;
  events: EventItem[];
  createEvent: (name: string, date: string, startTime: string, capacity: number) => EventItem;
  eventCentres: EventCentre[];
  centres: EventCentre[];
  selectedCentre: EventCentre | null;
  selectCentre: (centre: EventCentre | null) => void;
  bookings: Booking[];
  createBookingRequest: (eventCentreId: string, eventName: string, requestedDate: string, guestEstimate: number, message?: string) => Booking;
  updateBookingStatus: (bookingId: string, status: 'accepted' | 'declined') => void;
  delegations: Delegation[];
  checkinLogs: CheckinLog[];
  checkinTimeline: Date[];
  exportCsvReport: () => void;
}

const GatehouseContext = createContext<GatehouseContextType | undefined>(undefined);

const API_BASE = 'http://localhost:5000/api';

const DEFAULT_EVENT: EventItem = {
  id: 'evt_2026_01',
  name: 'Lagos Tech Fest & Executive Gala 2026',
  date: '2026-08-15',
  startTime: '09:00 AM',
  capacity: 3500,
  registeredCount: 0,
  checkedInCount: 0,
  centreName: 'Eko Convention Centre (Grand Ballroom)',
};

const INITIAL_GUESTS: Guest[] = [];

const INITIAL_CENTRES: EventCentre[] = [
  {
    id: 'c_1',
    name: 'Eko Hotels & Suites Convention Centre',
    city: 'Victoria Island, Lagos',
    address: 'Plot 1415 Adetokunbo Ademola St, VI, Lagos',
    capacity: 5000,
    halls: [
      { id: 'h_1', name: 'Grand Ballroom', capacity: 3000, pricePerDay: '₦5,500,000' },
      { id: 'h_2', name: 'Ocean View Marquee', capacity: 2000, pricePerDay: '₦3,800,000' },
    ],
    amenities: ['2.5MVA Soundproof Generators', 'Turnstile Access Gates', 'VIP Holding Suites', 'Helipad Access'],
    image: '/assets/closing_cta_venue_1786085136089.jpg',
    contactEmail: 'events@ekohotels.com',
    contactPhone: '+234 1 277 2700',
  },
  {
    id: 'c_2',
    name: 'Landmark Centre',
    city: 'Lekki Phase 1, Lagos',
    address: 'Water Corporation Drive, Victoria Island Annex, Lagos',
    capacity: 4000,
    halls: [
      { id: 'h_3', name: 'Hall 1 (Exhibition Center)', capacity: 2500, pricePerDay: '₦4,500,000' },
      { id: 'h_4', name: 'Hall 2 (Conference Pavilion)', capacity: 1500, pricePerDay: '₦2,800,000' },
    ],
    amenities: ['Beachfront Promenade', 'CCTV Sentinel Surveillance', '2000 Car Parking Complex', 'Fiber Optic Mesh'],
    image: '/assets/hero_command_center_1786085006377.jpg',
    contactEmail: 'bookings@landmarkcentre.com',
    contactPhone: '+234 1 448 0777',
  },
  {
    id: 'c_3',
    name: 'International Conference Centre (ICC)',
    city: 'Maitama, Abuja FCT',
    address: 'Herbert Macaulay Way, Central Business District, Abuja',
    capacity: 6000,
    halls: [
      { id: 'h_5', name: 'Africa Hall', capacity: 3500, pricePerDay: '₦6,000,000' },
      { id: 'h_6', name: 'Presidential Suite Hall', capacity: 1500, pricePerDay: '₦3,500,000' },
    ],
    amenities: ['Diplomatic Armed Security Gates', 'Simultaneous Translation Pods', 'Underground Vaults'],
    image: '/assets/ecosystem_diagram_1786085092807.jpg',
    contactEmail: 'info@iccabuja.gov.ng',
    contactPhone: '+234 9 234 1000',
  },
];

const TAB_PATH_MAP: Record<ViewTab, string> = {
  landing: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  guests: '/guests',
  checkin: '/checkin',
  walkin: '/walkin',
  centres: '/centres',
  'centre-dash': '/centre-dash',
  'public-reg': '/public-reg',
  settings: '/settings',
  admin: '/admin',
  'privacy-policy': '/privacy-policy',
  'terms-of-service': '/terms-of-service',
  'security-sla': '/security-sla',
  demo: '/demo',
};

const ROUTE_PATH_MAP: Record<string, ViewTab> = Object.entries(TAB_PATH_MAP).reduce((acc, [tab, path]) => {
  acc[path] = tab as ViewTab;
  return acc;
}, {} as Record<string, ViewTab>);

const PUBLIC_MARKETING_VIEWS: ViewTab[] = [
  'landing',
  'login',
  'register',
  'centres',
  'privacy-policy',
  'terms-of-service',
  'security-sla',
  'demo',
];

export const GatehouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<ViewTab>(() => {
    const path = window.location.pathname;
    return ROUTE_PATH_MAP[path] || 'landing';
  });

  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('gatehouse_auth_token'));
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem('gatehouse_guests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_GUESTS;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('gatehouse_events');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [DEFAULT_EVENT];
  });

  const [activeEvent, setActiveEvent] = useState<EventItem>(() => events[0] || DEFAULT_EVENT);
  const [eventCentres] = useState<EventCentre[]>(INITIAL_CENTRES);
  const [selectedCentre, setSelectedCentre] = useState<EventCentre | null>(INITIAL_CENTRES[0]);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('gatehouse_bookings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [delegations] = useState<Delegation[]>([]);
  const [checkinLogs] = useState<CheckinLog[]>([]);
  const [checkinTimeline, setCheckinTimeline] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem('gatehouse_guests', JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem('gatehouse_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('gatehouse_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const changeTab = useCallback((newTab: ViewTab, pushHistory = true) => {
    if (
      (currentUser?.email?.includes('demo') || currentUser?.email?.includes('venue')) &&
      PUBLIC_MARKETING_VIEWS.includes(newTab)
    ) {
      localStorage.removeItem('gatehouse_auth_token');
      setAuthToken(null);
      setCurrentUser(null);
    }

    setActiveTabState(newTab);
    const path = TAB_PATH_MAP[newTab] || '/';

    if (pushHistory && window.location.pathname !== path) {
      window.history.pushState({ tab: newTab }, '', path);
    }
  }, [currentUser]);

  useEffect(() => {
    if (
      (currentUser?.email?.includes('demo') || currentUser?.email?.includes('venue')) &&
      PUBLIC_MARKETING_VIEWS.includes(activeTab)
    ) {
      localStorage.removeItem('gatehouse_auth_token');
      setAuthToken(null);
      setCurrentUser(null);
    }
  }, [activeTab, currentUser]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        changeTab(event.state.tab, false);
      } else {
        const path = window.location.pathname;
        const matchedTab = ROUTE_PATH_MAP[path] || 'landing';
        changeTab(matchedTab, false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [changeTab]);

  useEffect(() => {
    const initAuth = async () => {
      if (authToken) {
        const rawAccounts = localStorage.getItem('gatehouse_registered_users');
        if (rawAccounts) {
          try {
            const accounts: (User & { password?: string })[] = JSON.parse(rawAccounts);
            const matched = accounts.find((a) => a.id === authToken || a.email === authToken);
            if (matched) {
              setCurrentUser(matched);
              setUserRole(matched.role);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error('Failed parsing registered users:', e);
          }
        }

        try {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          if (res.ok) {
            const user = await res.json();
            setCurrentUser(user);
            setUserRole(user.role);
          }
        } catch (e) {
          console.error('Auth verification error:', e);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [authToken]);

  const loginUser = async (email: string, password = ''): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('gatehouse_auth_token', data.token);
        setAuthToken(data.token);
        setCurrentUser(data.user);
        setUserRole(data.user.role);
        return true;
      }
    } catch (e) {
      console.error('API login unavailable:', e);
    }

    const rawAccounts = localStorage.getItem('gatehouse_registered_users');
    if (rawAccounts) {
      try {
        const accounts: (User & { password?: string })[] = JSON.parse(rawAccounts);
        const match = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
        if (match) {
          if (match.password && password && match.password !== password) {
            console.warn('Password mismatch');
            return false;
          }
          const token = match.id;
          localStorage.setItem('gatehouse_auth_token', token);
          setAuthToken(token);
          setCurrentUser(match);
          setUserRole(match.role);
          return true;
        }
      } catch (e) {
        console.error('Local accounts parse error:', e);
      }
    }

    const isDemoEmail = email === 'demo@gatehouse.app' || email.includes('organizer');
    const isVenueEmail = email === 'venue@gatehouse.app' || email === 'security@ekohotels.com' || email.includes('venue');

    if (isDemoEmail || isVenueEmail) {
      const mockUser: User = isVenueEmail
        ? {
            id: 'venue_eko_1',
            name: 'Eko Hotels Management',
            email: 'venue@gatehouse.app',
            phone: '08030009999',
            role: 'centre',
          }
        : {
            id: 'org_musa_1',
            name: 'Musa Ibrahim',
            email: 'demo@gatehouse.app',
            phone: '08031234567',
            role: 'organizer',
          };

      const mockToken = `token_${Date.now()}`;
      localStorage.setItem('gatehouse_auth_token', mockToken);
      setAuthToken(mockToken);
      setCurrentUser(mockUser);
      setUserRole(mockUser.role);
      return true;
    }

    return false;
  };

  const registerUser = async (
    name: string,
    email: string,
    password = 'password123',
    role: UserRole = 'organizer',
    extra?: {
      phone?: string;
      organization?: string;
      organizerType?: string;
      venueName?: string;
      venueAddress?: string;
      venueCapacity?: string;
      country?: string;
    }
  ): Promise<boolean> => {
    try {
      const payload = { name, email, password, role, ...extra };
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('gatehouse_auth_token', data.token);
        setAuthToken(data.token);
        setCurrentUser(data.user);
        setUserRole(data.user.role);
        return true;
      }
    } catch (err) {
      console.warn('Backend API registration failed, using local registration fallback.');
    }

    const newUser: User = {
      id: `u_${Date.now()}`,
      name,
      email,
      phone: extra?.phone || '08000000000',
      role,
    };

    const mockToken = `token_${Date.now()}`;
    localStorage.setItem('gatehouse_auth_token', mockToken);
    setAuthToken(mockToken);
    setCurrentUser(newUser);
    setUserRole(newUser.role);
    return true;
  };

  const logoutUser = () => {
    localStorage.removeItem('gatehouse_auth_token');
    setAuthToken(null);
    setCurrentUser(null);
    setUserRole(null);
    changeTab('landing');
  };

  const createEvent = (name: string, date: string, startTime: string, capacity: number): EventItem => {
    const newEvt: EventItem = {
      id: `evt_${Date.now()}`,
      name,
      date,
      startTime,
      capacity,
      registeredCount: 0,
      checkedInCount: 0,
      organizerId: currentUser?.id || 'org_default',
    };
    setEvents((prev) => [newEvt, ...prev]);
    setActiveEvent(newEvt);
    return newEvt;
  };

  const addGuest = (guestData: Omit<Guest, 'id' | 'code' | 'qrPayload' | 'status'>): Guest => {
    const id = `g_${Date.now()}`;
    const code = `${guestData.category === 'VIP' ? 'VIP' : 'REG'}-${Math.floor(1000 + Math.random() * 9000)}`;
    const qrPayload = `GH:${code}:${activeEvent.id}:sig_${Math.random().toString(36).substring(2, 9)}`;

    const newGuest: Guest = {
      ...guestData,
      id,
      code,
      qrPayload,
      status: 'out',
    };

    setGuests((prev) => [newGuest, ...prev]);
    return newGuest;
  };

  const undoCheckin = (guestId: string) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, status: 'out', checkinTime: null, checkedInBy: null } : g))
    );
  };

  const removeGuest = (guestId: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== guestId));
  };

  const bulkImportGuests = (rawCsv: string): number => {
    const lines = rawCsv.split('\n').filter((l) => l.trim().length > 0);
    let addedCount = 0;

    lines.forEach((line, idx) => {
      if (idx === 0 && line.toLowerCase().includes('name')) return;
      const parts = line.split(',').map((p) => p.trim());
      if (parts.length >= 2) {
        const name = parts[0];
        const email = parts[1];
        const category = parts[2]?.toUpperCase() === 'VIP' ? 'VIP' : 'Regular';
        const organization = parts[3] || 'Corporate Guest';

        addGuest({
          name,
          email,
          phone: '+234 800 000 0000',
          category,
          organization,
        });
        addedCount++;
      }
    });

    return addedCount;
  };

  const checkInGuest = async (
    guestId: string,
    agentName = 'Gate Sentinel',
    method: 'qr' | 'manual_code' | 'walkin' = 'qr'
  ) => {
    const target = guests.find((g) => g.id === guestId);
    if (!target) return { result: 'error', message: 'Guest record not found.' };

    if (target.status === 'in') {
      return {
        result: 'duplicate',
        message: `⚠️ DUPLICATE ENTRY BLOCKED: ${target.name} (${target.code}) already checked in! Pass reuse intercepted by Musa AI.`,
        guest: target,
      };
    }

    const updated: Guest = {
      ...target,
      status: 'in',
      checkinTime: new Date(),
      checkedInBy: agentName,
    };

    setGuests((prev) => prev.map((g) => (g.id === guestId ? updated : g)));
    setCheckinTimeline((prev) => [...prev, new Date()]);

    return {
      result: 'success',
      message: `✅ ACCESS GRANTED: Welcome ${updated.name} (${updated.category}). Turnstile unlocked via ${method.toUpperCase()}.`,
      guest: updated,
    };
  };

  const processQrScan = async (qrPayload: string) => {
    const match = guests.find((g) => g.qrPayload === qrPayload || g.code === qrPayload);
    if (!match) {
      return {
        result: 'invalid',
        message: '❌ INVALID PASS: Cryptographic signature mismatch. Unrecognized QR payload.',
      };
    }

    return checkInGuest(match.id, 'Gate Camera Scanner', 'qr');
  };

  const createBookingRequest = (
    eventCentreId: string,
    eventName: string,
    requestedDate: string,
    guestEstimate: number,
    message?: string
  ): Booking => {
    const newB: Booking = {
      id: `bk_${Date.now()}`,
      eventCentreId,
      organizerId: currentUser?.id || 'org_1',
      organizerName: currentUser?.name || 'Musa Ibrahim',
      eventName,
      requestedDate,
      guestEstimate,
      status: 'requested',
      message,
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [newB, ...prev]);
    return newB;
  };

  const updateBookingStatus = (bookingId: string, status: 'accepted' | 'declined') => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status } : b)));
  };

  const selectCentre = (centre: EventCentre | null) => {
    setSelectedCentre(centre);
  };

  const exportCsvReport = () => {
    let csv = 'ID,Name,Email,Phone,Category,PassCode,Status,CheckinTime,CheckedInBy\n';
    guests.forEach((g) => {
      const timeStr = g.checkinTime ? g.checkinTime.toISOString() : '';
      csv += `"${g.id}","${g.name}","${g.email}","${g.phone}","${g.category}","${g.code}","${g.status}","${timeStr}","${g.checkedInBy || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `gatehouse_attendance_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <GatehouseContext.Provider
      value={{
        currentUser,
        userRole,
        activeTab,
        setActiveTab: changeTab,
        loginUser,
        registerUser,
        logoutUser,
        guests,
        addGuest,
        undoCheckin,
        removeGuest,
        bulkImportGuests,
        checkInGuest,
        processQrScan,
        activeEvent,
        events,
        createEvent,
        eventCentres,
        centres: eventCentres,
        selectedCentre,
        selectCentre,
        bookings,
        createBookingRequest,
        updateBookingStatus,
        delegations,
        checkinLogs,
        checkinTimeline,
        exportCsvReport,
      }}
    >
      {!loading && children}
    </GatehouseContext.Provider>
  );
};

export const useGatehouse = () => {
  const ctx = useContext(GatehouseContext);
  if (!ctx) throw new Error('useGatehouse must be used within GatehouseProvider');
  return ctx;
};
