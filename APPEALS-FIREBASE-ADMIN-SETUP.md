# Appeals System - Firebase Admin SDK Setup

## Problem

The appeals system was failing with "Missing or insufficient permissions" because it was using the client-side Firebase SDK which is subject to Firestore security rules.

## Solution

Use Firebase Admin SDK on the server side (API routes) which bypasses security rules.

## Files Created/Modified

### New Files:

1. `src/lib/firebase-admin.ts` - Firebase Admin SDK initialization
2. `src/lib/appeals-service-admin.ts` - Server-side appeals service using Admin SDK

### Modified Files:

1. `src/app/api/appeals/create/route.ts` - Now uses `createAppealAdmin()`
2. `src/app/api/appeals/route.ts` - Now uses `getAppealsForUserAdmin()`

## Required Environment Variables

Add these to your `.env.local` file:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### How to Get These Values:

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project (`arida-c5faf`)
3. Go to Project Settings (gear icon) → Service Accounts
4. Click "Generate New Private Key"
5. Download the JSON file
6. Extract the values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and \n characters)

## Next Steps

1. **Add environment variables** to `.env.local`
2. **Restart the dev server** to pick up new files and env vars
3. **Test creating an appeal** - should work now without permission errors

## Testing

After setup:

1. Navigate to a paused/rejected petition
2. Click "Contact Moderator" button
3. Submit an appeal
4. Should succeed and create appeal in Firestore
5. Check dashboard - appeal should appear in appeals section
6. Check admin panel - appeal should appear in admin appeals list

## Notes

- Firebase Admin SDK bypasses all Firestore security rules
- Only use Admin SDK in server-side code (API routes, server components)
- Never expose Admin SDK credentials to the client
- The client-side appeals-service.ts is still there but not used by API routes
