# Firebase Phone Authentication Setup Guide

## Error: auth/invalid-app-credential

This error occurs when reCAPTCHA verification fails. Follow these steps to fix it:

### 1. Check Firebase Console - Authentication Settings

Go to: https://console.firebase.google.com/project/arida-c5faf/authentication/settings

**Authorized Domains:**

- Ensure `localhost` is in the list
- For production, add your domain (e.g., `arida-c5faf.web.app`)

### 2. Enable Phone Authentication

Go to: https://console.firebase.google.com/project/arida-c5faf/authentication/providers

**Phone Provider:**

- Click on "Phone" in the sign-in providers list
- Make sure it's **Enabled**
- Save changes

### 3. Configure reCAPTCHA (Important!)

For Phone Authentication to work on localhost, you need to:

**Option A: Use Invisible reCAPTCHA (Recommended for Development)**

- Firebase automatically uses reCAPTCHA v2 invisible for phone auth
- Make sure your browser allows pop-ups from localhost
- Clear browser cache and try again

**Option B: Add Test Phone Numbers (For Development)**
Go to: https://console.firebase.google.com/project/arida-c5faf/authentication/providers

Scroll down to "Phone numbers for testing" section:

- Click "Add phone number"
- Add your test number: `+34613658220`
- Add a test code: `123456`
- This bypasses SMS sending for development

### 4. Check Browser Console

If you still see errors:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any reCAPTCHA errors
4. Make sure no browser extensions are blocking reCAPTCHA

### 5. Common Issues

**Issue: "reCAPTCHA has already been rendered"**

- Solution: Refresh the page

**Issue: "auth/invalid-app-credential"**

- Solution: Check that localhost is in authorized domains
- Solution: Verify Phone provider is enabled
- Solution: Try in incognito mode (to rule out extensions)

**Issue: "auth/quota-exceeded"**

- Solution: You've hit the 1000 SMS/day limit
- Solution: Use test phone numbers instead

### 6. Production Setup

For production deployment:

1. Add your production domain to authorized domains
2. Configure reCAPTCHA v3 site key (optional, for better UX)
3. Monitor SMS quota usage
4. Consider implementing rate limiting

### 7. Testing Without SMS

If you want to test without sending real SMS:

1. Go to Firebase Console → Authentication → Sign-in method
2. Scroll to "Phone numbers for testing"
3. Add test numbers with codes:
   - Phone: `+34612345678`
   - Code: `123456`
4. Use these numbers in your app - no SMS will be sent

## Current Status

- ✅ Phone provider enabled in Firebase
- ✅ Blaze plan active (SMS sending enabled)
- ⚠️ Need to verify: localhost in authorized domains
- ⚠️ Need to verify: reCAPTCHA configuration

## Next Steps

1. Go to Firebase Console
2. Check Authentication → Settings → Authorized domains
3. Ensure `localhost` is listed
4. Try phone verification again
5. If still failing, add test phone numbers for development
