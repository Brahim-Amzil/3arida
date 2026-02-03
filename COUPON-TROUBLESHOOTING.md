# Coupon System Troubleshooting

## Current Issue

Getting 500 error when validating coupons: `حدث خطأ في التحقق من الكوبون`

## Root Cause

The API route `/api/coupons/validate` is returning 500 error, likely due to:

1. API route not properly recompiled after changes
2. Firebase client SDK initialization issue in server-side API route

## Solution

### Step 1: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

This ensures all API routes are properly compiled with the latest changes.

### Step 2: Generate a Test Coupon

1. Go to: `http://localhost:3004/admin/coupons`
2. Set discount: **10%**
3. Click **"إنشاء كوبون"** (Generate Coupon)
4. Copy the generated code (e.g., `INFL10-ABC`)

### Step 3: Test Coupon Validation

1. Go to: `http://localhost:3004/petitions/create`
2. Select **"Influencer"** as publisher type
3. Fill form and navigate to Step 5 (Review)
4. Enter the coupon code
5. Click **"تطبيق"** (Apply)

## Expected Behavior

### ✅ Valid Coupon:

- Shows discount applied
- Original price with strikethrough
- Final price calculated

### ❌ Invalid Coupon:

- Error: `كود الكوبون غير صالح`

### ❌ Already Used:

- Error: `لقد استخدمت هذا الكوبون من قبل`

## Verification Commands

### Check if coupons exist:

```bash
node check-coupons.js
```

### Test API directly:

```bash
./test-api-simple.sh
```

### Test Firebase connection:

```bash
node test-firebase-connection.js
```

## Changes Made

### 1. Shorter Coupon Codes ✅

- **Before**: `INFLUENCER30-I7Q8I8` (18 chars)
- **After**: `INFL30-ABC` (10 chars)

### 2. Better Error Logging ✅

- Added console.log statements in API routes
- Added detailed error information
- Added `dynamic = 'force-dynamic'` export

### 3. Files Modified:

- `src/app/api/coupons/validate/route.ts` - Added logging
- `src/app/api/coupons/use/route.ts` - Added logging
- `src/app/admin/coupons/page.tsx` - Shorter code generation

## Next Steps

1. **Restart dev server** to ensure API routes recompile
2. **Generate a coupon** in admin dashboard
3. **Test validation** at petition creation
4. Check server logs for detailed error messages

## If Still Not Working

### Check Environment Variables:

```bash
# Ensure Firebase config is set
echo $NEXT_PUBLIC_FIREBASE_API_KEY
echo $NEXT_PUBLIC_FIREBASE_PROJECT_ID
```

### Check Firestore Rules:

```bash
# Ensure rules are deployed
firebase deploy --only firestore:rules
```

### Check Browser Console:

- Open DevTools → Console
- Look for detailed error messages
- Check Network tab for API response

### Check Server Logs:

- Look for console.log output in terminal
- Should see: `🔍 Validating coupon: ...`
- If not seeing logs, API route isn't being hit

## Alternative: Use Admin SDK

If client SDK continues to have issues in API routes, we can switch to Firebase Admin SDK:

1. Create `src/lib/firebase-admin.ts`
2. Initialize admin SDK
3. Update API routes to use admin SDK instead

This would require server-side only execution but would be more reliable.

---

**Status**: Awaiting dev server restart to test
**Priority**: High
**Estimated Fix Time**: 5 minutes (restart + test)
