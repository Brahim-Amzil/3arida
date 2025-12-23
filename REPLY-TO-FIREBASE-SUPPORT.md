# Reply to Firebase Support

## Summary

Thank you for your response and for providing the test project. I tested my phone number on your demo (https://fir-ui-demo-84a6c.firebaseapp.com/) and **it worked perfectly** - I received the SMS verification code immediately.

However, the **same phone number fails in my app** with the same Firebase project. This confirms the issue is in my app's configuration or implementation, not with Firebase's service.

## Testing Results

### ✅ Firebase Demo (WORKS)

- URL: https://fir-ui-demo-84a6c.firebaseapp.com/
- Phone number: +34XXXXXXXXX (same number)
- Result: **SMS received successfully**
- Time to receive: ~30 seconds

### ❌ My App (FAILS)

- URL: http://localhost:3000 (local development)
- Phone number: +34XXXXXXXXX (same number)
- Error: `auth/internal-error` or `auth/invalid-recaptcha-token`
- Result: **No SMS received**

## Answers to Your Questions

### 1. Have the phones recently switched to a different mobile carrier?

**No**, the phone has been with the same carrier (Vodafone Spain) for over 2 years. No recent changes.

### 2. Are you testing locally or on a deployed website?

**Testing locally** on `localhost:3000` during development.

I plan to deploy to Firebase Hosting (`arida-c5faf.firebaseapp.com`) for production.

## My Configuration

### Firebase Project

- Project ID: `arida-c5faf`
- Auth Domain: `arida-c5faf.firebaseapp.com`
- Plan: Blaze (pay-as-you-go)

### Phone Auth Settings

- Phone provider: **ENABLED** ✅
- SMS region policy: Set to "Allow" mode
- Allowed regions: Spain, Morocco, EU, US, UAE

### Testing Environment

- Browser: Chrome (latest version)
- OS: macOS
- Phone format: E.164 (+34XXXXXXXXX)
- Phone numbers: Real (not test numbers)

## What I've Checked

### ✅ Authorized Domains

I verified in Firebase Console → Authentication → Settings → Authorized domains:

- `localhost` is listed ✅
- `arida-c5faf.firebaseapp.com` is listed ✅

### ✅ Phone Provider Enabled

Firebase Console → Authentication → Sign-in method:

- Phone provider is ENABLED ✅
- No test phone numbers configured

### ⚠️ Custom reCAPTCHA

I am using a custom reCAPTCHA key:

- Site key: `6LcHzhwsAAAAAIai6tAutRZY3AW4N1xTXAZIr9yd`
- Type: reCAPTCHA v2
- Domains configured: `localhost`, `arida-c5faf.firebaseapp.com`

**Question:** Could the custom reCAPTCHA be causing issues? Should I use Firebase's default reCAPTCHA instead?

## Error Details

### Browser Console Error

```
Error code: auth/internal-error
Error message: An internal error has occurred
```

OR

```
Error code: auth/invalid-recaptcha-token
Error message: The reCAPTCHA token is invalid
```

### Network Request

Request to: `https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode`

Response: 400 Bad Request (when it fails)

### Timestamp

Most recent failure: [INSERT TIMESTAMP HERE]

## My Implementation

I'm using Firebase SDK v10.7.1 with the following code:

```typescript
// Initialize reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  size: 'invisible',
  callback: () => console.log('reCAPTCHA solved'),
});

// Send SMS
const confirmationResult = await signInWithPhoneNumber(
  auth,
  phoneNumber, // E.164 format: +34XXXXXXXXX
  window.recaptchaVerifier
);
```

## Questions for Firebase Support

1. **Domain Authorization:** Is there anything else I need to configure for `localhost` to work? Your demo works on `firebaseapp.com` - could that be the difference?

2. **reCAPTCHA:** Should I remove my custom reCAPTCHA and use Firebase's default? Could my custom reCAPTCHA configuration be causing the issue?

3. **App Registration:** Is there any additional app registration or configuration needed in Firebase Console that I might be missing?

4. **Debugging:** Can you check the Google Cloud logs for my project (`arida-c5faf`) to see if there are more detailed error messages?

5. **Testing:** Should I deploy to Firebase Hosting first and test there instead of localhost?

## Next Steps I Plan to Take

1. **Remove custom reCAPTCHA** and use Firebase's default
2. **Deploy to Firebase Hosting** and test on `arida-c5faf.firebaseapp.com`
3. **Compare network requests** between your demo and my app
4. **Check Google Cloud logs** for detailed error messages

## Additional Information

- Firebase SDK version: 10.7.1
- Next.js version: 14.x
- Node.js version: 18.x
- Testing from: Spain (same country as phone number)

## Request

Could you please:

1. Check if there are any configuration issues in my Firebase project (`arida-c5faf`)
2. Review Google Cloud logs for detailed error messages
3. Confirm if custom reCAPTCHA could be causing the issue
4. Suggest any additional debugging steps

Thank you for your help!

---

**Project ID:** arida-c5faf  
**Phone Number Format:** +34XXXXXXXXX (E.164)  
**Error Code:** auth/internal-error or auth/invalid-recaptcha-token  
**Firebase Demo:** ✅ Works  
**My App:** ❌ Fails
