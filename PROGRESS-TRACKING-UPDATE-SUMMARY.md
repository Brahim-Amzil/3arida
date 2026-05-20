# Progress Tracking Files - Update Summary

**Last updated:** May 20, 2026  
**Purpose:** Summary of documentation updates for launch readiness tracking

---

## May 20, 2026 — Payment emails, contact form, reCAPTCHA

### Completed (production-verified or configured)

| Area | Status | Notes |
|------|--------|-------|
| Contact form | Done | Success on `www.3arida.org`; delivers to `contact@3arida.org` |
| reCAPTCHA | Done | Domains `3arida.org`, `www.3arida.org`; Vercel `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` + `RECAPTCHA_SECRET_KEY` (CLI) |
| Tip emails | Done (code) | No Stripe receipt; thank-you via webhook only |
| Stripe support on receipts | Done | Dashboard `support@3arida.org` |
| Paid petition / upgrade receipts | Done (code) | `receipt_email` enabled; deploy + **E-08** smoke pending |

### Tracker changes

- [`launch-preparation-tracker.md`](launch-preparation-tracker.md): new **§14 Payment & transactional emails** (E-01–E-08), §13 smoke row 8, G-03 notes, progress **87 tasks / 82 done**
- [`docs/PAYMENT-EMAIL-MATRIX.md`](docs/PAYMENT-EMAIL-MATRIX.md): new policy reference
- [`docs/MANUAL-LAUNCH-BLOCKERS.md`](docs/MANUAL-LAUNCH-BLOCKERS.md): G-03 tied to **E-08**
- [`docs/STAGING-DRY-RUN.md`](docs/STAGING-DRY-RUN.md): payment email smoke row
- [`FINAL-LAUNCH-CHECKLIST.md`](FINAL-LAUNCH-CHECKLIST.md): §6 email testing + payment matrix

### Remaining launch blockers

- **G-01** security sign-off
- **G-03** / **E-08** manual smoke (auth, petition journeys, payment email matrix)
- **G-04** rollback drill
- **T-06** PayPal webhooks (Stripe done)

### Code not yet on `main` (local / pending push)

Payment receipt split for paid create + upgrade (`withStripeReceiptEmail`, donation `receipt_email` removed) — commit and deploy before **E-08** sign-off.

---

## February 3, 2026 (prior session)

### Files updated

- `PROJECT-STATUS-FEB-2026.md`
- `CURRENT-PROJECT-STATUS.md`
- `MVP-LAUNCH-TASKS.md`
- `SESSION-FEB-3-2026-APPEALS-TIER-RESTRICTIONS.md` (new)

Appeals system, contact moderator tier restrictions, button visibility fixes documented.

---

## Primary sources of truth

| File | Use for |
|------|---------|
| [`launch-preparation-tracker.md`](launch-preparation-tracker.md) | All task IDs, status, update log |
| [`docs/MANUAL-LAUNCH-BLOCKERS.md`](docs/MANUAL-LAUNCH-BLOCKERS.md) | Human-only ordered queue |
| [`docs/PAYMENT-EMAIL-MATRIX.md`](docs/PAYMENT-EMAIL-MATRIX.md) | Who gets which email per payment type |
