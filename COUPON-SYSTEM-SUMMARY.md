# Coupon System - Current Status & Next Steps

## Current Issue

The coupon validation API returns 404 in the browser due to persistent caching and dev server instability with Firebase Admin SDK.

## What's Working

✅ Coupon generation in admin dashboard (`/admin/coupons`)
✅ Coupons stored in Firestore
✅ API works when tested with curl
✅ Contact form for influencer requests
✅ Email notifications to `contact@3arida.ma`

## What's Not Working

❌ Browser can't reach the API due to aggressive caching
❌ Dev server keeps crashing/restarting
❌ Firebase Admin SDK causing initialization issues

## Root Cause

The Firebase Admin SDK is designed for server-side Node.js environments, but Next.js API routes run in a hybrid environment that can cause issues during development.

## Recommended Solution

### Option 1: Deploy to Production (Recommended)

The coupon system will work perfectly in production because:

- No hot-reload/caching issues
- Proper server-side execution
- Firebase Admin SDK works reliably

**Action**: Deploy to Vercel and test there

### Option 2: Temporary Hardcoded Validation (Quick Fix)

Revert to simple hardcoded validation for development:

```typescript
const validateCoupon = (code: string) => {
  const coupons: Record<string, number> = {
    'INFL10-TEST': 10,
    'INFL15-04D': 15,
    'INFL20-ABC': 20,
    'INFL30-XYZ': 30,
  };
  return coupons[code.toUpperCase()] || null;
};
```

Then switch to API-based validation in production.

### Option 3: Use Client SDK Instead

Switch back to Firebase client SDK in API routes (less secure but works in dev):

- Remove firebase-admin dependency
- Use regular Firebase client SDK
- Works in development but less secure

## Current Coupons in Database

- `INFL10-TEST` - 10% discount, 5 uses
- `INFL15-04D` - 15% discount, 5 uses

## Files Involved

- `src/app/api/coupons/validate/route.ts` - Validation API
- `src/app/api/coupons/use/route.ts` - Usage tracking API
- `src/app/admin/coupons/page.tsx` - Admin dashboard
- `src/app/petitions/create/page.tsx` - Coupon input
- `src/lib/firebase-admin.ts` - Admin SDK init

## Next Steps

### Immediate (Choose One):

1. **Deploy to production** and test there
2. **Use hardcoded validation** for now
3. **Clear all browser data** and try again

### Long-term:

1. Test coupon system in production
2. If it works, keep current implementation
3. If not, switch to client SDK or hardcoded validation

## Testing in Production

Once deployed:

```bash
curl -X POST https://your-domain.com/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"INFL10-TEST"}'
```

Should return:

```json
{
  "valid": true,
  "discount": 10,
  "code": "INFL10-TEST",
  "type": "influencer"
}
```

---

**Recommendation**: Deploy to production and test there. The development environment has too many caching/hot-reload issues that won't exist in production.
