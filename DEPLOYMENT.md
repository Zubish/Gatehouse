## Vercel / Deployment environment variables

Add the following environment variables in Vercel (Project → Settings → Environment Variables) for the Gatehouse project. Use secure values and do not commit them to source control.

- DATABASE_URL — Postgres connection string (used by Prisma)
- JWT_SECRET — application JWT signing key
- QR_SIGNING_SECRET — HMAC secret used to sign QR tokens (do not expose to frontend)
- GEMINI_API_KEY — Gemini / Google AI API key (or set GOOGLE_AI_API_KEY instead)
- ADMIN_PASSWORD — master admin password for initial bootstrap
- ALLOWED_ORIGINS — comma-separated origins allowed for CORS (e.g. https://gatehouse.example.com)

Notes:
- Set Environment to both Preview and Production as needed.
- After adding variables, redeploy the project so runtime picks up the new values.

Security:
- Rotate any compromised keys immediately.
- Consider using a secrets manager or Vercel's built-in secret storage.
