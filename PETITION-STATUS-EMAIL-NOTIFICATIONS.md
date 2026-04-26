# Petition Status Email Notifications

## Overview

Added comprehensive email notifications for all petition status changes: approved, rejected, paused, and deleted. Creators now receive professional, bilingual emails whenever their petition status changes.

## Email Templates Created

### 1. Petition Rejected Email

**Subject:** `❌ تم رفض عريضتك: [Petition Title]`

**Features:**

- Red gradient header
- Displays rejection reason in highlighted box
- Instructions for resubmission (up to 3 times)
- Guidelines reminder
- Link to view and resubmit petition
- Bilingual (Arabic + English)

**Use Case:** When admin/moderator rejects a petition

---

### 2. Petition Paused Email

**Subject:** `⏸️ تم إيقاف عريضتك مؤقتًا: [Petition Title]`

**Features:**

- Orange gradient header
- Displays pause reason in highlighted box
- Explains what pausing means (not visible, can't be signed)
- Reassures that signatures are preserved
- Next steps and contact moderator button
- Bilingual (Arabic + English)

**Use Case:** When admin/moderator temporarily pauses a petition

---

### 3. Petition Deleted Email

**Subject:** `🗑️ تم حذف عريضتك: [Petition Title]`

**Features:**

- Dark red gradient header
- Displays deletion reason in highlighted box
- Explains permanence of deletion
- Appeal process information
- Contact support button
- Bilingual (Arabic + English)

**Use Case:** When admin/moderator permanently deletes a petition

---

### 4. Petition Approved Email (Already Existed)

**Subject:** `✅ تمت الموافقة على عريضتك: [Petition Title]`

**Features:**

- Green gradient header
- Congratulations message
- Next steps for promotion
- Link to view live petition
- Bilingual (Arabic + English)

**Use Case:** When admin/moderator approves a petition

## Implementation Details

### Files Created

1. **Email Templates** (`src/lib/email-templates.ts`)
   - `petitionRejectedEmail()` - Red themed rejection email
   - `petitionPausedEmail()` - Orange themed pause email
   - `petitionDeletedEmail()` - Dark red themed deletion email

2. **Email Notification Functions** (`src/lib/email-notifications.ts`)
   - `sendPetitionRejectedEmail()` - Sends rejection email
   - `sendPetitionPausedEmail()` - Sends pause email
   - `sendPetitionDeletedEmail()` - Sends deletion email

3. **API Endpoints**
   - `/api/email/petition-rejected/route.ts` - Handles rejection emails
   - `/api/email/petition-paused/route.ts` - Handles pause emails
   - `/api/email/petition-deleted/route.ts` - Handles deletion emails

### Files Modified

**`src/components/admin/PetitionAdminActions.tsx`**

- Added email sending for reject, pause, and delete actions
- Uses switch statement to handle different actions
- Includes error handling and logging
- Non-blocking (doesn't fail action if email fails)

## Email Flow

### When Admin Takes Action:

1. **Approve Petition:**
   - Status updated to 'approved'
   - Push notification sent
   - ✅ Approval email sent
   - Success message shown

2. **Reject Petition:**
   - Status updated to 'rejected'
   - Rejection reason captured
   - Push notification sent
   - ❌ Rejection email sent with reason
   - Success message shown

3. **Pause Petition:**
   - Status updated to 'paused'
   - Pause reason captured
   - Push notification sent
   - ⏸️ Pause email sent with reason
   - Success message shown

4. **Delete Petition:**
   - Status updated to 'deleted'
   - Deletion reason captured
   - Push notification sent
   - 🗑️ Deletion email sent with reason
   - Success message shown

## Email Content Structure

All emails follow a consistent structure:

```
┌─────────────────────────────────┐
│  Colored Header (Status Icon)  │
│  Arabic Title                   │
│  English Title                  │
├─────────────────────────────────┤
│  Greeting                       │
│  Status Message (AR + EN)       │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Reason Box (Highlighted)  │ │
│  └───────────────────────────┘ │
│                                 │
│  What This Means:               │
│  • Bullet points               │
│                                 │
│  Next Steps:                    │
│  • Action items                │
│                                 │
│  [Call-to-Action Button]        │
│                                 │
│  Closing Message                │
├─────────────────────────────────┤
│  Footer                         │
│  © 2025 3arida Platform         │
│  Unsubscribe Link               │
└─────────────────────────────────┘
```

## Color Themes

- **Approved:** Green gradient (#16a34a → #15803d)
- **Rejected:** Red gradient (#dc2626 → #991b1b)
- **Paused:** Orange gradient (#f59e0b → #d97706)
- **Deleted:** Dark red gradient (#7f1d1d → #450a0a)

## Error Handling

All email sending is wrapped in try-catch blocks:

- Logs success messages to console
- Logs errors to console
- Does NOT fail the admin action if email fails
- Warns if creator email is not found

## Testing Checklist

### Approve Action

- [ ] Admin approves petition
- [ ] Creator receives approval email
- [ ] Email has green theme
- [ ] Link to petition works
- [ ] Push notification sent

### Reject Action

- [ ] Admin rejects petition with reason
- [ ] Creator receives rejection email
- [ ] Email has red theme
- [ ] Reason is displayed correctly
- [ ] Resubmission instructions shown
- [ ] Push notification sent

### Pause Action

- [ ] Admin pauses petition with reason
- [ ] Creator receives pause email
- [ ] Email has orange theme
- [ ] Reason is displayed correctly
- [ ] Contact moderator button works
- [ ] Push notification sent

### Delete Action

- [ ] Admin deletes petition with reason
- [ ] Creator receives deletion email
- [ ] Email has dark red theme
- [ ] Reason is displayed correctly
- [ ] Contact support button works
- [ ] Push notification sent

### Error Scenarios

- [ ] Email fails but action succeeds
- [ ] Creator has no email (warning logged)
- [ ] Email service unavailable (error logged)

## Benefits

1. **Transparency:** Creators know exactly what happened to their petition
2. **Communication:** Reasons are clearly communicated
3. **Guidance:** Next steps are provided for each scenario
4. **Professional:** Bilingual, well-designed emails
5. **Actionable:** Direct links to relevant pages
6. **Non-blocking:** Email failures don't prevent admin actions

## Status

✅ **COMPLETE** - Ready for testing

## Files Summary

**Created:**

- `src/app/api/email/petition-rejected/route.ts`
- `src/app/api/email/petition-paused/route.ts`
- `src/app/api/email/petition-deleted/route.ts`

**Modified:**

- `src/lib/email-templates.ts` (added 3 new templates)
- `src/lib/email-notifications.ts` (added 3 new functions)
- `src/components/admin/PetitionAdminActions.tsx` (added email sending for all actions)
