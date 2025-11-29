# WhatsApp Phone Verification Setup Guide

## 🎯 Overview

This guide will help you set up **FREE** phone verification using WhatsApp Cloud API. No SMS costs!

### Benefits:

- ✅ **1,000 FREE verifications/month**
- ✅ **$0.008 per verification** after 1,000
- ✅ **No business verification required** (for user-initiated messages)
- ✅ **Better UX** with deep links
- ✅ **80-90% cost savings** vs Firebase SMS

---

## 📋 Prerequisites

1. Facebook/Meta account
2. Phone number (can be your personal number or buy a virtual one)
3. Your app deployed with HTTPS (for webhook)

---

## 🚀 Step 1: Create Meta App (15 minutes)

### 1.1 Go to Meta for Developers

Visit: https://developers.facebook.com/

### 1.2 Create New App

1. Click "Create App"
2. Select "Business" as app type
3. Fill in details:
   - App Name: "3arida Phone Verification"
   - Contact Email: your email
4. Click "Create App"

### 1.3 Add WhatsApp Product

1. In your app dashboard, find "WhatsApp" product
2. Click "Set Up"
3. Select "Business Portfolio" (create one if needed)

---

## 📱 Step 2: Configure Phone Number (10 minutes)

### 2.1 Add Phone Number

1. In WhatsApp settings, go to "API Setup"
2. Click "Add Phone Number"
3. Choose:
   - **Option A**: Use your existing number (recommended for testing)
   - **Option B**: Buy a virtual number from Twilio/Vonage

### 2.2 Verify Phone Number

1. Enter your phone number
2. Receive verification code via SMS
3. Enter code to verify

### 2.3 Get Credentials

Copy these values (you'll need them):

- **Phone Number ID**: Found in API Setup
- **WhatsApp Business Account ID**: Found in API Setup
- **Access Token**: Click "Generate Token" (temporary for testing)

---

## 🔧 Step 3: Configure Webhook (15 minutes)

### 3.1 Deploy Your App

Your webhook URL will be:

```
https://your-domain.com/api/whatsapp/webhook
```

For Vercel:

```
https://3arida.vercel.app/api/whatsapp/webhook
```

### 3.2 Set Up Webhook in Meta

1. In WhatsApp settings, go to "Configuration"
2. Click "Edit" next to "Webhook"
3. Enter:
   - **Callback URL**: `https://your-domain.com/api/whatsapp/webhook`
   - **Verify Token**: Create a random string (e.g., `3arida_verify_token_2025`)
4. Click "Verify and Save"

### 3.3 Subscribe to Webhooks

1. In "Webhook Fields", subscribe to:
   - ✅ `messages`
2. Click "Save"

---

## 🔐 Step 4: Add Environment Variables

### 4.1 Update `.env.local`

```bash
# WhatsApp Cloud API Configuration
NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER=212600000000
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_VERIFY_TOKEN=3arida_verify_token_2025
```

### 4.2 Update `.env.example`

Add the same variables (without values) for documentation.

### 4.3 Add to Vercel

```bash
# Add environment variables to Vercel
vercel env add NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER
vercel env add WHATSAPP_PHONE_NUMBER_ID
vercel env add WHATSAPP_ACCESS_TOKEN
vercel env add WHATSAPP_VERIFY_TOKEN
```

---

## 🧪 Step 5: Test the Integration (10 minutes)

### 5.1 Test Webhook

1. In Meta dashboard, go to "Webhooks"
2. Click "Test" button
3. Send a test message
4. Check your server logs

### 5.2 Test Full Flow

1. Go to your app
2. Try to sign a petition
3. Enter your phone number
4. Click "Open WhatsApp"
5. Send the pre-filled message
6. Return to app - should verify automatically

---

## 📊 Step 6: Monitor Usage

### 6.1 Check Conversation Counts

1. Go to Meta Business Suite
2. Navigate to WhatsApp Manager
3. View "Conversations" tab
4. Monitor your free quota (1,000/month)

### 6.2 Set Up Billing Alerts

1. Go to Business Settings
2. Navigate to "Payments"
3. Set up billing alerts at:
   - $5 (500 extra verifications)
   - $10 (1,250 extra verifications)
   - $25 (3,125 extra verifications)

---

## 🔄 Step 7: Update Your Code

### 7.1 Replace PhoneVerification Component

In files that use phone verification, replace:

```typescript
// OLD
import PhoneVerification from '@/components/auth/PhoneVerification';

// NEW
import WhatsAppPhoneVerification from '@/components/auth/WhatsAppPhoneVerification';
```

### 7.2 Update Usage

```typescript
// OLD
<PhoneVerification onVerified={handleVerified} onCancel={handleCancel} />

// NEW
<WhatsAppPhoneVerification onVerified={handleVerified} onCancel={handleCancel} />
```

---

## 🎨 Step 8: Customize Messages (Optional)

### 8.1 Customize Verification Message

Edit `src/lib/whatsapp-verification.ts`:

```typescript
export function generateWhatsAppLink(
  code: string,
  businessNumber: string
): string {
  const message = encodeURIComponent(
    `مرحباً! رمز التحقق لحسابي في 3arida هو: ${code}`
  );
  return `https://wa.me/${businessNumber}?text=${message}`;
}
```

### 8.2 Customize Response Messages

Edit `src/app/api/whatsapp/webhook/route.ts`:

```typescript
// Success message
await sendWhatsAppMessage(
  userPhone,
  '✅ تم التحقق بنجاح! يمكنك الآن العودة إلى التطبيق.'
);

