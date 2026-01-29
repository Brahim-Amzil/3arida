# Switch from PayPal to Stripe - Implementation Plan

## Current Status

- ✅ Stripe packages already installed (`@stripe/stripe-js`, `@stripe/react-stripe-js`, `stripe`)
- ✅ Stripe library file exists (`src/lib/stripe.ts`)
- ✅ Environment validation includes Stripe keys
- ✅ Previous Stripe implementation documented in `STRIPE-PETITION-PAYMENT-IMPLEMENTATION.md`
- ❌ Currently using PayPal for payments

## Files to Create/Restore

### 1. Payment Component

**File**: `src/components/petitions/PetitionPayment.tsx`

- Stripe Elements integration
- Card input form
- Order summary
- Payment processing
- Error handling

### 2. Stripe API Routes

**Files**:

- `src/app/api/stripe/create-payment-intent/route.ts`
- `src/app/api/stripe/webhook/route.ts`

### 3. Update Petition Creation Form

**File**: `src/app/petitions/create/page.tsx`

- Replace PayPalPayment import with PetitionPayment
- Update payment handlers
- Keep same pricing tiers (MAD currency)

## Environment Variables Needed

```env
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Pricing Tiers (Same as PayPal)

- Free: 0 MAD (up to 2,500 signatures)
- Starter: 69 MAD (up to 10,000 signatures)
- Pro: 129 MAD (up to 30,000 signatures)
- Advanced: 229 MAD (up to 75,000 signatures)
- Enterprise: 369 MAD (up to 100,000 signatures)

## Advantages of Stripe over PayPal

1. ✅ Better developer experience
2. ✅ More payment methods (cards, Apple Pay, Google Pay)
3. ✅ Better webhook reliability
4. ✅ Cleaner UI/UX
5. ✅ Better documentation
6. ✅ More flexible pricing
7. ✅ Better fraud protection

## Implementation Steps

1. **Create Stripe Payment Component** (30 min)
   - Copy structure from PayPalPayment
   - Integrate Stripe Elements
   - Add card input form
   - Handle payment processing

2. **Create Stripe API Routes** (20 min)
   - Create payment intent endpoint
   - Create webhook handler
   - Handle payment confirmation

3. **Update Petition Creation Form** (10 min)
   - Replace PayPal component with Stripe
   - Update payment success handler
   - Test payment flow

4. **Test Payment Flow** (15 min)
   - Test with Stripe test cards
   - Verify petition creation
   - Test error scenarios

5. **Remove PayPal Code** (10 min)
   - Delete PayPal component
   - Delete PayPal API routes
   - Remove PayPal package (optional)

## Test Cards (Stripe)

- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- Requires Auth: 4000 0025 0000 3155

## Total Time Estimate: ~1.5 hours

## Next Steps

1. Get Stripe API keys from dashboard
2. Add to environment variables
3. Create payment component
4. Create API routes
5. Update petition form
6. Test end-to-end
