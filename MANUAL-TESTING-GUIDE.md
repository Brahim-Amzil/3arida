# 🧪 Manual Testing Guide - MVP Launch

**Date:** December 7, 2025  
**Server:** http://localhost:3000  
**Duration:** ~1 hour

---

## ✅ TEST 1: Authentication Flow (15 min)

### 1.1 Register New User

**URL:** http://localhost:3000/auth/register

**Steps:**

1. Open registration page
2. Fill in the form:
   - Name: `Test User MVP`
   - Email: `mvptest@example.com` (use a unique email)
   - Password: `TestPass123!`
3. Click "Register"
4. ✅ **Expected:** Redirected to dashboard
5. ✅ **Expected:** Welcome message shows "Welcome back, Test User MVP!"

**Result:** [ ] Pass [ ] Fail  
**Notes:** **********\_\_\_**********

---

### 1.2 Email Verification (Optional)

**Note:** Email verification is configured but optional for testing

**Steps:**

1. Check if verification email was sent (check Resend dashboard)
2. If email received, click verification link
3. ✅ **Expected:** Email verified successfully

**Result:** [ ] Pass [ ] Fail [ ] Skipped  
**Notes:** **********\_\_\_**********

---

### 1.3 Logout

**Steps:**

1. Click user menu (top right)
2. Click "Logout"
3. ✅ **Expected:** Redirected to homepage
4. ✅ **Expected:** No longer logged in

**Result:** [ ] Pass [ ] Fail  
**Notes:** **********\_\_\_**********

---

### 1.4 Login with Email

**URL:** http://localhost:3000/auth/login

**Steps:**

1. Open login page
2. Enter credentials:
   - Email: `mvptest@example.com`
   - Password: `TestPass123!`
3. Click "Login"
4. ✅ **Expected:** Redirected to dashboard
5. ✅ **Expected:** User is logged in

**Result:** [ ] Pass [ ] Fail  
**Notes:** **********\_\_\_**********

---

### 1.5 Google OAuth (Optional)

**Steps:**

1. Go to login page
2. Click "Continue with Google"
3. Select Google account
4. ✅ **Expected:** Redirected to dashboard
5. ✅ **Expected:** User is logged in

**Result:** [ ] Pass [ ] Fail [ ] Skipped  
**Notes:** **********\_\_\_**********

---

## ✅ TEST 2: Petition Creation Flow (15 min)

### 2.1 Navigate to Create Petition

**URL:** http://localhost:3000/petitions/create

**Steps:**

1. Ensure you're logged in
2. Click "Start a Petition" or navigate to create page
3. ✅ **Expected:** Create petition form loads

**Result:** [ ] Pass [ ] Fail  
**Notes:** **********\_\_\_**********

---

### 2.2 Fill Petition Form

**Steps:**

1. Fill in the form:
   - **Title:** `Test Petition for MVP Launch`
   - **Category:** Select any category (e.g., "Environment")
   - **Description:** `This is a test petition to verify the MVP launch. We are testing the petition creation flow to ensure everything works correctly before going live.`
   - **Target Signatures:** `100`
   - **Target Audience:** `Government Officials`

2. Upload petition image:
   - Use any image < 5MB
   - ✅ **Expected:** Image preview shows

3. Add gallery images (optional):
   - Upload 1-2 images < 3MB each
   - ✅ **Expected:** Gallery images show

4. Click "Submit Petition"
5. ✅ **Expected:** Success message appears
6. ✅ **Expected:** Redirected to dashboard or petition page

**Result:** [ ] Pass [ ] Fail  
**Notes:** **********\_\_\_**********

---

### 2.3 Verify Petition in Dashboard

**URL:** http://localhost:3000/dashboard

**Steps:**

1. Go to dashboard
2. Click "Petitions" tab (if tabs are visible)
3. ✅ **Expected:** New petition appears in list
4. ✅ **Expected:** Status shows "Pending Review" (yellow badge)
5. Note the petition ID/URL for later tests

