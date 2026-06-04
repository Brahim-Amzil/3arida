# Payment & transactional email matrix

Single reference for what emails payers receive. Tracker IDs: **E-01–E-08** in [`launch-preparation-tracker.md`](../launch-preparation-tracker.md) §14.

## Policy

| Payment type | Platform thank-you | Stripe receipt |
|---|---|---|
| **Tip / donation** (`platform_support`) | Yes — webhook `sendPlatformSupportThankYouEmail` (one per payment) | **No** — `receipt_email` not set on donation PaymentIntent |
| **Create petition (paid)** | No | **Yes** — `receipt_email` on `create-payment-intent` when payer email known |
| **Upgrade petition** | No | **Yes** — `receipt_email` on `api/petitions/upgrade` when payer email known |

## Other channels

| Channel | Destination | Notes |
|---|---|---|
| Contact form | `contact@3arida.org` | `CONTACT_EMAIL` / Resend; reCAPTCHA v3 required |
| Stripe receipt footer (when Stripe sends a receipt) | `support@3arida.org` | Stripe Dashboard → business profile — [`STRIPE-RECEIPT-SUPPORT-EMAIL.md`](./STRIPE-RECEIPT-SUPPORT-EMAIL.md) |

## Smoke tests (**E-08**)

1. **Tip** (logged in): one thank-you email; **no** Stripe receipt. — **Pass 2026-06-04**
2. **Paid petition or upgrade**: Stripe receipt to payer; **no** platform thank-you. — **Upgrade pass** 2026-06-04; **create** deferred while `BETA100` auto-applies at checkout
3. **Contact form**: success UI + message at `contact@3arida.org`. — **Pass 2026-06-04**

## Code paths

- Donation: `src/app/api/stripe/create-donation-intent/route.ts`, webhook `platform_support` branch
- Paid create: `src/app/api/stripe/create-payment-intent/route.ts`, `StripePayment` + create pages
- Upgrade: `src/app/api/petitions/upgrade/route.ts`, `PetitionCardWithReport`
- Helper: `withStripeReceiptEmail()` in `src/lib/stripe-server.ts`
