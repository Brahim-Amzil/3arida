# Comment & Reply Delete Feature

## Overview

Users can now delete their own comments and replies using a **soft delete** approach. This means deleted content is marked as deleted but preserved in the database for moderation and audit purposes.

## Features Implemented

### 1. Soft Delete Functionality

- Comments/replies are marked with `deleted: true` instead of being removed
- Original content remains in database
- Deletion timestamp and user ID are tracked
- Admins can still view deleted content

### 2. User Interface

- **Delete Button**: Appears next to user's own comments/replies
- **Confirmation Dialog**: Asks user to confirm before deleting
- **Deleted Placeholder**: Shows "[Comment deleted]" or "[Reply deleted]" in UI
- **Reply Preservation**: When parent comment is deleted, replies remain visible

### 3. Security Rules

- Only comment author can delete their own comments
- Admins can delete any comment
- Firestore rules enforce authorization

## Data Structure

### Comment/Reply Document

```javascript
{
  id: string,
  petitionId: string,
  authorId: string,
  authorName: string,
  content: string,
  createdAt: Timestamp,
  isAnonymous: boolean,
  likes: number,
  likedBy: string[],
  parentId?: string,        // For replies

  // Soft delete fields
  deleted?: boolean,        // true when deleted
  deletedAt?: Timestamp,    // When it was deleted
  deletedBy?: string        // User ID who deleted it
}
```

## User Experience

### For Regular Users

1. **Own Comments**: See "Delete" button next to their comments/replies
2. **Deleted Content**: See "[Comment deleted]" placeholder
3. **Replies**: Can still see replies to deleted comments
4. **No Interaction**: Cannot like or reply to deleted comments

### For Admins

- Can delete any comment/reply
- Can view original content of deleted items in database
- Can track who deleted what and when

## Benefits

### User Control

- Users can remove regretted comments
- Privacy protection for accidentally shared info
- Ability to correct mistakes

### Platform Protection

- Audit trail for legal/moderation purposes
- Evidence preserved if needed
- Conversation context maintained

### Best Practices

- Follows industry standards (Reddit, Twitter, Facebook)
- Balances user autonomy with platform safety
- Maintains discussion continuity

## Technical Implementation

### Files Modified

1. **PetitionSupporters.tsx**

   - Added `deleted`, `deletedAt`, `deletedBy` to Comment interface
   - Implemented `handleDeleteComment()` function
   - Updated UI to show delete buttons
   - Added deleted content placeholders

2. **firestore.rules**
   - Updated comment rules to restrict deletion to authors/admins
   - Ensures security at database level

### Functions Added

#### handleDeleteComment(commentId, isReply)

```typescript
const handleDeleteComment = async (
  commentId: string,
  isReply: boolean = false
) => {
  // Confirms deletion
  // Updates Firestore with deleted flags
  // Updates local state to show placeholder
};
```

## Testing

### Manual Testing

1. Sign in as a user
2. Post a comment on a petition
3. Click "Delete" button
4. Confirm deletion
5. Verify "[Comment deleted]" appears
6. Check replies are still visible

### Automated Testing

Run the test script:

```bash
cd 3arida-app
node test-comment-delete.js
```

## Future Enhancements

### Potential Additions

1. **Time Limit**: Allow deletion only within 24-48 hours
2. **Edit History**: Track edits before deletion
3. **Restore Function**: Allow admins to restore deleted comments
4. **Bulk Delete**: Delete all comments by a user
5. **Notification**: Notify users when their comment is deleted by admin

### Admin Dashboard

- View all deleted comments
- Filter by date, user, petition
- Restore deleted content
- Export for legal purposes

## Security Considerations

### What's Protected

- Only authors can delete their own content
- Admins have override capability
- Database rules enforce authorization
- Deleted content preserved for audit

### What to Monitor

- Abuse of delete feature (spam then delete)
- Patterns of deletion (harassment then delete)
- Admin deletion activity
- Legal requests for deleted content

## Support & Troubleshooting

### Common Issues

**Delete button not appearing**

- Ensure user is signed in
- Verify user is the comment author
- Check browser console for errors

**Deletion fails**

- Check Firestore rules are deployed
- Verify user authentication
- Check network connection

**Deleted content still visible**

- Clear browser cache
- Refresh the page
- Check if viewing as admin

## Deployment Checklist

- [x] Update Comment interface with delete fields
- [x] Implement handleDeleteComment function
- [x] Add delete buttons to UI
- [x] Show deleted placeholders
- [x] Update Firestore security rules
- [x] Deploy Firestore rules
- [x] Test functionality
- [x] Document feature

## Conclusion

The soft delete feature provides users with control over their content while maintaining platform integrity. It follows industry best practices and balances user privacy with moderation needs.
