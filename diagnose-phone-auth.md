# Diagnosing auth/internal-error-encountered

## Current Status

✅ reCAPTCHA is working (visible checkbox, solves successfully)
✅ Client-side code is correct
❌ Firebase backend returning 500 Internal Server Error

## Error Details

- **Error Code:** `auth/internal-error-encountered`
- **HTTP Status:** 500 (Internal Server Error)
- **Endpoint:** `identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode`
- **Phone Number Tested:** +34622557914

## What This Means

The 500 error indicates Firebase's backend is rejecting the SMS request. This is NOT a code issue - it's a Firebase configuration or quota issue.

## Step 1: Check Google Cloud Logs (CRITICAL)

### How to Access:

1. Go to: https://console.cloud.google.com/
2. Select project: **arida-c5faf**
3. Navigate to: **Logging → Logs Explorer**
4. Use this filter:

```
resource.type="identitytoolkit.googleapis.com/project"
timestamp>="2024-12-12T00:00:00Z"
severity>=ERROR
```

### What to Look For:

- Error messages about phone verification
- SMS quota exceeded
- Region restrictions
- Invalid configuration
- Billing issues

## Step 2: Check Firebase Console Settings

### Authentication → Sign-in method → Phone

- [ ] Phone provider is **ENABLED** (not just added)
- [ ] Click on Phone provider and verify settings
- [ ] Check if test phone numbers are configured (remove them for production)

### Authentication → Settings → Authorized domains

- [ ] `localhost` is in the list
- [ ] Your production domain is in the list

### Authentication → Usage

- [ ] Check SMS quota (how many sent today)
- [ ] Check if quota is exceeded

## Step 3: Check Identity Platform

### Go to: https://console.cloud.google.com/customer-identity

1. Select project: **arida-c5faf**
2. Check if Identity Platform is **enabled**
3. Go to **Settings**
4. Check **SMS regions**:
   - Should be in "Allow" mode
   - Should include: Spain (ES), Morocco (MA), EU, US

## Step 4: Check Billing

### Firebase Console → Project Settings → Usage and billing

- [ ] Blaze plan is active
- [ ] No billing alerts
- [ ] Payment method is valid
- [ ] SMS quota not exceeded

## Step 5: Common Causes of 500 Error

### 1. SMS Region Not Allowed

**Solution:**

- Go to Identity Platform → Settings → SMS region policy
- Set to "Allow" mode
- Add: ES (Spain), MA (Morocco), EU, US

### 2. SMS Quota Exceeded

**Solution:**

- Check Firebase Console → Usage
- Wait for quota reset (daily)
- Or increase quota in billing settings

### 3. Phone Number Already Registered

**Solution:**

- Try a different phone number
- Or delete the existing user with that phone number

### 4. Identity Platform Not Properly Configured

**Solution:**

- Disable and re-enable Identity Platform
- Wait 5-10 minutes for propagation

### 5. Invalid reCAPTCHA Token (despite solving)

**Solution:**

- The token might be expired by the time it reaches Firebase
- Try sending SMS immediately after solving reCAPTCHA

### 6. Firebase Project Misconfiguration

**Solution:**

- Check that your Firebase project ID matches in all configs
- Verify API key is correct and not restricted

## Step 6: Test with Different Phone Numbers

Try these to isolate the issue:

- ✅ Spain: +34622557914 (already tested - failed)
- Try: +34612345678 (different Spanish number)
- Try: +212612345678 (Morocco)
- Try: +15551234567 (US test number)

## Step 7: Enable Test Phone Numbers (Temporary)

If you need to test without SMS:

1. Firebase Console → Authentication → Sign-in method → Phone
2. Scroll to "Phone numbers for testing"
3. Add test numbers:
   - Phone: +34612345678, Code: 123456
   - Phone: +212612345678, Code: 123456

**Note:** Test numbers work in development but won't send real SMS.

## Step 8: Check Firebase Service Status

Visit: https://status.firebase.google.com/

- Check if there are any ongoing incidents with Authentication or Identity Platform

## Step 9: Alternative Solutions

### Option A: Use WhatsApp Verification (You Already Have It)

You have WhatsApp Business API configured in `.env.local`:

```
WHATSAPP_PHONE_NUMBER_ID=955517827633887
WHATSAPP_ACCESS_TOKEN=EAAQUvnimSnkBQNiM9JxGU1KLx6agA4lLg0ycpZBYo53BGD9ie1ZCG8u1RrIpb6sfDV1arhxUz1gg6uS95s5EKhrwDI2xkHfRa7q5K8uqLU0h5aYdGAYAsVvuNBSTz8dzg2sF9U3VZAXQM4pgPowZBY8T16mG7Jew7tJ6Re55OZC3KFwz3h4uSHsTkHJPhAfavPXclJjfKfCbqTPBOWIjwnfH5k12I5TcOmCRlqfNStOVYHY5rj3dt9glo9eaOirwGZBZCsyz3AX0f6hqZBZCsRfOR8LgZD
```

This might be more reliable than Firebase SMS.

### Option B: Make Phone Verification Optional for MVP

Launch without mandatory phone verification, add it later when working.

### Option C: Use Email Verification Instead

Simpler and more reliable for MVP launch.

## Step 10: Contact Firebase Support

If all else fails:

1. Go to: https://firebase.google.com/support/contact/troubleshooting
2. Select: **Authentication**
3. Provide:
   - Project ID: `arida-c5faf`
   - Error: `auth/internal-error-encountered` (500)
   - Phone number tested: +34622557914
   - Timestamp: [when you tested]
   - Google Cloud logs (from Step 1)

## Next Actions (Priority Order)

1. **CHECK GOOGLE CLOUD LOGS** - This will tell you the exact reason
2. Verify Identity Platform SMS region settings
3. Check Firebase SMS quota
4. Try different phone numbers
5. Consider WhatsApp verification as alternative

## Quick Test Commands

### Check if Firebase project is accessible:

```bash
cd 3arida-app
node -e "
const admin = require('firebase-admin');
const serviceAccount = {
  projectId: 'arida-c5faf',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY
};
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
console.log('✅ Firebase Admin SDK initialized');
console.log('Project ID:', admin.app().options.projectId);
"
```

---

**MOST IMPORTANT:** Check Google Cloud Logs - they will show the exact reason for the 500 error.
