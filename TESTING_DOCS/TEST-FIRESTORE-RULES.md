# Testing Firestore Security Rules

## Quick Test Checklist

Test these scenarios to verify the new security rules work correctly:

### ✅ Test 1: Public Access (No Login Required)

**URL**: http://localhost:3005

- [ ] Homepage loads
- [ ] Can browse petitions
- [ ] Can view petition details
- [ ] Can see comments
- [ ] Can see signatures
- [ ] Can see signature count

**Expected**: All should work without login

---

### ✅ Test 2: User Registration & Login

**URL**: http://localhost:3005/auth/register

- [ ] Can create new account
- [ ] Can login with email/password
- [ ] Can login with Google OAuth
- [ ] Profile page loads after login

**Expected**: Authentication works normally

---

### ✅ Test 3: Create Petition (Logged In)

**URL**: http://localhost:3005/petitions/create

- [ ] Can access create petition page
- [ ] Can fill out petition form
- [ ] Can upload image
- [ ] Can submit petition
- [ ] Petition appears in dashboard

**Expected**: Petition creation works

---

### ✅ Test 4: Edit Own Petition

**URL**: http://localhost:3005/dashboard

- [ ] Can see own petitions
- [ ] Can click edit on own petition
- [ ] Can modify petition details
- [ ] Can save changes

**Expected**: Can edit own petitions

---

### ✅ Test 5: Cannot Edit Others' Petitions

**Test**: Try to edit someone else's petition

- [ ] Find a petition you didn't create
- [ ] Try to access edit page
- [ ] Should not see edit button OR
- [ ] Edit should fail with permission error

**Expected**: Cannot edit others' petitions

---

### ✅ Test 6: Comments & Replies

**URL**: Any petition page

- [ ] Can post a comment
- [ ] Can reply to a comment
- [ ] Can like a comment
- [ ] Can delete own comment
- [ ] Cannot delete others' comments

**Expected**: Comment system works with proper permissions

---

### ✅ Test 7: Sign Petition

**URL**: Any approved petition

- [ ] Can sign petition
- [ ] Signature count increases
- [ ] Signature appears in list
- [ ] Cannot sign twice

**Expected**: Signing works correctly

---

### ✅ Test 8: Admin Functions (If Admin)

**URL**: http://localhost:3005/admin

- [ ] Can access admin dashboard
- [ ] Can approve/reject petitions
- [ ] Can delete any comment
- [ ] Can manage categories
- [ ] Can view all users

**Expected**: Admin functions work

---

### ✅ Test 9: Profile Management

**URL**: http://localhost:3005/profile

- [ ] Can view own profile
- [ ] Can edit own profile
- [ ] Can update bio
- [ ] Can change display name
- [ ] Cannot edit others' profiles

**Expected**: Profile management works

---

### ✅ Test 10: Notifications

**URL**: http://localhost:3005 (check notification bell)

- [ ] Can see notifications
- [ ] Can mark as read
- [ ] Cannot see others' notifications

**Expected**: Notifications work correctly

---

## Testing Instructions

### 1. Test as Guest (Not Logged In)

```bash
# Open in incognito/private window
open http://localhost:3005
```

- Browse petitions
- View petition details
- Try to create petition (should redirect to login)

### 2. Test as Regular User

```bash
# Login with test account
# Email: test@example.com
# Password: test123456
```

- Create a petition
- Edit your petition
- Comment on petitions
- Sign petitions
- Try to edit someone else's petition (should fail)

### 3. Test as Admin

```bash
# Login with admin account
# Check Firebase Console for admin user
```

- Access admin dashboard
- Approve/reject petitions
- Delete any comment
- Manage categories

## Common Issues & Solutions

### Issue: "Permission Denied" when creating petition

**Cause**: creatorId doesn't match authenticated user
**Solution**: Check that petition creation sets creatorId correctly

### Issue: Can't see own petitions in dashboard

**Cause**: Query might be failing due to rules
**Solution**: Check that user.uid matches petition.creatorId

### Issue: Comments not loading

**Cause**: Public read might be blocked
**Solution**: Verify comments collection has `allow read: if true`

### Issue: Can't delete own comment

**Cause**: authorId doesn't match user.uid
**Solution**: Check comment.authorId is set correctly on creation

## Monitoring

Watch browser console for errors:

```javascript
// Open DevTools (F12)
// Check Console tab for:
-'FirebaseError: Missing or insufficient permissions' - 'PERMISSION_DENIED';
```

Watch Network tab:

```
// Check for failed Firestore requests
// Status: 403 = Permission Denied
```

## Success Criteria

All tests pass if:

- ✅ Public pages load without login
- ✅ Users can create and edit their own content
- ✅ Users cannot edit others' content
- ✅ Admins can manage all content
- ✅ No permission errors in console
- ✅ All features work as expected

## If Tests Fail

1. Check browser console for specific error
2. Check Firebase Console > Firestore > Rules tab
3. Review the error message for which rule failed
4. Verify user authentication state
5. Check user role in Firestore users collection

## Rollback if Needed

If critical issues occur:

```bash
cd 3arida-app
git checkout HEAD~1 firestore.rules
firebase deploy --only firestore:rules
```

---

## 🎯 Start Testing Now!

1. Open http://localhost:3005
2. Go through each test scenario
3. Check off completed tests
4. Report any issues found

**Testing Time**: ~15-20 minutes
**Priority**: HIGH - Must pass before launch
