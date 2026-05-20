# Progress Tracking Files - Update Summary

**Last updated:** May 20, 2026 (evening)  
**Purpose:** Summary of documentation updates for launch readiness tracking

---

## May 20, 2026 (evening) — Email verification & auth hardening

### Completed (production-verified)

| Area | Status | Notes |
|------|--------|-------|
| Email verification flow | Done | Register → Arabic Resend from `contact@3arida.org` → verify on `www.3arida.org` → login |
| Unverified account block | Done | Cannot login or create/sign petitions until verified; Firestore rules deployed |
| Resend verification | Done | Authenticated + email-only APIs; Firebase Admin `FIREBASE_*` credentials fix (401 resolved) |
| Verification link domain | Done | Links rewritten to `www.3arida.org` (not `firebaseapp.com` CORS error) |
| Welcome email | Done | Production URLs + button contrast (`1dd6b7e`) |
| Email subject branding | Done | `#عريـــضة` (`61e22ed`) |

### Commits (on `main`)

| Commit | Summary |
|--------|---------|
| `0f76a0e` | Mandatory email verification + Firestore rules |
| `037b2d0` | Firebase Admin credentials + resend APIs |
| `6aaa13e` | Rewrite verification links to app domain |
| `61e22ed` | Verification email subject branding |
| `1735495` | Payment receipt split (paid flows) |
| `1dd6b7e` | Welcome email production URLs |

### Tracker changes

- [`launch-preparation-tracker.md`](launch-preparation-tracker.md): new **§15 Email verification** (EV-01–EV-10), G-03 auth notes, §13 row 2, E-04/E-05 deployed — **97 tasks / 92 done**
- [`docs/FIREBASE-EMAIL-VERIFICATION.md`](docs/FIREBASE-EMAIL-VERIFICATION.md): deploy + link rewrite docs

### Remaining launch blockers

- **G-01** security sign-off
- **G-03** petition create/sign formal smoke; Google OAuth spot-check
- **G-04** rollback drill
- **T-06** PayPal webhooks (Stripe done)
- **E-08** payment email matrix smoke

---

## May 20, 2026 — Payment emails, contact form, reCAPTCHA

### Completed (production-verified or configured)

| Area | Status | Notes |
|------|--------|-------|
| Contact form | Done | Success on `www.3arida.org`; delivers to `contact@3arida.org` |
| reCAPTCHA | Done | Domains `3arida.org`, `www.3arida.org`; Vercel keys via CLI |
| Tip emails | Done | No Stripe receipt; thank-you via webhook only |
| Stripe support on receipts | Done | Dashboard `support@3arida.org` |
| Paid petition / upgrade receipts | Done | `receipt_email` enabled; deployed on `main` |

### Tracker changes

- [`launch-preparation-tracker.md`](launch-preparation-tracker.md): **§14 Payment & transactional emails** (E-01–E-08)
- [`docs/PAYMENT-EMAIL-MATRIX.md`](docs/PAYMENT-EMAIL-MATRIX.md): policy reference
- [`docs/MANUAL-LAUNCH-BLOCKERS.md`](docs/MANUAL-LAUNCH-BLOCKERS.md): G-03 tied to **E-08**

---

## February 3, 2026 (prior session)

Appeals system, contact moderator tier restrictions, button visibility fixes — see `MVP-LAUNCH-TASKS.md`, `SESSION-FEB-3-2026-APPEALS-TIER-RESTRICTIONS.md`.

---

## Primary sources of truth

| File | Use for |
|------|---------|
| [`launch-preparation-tracker.md`](launch-preparation-tracker.md) | All task IDs, status, update log |
| [`docs/MANUAL-LAUNCH-BLOCKERS.md`](docs/MANUAL-LAUNCH-BLOCKERS.md) | Human-only ordered queue |
| [`docs/FIREBASE-EMAIL-VERIFICATION.md`](docs/FIREBASE-EMAIL-VERIFICATION.md) | Email verification deploy & troubleshooting |
| [`docs/PAYMENT-EMAIL-MATRIX.md`](docs/PAYMENT-EMAIL-MATRIX.md) | Who gets which email per payment type |
