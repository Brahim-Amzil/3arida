# reCAPTCHA v3 Setup Guide

## Why reCAPTCHA v3?

✅ **100% Invisible** - Users never see it  
✅ **Zero Friction** - No clicking boxes or solving puzzles  
✅ **Highly Effective** - Catches 90%+ of bots  
✅ **100% FREE** - 1 million assessments per month  
✅ **Already Integrated** - Just needs keys

## Setup Steps (5 minutes)

### 1. Get Your Keys

1. Go to https://www.google.com/recaptcha/admin/create
2. Fill in the form:
   - **Label**: `3arida Petition Platform`
   - **reCAPTCHA type**: Select **reCAPTCHA v3**
   - **Domains**:
     - Add `localhost` (for development)
     - Add `3arida.ma` (your production domain)
     - Add any other domains you use
3. Accept terms and click **Submit**
4. You'll get two keys:
   - **Site Key** (starts with `6L...`) - Public key for frontend
   - **Secret Key** (starts with `6L...`) - Private key for backend

### 2. Add Keys to Environment Variables

**Local Development** (`.env.local`):

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RECAPTCHA_SECRET_KEY=6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Production** (Vercel):

```bash
# Add these in Vercel Dashboard > Settings > Environment Variables
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RECAPTCHA_SECRET_KEY=6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Deploy

That's it! The code is already integrated. Just:

```bash
# Test locally
npm run dev

# Deploy to production
vercel --prod
```

## How It Works

1. User clicks "Sign Petition"
2. reCAPTCHA v3 runs invisibly in background (< 1 second)
3. Google analyzes user behavior and gives a score (0.0 - 1.0)
4. If score > 0.5 → ✅ Allowed to sign
5. If score < 0.5 → ❌ Blocked (bot detected)

**User never sees anything** - it's completely invisible!

## Testing

### Test as Real User

1. Go to any petition
2. Click "Sign Petition"
3. Should work normally (reCAPTCHA passes silently)

### Test Bot Detection

reCAPTCHA automatically detects:

- Automated scripts
- Headless browsers
- Suspicious patterns
- VPN/proxy abuse
- Rapid repeated actions

### Check Logs

```bash
# Development console will show:
✅ reCAPTCHA passed with score: 0.9
```

## Monitoring

View reCAPTCHA analytics:

1. Go to https://www.google.com/recaptcha/admin
2. Click on your site
3. See real-time stats:
   - Total requests
   - Bot detection rate
   - Score distribution
   - Failed attempts

## Troubleshooting

### "reCAPTCHA not configured"

- Make sure both keys are in `.env.local`
- Restart dev server: `npm run dev`

### "Security verification failed"

- Check if keys are correct
- Verify domain is added in reCAPTCHA admin
- Check browser console for errors

### Keys not working

- Make sure you selected **reCAPTCHA v3** (not v2)
- Verify domain matches exactly (no `http://` or `https://`)
- For localhost, just add `localhost` (no port number)

## Cost

**FREE** for up to 1 million assessments per month.

For a petition platform, this means:

- 1M petition signatures per month = FREE
- 10M signatures per month = ~$8/month
- 100M signatures per month = ~$80/month

You'll likely never pay anything!

## Security Notes

- ✅ Site key is public (safe to expose)
- ❌ Secret key is private (never expose in frontend)
- ✅ Verification happens server-side
- ✅ Tokens expire after 2 minutes
- ✅ Each token can only be used once

## Alternative: Disable reCAPTCHA

If you want to disable it temporarily:

1. Remove keys from `.env.local`
2. Code will automatically skip reCAPTCHA
3. Petition signing still works normally

## Support

- reCAPTCHA Docs: https://developers.google.com/recaptcha/docs/v3
- Admin Console: https://www.google.com/recaptcha/admin
- Support: https://support.google.com/recaptcha
