import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

dotenv.config();

export const app = express();
export const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "GATEHOUSE-PRODUCTION-JWT-SECRET-KEY-2026";
const QR_SIGNING_SECRET = process.env.QR_SIGNING_SECRET || "GATEHOUSE-HMAC-SECURE-KEY-2026";

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000", "https://gatehouse-five.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ---------------- CRYPTOGRAPHIC HMAC-SHA256 QR SIGNING ----------------

export interface QrPayload {
  v: number;
  eventId: string;
  guestId: string;
  code: string;
  category: string;
  iat: number;
}

export function signQrToken(eventId: string, guestId: string, code: string, category = "Regular"): string {
  const payload: QrPayload = {
    v: 1,
    eventId,
    guestId,
    code,
    category,
    iat: Math.floor(Date.now() / 1000),
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", QR_SIGNING_SECRET)
    .update(payloadB64)
    .digest("base64url");

  return `GH1.${payloadB64}.${signature}`;
}

export function verifyQrToken(token: string): { valid: boolean; payload?: QrPayload } {
  try {
    if (!token || !token.startsWith("GH1.")) {
      // Fallback for legacy JSON format during migration
      const legacyData = JSON.parse(token);
      if (legacyData.e && legacyData.g && legacyData.c) {
        return {
          valid: true,
          payload: {
            v: 1,
            eventId: legacyData.e,
            guestId: legacyData.g,
            code: legacyData.c,
            category: "Regular",
            iat: Math.floor(Date.now() / 1000),
          },
        };
      }
      return { valid: false };
    }

    const parts = token.split(".");
    if (parts.length !== 3 || parts[0] !== "GH1") return { valid: false };

    const [, payloadB64, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", QR_SIGNING_SECRET)
      .update(payloadB64)
      .digest("base64url");

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return { valid: false };
    }

    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson) as QrPayload;

    return { valid: true, payload };
  } catch (e) {
    return { valid: false };
  }
}

function genCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return (
    "EVT-" +
    Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  );
}

// ---------------- AUTHENTICATION MIDDLEWARE ----------------

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication token required." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired authentication token." });
  }
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied. Insufficient permissions." });
    }
    next();
  };
}

// ---------------- HEALTH CHECK ----------------

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: "Neon PostgreSQL",
    engine: "Express Architecture Engine",
    crypto: "HMAC-SHA256 Active",
    time: new Date().toISOString(),
  });
});

// ---------------- AUTHENTICATION ENDPOINTS ----------------

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password, role, organization, organizerType, venueName, venueAddress, venueCapacity, country } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === "centre" ? "centre" : "organizer";

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || "08000000000",
        password: hashedPassword,
        role: userRole,
        organization: organization || null,
        organizerType: organizerType || null,
        country: country || "Nigeria",
      },
    });

    if (userRole === "centre") {
      await prisma.eventCentre.create({
        data: {
          userId: newUser.id,
          name: venueName || `${newUser.name} Event Facility`,
          description: "Premium multipurpose event facility.",
          address: venueAddress || "Victoria Island",
          city: "Lagos",
          capacity: Number(venueCapacity) || 2000,
          capacityMin: 200,
          capacityMax: Number(venueCapacity) || 2000,
          priceRange: "₦1,500,000 / day",
          photos: [
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
          ],
          amenities: ["VIP Lounge", "Air Conditioning", "High Security", "Parking"],
          status: "approved",
        },
      });
    }

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        organization: newUser.organization,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    if (user.password) {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid email or password." });
      }
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        organization: user.organization,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/auth/me", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        organization: user.organization,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- EVENT CENTRES & VENUES ----------------

