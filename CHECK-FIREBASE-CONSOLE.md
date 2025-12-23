# Firebase Console Checklist - auth/internal-error-encountered

## Error Details

- **Error Code:** `auth/internal-error-encountered`
- **HTTP Status:** 500 (Internal Server Error)
- **Timestamp:** December 12, 2024 - 6:34 PM
- **Phone Number:** +34613658220
- **Request URL:** `identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode`

## What This Means

This is a **Firebase backend error**, not a code issue. Your app is working correctly, but Firebase's server is rejecting the request.

---

## Step 1: Check Authentication Settings

### 1.1 Go to Firebase Console

Open: https://console.firebase.google.com/project/arida-c5faf/authentication/settings

### 1.2 Check for Alerts/Warnings

Look at the top of the page for any:

- ⚠️ Yellow warning banners
- 🔴 Red error messages
- ℹ️ Blue information notices

**Take a screenshot if you see any warnings.**

### 1.3 Check Authorized Domains

Click on the "Authorized domains" tab:

**Required domains:**

- [ ] `localhost` is listed
- [ ] `arida-c5faf.firebaseapp.com` is listed
- [ ] No red X marks next to domains

**If localhost is missing:** Click "Add domain" and add `localhost`

---

## Step 2: Check Phone Authentication Provider

### 2.1 Go to Sign-in Methods

Open: https://console.firebase.google.com/project/arida-c5faf/authentication/providers

### 2.2 Check Phone Provider Status

Find "Phone" in the list:

- [ ] Status shows "Enabled" (not "Disabled")
- [ ] No warning icons next to it

### 2.3 Click on Phone Provider

Click "Phone" to open settings:

**Check these settings:**

- [ ] **Phone numbers for testing:** Should be EMPTY (or remove any test numbers)
- [ ] **SMS region policy:** Should be set to "Allow" mode
- [ ] **Allowed regions:** Should include Spain (+34), Morocco (+212)

**If SMS region policy is "Block" mode:** Change it to "Allow" mode

---

## Step 3: Check Project Billing

### 3.1 Go to Usage and Billing

Open: https://console.firebase.google.com/project/arida-c5faf/usage

### 3.2 Check Plan

- [ ] Plan is "Blaze" (pay-as-you-go)
- [ ] NOT on "Spark" (free plan)

**If on Spark plan:** Phone auth requires Blaze plan. Upgrade to Blaze.

### 3.3 Check SMS Quota

Look for "Authentication" section:

- [ ] SMS sent today: **\_** / **\_**
- [ ] No "Quota exceeded" warnings

---

## Step 4: Check Identity Platform

### 4.1 Go to Identity Platform

Open: https://console.cloud.google.com/customer-identity/providers?project=arida-c5faf

### 4.2 Check Status

- [ ] Identity Platform is "Enabled"
- [ ] No errors or warnings shown

**If disabled:** Click "Enable" to activate Identity Platform

---

## Step 5: Check for Service Outages

### 5.1 Check Firebase Status

Open: https://status.firebase.google.com/

Look for any ongoing issues with:

- [ ] Authentication service
- [ ] Phone authentication
- [ ] Identity Toolkit

**If there's an outage:** Wait for Firebase to resolve it.

---

## What to Report Back

After checking all the above, report:

1. **Authorized domains:** Are localhost and firebaseapp.com listed?
2. **Phone provider:** Is it enabled? Any warnings?
3. **Billing plan:** Blaze or Spark?
4. **SMS quota:** Any limits reached?
5. **Identity Platform:** Enabled or disabled?
6. **Any warnings/errors:** Screenshot any red/yellow messages

---

## Most Likely Issues

Based on `auth/internal-error-encountered`, the most common causes are:

1. **Identity Platform not enabled** (most likely)
2. **SMS quota exceeded**
3. **Billing issue** (payment method failed)
4. **Regional restrictions** (Spain blocked)
5. **Firebase service outage**

---

## Next Steps After Checking

Once you've checked the console, we'll:

1. Fix any configuration issues found
2. Check Google Cloud logs for detailed error
3. Reply to Firebase support with findings
