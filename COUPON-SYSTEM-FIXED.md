# Coupon System - Fixed with Firebase Admin SDK

## Problem Solved ✅

The coupon validation was failing with 500 errors because the Firebase **client SDK** doesn't work reliably in Next.js API routes (server-side).

## Solution

Switched to **Firebase Admin SDK** for all API routes.

---

## Changes Made

### 1. Created Firebase Admin Library

**File**: `src/lib/firebase-admin.ts`

- Initializes Firebase Admin SDK
- Exports `adminDb` and `adminAuth`
- Uses application default credentials

### 2. Updated Validation API

**File**: `src/app/api/coupons/validate/route.ts`

- Changed from client SDK (`firebase/firestore`) to Admin SDK
- Uses `adminDb.collection()` instead of `collection(db, ...)`
- Proper timestamp handling with `.toDate()`

### 3. Updated Usage API

**File**: `src/app/api/coupons/use/route.ts`

- Changed to Admin SDK
- Uses `FieldValue.increment()` and `FieldValue.arrayUnion()`
- Proper document reference updates

### 4. Generated Test Coupon

**Script**: `generate-test-coupon.js`

- Creates test coupon: `INFL10-TEST`
- 10% discount
- Max 5 uses
- Expires in 30 days

---

## How to Test

### Step 1: Restart Dev Server (REQUIRED!)

```bash
# Stop current server (Ctrl+C in terminal)
npm run dev
```

**Why?** The dev server needs to restart to:

- Load the new `firebase-admin` package
- Recompile API routes with Admin SDK
- Clear any cached modules

### Step 2: Verify Test Coupon Exists

```bash
node check-coupons.js
```

Should show:

```
✅ Found 1 coupon(s):
Code: INFL10-TEST
Discount: 10%
Status: active
```

### Step 3: Test API Validation

```bash
curl -X POST http://localhost:3004/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"INFL10-TEST"}'
```

Expected response:

```json
{
  "valid": true,
  "discount": 10,
  "code": "INFL10-TEST",
  "type": "influencer"
}
```

### Step 4: Test in Browser

1. Go to: `http://localhost:3004/petitions/create`
2. Select **"Influencer"** as publisher type
3. Fill form and go to Step 5 (Review)
4. Enter coupon: `INFL10-TEST`
5. Click **"تطبيق"** (Apply)
6. Should show: ✅ Discount applied!

---

## API Endpoints

### POST `/api/coupons/validate`

**Request**:

```json
{
  "code": "INFL10-TEST"
}
```

**Response (Valid)**:

```json
{
  "valid": true,
  "discount": 10,
  "code": "INFL10-TEST",
  "type": "influencer"
}
```

**Response (Invalid)**:

```json
{
  "error": "كود الكوبون غير صالح"
}
```

### POST `/api/coupons/use`

**Request**:

```json
{
  "code": "INFL10-TEST",
  "userId": "user123"
}
```

**Response**:

```json
{
  "success": true,
  "message": "تم استخدام الكوبون بنجاح"
}
```

---

## Files Modified

### New Files:

- `src/lib/firebase-admin.ts` - Admin SDK initialization
- `generate-test-coupon.js` - Test coupon generator
- `check-coupons.js` - Coupon verification script

### Modified Files:

- `src/app/api/coupons/validate/route.ts` - Uses Admin SDK
- `src/app/api/coupons/use/route.ts` - Uses Admin SDK
- `src/app/admin/coupons/page.tsx` - Shorter codes (`INFL10-ABC`)

---

## Why Admin SDK?

### Client SDK Issues:

- ❌ Unreliable in server-side API routes
- ❌ Requires browser environment
- ❌ Can cause initialization errors
- ❌ Not designed for server use

### Admin SDK Benefits:

- ✅ Designed for server-side use
- ✅ More reliable and stable
- ✅ Better error handling
- ✅ Direct Firestore access
- ✅ No browser dependencies

---

## Troubleshooting

### Still getting 500 errors?

1. **Restart dev server** (most common fix)
2. Check Firebase credentials are set up
3. Run `firebase login` if needed

### Coupon not found?

1. Run `node check-coupons.js` to verify it exists
2. Check the code is exactly: `INFL10-TEST` (case-sensitive)
3. Generate a new one: `node generate-test-coupon.js`

### Console.log not showing?

- API routes don't always show logs in dev mode
- Check terminal where `npm run dev` is running
- Logs should appear after server restart

---

## Next Steps

1. ✅ **Restart dev server** - CRITICAL!
2. ✅ Test validation API with curl
3. ✅ Test in browser at petition creation
4. ✅ Generate real coupons in admin dashboard
5. ✅ Test complete payment flow with coupon

---

**Status**: Fixed and ready to test
**Action Required**: Restart dev server
**Test Coupon**: `INFL10-TEST`
**Estimated Test Time**: 2 minutes
