# Environment variables reference

Single place to see what the app and CI expect in **Production**, **Preview**, and **local**. Values are set in Vercel (or `.env.local`); never commit real secrets. See also [`SECURITY.md`](../SECURITY.md).

## Legend

| Column | Meaning |
|--------|---------|
| **Scope** | `server` = never exposed to the browser; `client` = `NEXT_PUBLIC_*` baked into the client bundle |
| **Prod** | `required` / `recommended` / `optional` for a normal production launch |

---

## Launch & routing

| Variable | Scope | Prod | Purpose |
|----------|-------|------|-----------|
| `COMING_SOON_MODE` | server | recommended | `true` rewrites most routes to `/coming-soon`; set `false` before public go-live |
| `MAINTENANCE_MODE` | server | optional | `true` emergency maintenance rewrite to `/maintenance` (stricter bypass list than coming-soon) |
| `NODE_ENV` | server | required | `production` in prod (usually set by the host) |

---

## App URLs & branding

| Variable | Scope | Prod | Purpose |
|----------|-------|------|-----------|
| `NEXT_PUBLIC_APP_URL` | client | required | Canonical HTTPS site URL (also used in emails and PDF/report links) |
| `NEXT_PUBLIC_APP_NAME` | client | required | Display name (see `src/lib/env-validator.ts`) |
| `NEXT_PUBLIC_BASE_URL` | client | recommended | Used by some PayPal return URLs; align with `NEXT_PUBLIC_APP_URL` if both are set |

---

## Firebase (client)

| Variable | Scope | Prod | Purpose |
|----------|-------|------|-----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | client | required | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | client | required | e.g. `*.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | client | required | Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | client | required | GCS bucket name |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | client | required | Numeric sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | client | required | App ID (`1:…`) |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | client | required | Web Push / FCM VAPID public key |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | client | optional | Analytics `G-…` |

---

## Firebase Admin (server API routes)

Used where routes call Admin SDK with explicit credentials (see `src/app/api/user/refresh-profile`, moderator routes, etc.).

| Variable | Scope | Prod | Purpose |
|----------|-------|------|-----------|
| `FIREBASE_PROJECT_ID` | server | required* | Admin project ID |
| `FIREBASE_CLIENT_EMAIL` | server | required* | Service account client email |
| `FIREBASE_PRIVATE_KEY` | server | required* | Private key (use `\n` for newlines in Vercel) |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | server | optional | Full JSON string alternative used by `src/lib/firebase-admin.ts` when set |

\*If you rely solely on `FIREBASE_SERVICE_ACCOUNT_KEY` JSON, the three-field split may be redundant—pick one style per environment and keep it consistent.

---

## Stripe

| Variable | Scope | Prod | Purpose |
|----------|-------|------|-----------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | client | required | `pk_live_…` in production |
| `STRIPE_SECRET_KEY` | server | required | `sk_live_…` / `sk_test_…` |
| `STRIPE_WEBHOOK_SECRET` | server | required | Webhook signing secret |

---

## PayPal

| Variable | Scope | Prod | Purpose |
|----------|-------|------|-----------|
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | client | required | Client ID |
| `PAYPAL_CLIENT_SECRET` | server | required | Secret |
| `PAYPAL_MODE` | server | recommended | `sandbox` or `live` |
| `PAYPAL_WEBHOOK_ID` | server | recommended | Webhook verification |

---

## Email (Resend + SMTP)

| Variable | Scope | Prod | Purpose |
|----------|-------|------|-----------|
| `RESEND_API_KEY` | server | recommended | Resend API |
| `RESEND_FROM_EMAIL` | server | optional | From address (defaults exist in code) |
| `CONTACT_EMAIL` | server | optional | Inbound routing / notifications |
| `SMTP_HOST` | server | optional | SMTP host (e.g. Hostinger) |
| `SMTP_PORT` | server | optional | Port (often `465`) |
| `SMTP_USER` | server | optional | SMTP user |
| `SMTP_PASSWORD` | server | optional | SMTP password |
| `USE_EMAIL_QUEUE` | server | optional | `true` to enable queue path in mail helper |

---

## WhatsApp (Graph API) — post-MVP

**MVP:** omit these unless you ship WhatsApp verification. Optional / unused in production until then.

| Variable | Scope | When used | Purpose |
|----------|-------|-----------|---------|
| `WHATSAPP_PHONE_NUMBER_ID` | server | Post-MVP | Meta phone number ID |
| `WHATSAPP_ACCESS_TOKEN` | server | Post-MVP | Long-lived user token |
| `WHATSAPP_VERIFY_TOKEN` | server | Post-MVP | Webhook verification token |

Rotation procedure (when feature is on): [`WHATSAPP-TOKEN-ROTATION.md`](./WHATSAPP-TOKEN-ROTATION.md).

---

## reCAPTCHA

| Variable | Scope | Prod | Purpose |
|----------|-------|------|-----------|
| `RECAPTCHA_SECRET_KEY` | server | required | Server-side verify |

---

## Auth / monitoring / alerts

| Variable | Scope | Prod | Purpose |
|----------|-------|------|-----------|
| `NEXTAUTH_SECRET` | server | recommended | Referenced in env validator for secure auth flows |
| `NEXT_PUBLIC_SENTRY_DSN` | client | optional | Sentry browser DSN |
| `PAYMENT_ALERT_THRESHOLD_COUNT` | server | optional | Webhook failure alert threshold |
| `PAYMENT_ALERT_WINDOW_MS` | server | optional | Rolling window for failures |
| `PAYMENT_ALERT_COOLDOWN_MS` | server | optional | Cooldown between alerts |
| `PAYMENT_ALERT_WEBHOOK_URL` | server | optional | Outbound alert webhook |

---

## Feature flags (`NEXT_PUBLIC_*`)

| Variable | Default if unset | Purpose |
|----------|------------------|---------|
| `NEXT_PUBLIC_MVP_MODE` | off | MVP feature gate (`src/lib/feature-flags.ts`) |
| `NEXT_PUBLIC_BETA_MODE` | off | Beta / coupon behaviour |
| `NEXT_PUBLIC_ENABLE_PAYMENTS` | on | Payments |
| `NEXT_PUBLIC_ENABLE_TIERS` | on | Tiered pricing UI |
| `NEXT_PUBLIC_SHOW_PRICING_PAGE` | on | Pricing page |
| `NEXT_PUBLIC_ENABLE_INFLUENCERS` | on | Influencer flows |
| `NEXT_PUBLIC_ENABLE_COUPONS` | on | Coupons |

---

## CI / GitHub Actions

| Secret / var | Used by |
|--------------|---------|
| _(none)_ | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) — runs `npm run scan:secrets` (full tree; see `.secret-scan-ignore`) after `npm ci` |
| `HEALTH_CHECK_URL` | [`.github/workflows/external-health-check.yml`](../.github/workflows/external-health-check.yml) — full production health URL |
| `VERCEL_TOKEN` | [`.github/workflows/deploy-vercel-staging.yml`](../.github/workflows/deploy-vercel-staging.yml) and [`deploy-vercel-production.yml`](../.github/workflows/deploy-vercel-production.yml) |

Optional: set `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` as repository **Variables** if you prefer not to rely on committed `.vercel/project.json` values in workflows.

---

## Local development

Copy from team template or generate notes from `envValidator.generateTemplate()` in `src/lib/env-validator.ts`. Use `.env.local` (gitignored).

## Related

- [`api-route-security-matrix.md`](../api-route-security-matrix.md) — which routes need which auth
- [`launch-preparation-tracker.md`](../launch-preparation-tracker.md) — task **DOC-01** source of truth pointer