**Result:** [ ] Pass [ ] Fail  
**Notes:** **********\_\_\_**********

---

## ✅ TEST 3: Admin Moderation Flow (10 min)

### 3.1 Login as Admin

**URL:** http://localhost:3000/auth/login

**Steps:**

1. Logout current user
2. Login with admin credentials:
   - Email: `[YOUR_ADMIN_EMAIL]`
   - Password: `[YOUR_ADMIN_PASSWORD]`
3. ✅ **Expected:** Logged in successfully

**Result:** [ ] Pass [ ] Fail  
**Notes:** **********\_\_\_**********

---

### 3.2 Access Admin Panel

**URL:** http://localhost:3000/admin/petitions

**Steps:**

1. Click "Admin" in navigation (or go to URL directly)
2. ✅ **Expected:** Admin panel loads
3. ✅ **Expected:** Can see "Petitions", "Users", "Appeals" tabs

**Result:** [ ] Pass [ ] Fail  
**Notes:** **********\_\_\_**********

---

### 3.3 Moderate Petition

**Steps:**

1. Go to "Petitions" tab
2. Click "Pending" filter
3. Find the test petition created earlier
4. Click on the petition to view details
5. Click "Approve" button
6. ✅ **Expected:** Status changes to "Approved"
7. ✅ **Expected:** Success message appears

**Result:** [ ] Pass [ ] Fail  
**Notes:** **********\_\_\_**********

---

## ✅ TEST 4: Petition Signing Flow (10 min)

### 4.1 Browse Petitions

**URL:** http://localhost:3000/petitions

**Steps:**

1. Logout admin (or use incognito window)
2. Login as regular user (mvptest@example.com)
3. Go to petitions page
4. ✅ **Expected:** Can see list of approved petitions
5. ✅ **Expected:** Test petition appears in list

**Result:** [ ] Pass [ ] Fail  
**Notes:** **********\_\_\_**********

---

### 4.2 View Petition Details

**Steps:**

1. Click on the test petition
2. ✅ **Expected:** Petition detail page loads
3. ✅ **Expected:** Can see:
   - Petition title and description
   - Signature count (0 or current count)
   - Progress bar
   - "Sign Petition" button
   - QR code (in sidebar)
   - Share button

**Result:** [ ] Pass [ ] Fail  
**Notes:** **********\_\_\_**********

---

### 4.3 Sign Petition

**Steps:**

1. Click "Sign Petition" button
2. Fill in signature form:
   - Name: `Test Signer`
   - Email: `signer@example.com`
   - Comment (optional): `Testing signature flow`
3. Check "I agree to terms"
4. Click "Sign Petition"
5. ✅ **Expected:** reCAPTCHA verification (invisible)
6. ✅ **Expected:** Success message appears
7. ✅ **Expected:** Signature count increases by 1
8. ✅ **Expected:** Progress bar updates
9. ✅ **Expected:** Signature appears in "Supporters" tab

**Result:** [ ] Pass [ ] Fail  
**Notes:** **********\_\_\_**********

---

## ✅ TEST 5: Appeals System Flow (10 min)

### 5.1 Create Appeal (as Creator)

**Steps:**

1. Login as petition creator (mvptest@example.com)
2. Go to admin panel and reject your test petition (or use existing rejected petition)
3. Go to the rejected petition page
4. ✅ **Expected:** "Contact Moderator" button appears
5. Click "Contact Moderator"
6. Fill in appeal form:
   - Reason: `Testing appeals system`
   - Message: `This is a test appeal to verify the system works correctly.`
7. Click "Submit Appeal"
8. ✅ **Expected:** Success message appears
9. ✅ **Expected:** Redirected to appeal thread

**Result:** [ ] Pass [ ] Fail  
**Notes:** **********\_\_\_**********

---

### 5.2 View Appeal (as Admin)

