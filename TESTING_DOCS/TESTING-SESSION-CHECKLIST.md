# Testing Session Checklist

## 🎯 Your Testing Session Guide

Use this checklist to systematically test the Supporters Discussion feature.

---

## ✅ Pre-Testing Setup

- [x] Dev server is running (http://localhost:3000)
- [x] Image configuration fixed
- [x] No build errors
- [ ] Open browser (Chrome recommended)
- [ ] Open DevTools (Press F12)
- [ ] Open Console tab
- [ ] Have test user credentials ready

---

## 📋 Test Scenarios

### Scenario 1: Basic Navigation (2 min)

**Steps:**

1. [ ] Open http://localhost:3000
2. [ ] Click on any petition
3. [ ] Look for "Supporters" tab
4. [ ] Click "Supporters" tab
5. [ ] Verify tab highlights in green
6. [ ] Check console for errors

**Expected Result:**

- Tab switches successfully
- Content loads
- No errors in console

**Status:** [ ] Pass [ ] Fail  
**Notes:** ****************\_\_\_****************

---

### Scenario 2: View Filters (3 min)

**Steps:**

1. [ ] On Supporters tab, see three buttons
2. [ ] Click "All" button
3. [ ] Click "Comments" button
4. [ ] Click "All Signatures" button
5. [ ] Return to "All" button

**Expected Result:**

- All three buttons work
- Active button has green background
- Content changes for each view
- Counts shown in parentheses

**Status:** [ ] Pass [ ] Fail  
**Notes:** ****************\_\_\_****************

---

### Scenario 3: All View Content (3 min)

**Steps:**

1. [ ] Select "All" view
2. [ ] Scroll through content
3. [ ] Look for comments (green avatar, blue badge)
4. [ ] Look for signatures (purple avatar, green badge)
5. [ ] Check chronological order

**Expected Result:**

- Mixed content displays
- Visual distinction clear
- Chronological order (newest first)
- Timestamps show relative time

**Status:** [ ] Pass [ ] Fail  
**Notes:** ****************\_\_\_****************

---

### Scenario 4: Comments View (3 min)

**Steps:**

1. [ ] Select "Comments" view
2. [ ] Check for sort buttons
3. [ ] Click "Latest"
4. [ ] Click "Most Liked"
5. [ ] Verify sorting works

**Expected Result:**

- Only comments shown
- Sort buttons visible
- Latest shows newest first
- Most Liked shows highest likes first

**Status:** [ ] Pass [ ] Fail  
**Notes:** ****************\_\_\_****************

---

### Scenario 5: Signatures View (3 min)

**Steps:**

1. [ ] Select "All Signatures" view
2. [ ] Scroll through signatures
3. [ ] Check for names and locations
4. [ ] Look for "Load More" button (if >20)
5. [ ] Click "Load More" if available

**Expected Result:**

- All signatures display
- Names and locations shown
- Dates visible
- Pagination works

**Status:** [ ] Pass [ ] Fail  
**Notes:** ****************\_\_\_****************

---

### Scenario 6: Post Comment - Logged In (5 min)

**Steps:**

1. [ ] Make sure you're logged in
2. [ ] Click "Add Comment" button
3. [ ] Type: "Test comment for Supporters Discussion"
4. [ ] Click "Post Comment"
5. [ ] Verify comment appears at top

**Expected Result:**

- Form appears
- Text area works
- Comment posts successfully
- Appears at top immediately
- Form closes automatically

**Status:** [ ] Pass [ ] Fail  
**Notes:** ****************\_\_\_****************

---

### Scenario 7: Anonymous Comment (3 min)

**Steps:**

1. [ ] Click "Add Comment"
2. [ ] Type a comment
3. [ ] Check "Comment anonymously"
4. [ ] Click "Post Comment"
5. [ ] Verify shows as "Anonymous"

**Expected Result:**

- Checkbox works
- Comment posts as Anonymous
- Gray "Anonymous" badge shows
- Avatar shows "?"

**Status:** [ ] Pass [ ] Fail  
**Notes:** ****************\_\_\_****************

---

### Scenario 8: Like Comment (3 min)

**Steps:**

1. [ ] Find any comment
2. [ ] Click heart icon
3. [ ] Verify heart fills red
4. [ ] Verify count increments
5. [ ] Click again to unlike

**Expected Result:**

- Heart fills with red
- Count increments by 1
- Immediate update (no reload)
- Unlike works (heart empties)

**Status:** [ ] Pass [ ] Fail  
**Notes:** ****************\_\_\_****************

---

### Scenario 9: Logged Out State (3 min)

**Steps:**

1. [ ] Log out
2. [ ] Navigate to Supporters tab
3. [ ] Verify can view content
4. [ ] Check for "Add Comment" button
5. [ ] Try to like a comment

**Expected Result:**

- Can view all content
- "Add Comment" button NOT visible
- Login prompt shows
- Like shows alert: "Please sign in"

**Status:** [ ] Pass [ ] Fail  
**Notes:** ****************\_\_\_****************

---

### Scenario 10: Mobile View (5 min)

**Steps:**

1. [ ] Open DevTools (F12)
2. [ ] Toggle device toolbar (Ctrl+Shift+M)
3. [ ] Select iPhone or Android
4. [ ] Test all views
5. [ ] Test interactions

**Expected Result:**

- Layout stacks vertically
- All buttons accessible
- Text readable
- Touch targets adequate
- No horizontal scroll

**Status:** [ ] Pass [ ] Fail  
**Notes:** ****************\_\_\_****************

---

### Scenario 11: Performance Check (3 min)

**Steps:**

1. [ ] Open Network tab in DevTools
2. [ ] Navigate to Supporters tab
3. [ ] Switch between views
4. [ ] Monitor load times
5. [ ] Check for unnecessary requests

**Expected Result:**

- Initial load < 2 seconds
- Smooth transitions
- No excessive requests
- No lag

**Status:** [ ] Pass [ ] Fail  
**Notes:** ****************\_\_\_****************

---

### Scenario 12: Console Errors (Ongoing)

**Steps:**

1. [ ] Keep Console tab open
2. [ ] Monitor during all tests
3. [ ] Note any red errors
4. [ ] Note any yellow warnings

**Expected Result:**

- No red errors
- No unexpected warnings
- Clean console output

**Errors Found:**

---

---

---

---

## 🐛 Issues Found

### Critical Issues (Must Fix Before Deploy)

1. ***
2. ***
3. ***

### High Priority Issues

1. ***
2. ***
3. ***

### Medium Priority Issues

1. ***
2. ***
3. ***

### Low Priority Issues (Nice to Have)

1. ***
2. ***
3. ***

---

## 📊 Testing Summary

**Total Scenarios**: 12  
**Passed**: **_ / 12  
**Failed**: _** / 12  
**Skipped**: \_\_\_ / 12

**Critical Issues**: **_  
**High Priority**: _**  
**Medium Priority**: **_  
**Low Priority**: _**

**Overall Status**: [ ] Ready [ ] Needs Fixes [ ] Major Issues

---

## ✅ Sign-Off

**Tested By**: **********\_\_\_**********  
**Date**: **********\_\_\_**********  
**Time Spent**: **********\_\_\_**********  
**Browser**: **********\_\_\_**********  
**OS**: **********\_\_\_**********

**Recommendation**:

- [ ] Ready for deployment
- [ ] Ready after minor fixes
- [ ] Needs significant work
- [ ] Not ready

**Additional Notes**:

---

---

---

---

---

## 🚀 Next Steps

### If All Tests Pass:

1. [ ] Mark as "Ready for Deployment"
2. [ ] Review deployment checklist
3. [ ] Plan deployment time
4. [ ] Notify team

### If Issues Found:

1. [ ] Document all issues clearly
2. [ ] Prioritize by severity
3. [ ] Create fix plan
4. [ ] Fix critical issues
5. [ ] Re-test after fixes

---

## 📞 Need Help?

- Check **START-TESTING-HERE.md** for quick guide
- Review **SUPPORTERS-DISCUSSION-TESTING.md** for detailed tests
- Check browser console for specific errors
- Review **SUPPORTERS-DISCUSSION-ARCHITECTURE.md** for technical details

---

**Ready to test? Let's go! 🎉**

Start with Scenario 1 and work your way through each one systematically.
