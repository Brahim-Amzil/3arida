# Notification Alert Debugging Guide

## 🐛 Issue: Alert Not Showing

You received a notification about a state change, but when clicked, no prompt box appeared.

### URL You Saw:

```
/petitions/OM2c1S04igZDRd8tW8wL?reason=TESTING+NOTIF+SYSTEM
```

**Problem:** The URL has `reason` but is missing the `notif` parameter!

---

## 🔍 Debugging Steps

### Step 1: Check Browser Console

With the new debugging code, you should see these logs:

#### When Notification is Clicked:

```javascript
🔗 Building notification link for: {
  type: "petition_status_change",  // <-- Check this value!
  petitionId: "OM2c1S04igZDRd8tW8wL",
  moderatorNotes: "TESTING NOTIF SYSTEM",
  denialReason: undefined
}
```

#### When Petition Page Loads:

```javascript
🔍 Checking for notification parameters: {
  notifType: null,  // <-- This should NOT be null!
  notifReason: "TESTING NOTIF SYSTEM",
  hasSearchParams: true,
  allParams: { reason: "TESTING NOTIF SYSTEM" }
}
```

---

## 🎯 Root Cause Analysis

### Possible Causes:

#### 1. **Wrong Notification Type in Database**

The notification type in Firestore might not match our expected types.

**Expected types:**

- `petition_approved`
- `petition_rejected`
- `petition_paused`
- `petition_deleted`
- `petition_archived`
- `deletion_request_approved`
- `deletion_request_denied`

**Check your notification in Firestore:**

```javascript
// In Firebase Console → Firestore → notifications collection
{
  type: "petition_status_change",  // ❌ WRONG! Should be "petition_paused"
  data: {
    moderatorNotes: "TESTING NOTIF SYSTEM"
  }
}
```

#### 2. **Notification Created with Wrong Type**

When the notification was created, it might have used a generic type instead of a specific one.

---

## ✅ Solution

### Fix 1: Update Notification Type Mapping

Add support for `petition_status_change` type:

```typescript
// In NotificationCenter.tsx, add this case:
else if (notification.type === 'petition_status_change') {
  // Determine type from data
  if (notification.data?.newStatus === 'approved') {
    params.set('notif', 'approved');
  } else if (notification.data?.newStatus === 'rejected') {
    params.set('notif', 'rejected');
  } else if (notification.data?.newStatus === 'paused') {
    params.set('notif', 'paused');
  } else if (notification.data?.newStatus === 'deleted') {
    params.set('notif', 'deleted');
  } else if (notification.data?.newStatus === 'archived') {
    params.set('notif', 'archived');
  }
}
```

### Fix 2: Check How Notification Was Created

Look at where the notification was created. It should use specific types:

**Correct:**

```typescript
await createNotification(
  userId,
  'petition_paused', // ✅ Specific type
  '⏸️ Petition Paused',
  'Your petition has been paused.',
  { petitionId, moderatorNotes }
);
```

**Incorrect:**

```typescript
await createNotification(
  userId,
  'petition_status_change', // ❌ Generic type
  '⏸️ Petition Paused',
  'Your petition has been paused.',
  { petitionId, moderatorNotes }
);
```

---

## 🧪 Testing Steps

### 1. Check Notification in Firestore

1. Go to Firebase Console
2. Navigate to Firestore Database
3. Open `notifications` collection
4. Find your notification
5. Check the `type` field

**What to look for:**

```javascript
{
  id: "abc123",
  userId: "user123",
  type: "???",  // <-- What is this value?
  title: "⏸️ Petition Paused",
  message: "Your petition has been paused.",
  data: {
    petitionId: "OM2c1S04igZDRd8tW8wL",
    moderatorNotes: "TESTING NOTIF SYSTEM",
    newStatus: "paused"  // <-- Check if this exists
  }
}
```

### 2. Test with Console Logs

Open browser console and look for:

```
🔗 Building notification link for: { ... }
```

This will show you:

- What notification type was received
- What data is available
- What URL was generated

### 3. Manually Test URL

Try navigating directly to:

```
http://localhost:3000/petitions/OM2c1S04igZDRd8tW8wL?notif=paused&reason=TESTING+NOTIF+SYSTEM
```

If the alert appears, the problem is in the notification link generation.
If it doesn't appear, the problem is in the alert detection.

---

## 🔧 Quick Fix

I'll add support for the `petition_status_change` type to handle this case.

### Updated Code:

The code now includes:

1. **Debugging logs** to see what's happening
2. **Warning for unknown types** to catch issues
3. **Support for generic types** (coming next)

---

## 📊 Expected Console Output

### When Everything Works:

```
🔗 Building notification link for: {
  type: "petition_paused",
  petitionId: "OM2c1S04igZDRd8tW8wL",
  moderatorNotes: "TESTING NOTIF SYSTEM"
}
✅ Generated notification link: /petitions/OM2c1S04igZDRd8tW8wL?notif=paused&reason=TESTING+NOTIF+SYSTEM

🔍 Checking for notification parameters: {
  notifType: "paused",
  notifReason: "TESTING NOTIF SYSTEM",
  hasSearchParams: true,
  allParams: { notif: "paused", reason: "TESTING NOTIF SYSTEM" }
}
✅ Found notification type: paused
✅ Setting notification alert: {
  type: "paused",
  title: "⏸️ Petition Paused",
  message: "Your petition has been temporarily paused...",
  reason: "TESTING NOTIF SYSTEM"
}
```

---

## 🎯 Action Items

1. **Check browser console** for the debugging logs
2. **Check Firestore** for the notification type
3. **Report back** what notification type you see
4. **Try manual URL** to test if alert works

Once you tell me what notification type is in the database, I can add support for it!

---

## 📝 Common Issues

### Issue: URL has `reason` but no `notif`

**Cause:** Notification type doesn't match expected types  
**Solution:** Add support for the actual type or fix notification creation

### Issue: Alert doesn't appear even with correct URL

**Cause:** useEffect not triggering or searchParams not working  
**Solution:** Check React DevTools for component state

### Issue: Alert appears but closes immediately

**Cause:** URL cleanup happening too fast  
**Solution:** Add delay before cleanup

---

**Next:** Check your console logs and let me know what you see!
