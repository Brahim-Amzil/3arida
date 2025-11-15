# Petition Management Feature

## Overview

Implemented comprehensive petition management system allowing creators to delete, archive, or request deletion of their petitions based on specific conditions.

## Features Implemented

### 1. **Conditional Direct Delete**

Users can delete their petition directly if ANY of these conditions are met:

- ✅ Petition has ≤ 10 signatures
- ✅ Petition status is "pending" (not yet approved)
- ✅ Petition was created within last 24 hours

### 2. **Archive Petition**

- Soft delete that hides petition from public view
- Data is preserved in database
- Can be restored by creator later
- Status changes to 'archived'

### 3. **Request Deletion**

- For petitions that don't meet direct delete criteria
- Creates deletion request in `deletionRequests` collection
- Admin reviews and approves/denies
- Includes reason field for transparency

## Files Created/Modified

### New Files:

1. **`src/components/petitions/PetitionManagement.tsx`**
   - UI component with delete/archive/request buttons
   - Confirmation modals for each action
   - Conditional rendering based on petition criteria

### Modified Files:

1. **`src/lib/petitions.ts`**

   - `archivePetition()` - Archive a petition
   - `deletePetitionByCreator()` - Delete with conditions check
   - `requestPetitionDeletion()` - Create deletion request
   - `restoreArchivedPetition()` - Restore archived petition

2. **`src/app/petitions/[id]/page.tsx`**
   - Added PetitionManagement component to sidebar
   - Handler functions for delete/archive/request
   - Only visible to petition creator
   - Hidden if petition already deleted

## User Flow

### Direct Delete Flow:

```
1. Creator clicks "Delete Petition"
2. Confirmation modal appears
3. System checks conditions (≤10 sigs OR pending OR <24h)
4. If allowed: Status → 'deleted', redirect to dashboard
5. If not allowed: Error message
```

### Archive Flow:

```
1. Creator clicks "Archive Petition"
2. Confirmation modal appears
3. Status → 'archived'
4. Petition hidden from public
5. Redirect to dashboard
```

### Request Deletion Flow:

```
1. Creator clicks "Request Deletion"
2. Modal asks for reason
3. Creates entry in deletionRequests collection
4. Admin gets notification
5. Admin reviews and approves/denies
6. Creator gets notification of decision
```

## Database Structure

### Petition Document Updates:

```typescript
{
  status: 'deleted' | 'archived' | 'approved' | 'pending' | 'rejected',
  deletedAt: Timestamp,
  deletedBy: string,
  archivedAt: Timestamp,
  archivedBy: string,
  deletionRequested: boolean,
  deletionRequestedAt: Timestamp
}
```

### Deletion Request Document:

```typescript
{
  petitionId: string,
  petitionTitle: string,
  creatorId: string,
  reason: string,
  status: 'pending' | 'approved' | 'denied',
  createdAt: Timestamp,
  currentSignatures: number
}
```

## UI Components

### Management Card (Sidebar):

- Orange-themed warning card
- Shows appropriate buttons based on conditions
- Explanatory text for each option
- Icons for visual clarity

### Modals:

1. **Delete Confirmation** - Red theme, trash icon
2. **Archive Confirmation** - Yellow theme, archive icon
3. **Request Deletion** - Orange theme, alert icon, reason textarea

## Security

- ✅ Verifies user is petition creator
- ✅ Checks conditions before allowing delete
- ✅ Soft delete preserves data for audit
- ✅ Admin review required for significant petitions
- ✅ All actions logged with timestamps and user IDs

## Next Steps (Optional Enhancements)

1. **Admin Dashboard** - View and manage deletion requests
2. **Email Notifications** - Notify creator of request status
3. **Restore UI** - Allow creators to restore archived petitions
4. **Bulk Actions** - Archive/delete multiple petitions
5. **Analytics** - Track deletion/archive patterns

## Testing Checklist

- [ ] Delete petition with 0 signatures
- [ ] Delete petition with 10 signatures
- [ ] Try to delete petition with 11 signatures (should fail)
- [ ] Delete pending petition
- [ ] Delete petition created <24h ago
- [ ] Archive petition
- [ ] Request deletion with reason
- [ ] Verify non-creator cannot see management options
- [ ] Verify deleted petition is hidden from public
- [ ] Verify archived petition is hidden from public
