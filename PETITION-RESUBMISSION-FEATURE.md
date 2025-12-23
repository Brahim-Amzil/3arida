# Petition Resubmission Feature

## Overview

Creators can now edit and resubmit rejected petitions up to 3 times, giving them a chance to fix issues and get their petition approved.

## Features Implemented

### 1. Edit & Resubmit Page (`/petitions/[id]/edit`)

- **Access**: Only available to petition creators when status is "rejected"
- **Limit**: Maximum 3 resubmission attempts
- **Functionality**:
  - Edit title, description, category, target signatures
  - Remove existing media
  - Add new media files
  - View previous rejection reason
  - See remaining resubmission attempts

### 2. Rejection Reason Display

- Red alert box on petition detail page showing:
  - "Petition Rejected" heading
  - Explanation message
  - Moderator's rejection reason (if provided)
  - "Edit & Resubmit" button (if attempts remaining)
  - Attempts counter (e.g., "2 attempts left")
  - Max attempts reached message (if 3/3 used)

### 3. Resubmission Tracking

- **New Petition Fields**:
  - `resubmissionCount`: Number of times petition has been resubmitted (0-3)
  - `resubmissionHistory`: Array of resubmission records containing:
    - `rejectedAt`: When petition was rejected
    - `reason`: Rejection reason from moderator
    - `resubmittedAt`: When petition was resubmitted

### 4. Admin Resubmission History

- **Visible to**: Admins and moderators only
- **Location**: Sidebar on petition detail page
- **Shows**:
  - Total resubmission count
  - History of each rejection and resubmission
  - Dates and reasons for each attempt

## User Flow

### For Creators:

1. Petition gets rejected with reason
2. Creator sees red alert with rejection reason
3. Creator clicks "Edit & Resubmit" button (shows attempts left)
4. Creator edits petition content
5. Creator clicks "Resubmit for Review"
6. Petition status changes to "pending"
7. Moderators review the resubmitted petition
8. Process repeats up to 3 times if rejected again

### For Moderators:

1. See "Resubmission History" card in sidebar (if applicable)
2. View all previous rejection reasons and dates
3. Know this is a resubmission (helps with context)
4. Review and approve/reject as normal

## Technical Details

### Database Schema Changes

```typescript
interface Petition {
  // ... existing fields
  resubmissionCount?: number;
  resubmissionHistory?: Array<{
    rejectedAt: Date;
    reason: string;
    resubmittedAt?: Date;
  }>;
}
```

### Key Files Modified

1. `src/types/petition.ts` - Added resubmission fields
2. `src/app/petitions/[id]/page.tsx` - Added rejection alert with edit button and admin history
3. `src/app/petitions/[id]/edit/page.tsx` - New edit/resubmit page
4. `src/components/admin/PetitionAdminActions.tsx` - Already saves rejection reason

### Resubmission Logic

```typescript
// When resubmitting:
1. Add current rejection to history
2. Increment resubmission count
3. Change status to "pending"
4. Clear moderationNotes
5. Update petition content
```

## Limits & Rules

### Resubmission Limits

- **Maximum attempts**: 3
- **After 3 rejections**: No more resubmissions allowed
- **Counter display**: Shows remaining attempts (e.g., "2 attempts left")

### Access Control

- Only petition creator can edit/resubmit
- Only rejected petitions can be resubmitted
- Edit page checks both creator and resubmission limit

### Status Changes

- **On rejection**: `approved/pending` → `rejected`
- **On resubmission**: `rejected` → `pending`
- **Rejection reason**: Cleared when resubmitted

## Benefits

### For Creators

✅ Second chance to fix issues
✅ Clear feedback on what to improve
✅ No need to create new petition from scratch
✅ Preserves petition ID and reference code

### For Moderators

✅ See resubmission history for context
✅ Know if creator addressed previous concerns
✅ Reduces duplicate petitions
✅ Improves petition quality over time

### For Platform

✅ Better user experience
✅ Higher approval rates
✅ Fewer abandoned petitions
✅ More engaged creators

## Testing

### Manual Testing Steps

1. Create a test petition
2. Reject it with a reason (as admin)
3. View petition as creator - see rejection alert
4. Click "Edit & Resubmit" button
5. Edit petition content
6. Submit for review
7. Check status changed to "pending"
8. Check resubmission count incremented
9. Repeat 2 more times to test limit
10. Verify "Max attempts reached" message appears

### Automated Test Script

Run: `node 3arida-app/test-resubmission.js`

This script:

- Finds a test petition
- Rejects it with a reason
- Simulates resubmission
- Verifies all fields updated correctly
- Restores original state

## UI/UX Details

### Rejection Alert (Red Box)

- Border: Left red border (4px)
- Background: Red-50
- Icon: X icon in red
- Reason: Displayed in red-100 box
- Button: Blue "Edit & Resubmit" button
- Counter: Shows attempts remaining

### Edit Page

- Blue info box: Shows remaining attempts
- Red alert box: Shows previous rejection reason
- Form: Pre-filled with current petition data
- Media: Can remove existing, add new
- Submit: "Resubmit for Review" button

### Admin History Card (Orange)

- Title: "Resubmission History" in orange
- Shows: Total count and detailed history
- Each entry: Bordered with dates and reasons
- Only visible: When resubmission history exists

## Future Enhancements (Optional)

1. **Email notifications**: Notify creator when rejected
2. **Comparison view**: Show what changed between submissions
3. **Moderator notes**: Allow moderators to add private notes
4. **Appeal system**: Allow creators to appeal after 3 rejections
5. **Auto-approve**: If minor changes, auto-approve resubmission
6. **Analytics**: Track resubmission success rates

## Status

✅ **Implemented and Ready for Testing**

All features are complete and integrated into the application. The resubmission system is fully functional with proper limits, tracking, and UI feedback.
