# Gatehouse QR Token Migration

This document describes the migration steps required when switching QR token formats to the secure `GH1.<payloadB64>.<signature>` HMAC format.

Summary of change

- Old client used a weak JSON payload with a non-cryptographic checksum.
- New format is `GH1.<base64url(payload)>.<signature>` where signature is HMAC-SHA256(payloadB64, QR_SIGNING_SECRET).
- Server now signs/validates GH1 tokens via `QR_SIGNING_SECRET` environment variable.

Migration steps

1. Set `QR_SIGNING_SECRET` in your production environment (secure secret store recommended).
2. Run `prisma generate` and `prisma db push` if schema changed.
3. Re-seed database if you want seeded guests to use GH1 tokens:

   ```bash
   npm run prisma:seed
   ```

   The new `prisma/seed.ts` uses the server signing secret (from `process.env.QR_SIGNING_SECRET`) to create `qrPayload` values.

4. If you have existing guests with legacy JSON `qrPayload`, the server will still attempt to parse and accept legacy JSON payloads for migration, but you should consider updating them by running a small migration script that replaces `qrPayload` with GH1 tokens for existing guests.

Migration script (example)

1. Create a one-off script that:
   - Iterates over `guest` rows.
   - For each guest, computes GH1 token using `signQrToken(eventId, guestId, code)` on the server.
   - Updates `qrPayload` column with the new token.

2. Run the script safely during maintenance window and verify a sample of guest entries.

Rollout notes

- Deploy the server with `QR_SIGNING_SECRET` set before updating the frontend.
- The frontend supports both demo `DEMO` tokens and GH1 tokens when `VITE_QR_SIGNING_SECRET` is provided during local testing; production should not rely on client-side signing.

Testing

- Use the `scripts/test_checkin.js` script to verify guest creation and scanning flows locally.
- Run `npm run test` to run unit tests for QR verification.

If you want, I can add the one-off migration script to `scripts/` and a safe rollout plan (backup and rollback steps).