// Error message
await sendWhatsAppMessage(userPhone, '❌ فشل التحقق. يرجى المحاولة مرة أخرى.');
```

---

## 🛡️ Security Best Practices

### 1. Rate Limiting

Add rate limiting to prevent abuse:

```typescript
// In webhook route
const attempts = await getRateLimitAttempts(userPhone);
if (attempts > 5) {
  return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
}
```

### 2. Code Expiration

Codes expire after 10 minutes (already implemented).

### 3. One-Time Use

Codes can only be used once (already implemented).

### 4. Phone Number Validation

Validate phone numbers before creating codes (already implemented).

---

## 📈 Cost Estimation

### Free Tier (0-1,000 users/month)

- Cost: **$0**
- Perfect for: Beta launch, testing

### Growth (1,000-5,000 users/month)

- Extra users: 4,000
- Cost: 4,000 × $0.008 = **$32/month**
- Perfect for: Early growth phase

### Scale (5,000-10,000 users/month)

- Extra users: 9,000
- Cost: 9,000 × $0.008 = **$72/month**
- Perfect for: Established platform

### Compare to Firebase SMS:

- 1,000 users: $30-50 (vs $0 with WhatsApp)
- 5,000 users: $150-250 (vs $32 with WhatsApp)
- 10,000 users: $300-500 (vs $72 with WhatsApp)

**Savings: 80-90%** 🎉

---

## 🐛 Troubleshooting

### Webhook Not Receiving Messages

1. Check webhook URL is HTTPS
2. Verify token matches in both places
3. Check webhook is subscribed to "messages"
4. Test with Meta's webhook tester

### Messages Not Sending

1. Check access token is valid
2. Verify phone number ID is correct
3. Check user has WhatsApp on that number
4. Review Meta dashboard for errors

### Verification Not Working

1. Check Firestore rules allow writes to `phoneVerifications`
2. Verify user is authenticated
3. Check phone number format is correct
4. Review browser console for errors

---

## 🎯 Next Steps

1. ✅ Complete Meta setup
2. ✅ Test with your own phone
3. ✅ Deploy to production
4. ✅ Monitor first 100 verifications
5. ✅ Set up billing alerts
6. ✅ Optimize based on user feedback

---

## 📞 Support

If you encounter issues:

1. Check Meta's WhatsApp Business API docs
2. Review webhook logs in Meta dashboard
3. Check your server logs
4. Test with Meta's API explorer

---

## 🎉 You're Done!

Your WhatsApp verification is now set up and ready to save you money while providing a better user experience!

**Estimated setup time: 45-60 minutes**
**Monthly cost: $0 for first 1,000 users**
