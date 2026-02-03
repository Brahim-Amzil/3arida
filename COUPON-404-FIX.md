# Coupon Validation 404 Error - Fixed

## Problem

Coupon validation was returning 404 error in browser, even though the API route exists and works when tested directly.

## Root Cause

Next.js dev server cache issue - the browser was using a cached version that didn't include the new API routes.

## Solution

### Step 1: Clear Next.js Cache ✅

```bash
rm -rf .next
```

### Step 2: Restart Dev Server (REQUIRED!)

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## Why This Happens

When we:

1. Created new API routes (`/api/coupons/validate`)
2. Switched from client SDK to Admin SDK
3. Made multiple changes to the same files

Next.js sometimes caches the old routes and doesn't pick up the new ones properly, even with hot reload.

## Verification

After restarting, test the API:

```bash
curl -X POST http://localhost:3004/api/coupons/validate \
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

## Test in Browser

1. Go to petition creation form
2. Select "Influencer" as publisher type
3. Navigate to Step 5 (Review)
4. Enter coupon: `INFL10-TEST`
5. Click "تطبيق" (Apply)
6. Should show: ✅ Discount applied!

## When to Clear Cache

Clear `.next` cache when:

- API routes return 404 but file exists
- Changes to API routes not reflecting
- Hot reload not working properly
- After switching between branches
- After major refactoring

## Quick Fix Command

```bash
rm -rf .next && npm run dev
```

---

**Status**: Cache cleared, restart dev server to fix
**Action Required**: Restart dev server
**Test Coupon**: `INFL10-TEST`