app.get("/api/centres", async (req, res) => {
  try {
    const centres = await prisma.eventCentre.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(centres);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- EVENTS ----------------

app.get("/api/events", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
      include: { eventCentre: true },
    });
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/events", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, date, startTime, capacity, eventCentreId } = req.body;
    const token = "EVT-" + Math.random().toString(36).substring(2, 7).toUpperCase();

    const newEvent = await prisma.event.create({
      data: {
        organizerId: req.user!.userId,
        eventCentreId: eventCentreId || null,
        name: name.trim(),
        date: date.trim(),
        startTime: startTime || "18:00",
        capacity: Number(capacity) || 500,
        status: "confirmed",
        registrationLinkToken: token,
      },
    });

    res.status(201).json(newEvent);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- BOOKINGS ----------------

app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/bookings", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { eventCentreId, eventName, requestedDate, guestEstimate, message } = req.body;

    const newBooking = await prisma.booking.create({
      data: {
        eventCentreId,
        organizerId: req.user!.userId,
        organizerName: req.user!.email,
        eventName,
        requestedDate,
        guestEstimate: Number(guestEstimate),
        status: "requested",
        message: message || "",
      },
    });

    res.status(201).json(newBooking);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/bookings/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    if (status === "accepted") {
      const token = "EVT-" + Math.random().toString(36).substring(2, 7).toUpperCase();
      const newEvt = await prisma.event.create({
        data: {
          organizerId: updated.organizerId,
          eventCentreId: updated.eventCentreId,
          name: updated.eventName,
          date: updated.requestedDate,
          startTime: "18:00",
          capacity: updated.guestEstimate,
          status: "confirmed",
          registrationLinkToken: token,
        },
      });

      await prisma.delegation.create({
        data: {
          eventId: newEvt.id,
          eventCentreId: updated.eventCentreId,
          permissions: ["register_guests", "scan_guests"],
          grantedBy: updated.organizerId,
        },
      });
    }

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- GUESTS & ATOMIC CHECK-IN ----------------

app.get("/api/guests", async (req, res) => {
  try {
    const { eventId } = req.query;
    const where = eventId ? { eventId: String(eventId) } : {};
    const guests = await prisma.guest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.json(guests);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/guests", async (req, res) => {
  try {
    const { eventId, name, phone, email, category, source } = req.body;

    const eventObj = await prisma.event.findUnique({ where: { id: eventId } });
    if (!eventObj) return res.status(404).json({ error: "Event not found" });

    const currentCount = await prisma.guest.count({ where: { eventId } });
    if (currentCount >= eventObj.capacity) {
      return res.status(400).json({
        error: `Event capacity cap reached (${eventObj.capacity} max).`,
      });
    }

    const guestId = "g_" + Math.random().toString(36).substring(2, 9);
    const code = genCode();
    const qrPayload = signQrToken(eventId, guestId, code, category || "Regular");

    const guest = await prisma.guest.create({
      data: {
        id: guestId,
        eventId,
        name: name.trim(),
        phone: (phone || "").trim(),
        email: email || "",
        category: category === "VIP" ? "VIP" : "Regular",
        source: source || "organizer",
        code,
        qrPayload,
        status: "out",
      },
    });

    res.status(201).json(guest);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ATOMIC CONCURRENCY-SAFE QR SCAN & CHECK-IN TRANSACTION
app.post("/api/guests/scan", async (req, res) => {
  try {
    const { eventId, qrPayloadOrCode, scannedBy } = req.body;
    const raw = String(qrPayloadOrCode).trim();
    let targetGuest = null;

    // 1. Verify HMAC-SHA256 Token
    const qrResult = verifyQrToken(raw);
    if (qrResult.valid && qrResult.payload) {
      // Event-scoped validation rule
      if (eventId && qrResult.payload.eventId !== eventId) {
        return res.status(400).json({
          success: false,
          result: "invalid",
          message: "Pass belongs to a different event. Entry rejected.",
        });
      }

      targetGuest = await prisma.guest.findUnique({
        where: { id: qrResult.payload.guestId },
      });
    }

    // 2. Fallback search by code or payload
    if (!targetGuest) {
      targetGuest = await prisma.guest.findFirst({
        where: {
          eventId,
          OR: [{ code: { equals: raw, mode: "insensitive" } }, { qrPayload: raw }],
        },
      });
    }

    if (!targetGuest) {
      return res.status(404).json({
        success: false,
        result: "invalid",
        message: "Invalid or forged QR pass code. HMAC verification failed.",
      });
    }

    // 3. Atomic Transaction: UPDATE WHERE status = 'out'
    const now = new Date();
    const updateCount = await prisma.guest.updateMany({
      where: {
        id: targetGuest.id,
        status: "out",
      },
      data: {
        status: "in",
        checkinTime: now,
        checkedInBy: scannedBy || "Gate Scanner Agent",
      },
    });

    if (updateCount.count === 0) {
      // Duplicate entry detected
      await prisma.checkinLog.create({
        data: {
          guestId: targetGuest.id,
          eventId: targetGuest.eventId,
          scannedBy: scannedBy || "Gate Scanner Agent",
          method: "qr_scan",
          result: "duplicate",
        },
      });

      return res.json({
        success: false,
        result: "duplicate",
        message: `⚠️ DUPLICATE ENTRY BLOCKED: Already checked in. Pass re-use prohibited.`,
        guest: targetGuest,
      });
    }

    // Fetch updated guest record
    const updatedGuest = await prisma.guest.findUnique({ where: { id: targetGuest.id } });

    await prisma.checkinLog.create({
      data: {
        guestId: targetGuest.id,
        eventId: targetGuest.eventId,
        scannedBy: scannedBy || "Gate Scanner Agent",
        method: "qr_scan",
        result: "success",
      },
    });

    res.json({
      success: true,
      result: "success",
      message: `${updatedGuest?.name} checked in successfully at ${now.toLocaleTimeString()}.`,
      guest: updatedGuest,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/guests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.guest.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/guests/:id/undo", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.guest.update({
      where: { id },
      data: { status: "out", checkinTime: null, checkedInBy: null },
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- ADMIN DATA PURGE (FRESH CLEAN SYSTEM) ----------------

app.post("/api/admin/purge-data", async (req, res) => {
  try {
    await prisma.checkinLog.deleteMany({});
    await prisma.guest.deleteMany({});
    await prisma.delegation.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.eventCentre.deleteMany({});
    await prisma.user.deleteMany({});

    res.json({
      success: true,
      message: "All users and platform records erased. System clean.",
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default app;
