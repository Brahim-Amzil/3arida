# Reference Code Migration - Ready to Run

## Summary

Created a migration script to add reference codes to all existing petitions.

---

## What Was Created

### 1. Migration Script ✅

**File**: `3arida-app/migrate-reference-codes.js`

**Features**:

- Generates unique 6-character codes (2 letters + 4 numbers)
- Only updates petitions without codes
- Shows progress for each petition
- Provides detailed summary
- Safe and non-destructive

### 2. Migration Guide ✅

**File**: `3arida-app/REFERENCE-CODE-MIGRATION-GUIDE.md`

**Includes**:

- Step-by-step instructions
- Troubleshooting tips
- Safety features explanation
- Verification steps
- FAQ section

---

## How to Run

### Quick Start

```bash
cd 3arida-app
node migrate-reference-codes.js
```

That's it! The script will:

1. Find all petitions without reference codes
2. Generate unique codes for each
3. Update the database
4. Show you a summary

---

## Example Output

```
🚀 Starting reference code migration...

📊 Found 25 total petitions

✅ 5 petitions already have reference codes
⏳ 20 petitions need reference codes

🔄 Generating reference codes...

✅ AB1234 → "Save the Local Park"
✅ XY5678 → "Improve Public Transportation"
✅ MK9012 → "Protect Marine Life"
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
```

---

## Safety Features

✅ **Non-Destructive**: Only adds codes, never overwrites  
✅ **Idempotent**: Safe to run multiple times  
✅ **Error Handling**: Continues even if one petition fails  
✅ **Uniqueness**: Guaranteed unique codes  
✅ **Progress Tracking**: See each petition as it's updated

---

## What Happens to Petitions

### Before

```javascript
{
  id: "abc123",
  title: "Save the Park",
  // ... other fields
  // ❌ No referenceCode
}
```

### After

```javascript
{
  id: "abc123",
  title: "Save the Park",
  // ... other fields
  referenceCode: "AB1234", // ✅ Added!
  updatedAt: "2025-01-18..." // ✅ Updated
}
```

---

## Verification

After running, check:

1. **Firebase Console**:

   - Go to Firestore → petitions
   - Check documents have `referenceCode` field

2. **Your App**:

   - Visit any petition page
   - Click "Publisher" tab
   - See reference code in "Petition Details"

3. **Admin Search** (if implemented):
   - Search for a code (e.g., "AB1234")
   - Verify it finds the petition

---

## Prerequisites

✅ Firebase Admin credentials in `.env.local`  
✅ Node.js installed  
✅ `firebase-admin` package (already installed)  
✅ Write permissions to Firestore

---

## Files Created

1. `3arida-app/migrate-reference-codes.js` - Migration script
2. `3arida-app/REFERENCE-CODE-MIGRATION-GUIDE.md` - Detailed guide
3. `REFERENCE-CODE-MIGRATION-COMPLETE.md` - This summary

---

## Ready to Run!

Everything is set up. Just run:

```bash
cd 3arida-app
node migrate-reference-codes.js
```

The script will handle everything automatically and show you the results.

---

**Status**: ✅ Ready to execute  
**Risk Level**: Low (safe, non-destructive)  
**Time Required**: ~1-2 minutes for typical database  
**Reversible**: Yes (can remove codes if needed)

---

**Created**: January 18, 2025  
**Next Action**: Run the migration script
