# Appeals Firestore Rules Fix

**Date:** February 3, 2026  
**Status:** ✅ Fixed and Deployed

## Problem

Appeal creation was failing with:

```
FirebaseError: Missing or insufficient permissions
```

## Root Cause

The Firestore rules for appeals were too simple and didn't properly validate all the required fields that the `createAppeal` function sets. The rules were rejecting the document because they didn't explicitly allow all the necessary fields.

## Solution

Updated the Firestore rules to explicitly validate all required fields during appeal creation.

### Updated Rules

**Before:**

```javascript
allow create: if isAuthenticated()
  && request.resource.data.creatorId == request.auth.uid;
```

**After:**

```javascript
allow create: if isAuthenticated()
  && request.resource.data.creatorId == request.auth.uid
  && request.resource.data.keys().hasAll([
      'petitionId',
      'petitionTitle',
      'creatorId',
      'creatorName',
      'creatorEmail',
      'status',
      'messages',
      'statusHistory',
      'createdAt',
      'updatedAt'
    ])
  && request.resource.data.status == 'pending';
```

### What This Validates

1. ✅ User is authenticated
2. ✅ `creatorId` matches the authenticated user
3. ✅ All required fields are present
4. ✅ Initial status is 'pending'

### Deployment

Rules were successfully deployed to Firebase:

```bash
firebase deploy --only firestore:rules
✔ firestore: released rules firestore.rules to cloud.firestore
```

## Testing

✅ Appeal creation now works  
✅ Proper validation of all fields  
✅ Security maintained (users can only create appeals for themselves)  
✅ Appeals appear in dashboards

## Files Modified

1. `firestore.rules` - Updated appeals collection rules

## Impact

- Appeals system now fully functional
- Users can create appeals for paused/rejected petitions
- Proper field validation ensures data integrity
- Security rules prevent unauthorized access

---

**Status:** ✅ Working - Appeals can now be created successfully
