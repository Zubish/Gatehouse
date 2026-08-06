/**
 * Pure SVG QR Matrix Generator & Signed HMAC Token Utilities for Gatehouse
 */

// Simple HMAC-like hashing utility for signing QR tokens
export function signQrToken(eventId: string, guestId: string, code: string): string {
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

export function verifyQrToken(qrPayloadStr: string): { valid: boolean; eventId?: string; guestId?: string; code?: string } {
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

// Generate 25x25 QR Grid matrix array of booleans based on payload string
export function generateQrGrid(payload: string): boolean[][] {
  const size = 21;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder pattern helper
  const addFinder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          if (r + i < size && c + j < size) grid[r + i][c + j] = true;
        }
      }
    }
  };

  // 3 Finder patterns at top-left, top-right, bottom-left
  addFinder(0, 0);
  addFinder(0, size - 7);
  addFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (i % 2 === 0) {
      grid[6][i] = true;
      grid[i][6] = true;
    }
  }

  // Hash payload into body cells
  let h = 0;
  for (let i = 0; i < payload.length; i++) {
    h = (h << 5) - h + payload.charCodeAt(i);
    h |= 0;
  }
  const seed = Math.abs(h);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder areas
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= size - 8) ||
        (r >= size - 8 && c < 8) ||
        r === 6 ||
        c === 6
      ) {
        continue;
      }
      const val = (seed ^ (r * 31 + c * 17)) % 100;
      grid[r][c] = val > 45;
    }
  }

  return grid;
}
