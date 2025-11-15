# Firestore Updates Needed for Notification System

## 🔒 Security Rules to Add

Add these rules to `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ... existing rules ...

    // Notifications collection
    match /notifications/{notificationId} {
      // Users can only read their own notifications
      allow read: if request.auth != null &&
                     resource.data.userId == request.auth.uid;

      // Users can update their own notifications (mark as read)
      allow update: if request.auth != null &&
                       resource.data.userId == request.auth.uid &&
                       request.resource.data.diff(resource.data).affectedKeys()
                         .hasOnly(['read']);

      // Only system/admins can create notifications
      allow create: if request.auth != null &&
                       (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'moderator']);

      // No deletes allowed
      allow delete: if false;
    }

    // Deletion Requests collection
    match /deletionRequests/{requestId} {
      // Admins and moderators can read all deletion requests
      allow read: if request.auth != null &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'moderator'];

      // Petition creators can create deletion requests
      allow create: if request.auth != null &&
                       request.resource.data.creatorId == request.auth.uid;

      // Only admins can update deletion requests (approve/deny)
      allow update: if request.auth != null &&
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'moderator'];

      // No deletes allowed
      allow delete: if false;
    }
  }
}
```

## 📊 Firestore Indexes to Add

Add these indexes to `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "read", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "deletionRequests",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "deletionRequests",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "creatorId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

## 🚀 How to Apply These Changes

### Option 1: Firebase Console (Recommended for Production)

1. **Security Rules:**

   - Go to Firebase Console → Firestore Database → Rules
   - Copy the rules above and add them to your existing rules
   - Click "Publish"

2. **Indexes:**
   - Firebase will automatically prompt you to create indexes when queries fail
   - Or manually create them in Firebase Console → Firestore Database → Indexes
   - Click "Create Index" and enter the fields as shown above

### Option 2: Firebase CLI (Recommended for Development)

1. **Update `firestore.rules` file:**

   ```bash
   # Edit the file
   nano 3arida-app/firestore.rules

   # Deploy rules
   firebase deploy --only firestore:rules
   ```

2. **Update `firestore.indexes.json` file:**

   ```bash
   # Edit the file
   nano 3arida-app/firestore.indexes.json

   # Deploy indexes
   firebase deploy --only firestore:indexes
   ```

## ✅ Verification

After applying the changes, verify they work:

### Test Security Rules:

1. Try to read another user's notification (should fail)
2. Try to mark your own notification as read (should succeed)
3. Try to create a notification as a regular user (should fail)
4. Try to create a notification as an admin (should succeed)

### Test Indexes:

1. Open NotificationCenter component
2. Check browser console for any Firestore index errors
3. If you see "The query requires an index" error, click the link to create it
4. Wait a few minutes for index to build

## 📝 Current Rules File Location

The rules file is located at:

```
3arida-app/firestore.rules
```

The indexes file is located at:

```
3arida-app/firestore.indexes.json
```

## ⚠️ Important Notes

1. **Test in Development First:** Always test rule changes in your development Firebase project before deploying to production

2. **Index Build Time:** Firestore indexes can take several minutes to build, especially if you have existing data

3. **Backward Compatibility:** The new rules don't affect existing collections, so your app will continue to work

4. **Admin Role Check:** Make sure your admin users have `role: 'admin'` or `role: 'moderator'` in their user documents

## 🔍 Troubleshooting

### "Missing or insufficient permissions" error:

- Check that the user has the correct role in Firestore
- Verify the security rules are deployed
- Check browser console for detailed error messages

### "The query requires an index" error:

- Click the link in the error message to create the index
- Or manually create the index using the specifications above
- Wait 2-5 minutes for the index to build

### Notifications not appearing:

- Check that notifications are being created in Firestore
- Verify the userId matches the logged-in user
- Check browser console for errors
- Verify the real-time listener is active

## 📚 Additional Resources

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Indexes Documentation](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
