# Petition Close Feature Implementation

## Overview

Implemented the ability for petition creators to close their petitions. Closed petitions remain publicly visible but no longer accept new signatures.

## Implementation Date

February 9, 2026

## Features Implemented

### 1. Close Petition Functionality

- **Location**: `src/lib/petitions.ts`
- **Function**: `closePetitionByCreator(petitionId, userId, closingMessage?)`
- **Behavior**:
  - Only petition creator can close their petition
  - Petition must not already be closed
  - Sets `closedByCreator: true` flag
  - Records `closedAt` timestamp
  - Optionally stores `closingMessage` from creator
  - Creates audit log entry (no admin notification)

### 2. Admin Dashboard Tab

- **Location**: `src/app/admin/petitions/page.tsx`
- **New Tab**: "مغلقة من المنشئ" (Closed by Creator)
- **Filter**: Shows all petitions where `closedByCreator === true`
- **Count Badge**: Displays number of closed petitions
- **Behavior**:
  - Filters petitions by `closedByCreator` flag (not by status)
  - Works with existing search and category filters
  - Shows petition details including closing message

### 3. Petition Management UI

- **Location**: `src/components/petitions/PetitionManagement.tsx`
- **New Button**: "إغلاق العريضة" (Close Petition)
- **Modal**: Close confirmation with optional message input
- **Visibility**:
  - Only shown if petition is NOT already closed
  - Only shown if petition status is 'approved'
  - Available to petition creator only
- **Closed Status Display**:
  - Shows blue badge when petition is closed
  - Displays closing message if provided
  - Indicates no new signatures accepted

## Database Schema Updates

### Petition Type Fields (Already Added)

```typescript
closedByCreator?: boolean;
closedAt?: Date;
closingMessage?: string;
```

## User Flow

### Closing a Petition

1. Creator navigates to their petition detail page
2. Sees "إغلاق العريضة" button in management card
3. Clicks button → modal opens
4. Optionally enters closing message
5. Confirms → petition is closed
6. Petition remains visible but shows "Closed" badge
7. Sign button is disabled (to be implemented)

### Admin View

1. Admin navigates to petitions management
2. Clicks "مغلقة من المنشئ" tab
3. Sees all petitions closed by creators
4. Can view closing messages and petition details
5. No action required (just for monitoring)

## Key Design Decisions

### 1. No Admin Notification

- Closing is a creator action, not requiring approval
- Audit log is created for tracking
- Admins can view closed petitions in dedicated tab

### 2. Petition Remains Public

- Closed petitions stay visible
- Signatures count remains displayed
- Comments remain visible
- Only new signatures are prevented

### 3. Status Independent

- Closing is separate from petition status
- Petition can be 'approved' AND closed
- Filter by `closedByCreator` flag, not status

### 4. Optional Closing Message

- Creator can explain why petition was closed
- Message displayed to visitors
- Not required (can be empty)

## Still To Implement

### 1. Prevent Signing on Closed Petitions

- **File**: `src/app/petitions/[id]/page.tsx`
- **Action**: Check `petition.closedByCreator` before showing sign button
- **UI**: Show "Closed" badge instead of sign button

### 2. Display Closed Badge on Petition Cards

- **File**: `src/components/petitions/PetitionCard.tsx`
- **Action**: Show "مغلقة" badge if `closedByCreator === true`
- **Style**: Blue badge similar to status badges

### 3. Backend Validation

- **File**: `src/lib/petitions.ts` - `signPetition()` function
- **Action**: Check `closedByCreator` flag before allowing signature
- **Error**: "This petition is closed and no longer accepting signatures"

### 4. Translation Keys

- **File**: `src/hooks/useTranslation.ts`
- **Keys Needed**:
  - `petition.close.button`: "إغلاق العريضة"
  - `petition.close.title`: "إغلاق العريضة؟"
  - `petition.close.description`: "ستبقى مرئية ولكن لن تقبل توقيعات جديدة"
  - `petition.close.message.placeholder`: "رسالة الإغلاق (اختياري)..."
  - `petition.close.confirm`: "إغلاق العريضة"
  - `petition.close.cancel`: "إلغاء"
  - `petition.closed.badge`: "مغلقة"
  - `petition.closed.message`: "هذه العريضة مغلقة ولا تقبل توقيعات جديدة"

## Testing Checklist

- [ ] Creator can close their own petition
- [ ] Non-creator cannot close petition
- [ ] Closing message is optional
- [ ] Closing message is saved and displayed
- [ ] Closed petition appears in admin "Closed by Creator" tab
- [ ] Closed badge shows in management card
- [ ] Cannot close already closed petition
- [ ] Audit log is created on close
- [ ] Petition remains publicly visible after closing
- [ ] Sign button is disabled on closed petitions (to implement)
- [ ] Closed badge shows on petition cards (to implement)

## Files Modified

1. `src/lib/petitions.ts` - Added `closePetitionByCreator()` function
2. `src/app/admin/petitions/page.tsx` - Added "Closed by Creator" tab and filter
3. `src/components/petitions/PetitionManagement.tsx` - Added close button and modal
4. `src/types/petition.ts` - Already had close fields from previous session

## Next Steps

1. Implement sign button prevention on closed petitions
2. Add closed badge to petition cards
3. Add translation keys
4. Test complete flow
5. Deploy to production

## Notes

- Feature designed for beta launch where all petitions are free
- No payment implications for closing
- Closing is permanent (no reopen functionality yet)
- Consider adding reopen functionality in future if needed
