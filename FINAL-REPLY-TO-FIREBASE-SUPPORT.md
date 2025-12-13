# Reply to Firebase Support - Updated with Test Results

## Summary

Thank you for your response and for providing the test project. I tested my phone number on your demo (https://fir-ui-demo-84a6c.firebaseapp.com/) and **it worked perfectly** - I received the SMS verification code immediately.

However, the **same phone number fails in my app** with error `auth/internal-error-encountered`. This confirms Firebase's phone auth service works, but something in my project backend configuration is causing a 500 Internal Server Error.

---

## Testing Results

### ✅ Firebase Demo (WORKS)

- **URL:** https://fir-ui-demo-84a6c.firebaseapp.com/
- **Phone number:** +34613658220
- **Result:** SMS received successfully ✅
- **Time to receive:** ~30 seconds

### ❌ My App (FAILS)

- **URL:** http://localhost:3000/test-phone-simple
- **Phone number:** +34613658220 (same number)
- **Error Code:** `auth/internal-error-encountered`
- **HTTP Status:** 500 (Internal Server Error)
- **Request URL:** `https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode`
- **Result:** No SMS received ❌
- **Timestamp:** December 12, 2024 at 6:34 PM GMT

---

## Answers to Your Questions

### 1. Have the phones recently switched to a different mobile carrier?

**No**, the phone has been with the same carrier (Vodafone Spain) for over 2 years. No recent changes.

### 2. Are you testing locally or on a deployed website?

**Testing locally** on `localhost:3000` during development.

I plan to deploy to Firebase Hosting (`arida-c5faf.firebaseapp.com`) for production, but wanted to resolve this issue first.

---

## What I've Verified

### ✅ Firebase Console Configuration

I've checked all settings in Firebase Console:

**Authentication Settings:**

- Phone provider: ENABLED ✅
- Authorized domains: `localhost` and `arida-c5faf.firebaseapp.com` are both listed ✅
- No warnings or alerts shown ✅

**Phone Provider Settings:**

- SMS region policy: Set to "Allow" mode ✅
- Allowed regions: Include Spain (+34), Morocco (+212), EU, US ✅
- Phone numbers for testing: Empty (no test numbers) ✅

**Project Billing:**

- Plan: Blaze (pay-as-you-go) ✅
- No quota exceeded warnings ✅
- Payment method active ✅

**Identity Platform:**

- Status: Enabled ✅
- No errors or warnings ✅

### ✅ Firebase Service Status

- Checked https://status.firebase.google.com/
- Authentication service: Operational ✅
- No ongoing outages ✅

### ✅ Google Cloud Logs

- Checked logs at https://console.cloud.google.com/logs
- No Firebase authentication errors logged
- The error appears to be happening on Firebase's backend before reaching my Cloud Functions

### ✅ Code Implementation

- Using Firebase SDK v10.7.1
- Using invisible reCAPTCHA (like your demo)
- reCAPTCHA renders successfully (widget ID: 0)
- Request is sent correctly to identitytoolkit.googleapis.com
- No custom reCAPTCHA keys (using Firebase default)

---

## Error Details

**Browser Console Error:**

```
FirebaseError: Firebase: Error (auth/internal-error-encountered).
```

**Network Request:**

- **Method:** POST
- **URL:** `https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=AIzaSyAhYUelLCS8ItJwaltcjtUl8HHJwp605T0`
- **Status:** 500 (Internal Server Error)
- **Response:** `(Internal Server Error)`

**Debug Logs from My App:**

```
[6:34:16 PM] ✅ Component mounted, initializing reCAPTCHA...
[6:34:16 PM] ✅ Component mounted, initializing reCAPTCHA...
[6:34:16 PM] 🔐 Creating RecaptchaVerifier...
[6:34:17 PM] ✅ reCAPTCHA rendered successfully (widget ID: 0)
[6:34:49 PM] 📱 Sending SMS to: +34613658220
[6:34:49 PM] ❌ Send SMS failed: auth/internal-error-encountered
```

---

## What This Indicates

Since:

1. Your demo works with my phone number ✅
2. My code sends the request correctly ✅
3. reCAPTCHA works ✅
4. All Firebase Console settings are correct ✅
5. Firebase returns a 500 Internal Server Error ❌

This appears to be a **backend configuration issue in my Firebase project** that only Firebase support can diagnose and fix.

---

## Questions for Firebase Support

1. **Can you check the backend logs for my project (`arida-c5faf`) around December 12, 2024 at 6:34 PM GMT?**
   - The error `auth/internal-error-encountered` suggests a server-side issue
   - Google Cloud Logs don't show the error, so it must be in Firebase's internal logs

2. **Is there any backend configuration in my project that could cause this 500 error?**
   - Identity Platform settings?
   - SMS provider configuration?
   - Regional restrictions?
   - API quotas or limits?

3. **Why does your demo work but my project doesn't?**
   - Both use the same phone number
   - Both use Firebase phone authentication
   - What's different in the backend configuration?

4. **Should I try deploying to Firebase Hosting first?**
   - Would testing on `arida-c5faf.firebaseapp.com` instead of `localhost` help?

5. **Is there a way to enable more detailed error logging?**
   - The generic `auth/internal-error-encountered` doesn't provide enough information to debug

---

## Additional Context

- **Project ID:** arida-c5faf
- **Firebase SDK:** v10.7.1
- **Next.js version:** 14.x
- **Browser:** Chrome (latest)
- **Testing from:** Spain (same country as phone number)
- **Phone format:** E.164 (+34613658220)

---

## What I Need

Please check the backend logs for my project and let me know:

1. What's causing the 500 Internal Server Error?
2. What configuration needs to be fixed?
3. Are there any backend settings I can't see in the Firebase Console?

Thank you for your help!

---

**Project ID:** arida-c5faf  
**Error Code:** auth/internal-error-encountered  
**HTTP Status:** 500  
**Timestamp:** December 12, 2024 at 6:34 PM GMT  
**Phone Number:** +34613658220
