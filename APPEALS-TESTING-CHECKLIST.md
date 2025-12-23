# Appeals System Testing Checklist

## Pre-Testing Setup

- [ ] App is running on http://localhost:4000
- [ ] You have a test user account (creator)
- [ ] You have an admin/moderator account
- [ ] You have at least one petition that can be paused/rejected

## Creator Flow Testing

### 1. Create an Appeal

- [ ] Navigate to a petition page
- [ ] Have moderator pause or reject the petition
- [ ] Verify "Contact Moderator" button appears on petition page
- [ ] Click "Contact Moderator" button
- [ ] Modal opens with petition preview
- [ ] Modal shows moderation notes/reason
- [ ] Enter appeal message
- [ ] Click "Send Message"
- [ ] Success message appears
- [ ] Modal closes after 2 seconds

### 2. View Appeals in Dashboard

- [ ] Navigate to `/dashboard`
- [ ] Verify "Appeals" section appears at top of page
- [ ] Appeals section shows list of your appeals
- [ ] Each appeal shows:
  - [ ] Petition title
  - [ ] Status badge (pending/in-progress/resolved/rejected)
  - [ ] Last updated date
  - [ ] Unread indicator (if moderator replied)
- [ ] Click on an appeal
- [ ] Redirects to `/dashboard/appeals/[id]`

### 3. View Appeal Thread

- [ ] Full conversation thread displays
- [ ] Messages show sender name and timestamp
- [ ] Your messages appear on right side
- [ ] Moderator messages appear on left side
- [ ] Petition preview card shows at top
- [ ] Reply form appears at bottom (if appeal is open)
- [ ] Can submit reply
- [ ] New message appears in thread
- [ ] Cannot reply if appeal is resolved/rejected

### 4. Email Notifications (Creator)

- [ ] Receive email when appeal is created (confirmation)
- [ ] Receive email when moderator replies
- [ ] Email contains message content
- [ ] Email does NOT contain admin links
- [ ] Email has link to view appeal in dashboard

## Admin/Moderator Flow Testing

### 1. Access Appeals Dashboard

- [ ] Navigate to `/admin`
- [ ] Verify "Appeals" link appears in admin navigation
- [ ] Click "Appeals" link
- [ ] Redirects to `/admin/appeals`
- [ ] Appeals list page loads

### 2. View Appeals List

- [ ] All appeals display in list
- [ ] Each appeal shows:
  - [ ] Appeal ID
  - [ ] Petition title
  - [ ] Creator name
  - [ ] Status badge
  - [ ] Submission date
  - [ ] Last updated date
- [ ] Filter by status works:
  - [ ] All
  - [ ] Pending
  - [ ] In Progress
  - [ ] Resolved
  - [ ] Rejected
- [ ] Search functionality works (if implemented)
- [ ] Pagination works (if many appeals)

### 3. View Appeal Details

- [ ] Click on an appeal
- [ ] Redirects to `/admin/appeals/[id]`
- [ ] Full appeal details display:
  - [ ] Petition information with admin link
  - [ ] Creator information
  - [ ] Full message thread
  - [ ] Status history
  - [ ] Reply form
  - [ ] Status update controls

### 4. Reply to Appeal

- [ ] Enter reply message in form
- [ ] Click "Send Reply"
- [ ] Message appears in thread
- [ ] Status auto-updates to "in-progress" if was "pending"
- [ ] Creator receives email notification
- [ ] Timestamp is correct

### 5. Update Appeal Status

- [ ] Click status dropdown/buttons
- [ ] Change status to "in-progress"
  - [ ] Status updates successfully
  - [ ] Status change logged in history
- [ ] Change status to "resolved"
  - [ ] Status updates successfully
  - [ ] Resolved timestamp set
  - [ ] Creator receives email notification
  - [ ] Reply form disabled
- [ ] Change status to "rejected"
  - [ ] Rejection reason field appears
  - [ ] Enter rejection reason
  - [ ] Status updates successfully
  - [ ] Creator receives email notification
  - [ ] Reply form disabled
- [ ] Reopen resolved appeal
  - [ ] Status changes back to "in-progress"
  - [ ] Reply form re-enabled

### 6. Internal Notes (if implemented)

- [ ] Add internal moderator note
- [ ] Note is NOT visible to creator
- [ ] Note appears in admin view only

### 7. Export Appeal Data

- [ ] Click "Export" button
- [ ] JSON export downloads
- [ ] Export contains all messages
- [ ] Export contains status history
- [ ] Export contains metadata

### 8. Email Notifications (Moderator)

- [ ] Receive email when new appeal is created
- [ ] Email contains appeal details
- [ ] Email has link to admin appeal page
- [ ] Receive email when creator replies
- [ ] Email does NOT expose creator email address

## Edge Cases & Error Handling

### Appeal Creation

- [ ] Cannot create appeal for approved petition
- [ ] Cannot create appeal if one already exists (open)
- [ ] Empty message is rejected
- [ ] Very long message is handled properly
- [ ] Network error shows error message

### Permissions

- [ ] Non-creator cannot view other creator's appeals
- [ ] Non-admin cannot access `/admin/appeals`
- [ ] Unauthenticated user redirected to login
- [ ] Creator cannot change appeal status
- [ ] Creator cannot see internal moderator notes

### Data Integrity

- [ ] Appeal ID is unique
- [ ] Timestamps are accurate
- [ ] Status transitions are valid
- [ ] Audit trail is complete
- [ ] No data loss on page refresh

## Performance Testing

- [ ] Appeals list loads quickly (<2s)
- [ ] Appeal detail page loads quickly (<1s)
- [ ] No console errors
- [ ] No memory leaks
- [ ] Smooth scrolling in long threads

## Mobile Testing (Optional)

- [ ] Appeals section displays properly on mobile
- [ ] Modal is responsive
- [ ] Thread view is readable on small screens
- [ ] Reply form works on mobile
- [ ] Admin dashboard is usable on tablet

## Browser Compatibility (Optional)

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Notes

- Document any bugs found
- Take screenshots of issues
- Note any UX improvements needed
- Check Firestore console for data accuracy
