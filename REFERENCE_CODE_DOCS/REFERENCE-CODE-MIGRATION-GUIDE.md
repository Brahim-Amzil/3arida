# Reference Code Migration Guide

## Overview

This guide explains how to add reference codes to all existing petitions in your database.

---

## What This Does

The migration script will:

1. ✅ Find all petitions without a reference code
2. ✅ Generate unique 6-character codes (2 letters + 4 numbers)
3. ✅ Update each petition with its new code
4. ✅ Preserve existing codes (won't overwrite)
5. ✅ Show progress and summary

---

## Prerequisites

Make sure you have:

- ✅ Firebase Admin credentials in `.env.local`
- ✅ Node.js installed
- ✅ `firebase-admin` package installed

---

## Step-by-Step Instructions

### 1. Verify Environment Variables

Check that your `.env.local` file has these variables:

```env
FIREBASE_PROJECT_ID=arida-c5faf
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@arida-c5faf.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----\n"
```

### 2. Install Dependencies (if needed)

```bash
cd 3arida-app
npm install firebase-admin dotenv
```

### 3. Run the Migration Script

```bash
node migrate-reference-codes.js
```

### 4. Review the Output

You'll see something like:

```
🚀 Starting reference code migration...

📊 Found 25 total petitions

✅ 5 petitions already have reference codes
⏳ 20 petitions need reference codes

🔄 Generating reference codes...

✅ AB1234 → "Save the Local Park from Development"
✅ XY5678 → "Improve Public Transportation in Casablanca"
✅ MK9012 → "Protect Marine Life in Mediterranean"
...

============================================================
📈 Migration Summary:
============================================================
✅ Successfully updated: 20 petitions
❌ Failed: 0 petitions
📊 Total processed: 20 petitions
🎯 Unique codes generated: 20
============================================================

🎉 Migration completed successfully!
💡 All petitions now have unique reference codes.
```

---

## What Happens

### Before Migration

```javascript
{
  id: "abc123",
  title: "Save the Park",
  // ... other fields
  // ❌ No referenceCode
}
```

### After Migration

```javascript
{
  id: "abc123",
  title: "Save the Park",
  // ... other fields
  referenceCode: "AB1234", // ✅ Added
  updatedAt: "2025-01-18T..." // ✅ Updated
}
```

---

## Safety Features

### 1. Non-Destructive

- ✅ Only adds codes to petitions that don't have them
- ✅ Never overwrites existing codes
- ✅ Doesn't modify other petition data

### 2. Uniqueness Guaranteed

- ✅ Checks existing codes before generating
- ✅ Retries if collision detected (up to 10 attempts)
- ✅ Fallback mechanism if all attempts fail

### 3. Error Handling

- ✅ Continues even if one petition fails
- ✅ Shows detailed error messages
- ✅ Provides summary of successes and failures

---

## Troubleshooting

### Error: "Firebase credentials not found"

**Solution**: Check your `.env.local` file has the correct Firebase Admin credentials.

### Error: "Permission denied"

**Solution**: Make sure your Firebase service account has write permissions to the `petitions` collection.

### Error: "Module not found: firebase-admin"

**Solution**: Run `npm install firebase-admin`

### Some petitions failed

**Solution**:

1. Check the error messages in the output
2. Fix the specific issues
3. Run the script again (it will skip already-migrated petitions)

---

## Verification

After running the migration, verify it worked:

### 1. Check in Firebase Console

1. Go to Firestore
2. Open `petitions` collection
3. Check a few documents
4. Verify `referenceCode` field exists

### 2. Check in Your App

1. Go to any petition detail page
2. Click "Publisher" tab
3. Scroll to "Petition Details"
4. Verify reference code is displayed

### 3. Test Search (if implemented)

1. Go to admin panel
2. Search for a reference code
3. Verify it finds the correct petition

---

## Performance

- **Speed**: ~100-200 petitions per minute
- **Database Reads**: 1 read for all petitions
- **Database Writes**: 1 write per petition needing a code
- **Cost**: Minimal (standard Firestore pricing applies)

---

## Rollback (if needed)

If you need to remove the codes:

```javascript
// Run this in Firebase Console or create a rollback script
const petitionsRef = db.collection('petitions');
const snapshot = await petitionsRef.get();

const batch = db.batch();
snapshot.forEach((doc) => {
  batch.update(doc.ref, {
    referenceCode: admin.firestore.FieldValue.delete(),
  });
});

await batch.commit();
```

---

## Next Steps

After migration:

1. ✅ Test a few petition pages to see codes
2. ✅ Verify codes appear in Petition Details box
3. ✅ Test admin search with reference codes (if implemented)
4. ✅ Update any documentation
5. ✅ Inform support team about new codes

---

## FAQ

**Q: Can I run this multiple times?**  
A: Yes! It's safe. It only updates petitions without codes.

**Q: What if I have thousands of petitions?**  
A: The script handles large datasets. It may take a few minutes.

**Q: Will this affect my app's performance?**  
A: No. The migration runs independently and doesn't affect the running app.

**Q: Can I run this in production?**  
A: Yes, but test in development first. The script is safe and non-destructive.

**Q: What if the script crashes midway?**  
A: Just run it again. It will skip petitions that already have codes.

---

## Support

If you encounter issues:

1. Check the error messages in the console
2. Verify your Firebase credentials
3. Check Firestore permissions
4. Review the troubleshooting section above

---

**Created**: January 18, 2025  
**Script**: `migrate-reference-codes.js`  
**Status**: Ready to run
