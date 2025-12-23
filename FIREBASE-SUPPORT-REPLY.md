# Reply to Firebase Support

Hi Enrique,

Thank you for the test project. I tested my phone number (+34613658220) on your demo at https://fir-ui-demo-84a6c.firebaseapp.com/ and **it worked perfectly** - I received the SMS within 30 seconds.

However, the **same phone number fails in my app** with error `auth/internal-error-encountered` (HTTP 500). This confirms Firebase's service works, but something in my project's backend configuration is causing the error.

---

## Test Results

**Your Demo:** ✅ Works  
**My App:** ❌ Fails with `auth/internal-error-encountered`

**Error Details:**

- **Project ID:** arida-c5faf
- **Phone Number:** +34613658220
- **Error Code:** auth/internal-error-encountered
- **HTTP Status:** 500 (Internal Server Error)
- **Request URL:** https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=AIzaSyAhYUelLCS8ItJwaltcjtUl8HHJwp605T0
- **Timestamp:** December 12, 2024 at 6:34 PM GMT
- **Testing From:** localhost:3000

---

## What I've Verified

**Firebase Console:**

- Phone provider: ENABLED ✅
- Authorized domains: localhost and arida-c5faf.firebaseapp.com both listed ✅
- SMS region policy: "Allow" mode with Spain (+34) included ✅
- Identity Platform: Enabled ✅
- Billing: Blaze plan active ✅
- No quota warnings ✅

**Code Implementation:**

- Firebase SDK v10.7.1
- Using invisible reCAPTCHA (like your demo)
- reCAPTCHA renders successfully (widget ID: 0)
- No custom reCAPTCHA keys (using Firebase default)
- Request is sent correctly to identitytoolkit.googleapis.com

**Service Status:**

- Checked https://status.firebase.google.com/ - All services operational ✅

**Google Cloud Logs:**

- No Firebase authentication errors appear in logs
- Error seems to occur on Firebase's backend before reaching my Cloud Functions

---

## Answers to Your Questions

**1. Have the phones recently switched carriers?**  
No, same carrier (Digi Spain) for 4+ years.

**2. Testing locally or deployed?**  
Testing locally on localhost:3000.

**Note:** We also attempted to deploy to Vercel for production testing, but the build fails with:

```
Error: Cannot find module '@opentelemetry/api'
Require stack:
- /vercel/path0/node_modules/@google-cloud/firestore/build/src/telemetry/enabled-trace-util.js
- /vercel/path0/node_modules/firebase-admin/lib/app/firebase-namespace.js
```

This is a firebase-admin dependency issue. The package `@opentelemetry/api` is in our package.json (v1.9.0) but Vercel's build cannot find it. This might be related to the same backend configuration issues causing the phone auth error.

---

## What I Need

Since your demo works but my project doesn't, this appears to be a **backend configuration issue in my Firebase project** that I cannot see or fix from the Console.

**Please check your internal logs for project `arida-c5faf` around December 12, 2024 at 6:34 PM GMT** and let me know:

1. What's causing the 500 Internal Server Error for phone auth?
2. What backend configuration needs to be fixed?
3. Are there any hidden settings or quotas I'm hitting?
4. Could the missing `@opentelemetry/api` dependency issue in Vercel builds be related to project configuration?

The generic `auth/internal-error-encountered` error doesn't provide enough information to debug on my end, and the Vercel build errors suggest there might be deeper Firebase Admin SDK configuration issues in my project.

Thank you for your help!

---

**Project ID:** arida-c5faf  
**API Key:** AIzaSyAhYUelLCS8ItJwaltcjtUl8HHJwp605T0  
**Phone Number:** +34613658220  
**Error:** auth/internal-error-encountered (HTTP 500)  
**Timestamp:** December 12, 2024, 6:34 PM GMT
