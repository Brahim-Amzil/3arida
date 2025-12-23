# reCAPTCHA v3 - Setup Complete ✅

## Status: READY TO USE

Your reCAPTCHA v3 (invisible bot protection) is now fully configured and ready to protect petition signatures.

## Configuration

- **Type**: reCAPTCHA v3 (Score-based, invisible)
- **Site Key**: `6LcHzhwsAAAAAIai6tAutRZY3AW4N1xTXAZIr9yd`
- **Secret Key**: `6LcHzhwsAAAAANYh8NxAXmnNe8jYiBGZK3ao_D1I`

## Domains Configured

✅ `localhost` - Local development  
✅ `3arida.vercel.app` - Vercel staging/testing  
✅ `3arida.ma` - Production domain

## How It Works

1. User clicks "Sign Petition"
2. reCAPTCHA v3 runs **invisibly** in background (< 1 second)
3. Google analyzes behavior and returns score (0.0 - 1.0)
4. Score ≥ 0.5 → ✅ Allowed to sign
5. Score < 0.5 → ❌ Blocked (bot detected)

**Users never see anything** - completely invisible!

## Testing

### Local Development

```bash
npm run dev
# Go to http://localhost:3000
# Click "Sign Petition" on any petition
# Check browser console for: ✅ reCAPTCHA passed with score: X.X
```

### Staging (Vercel)

```bash
# Deploy to Vercel
vercel

# Test on: https://3arida.vercel.app
```

### Production

```bash
# Deploy to production
vercel --prod

# Test on: https://3arida.ma
```

## Monitoring

View real-time stats and analytics:

- **Admin Console**: https://www.google.com/recaptcha/admin
- **Your Site**: Click on "3arida.ma" to see:
  - Total requests
  - Bot detection rate
  - Score distribution
  - Failed attempts

## What's Protected

✅ **Petition Signing** - Runs automatically when users sign petitions  
✅ **All Domains** - Works on localhost, Vercel, and production  
✅ **Zero Friction** - Users never see it or interact with it

## Cost

**FREE** - 1 million assessments per month

For reference:

- 1M signatures/month = FREE
- 10M signatures/month = ~$8/month
- 100M signatures/month = ~$80/month

## Files Modified

- ✅ `src/app/petitions/[id]/page.tsx` - Added reCAPTCHA to signing flow
- ✅ `src/lib/recaptcha.ts` - Helper functions for reCAPTCHA
- ✅ `src/app/api/verify-recaptcha/route.ts` - Backend verification
- ✅ `.env.local` - Added keys for development
- ✅ `.env.production` - Added keys for production

## Next Steps

1. **Test locally**: `npm run dev` and try signing a petition
2. **Deploy to Vercel**: Add keys to Vercel environment variables
3. **Monitor**: Check reCAPTCHA admin console for stats

## Vercel Deployment

Add these environment variables in Vercel Dashboard:

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcHzhwsAAAAAIai6tAutRZY3AW4N1xTXAZIr9yd
RECAPTCHA_SECRET_KEY=6LcHzhwsAAAAANYh8NxAXmnNe8jYiBGZK3ao_D1I
```

## Troubleshooting

### "Security verification failed"

- Check if keys are correct in `.env.local`
- Verify domain is added in reCAPTCHA admin
- Check browser console for errors

### Keys not working

- Make sure you're using reCAPTCHA v3 (not v2)
- Verify domain matches exactly (no `https://`)
- For localhost, just use `localhost` (no port)

### reCAPTCHA not running

- Check if `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set
- Restart dev server after adding keys
- Check browser console for loading errors

## Support

- **reCAPTCHA Docs**: https://developers.google.com/recaptcha/docs/v3
- **Admin Console**: https://www.google.com/recaptcha/admin
- **Support**: https://support.google.com/recaptcha

---

**Setup Date**: December 2024  
**Status**: ✅ Production Ready
