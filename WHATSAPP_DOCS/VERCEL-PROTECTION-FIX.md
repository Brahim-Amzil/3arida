# Fix Vercel Deployment Protection for WhatsApp Webhook

## Problem

Your Vercel deployment has authentication protection enabled, which blocks Meta's WhatsApp servers from accessing your webhook endpoint.

Error message: "The callback URL or verify token couldn't be validated"

## Solution

You need to disable deployment protection or configure it to allow webhook access.

### Option 1: Disable Deployment Protection (Easiest)

1. Go to https://vercel.com/dashboard
2. Select your project: **3arida-app**
3. Go to **Settings** > **Deployment Protection**
4. Temporarily disable protection or set it to "Only Preview Deployments"
5. Redeploy: `vercel --prod`
6. Try webhook configuration again in Meta Dashboard

### Option 2: Use Production Domain (Recommended for Production)

Instead of using the auto-generated Vercel URL, use your custom domain:

1. Add your custom domain in Vercel (e.g., `3arida.ma` or `app.3arida.ma`)
2. Configure DNS
3. Use webhook URL: `https://your-domain.com/api/whatsapp/webhook`
4. Production domains bypass deployment protection

### Option 3: Configure IP Allowlist

If you want to keep protection enabled:

1. Go to Vercel Dashboard > Settings > Deployment Protection
2. Add Meta's WhatsApp webhook IPs to allowlist:
   - Check Meta's documentation for current IP ranges
   - https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks

## Quick Fix for Testing

For now, the fastest solution:

```bash
# 1. Disable deployment protection in Vercel dashboard
# 2. Redeploy
cd 3arida-app
vercel --prod

# 3. Test webhook endpoint
curl -X GET "https://your-url.vercel.app/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=3arida_webhook_verify_token_2024_secure&hub.challenge=test123"

# Should return: test123
```

## After Fixing

Once deployment protection is disabled or configured:

1. Go back to Meta Dashboard
2. Click "Configure webhooks"
3. Enter:
   - Callback URL: `https://your-url.vercel.app/api/whatsapp/webhook`
   - Verify Token: `3arida_webhook_verify_token_2024_secure`
4. Click "Verify and save"
5. Subscribe to "messages" field

## Production Recommendation

For production, use a custom domain without deployment protection, or configure protection to allow webhook IPs only.
