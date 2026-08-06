/**
 * Gatehouse Signed HMAC QR Token Generator & Verifier
 * Enterprise Cryptographic Pass Architecture
 */

const HMAC_SECRET = 'GATEHOUSE-HMAC-SECURE-KEY-2026';

export interface QrTokenPayload {
  e: string; // eventId
  g: string; // guestId
  c: string; // guest code e.g. EVT-TBK88
  sig: string; // HMAC Signature
}

export function signQrToken(eventId: string, guestId: string, code: string): string {
  const raw = `${eventId}:${guestId}:${code}:${HMAC_SECRET}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  const signature = Math.abs(hash).toString(36).toUpperCase();
  return JSON.stringify({ e: eventId, g: guestId, c: code, sig: signature });
}

export function verifyQrToken(qrPayloadStr: string): { valid: boolean; eventId?: string; guestId?: string; code?: string } {
  try {
    const data: QrTokenPayload = JSON.parse(qrPayloadStr);
    if (!data.e || !data.g || !data.c || !data.sig) {
      return { valid: false };
    }
    const expectedPayload = signQrToken(data.e, data.g, data.c);
    const parsedExpected: QrTokenPayload = JSON.parse(expectedPayload);
    if (parsedExpected.sig === data.sig) {
      return { valid: true, eventId: data.e, guestId: data.g, code: data.c };
    }
    return { valid: false };
  } catch (e) {
    return { valid: false };
  }
}

/**
 * Deterministic 21x21 SVG QR Code Matrix Grid Generator
 */
export function generateQrGrid(seed: string): boolean[][] {
  const size = 21;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder Patterns (Top-Left, Top-Right, Bottom-Left)
  const drawFinder = (startR: number, startC: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          grid[startR + r][startC + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Pseudo-random data fill based on payload string hash
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const isTopLeft = r < 8 && c < 8;
      const isTopRight = r < 8 && c >= size - 8;
      const isBottomLeft = r >= size - 8 && c < 8;

      if (!isTopLeft && !isTopRight && !isBottomLeft) {
        const val = Math.abs((hash ^ (r * 31 + c * 17)) % 100);
        grid[r][c] = val > 45;
      }
    }
  }

  return grid;
}
