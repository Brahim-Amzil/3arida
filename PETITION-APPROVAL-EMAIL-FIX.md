# Petition Approval Email Fix

## Issue

When an admin approves a petition, no email notification is sent to the petition creator to inform them that their petition has been approved and is now live.

## Root Cause

The `PetitionAdminActions` component was directly updating Firestore and sending push notifications, but it was NOT sending email notifications when approving petitions.

While the `updatePetitionStatus` function in `src/lib/petitions.ts` had email sending logic, it wasn't being used by the admin UI component.

## Solution

Added email notification logic to the `PetitionAdminActions` component to send an approval email when a petition is approved.

### Changes Made

**File: `src/components/admin/PetitionAdminActions.tsx`**

Added email sending logic after the push notification (lines 192-211):

```typescript
// Send email notification if petition was approved
if (action === 'approve') {
  try {
    const creator = await getUserById(petition.creatorId);
    if (creator?.email) {
      const { sendPetitionApprovedEmail } =
        await import('@/lib/email-notifications');
      await sendPetitionApprovedEmail(
        creator.name,
        creator.email,
        petition.title,
        petition.id,
      );
      console.log('✅ Petition approved email sent to creator');
    } else {
      console.warn('⚠️ Creator email not found, skipping email notification');
    }
  } catch (emailError) {
    console.error('❌ Error sending petition approved email:', emailError);
    // Don't fail the action if email fails
  }
}
```

## How It Works

### Email Flow

1. Admin clicks "Approve" button in admin dashboard
2. Petition status is updated to 'approved' in Firestore
3. Push notification is sent to creator
4. **NEW:** Email is sent to creator's email address
5. Success message is shown to admin

### Email Content

The email includes:

- Congratulations message in Arabic and English
- Petition title
- Next steps (share, promote, add updates)
- Direct link to view the live petition
- Unsubscribe link

### Error Handling

- If creator email is not found, logs a warning but doesn't fail the approval
- If email sending fails, logs an error but doesn't fail the approval
- Approval action always succeeds even if email fails

## Email Template

Uses the existing `petitionApprovedEmail` template from `src/lib/email-templates.ts`:

- Subject: `✅ تمت الموافقة على عريضتك: [Petition Title]`
- Bilingual content (Arabic + English)
- Professional styling with green theme
- Call-to-action button to view petition

## API Endpoint

Uses the existing `/api/email/petition-approved` endpoint which:

- Validates required fields
- Generates HTML email from template
- Sends via Resend email service
- Returns success/error response

## Files Modified

- `src/components/admin/PetitionAdminActions.tsx`

## Testing Checklist

- [ ] Admin approves a petition
- [ ] Creator receives email notification
- [ ] Email contains correct petition title and link
- [ ] Email is in both Arabic and English
- [ ] Approval succeeds even if email fails
- [ ] Console logs show email sending status
- [ ] Push notification still works

## Status

✅ **FIXED** - Ready for testing

## Next Steps

1. Test petition approval in admin dashboard
2. Verify creator receives email
3. Check email content and formatting
4. Verify link in email works correctly
