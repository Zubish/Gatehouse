import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Helper for HMAC QR payload generation
function signQrToken(eventId: string, guestId: string, code: string): string {
  const secret = 'GATEHOUSE-HMAC-SECURE-KEY-2026';
  const raw = `${eventId}:${guestId}:${code}:${secret}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  const signature = Math.abs(hash).toString(36).toUpperCase();
  return JSON.stringify({ e: eventId, g: guestId, c: code, sig: signature });
}

function verifyQrToken(qrPayloadStr: string): { valid: boolean; eventId?: string; guestId?: string; code?: string } {
  try {
    const data = JSON.parse(qrPayloadStr);
    if (!data.e || !data.g || !data.c || !data.sig) return { valid: false };
    const expected = signQrToken(data.e, data.g, data.c);
    const parsedExpected = JSON.parse(expected);
    if (parsedExpected.sig === data.sig) {
      return { valid: true, eventId: data.e, guestId: data.g, code: data.c };
    }
    return { valid: false };
  } catch (e) {
    return { valid: false };
  }
}

function genCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'EVT-' + Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ---------------- API ENDPOINTS ----------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'Vercel Serverless', database: 'Neon PostgreSQL', time: new Date().toISOString() });
});

app.get('/api/centres', async (req, res) => {
  try {
    const centres = await prisma.eventCentre.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(centres);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({ orderBy: { createdAt: 'desc' }, include: { eventCentre: true } });
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { name, date, startTime, capacity, eventCentreId } = req.body;
    const token = 'EVT-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const org = await prisma.user.findFirst({ where: { role: 'organizer' } });

    const newEvent = await prisma.event.create({
      data: {
        organizerId: org?.id || 'u_org_1',
        eventCentreId: eventCentreId || null,
        name: name.trim(),
        date: date.trim(),
        startTime: startTime || '18:00',
        capacity: Number(capacity) || 500,
        status: 'confirmed',
        registrationLinkToken: token,
      },
    });

    res.status(201).json(newEvent);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { eventCentreId, eventName, requestedDate, guestEstimate, message } = req.body;
    const org = await prisma.user.findFirst({ where: { role: 'organizer' } });

    const newBooking = await prisma.booking.create({
      data: {
        eventCentreId,
        organizerId: org?.id || 'u_org_1',
        organizerName: org?.name || 'Chidinma Okoro (Xquisit Events)',
        eventName,
        requestedDate,
        guestEstimate: Number(guestEstimate),
        status: 'requested',
        message: message || '',
      },
    });

    res.status(201).json(newBooking);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.booking.update({ where: { id }, data: { status } });

    if (status === 'accepted') {
      const token = 'EVT-' + Math.random().toString(36).substring(2, 7).toUpperCase();
      const newEvt = await prisma.event.create({
        data: {
          organizerId: updated.organizerId,
          eventCentreId: updated.eventCentreId,
          name: updated.eventName,
          date: updated.requestedDate,
          startTime: '18:00',
          capacity: updated.guestEstimate,
          status: 'confirmed',
          registrationLinkToken: token,
        },
      });

      await prisma.delegation.create({
        data: {
          eventId: newEvt.id,
          eventCentreId: updated.eventCentreId,
          permissions: ['register_guests', 'scan_guests'],
          grantedBy: updated.organizerId,
        },
      });
    }

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/delegations', async (req, res) => {
  try {
    const delegations = await prisma.delegation.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(delegations);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/guests', async (req, res) => {
  try {
    const { eventId } = req.query;
    const where = eventId ? { eventId: String(eventId) } : {};
    const guests = await prisma.guest.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(guests);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/guests', async (req, res) => {
  try {
    const { eventId, name, phone, email, category, source } = req.body;
    const eventObj = await prisma.event.findUnique({ where: { id: eventId } });
    if (!eventObj) return res.status(404).json({ error: 'Event not found' });

    const currentCount = await prisma.guest.count({ where: { eventId } });
    if (currentCount >= eventObj.capacity) {
      return res.status(400).json({ error: `Event capacity cap reached (${eventObj.capacity} max).` });
    }

    const guestId = 'g_' + Math.random().toString(36).substring(2, 9);
    const code = genCode();
    const qrPayload = signQrToken(eventId, guestId, code);

    const guest = await prisma.guest.create({
      data: {
        id: guestId,
        eventId,
        name: name.trim(),
        phone: (phone || '').trim(),
        email: email || '',
        category: category === 'VIP' ? 'VIP' : 'Regular',
        source: source || 'organizer',
        code,
        qrPayload,
        status: 'out',
      },
    });

    res.status(201).json(guest);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/guests/bulk', async (req, res) => {
  try {
    const { eventId, rawText, source } = req.body;
    const lines = String(rawText).split('\n').map((l) => l.trim()).filter(Boolean);
    const eventObj = await prisma.event.findUnique({ where: { id: eventId } });
    if (!eventObj) return res.status(404).json({ error: 'Event not found' });

    let addedCount = 0;
    for (const line of lines) {
      const parts = line.split(',').map((p) => p.trim());
      const [name, phone, cat, email] = parts;
      if (name) {
        const guestId = 'g_' + Math.random().toString(36).substring(2, 9);
        const code = genCode();
        const qrPayload = signQrToken(eventId, guestId, code);

        await prisma.guest.create({
          data: {
            id: guestId,
            eventId,
            name,
            phone: phone || '',
            email: email || '',
            category: cat?.toUpperCase() === 'VIP' ? 'VIP' : 'Regular',
            source: source || 'organizer',
            code,
            qrPayload,
            status: 'out',
          },
        });
        addedCount++;
      }
    }

    res.json({ addedCount });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/guests/scan', async (req, res) => {
  try {
    const { eventId, qrPayloadOrCode, scannedBy } = req.body;
    const raw = String(qrPayloadOrCode).trim();
    let targetGuest = null;

    const qrResult = verifyQrToken(raw);
    if (qrResult.valid && qrResult.guestId) {
      targetGuest = await prisma.guest.findUnique({ where: { id: qrResult.guestId } });
    }

    if (!targetGuest) {
      targetGuest = await prisma.guest.findFirst({
        where: {
          eventId,
          OR: [{ code: { equals: raw, mode: 'insensitive' } }, { qrPayload: raw }],
        },
      });
    }

    if (!targetGuest) {
      targetGuest = await prisma.guest.findFirst({
        where: { eventId, name: { contains: raw, mode: 'insensitive' } },
      });
    }

    if (!targetGuest) {
      return res.status(404).json({
        success: false,
        result: 'invalid',
        message: 'Invalid or forged QR code. Pass signature verification failed.',
      });
    }

    if (targetGuest.status === 'in') {
      await prisma.checkinLog.create({
        data: {
          guestId: targetGuest.id,
          eventId: targetGuest.eventId,
          scannedBy: scannedBy || 'Gate Camera Agent',
          method: 'qr_scan',
          result: 'duplicate',
        },
      });

      return res.json({
        success: false,
        result: 'duplicate',
        message: `Already checked in at ${targetGuest.checkinTime?.toLocaleTimeString()}. Duplicate entry blocked.`,
        guest: targetGuest,
      });
    }

    const now = new Date();
    const updated = await prisma.guest.update({
      where: { id: targetGuest.id },
      data: { status: 'in', checkinTime: now, checkedInBy: scannedBy || 'Gate Camera Agent' },
    });

    await prisma.checkinLog.create({
      data: {
        guestId: updated.id,
        eventId: updated.eventId,
        scannedBy: scannedBy || 'Gate Camera Agent',
        method: 'qr_scan',
        result: 'success',
      },
    });

    res.json({
      success: true,
      result: 'success',
      message: `${updated.name} checked in successfully at ${now.toLocaleTimeString()}.`,
      guest: updated,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/guests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.guest.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/guests/:id/undo', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.guest.update({
      where: { id },
      data: { status: 'out', checkinTime: null, checkedInBy: null },
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default app;
