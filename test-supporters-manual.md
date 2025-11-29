# Manual Testing Guide for Supporters Discussion

## 🚀 Quick Start

The dev server is running at: **http://localhost:3001**

## 📋 Pre-Testing Checklist

- [x] Dev server is running
- [x] No build errors
- [ ] Browser DevTools open (F12)
- [ ] Console tab visible
- [ ] Network tab ready

## 🧪 Test Scenarios

### Test 1: Basic Navigation ✅

**Steps:**

1. Open http://localhost:3001
2. Navigate to any approved petition
3. Look for the "Supporters" tab (should be between "Petition" and "Publisher")
4. Click on "Supporters" tab

**Expected Result:**

- Tab switches successfully
- Tab is highlighted in green
- Content loads without errors
- No console errors

**Status:** [ ] Pass [ ] Fail

**Notes:**

---

---

### Test 2: View Filters ✅

**Steps:**

1. On Supporters tab, observe the filter buttons
2. Click "All" button
3. Click "Comments" button
4. Click "All Signatures" button

**Expected Result:**

- Three buttons visible: [All] [Comments] [All Signatures]
- Active button has green background
- Content changes for each view
- Counts shown in parentheses (e.g., "All (45)")
- No console errors

**Status:** [ ] Pass [ ] Fail

**Notes:**

---

---

### Test 3: All View (Mixed Feed) ✅

**Steps:**

1. Select "All" view
2. Scroll through the content
3. Look for visual differences between items

**Expected Result:**

- Comments have:
  - Green avatar background
  - Blue "Comment" badge
  - Like button with heart icon
- Signatures (with comments) have:
  - Purple avatar background
  - Green "Signed" badge with checkmark
  - Location information
- Items sorted chronologically (newest first)
- Relative timestamps (e.g., "2 hours ago")

**Status:** [ ] Pass [ ] Fail

**Notes:**

---

---

### Test 4: Comments View ✅

**Steps:**

1. Select "Comments" view
2. Check for sort buttons
3. Click "Latest" button
4. Click "Most Liked" button

**Expected Result:**

- Only comments displayed
- Sort buttons visible: [Latest] [Most Liked]
- "Latest" shows newest first
- "Most Liked" shows highest likes first
- Like counts visible
- Heart icon (filled if liked, empty if not)

**Status:** [ ] Pass [ ] Fail

**Notes:**

---

---

### Test 5: All Signatures View ✅

**Steps:**

1. Select "All Signatures" view
2. Scroll to bottom
3. Look for "Load More" button (if >20 signatures)
4. Click "Load More" if available

**Expected Result:**

- All signatures displayed in cards
- Name and location shown
- Signature date visible
- Optional comments displayed in italic
- "Load More" button at bottom (if applicable)
- Button shows "Loading..." when clicked

**Status:** [ ] Pass [ ] Fail

**Notes:**

---

---

### Test 6: Add Comment (Logged In) ✅

**Steps:**

1. Make sure you're logged in
2. Click "Add Comment" button
3. Type a test comment
4. Check "Comment anonymously" checkbox
5. Click "Post Comment"

**Expected Result:**

- Comment form appears
- Text area is functional
- Anonymous checkbox works
- "Post Comment" button enabled when text entered
- Comment appears at top immediately
- Form closes automatically
- No page reload

**Status:** [ ] Pass [ ] Fail

**Notes:**

---

---

### Test 7: Add Comment (Logged Out) ✅

**Steps:**

1. Log out if logged in
2. Navigate to Supporters tab
3. Look for "Add Comment" button

**Expected Result:**

- "Add Comment" button NOT visible
- Login prompt displayed:
  - Icon (speech bubble)
  - "Join the Discussion" heading
  - "Sign In to Comment" button
- Can still view all content

**Status:** [ ] Pass [ ] Fail

**Notes:**

---

---

### Test 8: Like Comment ✅

**Steps:**

1. Make sure you're logged in
2. Find a comment with likes
3. Click the heart icon
4. Click the heart icon again

**Expected Result:**

- First click:
  - Heart fills with red color
  - Like count increments by 1
  - Change is immediate (optimistic update)