**Steps:**

1. Login as admin
2. Go to Admin panel
3. ✅ **Expected:** Red badge shows pending appeals count
4. Click "Appeals" tab
5. ✅ **Expected:** Test appeal appears in list
6. Click on the appeal
7. ✅ **Expected:** Appeal thread loads with:
   - Petition card (clickable)
   - Creator's message
   - Reply form
   - Status dropdown
   - Internal notes section

**Result:** [ ] Pass [ ] Fail  
**Notes:** **********\_\_\_**********

---

### 5.3 Respond to Appeal

**Steps:**

1. Type response: `Thank you for your appeal. We are reviewing it.`
2. Click "Send Reply"
3. ✅ **Expected:** Reply appears in thread
4. Change status to "In Progress"
5. ✅ **Expected:** Status updates
6. Add internal note: `Need to review with team`
7. ✅ **Expected:** Note appears in yellow sidebar only (not in main thread)

**Result:** [ ] Pass [ ] Fail  
**Notes:** **********\_\_\_**********

---

## ✅ TEST 6: Mobile Responsiveness (10 min)

### 6.1 Test on Mobile Browser

**Steps:**

1. Open Chrome DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar
4. Test these pages:
   - Homepage
   - Petitions list
   - Petition detail
   - Login/Register
   - Dashboard

**Check:**

- [ ] Navigation menu works (hamburger menu)
- [ ] Forms are usable
- [ ] Buttons are clickable (not too small)
- [ ] Images load and scale properly
- [ ] Text is readable (not too small)
- [ ] No horizontal scrolling

**Result:** [ ] Pass [ ] Fail  
**Notes:** **********\_\_\_**********

---

## ✅ TEST 7: Additional Features (Optional - 10 min)

### 7.1 Comments

**Steps:**

1. Go to any petition
2. Click "Discussion" tab
3. Add a comment
4. ✅ **Expected:** Comment appears
5. Try to like a comment
6. ✅ **Expected:** Like count increases

**Result:** [ ] Pass [ ] Fail [ ] Skipped  
**Notes:** **********\_\_\_**********

---

### 7.2 QR Code

**Steps:**

1. Go to any petition
2. Check sidebar for QR code
3. ✅ **Expected:** QR code is visible
4. Click "Download QR Code"
5. ✅ **Expected:** QR code downloads

**Result:** [ ] Pass [ ] Fail [ ] Skipped  
**Notes:** **********\_\_\_**********

---

### 7.3 Share Functionality

**Steps:**

1. Go to any petition
2. Click "Share" button
3. ✅ **Expected:** Share modal opens with options:
   - Copy link
   - WhatsApp
   - Facebook
   - Twitter
4. Click "Copy Link"
5. ✅ **Expected:** Link copied to clipboard

**Result:** [ ] Pass [ ] Fail [ ] Skipped  
**Notes:** **********\_\_\_**********

---

## 📊 TESTING SUMMARY

**Date Completed:** ******\_******  
**Tester:** ******\_******  
**Total Tests:** 7 sections  
**Tests Passed:** **\_** / 7  
**Tests Failed:** **\_** / 7  
**Tests Skipped:** **\_** / 7

### Critical Issues Found:

1. ***
2. ***
3. ***

### Minor Issues Found:

1. ***
2. ***
3. ***

### Overall Assessment:

[ ] Ready for Production  
[ ] Needs Fixes Before Launch  
[ ] Major Issues - Delay Launch

---

## 🚀 NEXT STEPS

If all tests pass:

- ✅ Proceed to Phase 3: Production Deployment

If issues found:

- 🔧 Fix critical issues
- 🔄 Re-test affected areas
- ✅ Then proceed to deployment

---

**Notes:**

- Use incognito/private browsing for testing different user roles
- Keep browser console open to catch any JavaScript errors
- Take screenshots of any issues found
- Test on actual mobile device if possible (not just DevTools)
