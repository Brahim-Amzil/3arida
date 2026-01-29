# Stripe Setup - New Account

## Step 1: Get Your Stripe API Keys

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/test/apikeys
2. **Copy your keys**:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"

## Step 2: Update .env.local

Replace the old keys in `.env.local` with your new keys:

```env
# Stripe Configuration (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_NEW_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_NEW_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # We'll set this up later
```

## Step 3: Test Cards

Use these test cards in development:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires 3D Secure**: 4000 0025 0000 3155

Any future expiry date (e.g., 12/25) and any 3-digit CVC.

## Step 4: Webhook Setup (Later)

After deployment, you'll need to:

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret and add to `.env.local`

## Currency Support

Stripe supports MAD (Moroccan Dirham) natively, so our pricing will work perfectly:

- 69 MAD
- 129 MAD
- 229 MAD
- 369 MAD

## Next Steps

1. Get your API keys from Stripe dashboard
2. Update `.env.local` with new keys
3. I'll implement the Stripe payment integration
4. Test with test cards
5. Deploy and set up webhooks

---

**Ready?** Once you have your new Stripe keys, paste them in `.env.local` and let me know!
