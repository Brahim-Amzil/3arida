# Petition Updates - Edit & Delete Feature

## Summary

Implemented edit and delete functionality for petition updates with a "one edit only" policy to prevent abuse and support future freemium monetization.

---

## Features Implemented

### 1. Edit Update (One Time Only) ✅

**Policy**: Each update can only be edited once

**UI/UX**:

- Edit button appears only if update hasn't been edited yet
- Inline edit form with title and content fields
- Character counter (1000 chars max)
- Warning message: "You can only edit this update once"
- Edit button disappears after first edit
- "Edited" badge shows with timestamp after editing

**Database Fields**:

```typescript
{
  editedAt?: Date;      // Timestamp of when edited
  editedOnce?: boolean; // Has been edited (true = no more edits)
}
```

### 2. Delete Update ✅

**Policy**: Can be deleted anytime by creator

**UI/UX**:

- Delete button always visible to creator
- Confirmation dialog before deletion
- Permanent deletion (no soft delete for now)
- Update removed from timeline immediately

---

## User Interface

### Update Display (Not Edited)

```
┌─────────────────────────────────────┐
│ Update Title              [✏️] [🗑️] │
│ Nov 19, 2025 • by Creator          │
│                                     │
│ Update content here...              │
└─────────────────────────────────────┘
```

### Update Display (Already Edited)

```
┌─────────────────────────────────────┐
│ Update Title                  [🗑️]  │
│ Nov 19, 2025 • Edited Nov 20, 2025 │
│                                     │
│ Update content here...              │
└─────────────────────────────────────┘
```

### Edit Mode

```
┌─────────────────────────────────────┐
│ [Title input field]                 │
│ [Content textarea]                  │
│ 450/1000 characters                 │
│                                     │
│ [Save Changes] [Cancel]             │
│ ⚠️ You can only edit this once      │
└─────────────────────────────────────┘
```

---

## Technical Implementation

### Component: `PetitionUpdates.tsx`

**New State**:

```typescript
const [editingUpdate, setEditingUpdate] = useState<string | null>(null);
const [editForm, setEditForm] = useState({ title: '', content: '' });
```

**New Functions**:

1. `handleEdit(update)` - Opens edit form
2. `handleUpdateEdit(updateId)` - Saves edited update
3. `handleDelete(updateId)` - Deletes update with confirmation

**Edit Logic**:

```typescript
await updateDoc(updateRef, {
  title: editForm.title.trim(),
  content: editForm.content.trim(),
  editedAt: serverTimestamp(),
  editedOnce: true, // Prevents future edits
});
```

**Delete Logic**:

```typescript
if (confirm('Are you sure?')) {
  await deleteDoc(updateRef);
  await fetchUpdates();
}
```

---

## Permissions

### Who Can Edit/Delete?

- ✅ Petition creator only
- ✅ Must be authenticated
- ✅ Firestore rules allow authenticated updates/deletes

### Edit Restrictions

- ✅ Can only edit once per update
- ✅ Edit button hidden after first edit
- ✅ "Edited" badge shows timestamp

### Delete Restrictions

- ✅ Can delete anytime
- ✅ Confirmation required
- ✅ No undo (permanent deletion)

---

## Future Monetization Strategy

### Free Tier

- **3-4 updates maximum** per petition
- **1 edit per update**
- Delete anytime

### Premium Tier (Future)

- **Unlimited updates**
- **2-3 edits per update** (or unlimited?)
- Advanced analytics
- Priority support

---

## Benefits

### 1. Prevents Abuse ✅

- Stops constant editing/changing of updates
- Maintains timeline integrity
- Reduces confusion for supporters

### 2. Encourages Quality ✅

- Creators think before posting
- Better quality updates
- More professional campaigns

### 3. Monetization Ready ✅

- Clear value proposition for premium
- Easy to implement limits
- Scalable business model

### 4. User-Friendly ✅

- Simple, intuitive interface
- Clear visual feedback
- Helpful warning messages

---

## Testing Checklist

- [ ] Create a petition update
- [ ] Edit the update (should work)
- [ ] Try to edit again (button should be hidden)
- [ ] Check "Edited" badge appears
- [ ] Delete an update (with confirmation)
- [ ] Verify update is removed
- [ ] Test as non-creator (no edit/delete buttons)
- [ ] Test character limits (1000 chars)

---

## Files Modified

1. `3arida-app/src/components/petitions/PetitionUpdates.tsx`

   - Added edit/delete functionality
   - Added "one edit only" policy
   - Updated UI with edit/delete buttons
   - Added inline edit form

2. `3arida-app/firestore.rules`
   - Already allows authenticated updates/deletes
   - No changes needed (dev rules are permissive)

---

## Database Schema

### petitionUpdates Collection

```typescript
{
  id: string;
  petitionId: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  createdBy: string;
  createdByName: string;
  editedAt?: Timestamp;      // NEW: When edited
  editedOnce?: boolean;      // NEW: Has been edited
}
```

---

## Next Steps

### Immediate

- ✅ Feature is complete and ready to test
- Test in browser at http://localhost:4000
- Create updates and test edit/delete

### Future Enhancements

1. **Update Limits** (Freemium)

   - Add `updateCount` to petitions
   - Enforce 3-4 update limit for free tier
   - Show "Upgrade to Premium" message

2. **Edit History** (Optional)

   - Store previous versions
   - Show edit history to admins
   - Transparency feature

3. **Notifications**

   - Notify supporters of new updates
   - Email notifications for major updates
   - Push notifications

4. **Rich Text Editor**
   - Add formatting options
   - Embed images/videos
   - Better content creation

---

## Status

✅ **Complete and Ready to Test**

**Created**: November 19, 2025  
**Feature**: Edit & Delete Petition Updates  
**Policy**: One Edit Only per Update  
**Monetization**: Ready for Freemium Model

---

**Test it now at**: http://localhost:4000
