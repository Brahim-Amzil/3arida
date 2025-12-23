# Contact Moderator Button Integration

**Date:** December 4, 2024  
**Status:** ✅ COMPLETED

## Overview

Added the "Contact Moderator" button to petition detail pages for paused and rejected petitions, allowing creators to submit appeals directly from the petition page.

## Changes Made

### File Modified: `src/app/petitions/[id]/page.tsx`

#### 1. Added Import

```typescript
import ContactModeratorModal from '@/components/moderation/ContactModeratorModal';
```

#### 2. Added State

```typescript
const [showContactModerator, setShowContactModerator] = useState(false);
```

#### 3. Added Button to Rejected Petition Alert

- Button appears for petition creators when their petition is rejected
- Styled with red theme to match rejection alert
- Includes message icon
- Opens ContactModeratorModal when clicked

#### 4. Added Button to Paused Petition Alert

- Button appears for petition creators when their petition is paused
- Styled with orange theme to match paused alert
- Includes message icon
- Opens ContactModeratorModal when clicked

#### 5. Added Modal Component

```typescript
{showContactModerator && (
  <ContactModeratorModal
    petition={petition}
    onClose={() => setShowContactModerator(false)}
  />
)}
```

## User Experience

### For Rejected Petitions

1. Creator sees red alert box with rejection reason
2. If resubmission attempts remain: "Edit & Resubmit" button shows
3. "Contact Moderator" button always shows for creators
4. Clicking button opens modal to submit appeal

### For Paused Petitions

1. Creator sees orange alert box with pause reason
2. "Contact Moderator" button shows for creators
3. Clicking button opens modal to submit appeal

## Button Visibility Rules

The "Contact Moderator" button only appears when:

- ✅ User is authenticated
- ✅ User is the petition creator (`petition.creatorId === user.uid`)
- ✅ Petition status is either "paused" or "rejected"

## Modal Functionality

When the button is clicked:

1. ContactModeratorModal opens
2. Shows petition preview with status and moderation notes
3. Creator can write appeal message
4. On submit, creates appeal via `/api/appeals/create`
5. Success message shows
6. Creator can view appeal in dashboard

## Testing Checklist

- [ ] Navigate to a rejected petition as the creator
- [ ] Verify "Contact Moderator" button appears
- [ ] Click button and verify modal opens
- [ ] Submit appeal and verify success
- [ ] Navigate to a paused petition as the creator
- [ ] Verify "Contact Moderator" button appears
- [ ] Click button and verify modal opens
- [ ] Submit appeal and verify success
- [ ] Verify button does NOT appear for non-creators
- [ ] Verify button does NOT appear for approved petitions

## Integration with Appeals System

The Contact Moderator button is now fully integrated with the Appeals system:

1. **Button** → Opens ContactModeratorModal
2. **Modal** → Calls `/api/appeals/create` endpoint
3. **API** → Creates appeal in Firestore
4. **Email** → Notifies moderators
5. **Dashboard** → Creator sees appeal in appeals section
6. **Admin** → Moderators see appeal in admin panel

## Files Involved

- ✅ `src/app/petitions/[id]/page.tsx` - Added button and modal
- ✅ `src/components/moderation/ContactModeratorModal.tsx` - Already configured
- ✅ `src/app/api/appeals/create/route.ts` - Already implemented
- ✅ `src/components/appeals/CreatorAppealsSection.tsx` - Already implemented
- ✅ `src/app/admin/appeals/page.tsx` - Already implemented

## Next Steps

1. Test the button on both paused and rejected petitions
2. Verify modal opens and submits correctly
3. Check that appeals appear in dashboard
4. Verify moderators receive email notifications
5. Test end-to-end appeal workflow

## Notes

- Button styling matches the alert box theme (red for rejected, orange for paused)
- Button includes a message icon for better UX
- Modal already handles all the appeal creation logic
- No additional backend changes needed
- All TypeScript compilation passes without errors
