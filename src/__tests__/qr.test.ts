import { describe, it, expect } from 'vitest';
import { signQrToken, verifyQrToken } from '../utils/qrGenerator';

describe('QR Generator', () => {
  it('generates and verifies demo GH1 tokens', async () => {
    // ensure client demo token can be verified by client verifyQrToken
    const token = signQrToken('evt_test', 'g_test', 'EVT-TEST1');
    const res = await verifyQrToken(token);
    expect(res.valid).toBe(true);
    expect(res.payload).toBeDefined();
    expect(res.payload?.guestId || res.payload?.guestId).toBe('g_test');
  });

  it('accepts legacy JSON payloads', async () => {
    const legacy = JSON.stringify({ e: 'evt_test', g: 'g_test', c: 'EVT-TEST1' });
    const res = await verifyQrToken(legacy);
    expect(res.valid).toBe(true);
    expect(res.payload?.eventId).toBe('evt_test');
  });
});
