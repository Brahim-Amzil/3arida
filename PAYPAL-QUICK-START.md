# PayPal Integration - Quick Start Guide

**Ready to test PayPal payments in 5 minutes!**

---

## 🚀 Quick Setup (5 Steps)

### Step 1: Get PayPal Sandbox Credentials (2 min)

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Log in (or create account)
3. Click "Apps & Credentials"
4. Make sure "Sandbox" tab is selected
5. Click "Create App"
6. Name it: `3arida-test`
7. Copy your **Client ID** and **Secret**

### Step 2: Configure Environment Variables (1 min)

```bash
# Copy the example file
cp .env.paypal.example .env.local

# Edit .env.local and add your credentials:
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_secret_here
PAYPAL_MODE=sandbox
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Step 3: Restart Development Server (30 sec)

```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

### Step 4: Test Payment Flow (1 min)

1. Open http://localhost:3000/petitions/create
2. Fill in petition details
3. Select a paid tier (e.g., 5,000 signatures)
4. Click "Create Petition"
5. You'll see PayPal payment buttons

### Step 5: Complete Test Payment (30 sec)

**Option A: Use PayPal Test Account**

1. Click "PayPal" button
2. Log in with sandbox test account:
   - Go to Developer Dashboard → Sandbox → Accounts
   - Use any Personal account credentials

**Option B: Use Test Credit Card**

1. Click "Debit or Credit Card" button
2. Use test card:
   - **Card:** 4032039668610896
   - **Expiry:** 12/2025
   - **CVV:** 123
   - **Name:** Test User

---

## ✅ Success!

If payment completes successfully, you'll see:

- Success message
- Petition created
- Payment captured in PayPal dashboard

---

## 🐛 Troubleshooting

### "PayPal is not configured"

**Fix:** Check your `.env.local` file has the correct credentials

```bash
# Verify variables are set
cat .env.local | grep PAYPAL
```

### "Failed to create PayPal order"

**Fix:** Make sure you're using **Sandbox** credentials, not Live

### PayPal buttons don't appear

**Fix:** Check browser console for errors. Restart dev server.

### Payment succeeds but petition not created

**Fix:** Check the `handlePaymentSuccess` function in `create/page.tsx`

---

## 📝 Test Checklist

Quick checklist for testing:

- [ ] PayPal buttons appear
- [ ] Can pay with PayPal account
- [ ] Can pay with credit card
- [ ] Payment success shows confirmation
- [ ] Petition is created after payment
- [ ] Error messages work (try canceling)
- [ ] Works in Arabic
- [ ] Works in French

---

## 🎯 Next Steps

Once testing works:

1. **Test all pricing tiers** (free, 2.5K, 5K, 10K, 100K)
2. **Test error scenarios** (cancel, invalid card)
3. **Set up webhooks** (optional, for production)
4. **Get live credentials** (when ready for production)
5. **Deploy to production**

---

## 📚 Need More Help?

- **Detailed Setup:** See [PAYPAL-SETUP-GUIDE.md](./PAYPAL-SETUP-GUIDE.md)
- **Implementation Details:** See [PAYPAL-IMPLEMENTATION-SUMMARY.md](./PAYPAL-IMPLEMENTATION-SUMMARY.md)
- **Strategy:** See [PAYMENT-STRATEGY.md](./PAYMENT-STRATEGY.md)

---

**Happy Testing! 🎉**
