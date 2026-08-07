# Gatehouse senior hardening deployment notes

## 1. Replace the junior implementation
Replace:
- server/index.ts
- api/index.ts
- src/context/GatehouseContext.tsx
- src/services/apiService.ts (stop using it; use apiClient.ts)
- src/utils/qrGenerator.ts
- src/components/views/AuthView.tsx

Add:
- server/app.ts
- src/services/apiClient.ts
- src/components/views/QRCodePass.tsx

Also apply the patched view files and Prisma schema in this folder.

## 2. Secrets
Create real secrets outside source control:
- JWT_SECRET
- QR_SIGNING_SECRET
- DATABASE_URL
- GOOGLE_CLIENT_ID
- VITE_GOOGLE_CLIENT_ID

Rotate any old secrets that appeared in Git history. The old hard-coded values must be considered compromised.

## 3. Database
For a new environment:
  npx prisma migrate dev --name gatehouse_hardening

For production, generate and apply a reviewed migration:
  npx prisma migrate deploy

Do not use `db push` as the production migration process.

## 4. Frontend auth
The browser no longer stores a JWT or password. Authentication is an HttpOnly cookie. Requests use `credentials: include`.

## 5. QR security
The browser never signs QR payloads. The server signs them with HMAC-SHA256. A pass has the form:
  GH1.<base64url-payload>.<base64url-signature>

The signature secret must never be prefixed with VITE_ and must never be shipped to the browser.

## 6. Real QR codes
The old 21x21 SVG grid was not a real QR code. The patch uses the `qrcode` package to generate standards-compliant QR codes from the server-signed payload.

## 7. Google
The fake account chooser is removed. Google Identity Services returns a credential and the backend verifies the Google identity before creating/signing in the Gatehouse account.

Configure the Google OAuth/Web Client ID and the correct authorized origins in Google Cloud.

## 8. Production rate limiting
The included limiter is intentionally small and process-local. It protects a single instance, but it is NOT a distributed limiter.

Before a horizontally scaled commercial launch, move rate limiting to Redis/Upstash or another shared store.

## 9. Hardware
The turnstile endpoint in this patch is an authorization boundary. It does not pretend to control physical hardware. Connect the real relay controller through an authenticated hardware gateway/service and keep that credential server-side.

## 10. CI acceptance tests
Before launch, CI must cover:
- register/login/logout
- unauthorized API access
- organizer cannot access another organizer's event
- venue cannot modify another venue's booking
- forged QR rejected
- expired QR rejected
- QR from another event rejected
- simultaneous duplicate scans produce exactly one success
- capacity cannot be exceeded under concurrent registration
- public registration works only with a valid registration token
- Google identity cannot be impersonated by changing frontend fields