- Second click:
  - Heart empties
  - Like count decrements by 1
  - Change is immediate

**Status:** [ ] Pass [ ] Fail

**Notes:**

---

---

### Test 9: Like Comment (Not Logged In) ✅

**Steps:**

1. Log out
2. Try to click heart icon on a comment

**Expected Result:**

- Alert appears: "Please sign in to like comments"
- Like count doesn't change
- No error in console

**Status:** [ ] Pass [ ] Fail

**Notes:**

---

---

### Test 10: Empty States ✅

**Steps:**

1. Find a petition with no comments/signatures
2. Navigate to Supporters tab
3. Try each view

**Expected Result:**

- Empty state message displays
- Icon shows (speech bubble)
- Appropriate message for each view:
  - All: "No activity yet"
  - Comments: "No comments yet"
  - Signatures: "No signatures yet"
- Call-to-action text present

**Status:** [ ] Pass [ ] Fail

**Notes:**

---

---

### Test 11: Mobile Responsiveness 📱

**Steps:**

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone or Android device
4. Test all views and interactions

**Expected Result:**

- Layout stacks vertically
- Filter buttons remain accessible
- Text is readable
- Touch targets adequate (min 44px)
- No horizontal scrolling
- All features work

**Status:** [ ] Pass [ ] Fail

**Notes:**

---

---

### Test 12: Performance ⚡

**Steps:**

1. Open DevTools Network tab
2. Navigate to Supporters tab
3. Switch between views
4. Monitor network requests

**Expected Result:**

- Initial load < 2 seconds
- No unnecessary requests
- Efficient Firestore queries
- Smooth transitions
- No lag when switching views

**Status:** [ ] Pass [ ] Fail

**Notes:**

---

---

### Test 13: Console Errors 🐛

**Steps:**

1. Open DevTools Console
2. Navigate through all features
3. Monitor for errors/warnings

**Expected Result:**

- No red errors
- No yellow warnings (except expected ones)
- Clean console output

**Status:** [ ] Pass [ ] Fail

**Errors Found:**

---

---

### Test 14: Data Persistence 💾

**Steps:**

1. Post a comment
2. Refresh the page
3. Check if comment is still there
4. Like a comment
5. Refresh the page
6. Check if like is still there

**Expected Result:**

- Posted comment persists after refresh
- Like persists after refresh
- Data is correctly saved to Firestore

**Status:** [ ] Pass [ ] Fail

**Notes:**

---

---

### Test 15: Cancel Comment ✅

**Steps:**

1. Click "Add Comment"
2. Type some text
3. Click "Cancel" button

**Expected Result:**

- Form closes
- Text is cleared
- No comment is posted
- Returns to normal view

**Status:** [ ] Pass [ ] Fail

**Notes:**

---

---

## 🎯 Critical Issues Found

List any critical issues that must be fixed before deployment:

1. ***
2. ***
3. ***

## ⚠️ Minor Issues Found

List any minor issues that can be fixed later:

1. ***
2. ***
3. ***

## ✅ Sign-Off

**Tested By:** **********\_\_\_**********  
**Date:** **********\_\_\_**********  
**Browser:** **********\_\_\_**********  
**OS:** **********\_\_\_**********

**Overall Status:** [ ] Ready for Deployment [ ] Needs Fixes

**Additional Notes:**

---

---

---

---

## 🔧 Quick Fixes

If you find issues, here are common fixes:

### Issue: Component not loading

**Fix:** Check browser console for errors, verify imports

### Issue: Data not displaying

**Fix:** Check Firestore rules, verify petition has data

### Issue: Likes not working

**Fix:** Verify user is logged in, check Firestore permissions

### Issue: Styling issues

**Fix:** Check Tailwind classes, verify CSS is loading

### Issue: Performance slow

**Fix:** Check Network tab, verify pagination is working

---

## 📞 Need Help?

- Check SUPPORTERS-DISCUSSION-TESTING.md for detailed test cases
- Review SUPPORTERS-DISCUSSION-ARCHITECTURE.md for technical details
- Check browser console for specific error messages
