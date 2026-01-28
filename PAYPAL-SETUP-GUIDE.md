# PayPal Integration Setup Guide

**Date:** January 26, 2025  
**Status:** Implementation Complete - Testing Pending  
**Purpose:** Complete guide for setting up PayPal payment integration

---

## 📋 Overview

This guide walks you through setting up PayPal as the payment processor for the 3arida petition platform. PayPal supports both credit/debit card payments and PayPal account payments.

---

## 🎯 Prerequisites

- PayPal Business account (or create one)
- Access to PayPal Developer Dashboard
- Access to project environment variables (`.env.local` and Vercel)

---

## 1️⃣ PayPal Account Setup

### Step 1: Create PayPal Business Account

1. Go to [PayPal Business](https://www.paypal.com/ma/business)
2. Click "Sign Up" and select "Business Account"
3. Fill in your business information:
   - Business name: 3arida
   - Business type: Technology/Platform
   - Country: Morocco
4. Complete email verification
5. Add bank account for receiving payments

### Step 2: Complete Business Verification

1. Log in to your PayPal Business account
2. Go to Settings → Account Settings
3. Complete business verification:
   - Upload business documents (if required)
   - Verify business address
   - Add business phone number
4. Wait for verification approval (usually 1-3 business days)

---

## 2️⃣ PayPal Developer Setup

### Step 1: Access Developer Dashboard

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Log in with your PayPal Business account
3. You'll see two environments:
   - **Sandbox** - For testing (use this first)
   - **Live** - For production (use after testing)

### Step 2: Create Sandbox App (For Testing)

1. In Developer Dashboard, click "Apps & Credentials"
2. Make sure "Sandbox" tab is selected
3. Click "Create App"
4. Fill in app details:
   - App Name: `3arida-sandbox`
   - App Type: Merchant
5. Click "Create App"
6. You'll see your credentials:
   - **Client ID** - Copy this (starts with `A...`)
   - **Secret** - Click "Show" and copy this

### Step 3: Create Live App (For Production)

1. Switch to "Live" tab
2. Click "Create App"
3. Fill in app details:
   - App Name: `3arida-production`
   - App Type: Merchant
4. Click "Create App"
5. Copy your live credentials (keep these secure!)

### Step 4: Configure App Settings

For both Sandbox and Live apps:

1. Scroll down to "App Settings"
2. Enable these features:
   - ✅ Accept payments
   - ✅ Checkout
   - ✅ Invoicing (optional)
3. Set Return URL: `https://your-domain.com/petitions/create/success`
4. Set Cancel URL: `https://your-domain.com/petitions/create`
5. Click "Save"

---

## 3️⃣ Environment Variables Setup

### For Local Development (`.env.local`)

Add these variables to your `.env.local` file:

```bash
# PayPal Configuration (Sandbox for testing)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_sandbox_client_id_here
PAYPAL_CLIENT_SECRET=your_sandbox_secret_here
PAYPAL_MODE=sandbox

# Optional: Webhook verification
PAYPAL_WEBHOOK_ID=your_webhook_id_here

# Base URL for redirects
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### For Production (Vercel)

Add these environment variables in Vercel:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add these variables:

```bash
# PayPal Configuration (Live for production)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_live_client_id_here
PAYPAL_CLIENT_SECRET=your_live_secret_here
PAYPAL_MODE=live

# Optional: Webhook verification
PAYPAL_WEBHOOK_ID=your_webhook_id_here

# Base URL for redirects
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

**Important:** Make sure to set these for all environments (Production, Preview, Development)

---

## 4️⃣ Webhook Setup (Optional but Recommended)

Webhooks allow PayPal to notify your app about payment events.

### Step 1: Create Webhook

1. In PayPal Developer Dashboard, go to "Webhooks"
2. Click "Add Webhook"
3. Fill in webhook details:
   - **Webhook URL:** `https://your-domain.com/api/paypal/webhook`
   - For testing: Use ngrok or similar to expose localhost
4. Select events to subscribe to:
   - ✅ `CHECKOUT.ORDER.APPROVED`
   - ✅ `PAYMENT.CAPTURE.COMPLETED`
   - ✅ `PAYMENT.CAPTURE.DENIED`
   - ✅ `PAYMENT.CAPTURE.REFUNDED`
5. Click "Save"
6. Copy the **Webhook ID** and add it to your environment variables

### Step 2: Test Webhook

1. In Webhooks section, click on your webhook
2. Click "Simulate" to send test events
3. Check your app logs to verify webhook is received

---

## 5️⃣ Testing in Sandbox

### Step 1: Create Test Accounts

1. In Developer Dashboard, go to "Sandbox" → "Accounts"
2. You'll see default test accounts:
   - **Business Account** - Receives payments
   - **Personal Account** - Makes payments
3. Click on an account to see login credentials

### Step 2: Test Payment Flow

1. Start your development server: `npm run dev`
2. Go to petition creation page
3. Fill in petition details
4. Select a paid tier (e.g., 5,000 signatures)
5. Click "Create Petition"
6. You'll see PayPal payment buttons
7. Click "PayPal" or "Debit or Credit Card"
8. Use sandbox test account credentials to complete payment
9. Verify payment success

### Test Credit Cards (Sandbox Only)

PayPal provides test cards for sandbox testing:

- **Visa:** 4032039668610896
- **Mastercard:** 5425233430109903
- **Amex:** 374245455400126
- **Expiry:** Any future date (e.g., 12/2025)
- **CVV:** Any 3 digits (e.g., 123)

---

## 6️⃣ Currency Handling

### Important Notes

- PayPal requires USD for international transactions
- The app displays prices in MAD (Moroccan Dirham)
- PayPal automatically converts MAD to USD
- Conversion rate is handled by PayPal

### Current Implementation

```typescript
// In create-order API route
currency: 'USD', // PayPal converts from MAD
```

### Future Enhancement

Consider adding dynamic currency conversion:

- Fetch current MAD to USD exchange rate
- Display both MAD and USD prices to users
- Use PayPal's multi-currency support

---

## 7️⃣ Going Live Checklist

Before switching to production:

### Pre-Launch Checklist

- [ ] PayPal Business account fully verified
- [ ] Live app created in PayPal Developer Dashboard
- [ ] Live credentials added to Vercel environment variables
- [ ] Webhook configured for production URL
- [ ] Test payment flow in sandbox (all tiers)
- [ ] Test webhook events in sandbox
- [ ] Verify petition status updates after payment
- [ ] Test refund process
- [ ] Review PayPal fees and pricing
- [ ] Set up payment monitoring/alerts

### Launch Steps

1. **Update Environment Variables:**

   ```bash
   PAYPAL_MODE=live
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_live_client_id
   PAYPAL_CLIENT_SECRET=your_live_secret
   ```

2. **Deploy to Production:**

   ```bash
   git add .
   git commit -m "Switch to PayPal live mode"
   git push
   ```

3. **Test with Real Payment:**
   - Use a real credit card (small amount)
   - Verify payment is captured
   - Check PayPal dashboard for transaction
   - Verify petition status updates

4. **Monitor First Transactions:**
   - Watch PayPal dashboard
   - Check application logs
   - Verify webhook events
   - Test refund if needed

---

## 8️⃣ Troubleshooting

### Common Issues

#### Issue: "PayPal is not configured"

**Solution:** Check environment variables are set correctly:

```bash
echo $NEXT_PUBLIC_PAYPAL_CLIENT_ID
echo $PAYPAL_CLIENT_SECRET
```

#### Issue: "Failed to create PayPal order"

**Possible causes:**

- Invalid credentials
- Wrong mode (sandbox vs live)
- Network issues
- Invalid amount or currency

**Solution:** Check API logs and verify credentials

#### Issue: "Payment capture failed"

**Possible causes:**

- Order not approved by user
- Insufficient funds
- Payment method declined

**Solution:** Check PayPal dashboard for transaction details

#### Issue: "Webhook not received"

**Possible causes:**

- Incorrect webhook URL
- Webhook not configured
- Firewall blocking requests

**Solution:**

- Verify webhook URL is accessible
- Check webhook logs in PayPal dashboard
- Test with webhook simulator

---

## 9️⃣ PayPal Fees

### Standard Fees (Morocco)

- **Domestic transactions:** 3.4% + 3.00 MAD per transaction
- **International transactions:** 4.4% + 3.00 MAD per transaction
- **Currency conversion:** 3-4% above base exchange rate

### Example Calculation

For a 500 MAD petition:

- Transaction fee: 500 × 0.034 + 3 = 20 MAD
- You receive: 480 MAD
- User pays: 500 MAD

**Note:** Consider whether to absorb fees or pass them to users

---

## 🔟 Security Best Practices

### Credentials Security

- ✅ Never commit credentials to Git
- ✅ Use environment variables
- ✅ Rotate secrets regularly
- ✅ Use different credentials for sandbox/live
- ✅ Limit access to PayPal dashboard

### Payment Security

- ✅ Always verify webhook signatures
- ✅ Validate payment amounts server-side
- ✅ Log all payment attempts
- ✅ Monitor for suspicious activity
- ✅ Implement rate limiting

### Data Protection

- ✅ Never store credit card details
- ✅ Store only PayPal transaction IDs
- ✅ Encrypt sensitive data
- ✅ Comply with PCI DSS (PayPal handles this)

---

## 📚 Resources

### Official Documentation

- [PayPal Developer Docs](https://developer.paypal.com/docs/)
- [PayPal REST API Reference](https://developer.paypal.com/api/rest/)
- [PayPal React SDK](https://www.npmjs.com/package/@paypal/react-paypal-js)
- [PayPal Webhooks Guide](https://developer.paypal.com/api/rest/webhooks/)

### Support

- [PayPal Developer Community](https://www.paypal-community.com/t5/Developer-Community/ct-p/developer)
- [PayPal Support](https://www.paypal.com/ma/smarthelp/home)
- [PayPal Business Support](https://www.paypal.com/ma/business/contact-us)

---

## ✅ Summary

You've completed the PayPal integration setup! Here's what you've accomplished:

1. ✅ Created PayPal Business account
2. ✅ Set up Developer Dashboard apps (Sandbox & Live)
3. ✅ Configured environment variables
4. ✅ Set up webhooks (optional)
5. ✅ Tested in sandbox environment
6. ✅ Ready for production deployment

**Next Steps:**

1. Test payment flow thoroughly in sandbox
2. Review and adjust pricing if needed
3. Switch to live mode when ready
4. Monitor first transactions closely
5. Consider adding Stripe in Phase 2 for more payment options

---

**Questions or Issues?** Check the troubleshooting section or contact PayPal support.
