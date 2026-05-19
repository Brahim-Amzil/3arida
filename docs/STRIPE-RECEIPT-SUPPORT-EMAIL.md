# Stripe receipt support email

Stripe receipts show **“If you have any questions, contact us at …”** from your Stripe **business profile**, not from app code.

## Set to support@3arida.org

### Option A — Stripe Dashboard (recommended)

1. [Stripe Dashboard](https://dashboard.stripe.com/settings/public)
2. **Settings → Business → Public business information**
3. **Customer support email** → `support@3arida.org`
4. **Customer support URL** → `https://3arida.org/contact`
5. Save

### Option B — Script (same result)

```bash
STRIPE_SECRET_KEY=sk_live_... node scripts/stripe-set-support-email.mjs
```

Optional env: `STRIPE_SUPPORT_EMAIL`, `STRIPE_SUPPORT_URL`.

## What app code controls

- `receipt_email` on PaymentIntent = where Stripe **sends** the receipt (donor email).
- Receipt **footer contact** = Dashboard / `business_profile.support_email` only.

After updating, make a small test donation to confirm the new address on the receipt.
