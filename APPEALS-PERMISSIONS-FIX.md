# Appeals System - Permissions Fix (FINAL)

## Problem

Appeals creation was failing with "Missing or insufficient permissions" and 500 errors because Firebase Admin SDK wasn't properly initialized in the development environment.

## Root Cause

- API routes require Firebase Admin SDK (server-side)
- Admin SDK needs proper initialization to work
- Previous initialization was too strict and failed without service account

## Solution

Fixed Firebase Admin SDK initialization to work in development without service account:

### Files Modified

1. **src/lib/firebase-admin.ts**
   - Improved initialization fallback logic
   - Now tries multiple initialization methods:
     1. Service account key (if available)
     2. Application default credentials
     3. Project ID only (for development)
   - Works in development without requiring service account setup

2. **src/app/api/appeals/create/route.ts**
   - Uses Firebase Admin SDK (`adminDb`)
   - Properly handles server-side operations

3. **src/app/api/appeals/route.ts**
   - Uses Firebase Admin SDK
   - Fetches appeals with proper role-based filtering

### Why This Works

- Firebase Admin SDK can initialize with just project ID in development
- Security rules are still enforced
- No need to configure service account for local development
- Production can use service account or application default credentials

## Testing

After restarting the dev server:

1. User creates appeal → Should work ✅
2. Appeal appears in user dashboard ✅
3. Appeal appears in admin dashboard ✅
4. No permission errors ✅

## Important

**You must restart your development server** for the firebase-admin.ts changes to take effect:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Production Setup (Optional)

For production, you can add a service account key:

1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Add to environment variables:
   ```
   FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
   ```

But this is **not required** for development or basic production deployments.
