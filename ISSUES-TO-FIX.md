# Issues to Fix

## 1. Comments Not Loading

**File**: `src/components/petitions/PetitionComments.tsx`
**Issue**: Comments query needs Firestore index
**Fix**: Deploy the Firestore index:

```bash
firebase deploy --only firestore:indexes
```

The index already exists in `firestore.indexes.json` for comments collection.

## 2. Publisher Bio Not Saving

**File**: `src/app/profile/page.tsx`
**Issue**: Need to check if the bio update function is calling Firestore correctly
**Check**: Look for `updateDoc` or similar in the profile page bio save handler

## 3. Petition Details Boxes Missing

**File**: `src/app/petitions/[id]/page.tsx`
**Issue**: The restored version is missing the petition details boxes (Publisher Info, Petition Details with addressedToType, petitionType, etc.)
**Fix**: These sections need to be added back to the petition tab content. They should show:

- Publisher Information (publisherType, publisherName)
- Petition Details (petitionType, addressedToType, addressedToSpecific, referenceCode)

## 4. Notifications Not Working

**Status**: Partially fixed - NotificationCenter now imports real Firebase functions
**Remaining issue**: Need to verify that:

- Firestore indexes for notifications are deployed (already in firestore.indexes.json)
- Admin actions are calling `notifyPetitionStatusChange()` with moderator notes
- The notification data includes `newStatus` and `moderatorNotes` fields

## Quick Fixes You Can Try:

### Deploy Firestore Indexes

```bash
cd 3arida-app
firebase deploy --only firestore:indexes
```

### Check Browser Console

Open browser dev tools and check for:

- Firestore permission errors
- Missing index errors
- Network errors

### Test Notifications

1. As admin, approve/reject a petition with notes
2. Check Firestore console to see if notification document was created
3. Check if notification appears in bell icon for the petition creator

## Files That Were Restored

- `src/components/notifications/NotificationCenter.tsx` - Fixed imports
- `src/app/admin/petitions/page.tsx` - Has search and deleted tab
- `src/app/petitions/[id]/page.tsx` - Basic version, missing some features
- `src/app/petitions/create/page.tsx` - Restored from Nov 12
- `src/components/layout/Header.tsx` - Restored from Nov 10
- `next.config.js` - Removed `output: 'export'`
