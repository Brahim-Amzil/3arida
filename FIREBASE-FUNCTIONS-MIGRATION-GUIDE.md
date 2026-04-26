# Firebase Functions Config Migration Guide

**Date:** February 16, 2026  
**Deadline:** March 31, 2027  
**Status:** ⚠️ ACTION REQUIRED

---

## What's Happening

Google is retiring the legacy `functions.config()` API and moving to Secret Manager for better security.

---

## Current Status

**Your project has 1 legacy config:**
```json
{
  "resend": {
    "api_key": "re_NsUf86bD_NYW1X8XgeKpvkFcSyTEZJytB"
  }
}
```

---

## Migration Steps

### Step 1: Export Current Config (DONE)
```bash
firebase functions:config:get
```

### Step 2: Migrate to Secret Manager

**Option A: Automatic Migration (Recommended)**
```bash
# Export and convert to Secret Manager format
firebase functions:config:export

# This creates a .env file with your secrets
# Then set the secret:
firebase functions:secrets:set RESEND_API_KEY
# When prompted, paste: re_NsUf86bD_NYW1X8XgeKpvkFcSyTEZJytB
```

**Option B: Manual Migration**
```bash
# Set secret directly
echo "re_NsUf86bD_NYW1X8XgeKpvkFcSyTEZJytB" | firebase functions:secrets:set RESEND_API_KEY
```

### Step 3: Update Your Code

**Before (Legacy):**
```typescript
import * as functions from 'firebase-functions';

const resendApiKey = functions.config().resend.api_key;
```

**After (Secret Manager):**
```typescript
import { defineSecret } from 'firebase-functions/params';

const resendApiKey = defineSecret('RESEND_API_KEY');

export const myFunction = onRequest(
  { secrets: [resendApiKey] },
  (req, res) => {
    const apiKey = resendApiKey.value();
    // Use apiKey
  }
);
```

### Step 4: Deploy
```bash
firebase deploy --only functions
```

---

## Important Notes

1. **No Rush:** You have until March 31, 2027
2. **No Downtime:** Existing functions keep running
3. **Free Tier:** Secret Manager includes 6 free secret versions (you only need 1)
4. **Better Security:** Secrets are encrypted and access-controlled

---

## Current Function Usage

Your `functions/src/index.ts` currently runs Next.js but doesn't use `functions.config()`.

**Check if Resend API key is used elsewhere:**
```bash
grep -r "resend" functions/
grep -r "RESEND" src/
```

---

## Action Plan

### Immediate (Optional - can wait):
1. Run: `firebase functions:secrets:set RESEND_API_KEY`
2. Paste the API key when prompted
3. Update any code that uses `functions.config().resend.api_key`
4. Deploy: `firebase deploy --only functions`

### Before March 2027 (Required):
- Complete the migration to avoid deployment failures

---

## Testing After Migration

1. Deploy functions
2. Test email sending functionality
3. Verify Resend API key works
4. Check Firebase Console > Functions > Secrets

---

## Rollback Plan

If something breaks:
1. The old config still works until March 2027
2. You can revert code changes
3. Redeploy with old code

---

## Questions?

- [Official Migration Guide](https://firebase.google.com/docs/functions/config-env)
- [Secret Manager Docs](https://cloud.google.com/secret-manager/docs)
- Google Cloud Support

---

## Summary

✅ You have 1 secret to migrate (Resend API key)  
⏰ Deadline: March 31, 2027 (over 1 year away)  
💰 Cost: Free (within free tier)  
⚠️ Priority: Low (but don't forget!)

**Recommendation:** Migrate during your next maintenance window, no urgency.
