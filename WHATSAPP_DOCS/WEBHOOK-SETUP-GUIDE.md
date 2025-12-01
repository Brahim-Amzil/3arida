# WhatsApp Webhook Setup Guide

## Overview

Webhooks allow your app to receive messages from WhatsApp users. This is essential for the verification flow where users reply with their verification code.

## Prerequisites

✅ WhatsApp Business API credentials configured
✅ App deployed to Vercel with HTTPS URL
✅ Webhook endpoint implemented at `/api/whatsapp/webhook`

## Step 1: Add Environment Variables to Vercel

Run the setup script:

```bash
cd 3arida-app
chmod +x setup-whatsapp-vercel.sh
./setup-whatsapp-vercel.sh
```

Or add manually via Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Select your project (3arida-app)
3. Go to Settings > Environment Variables
4. Add these variables for **Production**:

```
WHATSAPP_PHONE_NUMBER_ID=955517827633887
WHATSAPP_ACCESS_TOKEN=EAAQUvnimSnkBQNiM9JxGU1KLx6agA4lLg0ycpZBYo53BGD9ie1ZCG8u1RrIpb6sfDV1arhxUz1gg6uS95s5EKhrwDI2xkHfRa7q5K8uqLU0h5aYdGAYAsVvuNBSTz8dzg2sF9U3VZAXQM4pgPowZBY8T16mG7Jew7tJ6Re55OZC3KFwz3h4uSHsTkHJPhAfavPXclJjfKfCbqTPBOWIjwnfH5k12I5TcOmCRlqfNStOVYHY5rj3dt9glo9eaOirwGZBZCsyz3AX0f6hqZBZCsRfOR8LgZD
WHATSAPP_VERIFY_TOKEN=3arida_webhook_verify_token_2024_secure
WHATSAPP_BUSINESS_ACCOUNT_ID=186877493784901
```

## Step 2: Deploy to Vercel

```bash
cd 3arida-app
vercel --prod
```

Note your deployment URL (e.g., `https://3arida-app.vercel.app`)

## Step 3: Configure Webhook in Meta Dashboard

1. Go to Meta for Developers: https://developers.facebook.com/
2. Select your app: "3arida Phone Verification"
3. In the left sidebar, click **WhatsApp > Configuration**
4. Click **Configure webhooks** button

### Webhook Configuration:

**Callback URL:**

```
https://your-app.vercel.app/api/whatsapp/webhook
```

**Verify Token:**

```
3arida_webhook_verify_token_2024_secure
```

5. Click **Verify and Save**

### Subscribe to Webhook Fields:

After verification succeeds, subscribe to these fields:

- ✅ **messages** (required for receiving user messages)

## Step 4: Test the Webhook

### Test 1: Verify Webhook Connection

Meta will send a GET request to verify your webhook. Your endpoint should respond with the challenge.

Check Vercel logs to confirm:

```bash
vercel logs --prod
```

You should see:

```
✅ Webhook verified successfully
```

### Test 2: Send a Test Message

1. Send a message from your WhatsApp to the test number (+1 555 173-8972)
2. Check Vercel logs to see if the webhook received it:

```bash
vercel logs --prod --follow
```

You should see:

```
📨 Received WhatsApp message from +212XXXXXXXXX
```

### Test 3: Full Verification Flow

1. Go to your app: https://your-app.vercel.app/auth/register
2. Enter your phone number
3. Click "Send Verification Code"
4. Check WhatsApp for the code
5. Enter the code in your app
6. Verify it marks you as verified

## Webhook Endpoint Details

Your webhook endpoint is already implemented at:

```
3arida-app/src/app/api/whatsapp/webhook/route.ts
```

### What it does:

**GET Request (Verification):**

- Meta sends a challenge token
- Your endpoint validates the verify token
- Returns the challenge to confirm ownership

**POST Request (Incoming Messages):**

- Receives messages from WhatsApp users
- Extracts verification codes (6-digit numbers)
- Updates user verification status in Firestore
- Logs all activity for debugging

## Troubleshooting

### Webhook Verification Fails

**Error:** "The callback URL or verify token couldn't be validated"

**Solutions:**

1. Ensure your app is deployed to production
2. Check that `WHATSAPP_VERIFY_TOKEN` matches in both:
   - Your `.env.local` / Vercel environment
   - Meta Dashboard webhook configuration
3. Verify the URL is correct and accessible
4. Check Vercel logs for errors

### Not Receiving Messages

**Problem:** Webhook verified but not receiving messages

**Solutions:**

1. Ensure you subscribed to "messages" field in webhook settings
2. Check that the sender's phone number is added as a test recipient
3. Verify Vercel logs show incoming POST requests
4. Test with the Meta test tool in the dashboard

### Access Token Expired

**Error:** "Invalid OAuth access token"

**Solution:**

1. Generate a new access token in Meta Dashboard
2. Update in Vercel environment variables
3. Redeploy: `vercel --prod`

## Security Notes

⚠️ **Important:**

- Never commit access tokens to git
- Rotate access tokens regularly
- Use environment variables for all secrets
- Monitor webhook logs for suspicious activity
- Implement rate limiting in production

## Production Checklist

Before going live:

- [ ] Environment variables added to Vercel
- [ ] App deployed to production
- [ ] Webhook verified in Meta Dashboard
- [ ] Subscribed to "messages" webhook field
- [ ] Tested full verification flow
- [ ] Verified Firestore security rules allow updates
- [ ] Monitoring and logging enabled
- [ ] Error handling tested
- [ ] Rate limiting configured

## Next Steps

After webhook is configured:

1. **Test with real users** - Add more test phone numbers
2. **Monitor usage** - Check Meta Dashboard for message counts
3. **Apply for production access** - When ready to scale beyond 5 test numbers
4. **Add phone number** - Get your own WhatsApp Business number
5. **Enable billing** - Set up payment method for production usage

## Support

- Meta WhatsApp Documentation: https://developers.facebook.com/docs/whatsapp
- Vercel Documentation: https://vercel.com/docs
- Project Documentation: See `WHATSAPP_DOCS/README.md`
