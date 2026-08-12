(async ()=>{
  try {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbXNwa3hqbmgwMDAwdmkyd3JrNWRzeG81IiwiZW1haWwiOiJ0ZXN0ZXJAZ2F0ZWhvdXNlLnRlc3QiLCJyb2xlIjoib3JnYW5pemVyIiwiaWF0IjoxNzg2NTA4MzI4LCJleHAiOjE3ODcxMTMxMjh9.umk5q06Y7JoUKOsaPgkaIrWF-Hm5OWYMbgI3NRlvJqQ';
    const headers = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token };

    const fetchJson = async (url, opts = {}) => {
      const res = await fetch(url, opts);
      const text = await res.text();
      try { return JSON.parse(text); } catch (e) { return text; }
    };

    console.log('Fetching events...');
    const events = await fetchJson('http://localhost:3001/api/events', { headers });
    console.log('events length:', Array.isArray(events) ? events.length : Object.keys(events).length);
    const eventId = Array.isArray(events) && events.length > 0 ? events[0].id : events.id || 'evt_2026_01';
    console.log('Using eventId', eventId);

    console.log('Creating guest...');
    const guest = await fetchJson('http://localhost:3001/api/guests', { method: 'POST', headers, body: JSON.stringify({ eventId, name: 'Auto Guest', phone: '08011112222', category: 'Regular' }) });
    console.log('guest created id:', guest?.id);

    console.log('Scanning guest...');
    const scan = await fetchJson('http://localhost:3001/api/guests/scan', { method: 'POST', headers, body: JSON.stringify({ eventId, qrPayloadOrCode: guest.qrPayload, scannedBy: 'AutomatedTest' }) });
    console.log('scan result:', scan);

    console.log('Fetching guests list...');
    const guests = await fetchJson('http://localhost:3001/api/guests?eventId=' + eventId, { headers });
    console.log('first guests:', guests.slice(0,3));
  } catch (e) {
    console.error('Error during test:', e);
  }
})();
