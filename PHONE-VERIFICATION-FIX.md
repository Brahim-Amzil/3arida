# Phone Verification Fix - December 2024

## Problem Summary

Phone verification was failing with `auth/internal-error` and `auth/invalid-recaptcha-token` errors after multiple troubleshooting attempts over 5 days.

## Root Cause Analysis

### What We Found:

1. **Backup folder (`3arida_copy`) had MOCK verification** - not real Firebase phone auth
2. **Firebase SDK was at v10.7.1** (correct version, not v9.23.0 as thought)
3. **RecaptchaVerifier API usage was incorrect** for Firebase v10
4. **reCAPTCHA initialization timing issues** causing failures

### Key Issues Fixed:

- ✅ Corrected RecaptchaVerifier constructor parameter order for Firebase v10
- ✅ Changed from visible to invisible reCAPTCHA for better UX
- ✅ Added proper initialization delay to ensure DOM is ready
- ✅ Improved error handling with specific Firebase error codes
- ✅ Added automatic sign-out after verification (we only need verification, not auth)
- ✅ Better cleanup on component unmount

## Changes Made

### 1. PhoneVerification.tsx - Complete Rewrite

**File:** `3arida-app/src/components/auth/PhoneVerification.tsx`

**Key Changes:**

- Fixed RecaptchaVerifier constructor: `new RecaptchaVerifier(elementId, options, auth)` (not `auth` first)
- Changed to invisible reCAPTCHA (`size: 'invisible'`)
- Added 500ms initialization delay for DOM readiness
- Improved error messages with specific Firebase error codes
- Added automatic sign-out after successful verification
- Better state management and cleanup

### 2. Dependencies

**File:** `3arida-app/package.json`

Firebase SDK confirmed at **v10.7.1** (correct version)

- Reinstalled all dependencies to ensure clean state

## Testing Instructions

### 1. Start Development Server

```bash
cd 3arida-app
npm run dev
```

### 2. Test Phone Verification

1. Navigate to: http://localhost:3000/test-phone
2. Enter a valid phone number with country code (e.g., +34612345678)
3. Wait for reCAPTCHA to initialize (should be invisible)
4. Click "Send Code"
5. Check console for detailed logs
6. Enter the 6-digit code received via SMS
7. Click "Verify"

### 3. Check Firebase Console

If errors persist, check:

- **Firebase Console → Authentication → Sign-in method → Phone**
  - Ensure Phone provider is ENABLED
  - Check SMS region policy (should allow Spain, Morocco, EU, US, UAE)
- **Google Cloud Console → Logs Explorer**
  - Filter by: `resource.type="cloud_function"`
  - Look for detailed error messages

### 4. Common Error Codes

| Error Code                    | Meaning               | Solution                             |
| ----------------------------- | --------------------- | ------------------------------------ |
| `auth/invalid-phone-number`   | Phone format wrong    | Use E.164 format: +[country][number] |
| `auth/too-many-requests`      | Rate limited          | Wait 1 hour or use different number  |
| `auth/quota-exceeded`         | SMS quota reached     | Check Firebase billing/quotas        |
| `auth/captcha-check-failed`   | reCAPTCHA failed      | Refresh page and try again           |
| `auth/internal-error`         | Server-side error     | Check Google Cloud logs for details  |
| `auth/invalid-app-credential` | Firebase config issue | Verify Firebase project settings     |

## Firebase Console Checklist

### Authentication Settings

- [ ] Phone provider is ENABLED
- [ ] SMS region policy set to "Allow" mode
- [ ] Allowed regions include: Spain, Morocco, EU, US, UAE
- [ ] Test phone numbers removed (if any)
- [ ] Identity Platform is enabled

### Project Settings

- [ ] Blaze (pay-as-you-go) plan is active
- [ ] SMS quota is not exceeded
- [ ] No billing alerts

### App Configuration

- [ ] App is registered in Firebase project
- [ ] SHA-1/SHA-256 fingerprints added (if using Android)
- [ ] Authorized domains include localhost and production domain

## Environment Variables Required

Ensure these are set in `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Debugging Tips

### 1. Enable Verbose Logging

Check browser console for these log messages:

- 🔐 Initializing reCAPTCHA verifier...
- ✅ reCAPTCHA rendered with widget ID: [number]
- 📱 Sending verification code to: [phone]
- ✅ SMS sent successfully
- 🔍 Verifying code...
- ✅ Phone verified successfully!

### 2. Check Network Tab

- Look for POST to `identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode`
- Check response status and error details

### 3. Test with Different Numbers

Try numbers from different countries:

- Spain: +34612345678
- Morocco: +212612345678
- US: +15551234567

### 4. Check Firebase Quotas

Firebase Console → Usage → Authentication

- SMS sent today
- SMS quota remaining

## Known Limitations

1. **SMS Costs**: Each SMS costs money on Blaze plan
2. **Rate Limiting**: Firebase limits SMS per phone number per day
3. **Regional Restrictions**: Some countries may be blocked by default
4. **Test Mode**: Test phone numbers don't work in production mode

## Next Steps if Still Failing

### Option 1: Check Google Cloud Logs (RECOMMENDED)

```bash
# Go to Google Cloud Console
# Navigate to: Logging → Logs Explorer
# Filter: resource.type="cloud_function"
# Look for detailed error messages
```

### Option 2: Enable Test Phone Numbers (Development Only)

Firebase Console → Authentication → Sign-in method → Phone

- Add test phone numbers with codes
- Example: +1 650-555-3434 → code: 123456

### Option 3: Use Alternative Verification (Temporary)

If SMS continues to fail, consider:

- Email verification instead
- WhatsApp verification (you have WhatsApp API configured)
- Manual admin approval for creators

### Option 4: Contact Firebase Support

If internal errors persist:

1. Go to Firebase Console → Support
2. Provide:
   - Project ID: arida-c5faf
   - Error code: auth/internal-error
   - Timestamp of failed attempts
   - Google Cloud logs

## Success Criteria

Phone verification is working when:

- ✅ reCAPTCHA initializes without errors
- ✅ SMS is sent successfully
- ✅ User receives SMS within 1 minute
- ✅ Verification code is accepted
- ✅ No console errors
- ✅ User can proceed with petition creation

## Rollback Plan

If this fix doesn't work, you can:

1. Use mock verification temporarily (like backup folder)
2. Make phone verification optional for MVP launch
3. Implement email verification as alternative

## Support

If you continue to experience issues:

1. Check Google Cloud logs for detailed error messages
2. Verify Firebase project configuration
3. Test with multiple phone numbers from different countries
4. Consider enabling test phone numbers for development

---

**Last Updated:** December 12, 2024
**Status:** Ready for testing
**Firebase SDK Version:** 10.7.1
