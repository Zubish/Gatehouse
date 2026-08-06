import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

async function main() {
  console.log('🌱 Seeding Neon PostgreSQL Database...');

  // Create Users
  const orgUser = await prisma.user.upsert({
    where: { email: 'chidinma@xquisitevents.ng' },
    update: {},
    create: {
      name: 'Chidinma Okoro',
      email: 'chidinma@xquisitevents.ng',
      phone: '08031234567',
      role: 'organizer',
    },
  });

  const centreUser1 = await prisma.user.upsert({
    where: { email: 'events@ekohotels.com' },
    update: {},
    create: {
      name: 'Eko Convention Centre Management',
      email: 'events@ekohotels.com',
      phone: '08099998888',
      role: 'centre',
    },
  });

  // Create Event Centres
  const centre1 = await prisma.eventCentre.create({
    data: {
      userId: centreUser1.id,
      name: 'Eko Convention Centre',
      description: 'Premier multipurpose event facility in Lagos, accommodating large scale galas, summits, and grand exhibitions.',
      address: 'Plot 1415 Adetokunbo Ademola Street, Victoria Island',
      city: 'Lagos',
      capacityMin: 500,
      capacityMax: 5000,
      priceRange: '₦2,500,000 - ₦8,000,000 / day',
      photos: [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      ],
      amenities: ['VIP Lounge', 'Full Aircon', 'High Security', 'Ample Parking', 'Sound & Stage Setup'],
      status: 'approved',
    },
  });

  const centre2 = await prisma.eventCentre.create({
    data: {
      userId: centreUser1.id,
      name: 'Harbour Point Event Centre',
      description: 'Waterfront luxury event space with state-of-the-art audiovisual infrastructure.',
      address: '4 Wilmot Point Road, Victoria Island',
      city: 'Lagos',
      capacityMin: 300,
      capacityMax: 2000,
      priceRange: '₦1,800,000 - ₦4,500,000 / day',
      photos: [
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      ],
      amenities: ['Waterfront View', 'Full Aircon', 'Catering Prep Kitchen', 'Backup Generators'],
      status: 'approved',
    },
  });

  // Create Events
  const event1 = await prisma.event.create({
    data: {
      organizerId: orgUser.id,
      eventCentreId: centre1.id,
      name: 'Bloom Xquisit Gala 2026',
      date: 'Sat, 23 Aug 2026',
      startTime: '18:00',
      capacity: 500,
      status: 'confirmed',
      registrationLinkToken: 'EVT-9F2K1',
    },
  });

  // Create Bookings
  await prisma.booking.create({
    data: {
      eventId: event1.id,
      eventCentreId: centre1.id,
      organizerId: orgUser.id,
      organizerName: orgUser.name,
      eventName: event1.name,
      requestedDate: event1.date,
      guestEstimate: 450,
      status: 'accepted',
      message: 'Requesting venue booking for annual gala event.',
    },
  });

  // Create Delegation
  await prisma.delegation.create({
    data: {
      eventId: event1.id,
      eventCentreId: centre1.id,
      permissions: ['register_guests', 'scan_guests'],
      grantedBy: orgUser.id,
    },
  });

  // Create Initial Guests
  const g1Id = 'g_seed_1';
  const g1Code = 'EVT-TBK88';
  await prisma.guest.create({
    data: {
      id: g1Id,
      eventId: event1.id,
      name: 'Tunde Bakare',
      phone: '08031112222',
      email: 'tunde@bakare.ng',
      category: 'VIP',
      source: 'organizer',
      code: g1Code,
      qrPayload: signQrToken(event1.id, g1Id, g1Code),
      status: 'out',
    },
  });

  const g2Id = 'g_seed_2';
  const g2Code = 'EVT-AMC12';
  await prisma.guest.create({
    data: {
      id: g2Id,
      eventId: event1.id,
      name: 'Amaka Chukwu',
      phone: '08033334444',
      email: 'amaka@gmail.com',
      category: 'Regular',
      source: 'organizer',
      code: g2Code,
      qrPayload: signQrToken(event1.id, g2Id, g2Code),
      status: 'out',
    },
  });

  console.log('✅ Neon PostgreSQL Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
