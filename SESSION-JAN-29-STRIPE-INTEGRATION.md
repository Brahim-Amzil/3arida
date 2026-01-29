# Session January 29, 2025 - Stripe Payment Integration

## Summary

Successfully switched the petition payment system from PayPal to Stripe for the new Stripe account.

## Changes Made

### 1. Stripe Payment Component

- **File**: `src/components/petitions/StripePayment.tsx`
- Created new Stripe payment component using Stripe Elements
- Integrated CardElement for secure card input
- Added payment processing with proper error handling
- Supports MAD currency (69, 129, 229, 369 MAD)
- Test mode indicator with test card information

### 2. Stripe API Routes

- **File**: `src/app/api/stripe/create-payment-intent/route.ts`
  - Creates payment intents with Stripe
  - Handles MAD currency conversion
  - Returns client secret for payment confirmation

- **File**: `src/app/api/stripe/webhook/route.ts`
  - Webhook endpoint for Stripe events
  - Handles payment_intent.succeeded events
  - Updates petition payment status in Firestore

### 3. Petition Creation Page

- **File**: `src/app/petitions/create/page.tsx`
- Replaced PayPalPayment with StripePayment component
- Updated handlePaymentSuccess to accept paymentIntentId
- Wrapped payment component in Elements provider

### 4. Translation Keys

- **File**: `src/hooks/useTranslation.ts`
- Added payment translation keys for both Arabic and French:
  - `payment.completePayment`
  - `payment.securePayment`
  - `payment.orderSummary`
  - `payment.petition`
  - `payment.signatureGoal`
  - `payment.plan`
  - `payment.total`
  - `payment.cardDetails`
  - `payment.testMode`
  - `payment.testCard`
  - `payment.processing`
  - `payment.pay`
  - `payment.securePaymentBadge`

### 5. Documentation

- **File**: `STRIPE-SETUP-NEW-ACCOUNT.md`
  - Step-by-step guide for setting up new Stripe account
  - Instructions for getting API keys
  - Test card information
  - Webhook setup instructions

- **File**: `SWITCH-TO-STRIPE-PLAN.md`
  - Complete implementation plan
  - Technical details
  - Migration steps

### 6. Firestore Rules

- **File**: `firestore.rules`
- Fixed petition updates permissions
- Added validation to verify creator ownership

## Next Steps for User

### 1. Get Stripe API Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Click "Reveal test key" and copy your **Secret key** (starts with `sk_test_`)

### 2. Update Environment Variables

Update `.env.local` with your new Stripe keys:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
```

### 3. Test Payment Flow

1. Run the app locally: `npm run dev`
2. Create a petition with paid tier
3. Use test card: **4242 4242 4242 4242**
4. Any future expiry date (e.g., 12/25)
5. Any 3-digit CVC (e.g., 123)

### 4. Deploy to Vercel

Once tested locally:

1. Add Stripe keys to Vercel environment variables
2. Deploy the changes
3. Test on production

### 5. Setup Webhooks (After Deployment)

1. Go to https://dashboard.stripe.com/test/webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret and add to environment variables as `STRIPE_WEBHOOK_SECRET`

## Test Cards

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires 3D Secure**: 4000 0025 0000 3155

Use any future expiry date and any 3-digit CVC.

## Pricing Tiers (MAD)

- Free: 0 MAD (up to 2,500 signatures)
- Starter: 69 MAD (up to 10,000 signatures)
- Pro: 129 MAD (up to 30,000 signatures)
- Advanced: 229 MAD (up to 75,000 signatures)
- Enterprise: 369 MAD (up to 100,000 signatures)

## Files Modified

1. `src/components/petitions/StripePayment.tsx` (NEW)
2. `src/app/api/stripe/create-payment-intent/route.ts` (MODIFIED)
3. `src/app/api/stripe/webhook/route.ts` (MODIFIED)
4. `src/app/petitions/create/page.tsx` (MODIFIED)
5. `src/hooks/useTranslation.ts` (MODIFIED)
6. `firestore.rules` (MODIFIED)
7. `STRIPE-SETUP-NEW-ACCOUNT.md` (NEW)
8. `SWITCH-TO-STRIPE-PLAN.md` (NEW)

## Git Commit

Committed and pushed to main branch with message:
"Switch from PayPal to Stripe payment integration"

---

**Status**: ✅ Implementation Complete - Awaiting Stripe API Keys from User
