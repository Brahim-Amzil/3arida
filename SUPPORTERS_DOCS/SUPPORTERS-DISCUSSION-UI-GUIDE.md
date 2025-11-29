# Supporters Discussion - UI/UX Guide

## Visual Overview

### Tab Navigation (Before vs After)

**Before (4 tabs):**

```
┌─────────┬──────────┬─────────┬───────────┐
│Petition │ Comments │ Signees │ Publisher │
└─────────┴──────────┴─────────┴───────────┘
```

**After (3 tabs):**

```
┌─────────┬────────────┬───────────┐
│Petition │ Supporters │ Publisher │
└─────────┴────────────┴───────────┘
```

## Supporters Tab Layout

### Header Section

```
┌────────────────────────────────────────────────────────┐
│ Supporters Discussion (45)              [Add Comment]  │
├────────────────────────────────────────────────────────┤
│ Show: [All (45)] [Comments (12)] [All Signatures (50)]│
│ Sort by: [Latest] [Most Liked]  (only in Comments view)│
└────────────────────────────────────────────────────────┘
```

### View Modes

#### 1. All View (Default)

Shows mixed feed of comments and signatures with comments in chronological order.

```
┌────────────────────────────────────────────────────────┐
│ 👤 John Doe                                            │
│    [Comment] 2 hours ago                               │
│    "This is exactly what we need! Fully support this." │
│    ❤️ 15                                               │
├────────────────────────────────────────────────────────┤
│ 👤 Sarah Smith                                         │
│    [✓ Signed] Morocco • 3 hours ago                    │
│    "Happy to support this important cause."            │
├────────────────────────────────────────────────────────┤
│ 👤 Anonymous                                           │
│    [Comment] [Anonymous] 5 hours ago                   │
│    "I prefer to stay anonymous but this is important." │
│    ❤️ 8                                                │
└────────────────────────────────────────────────────────┘
```

**Visual Distinctions:**

- Comments: Green avatar, Blue "Comment" badge
- Signatures: Purple avatar, Green "Signed" badge with checkmark
- Anonymous: Gray "Anonymous" badge

#### 2. Comments Only View

Shows all standalone comments with full interaction features.

```
┌────────────────────────────────────────────────────────┐
│ 👤 John Doe                                            │
│    2 hours ago                                         │
│    "This is exactly what we need! Fully support this." │
│    ❤️ 15  💬 Reply  🗑️ Delete (if owner)              │
├────────────────────────────────────────────────────────┤
│ 👤 Anonymous [Anonymous]                               │
│    5 hours ago                                         │
│    "I prefer to stay anonymous but this is important." │
│    ❤️ 8  💬 Reply                                      │
└────────────────────────────────────────────────────────┘
```

**Features:**

- Like/Unlike with heart icon (filled when liked)
- Reply button (placeholder for future)
- Delete button (only for comment owner)
- Sort by Latest or Most Liked

#### 3. All Signatures View

Shows complete list of all petition signers.

```
┌────────────────────────────────────────────────────────┐
│ 👤 Sarah Smith                                         │
│    Casablanca, Morocco                                 │
│    "Happy to support this important cause."            │
│                                          Jan 18, 2025  │
├────────────────────────────────────────────────────────┤
│ 👤 Ahmed Hassan                                        │
│    Rabat, Morocco                                      │
│                                          Jan 18, 2025  │
├────────────────────────────────────────────────────────┤
│ 👤 Maria Garcia                                        │
│    Madrid, Spain                                       │
│    "Solidarity from Spain!"                            │
│                                          Jan 17, 2025  │
└────────────────────────────────────────────────────────┘
                    [Load More]
```

**Features:**

- Shows all signatures (not just those with comments)
- Location information displayed
- Optional signature comments shown
- Pagination with "Load More" button

## Comment Form

When user clicks "Add Comment":

```
┌────────────────────────────────────────────────────────┐
│ Share your thoughts                                    │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Why do you support this petition?                  │ │
│ │                                                    │ │
│ │                                                    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ ☐ Comment anonymously                                 │
│                                                        │
│ [Post Comment]  [Cancel]                              │
└────────────────────────────────────────────────────────┘
```

## Empty States

### No Activity Yet

```
┌────────────────────────────────────────────────────────┐
│                        💬                              │
│                                                        │
│              No activity yet                           │
│         Be the first to support this petition.         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Login Required

```
┌────────────────────────────────────────────────────────┐
│                        💬                              │
│                                                        │
│              Join the Discussion                       │
│   Sign in to share your thoughts and support this      │
│                    petition.                           │
│                                                        │
│              [Sign In to Comment]                      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Color Scheme

### Badges

- **Comment Badge**: Blue background (#DBEAFE), Blue text (#1E40AF)
- **Signed Badge**: Green background (#D1FAE5), Green text (#065F46)
- **Anonymous Badge**: Gray background (#F3F4F6), Gray text (#4B5563)

### Avatars

- **Comment Avatar**: Green background (#D1FAE5), Green text (#059669)
- **Signature Avatar**: Purple background (#EDE9FE), Purple text (#7C3AED)

### Buttons

- **Primary (Add Comment, Post)**: Green (#059669)
- **Filter Active**: Green (#059669)
- **Filter Inactive**: Gray (#F3F4F6)
- **Like (Active)**: Red (#EF4444)
- **Like (Inactive)**: Gray (#6B7280)

## Responsive Behavior

### Desktop (>768px)

- Full width layout
- Side-by-side filter buttons
- Avatars: 40px (10 rem)
- Comfortable spacing

### Mobile (<768px)

- Stacked layout
- Filter buttons wrap to multiple rows if needed
- Avatars: 32px (8 rem)
- Compact spacing
- Touch-friendly tap targets (min 44px)

## Interaction States

### Hover States

- Filter buttons: Slight background color change
- Like button: Color intensifies
- Comment cards: Subtle shadow appears

### Loading States

- Initial load: Skeleton screens (3 placeholder items)
- Load more: Spinner in button
- Posting comment: Spinner + "Posting..." text

### Success States

- Comment posted: Appears at top of list immediately
- Like added: Heart fills with animation
- Unlike: Heart empties with animation

## Accessibility

### Keyboard Navigation

- Tab through filter buttons
- Tab through comments/signatures
- Enter to activate buttons
- Space to toggle checkboxes

### Screen Readers

- Proper ARIA labels on all interactive elements
- Semantic HTML structure
- Alt text for icons
- Status announcements for actions

### Focus Indicators

- Visible focus rings on all interactive elements
- High contrast focus states
- Skip to content links

## Performance Optimizations

### Lazy Loading

- Component can be lazy-loaded
- Images lazy-loaded with Next.js Image
- Pagination for signatures (20 per page)

### Caching

- Comments cached after initial load
- Signatures loaded incrementally
- Like states cached locally

### Optimistic Updates

- Likes update immediately (optimistic)
- Comments appear immediately after posting
- Rollback on error

## User Flow Examples

### Flow 1: Viewing All Activity

1. User clicks "Supporters" tab
2. Sees mixed feed of comments and signatures
3. Can scroll through chronological activity
4. Understands petition engagement at a glance

### Flow 2: Adding a Comment

1. User clicks "Add Comment" button
2. Comment form appears
3. User types comment
4. Optionally checks "Comment anonymously"
5. Clicks "Post Comment"
6. Comment appears at top of feed immediately
7. Form closes automatically

### Flow 3: Liking a Comment

1. User sees interesting comment
2. Clicks heart icon
3. Heart fills with red color
4. Like count increments
5. Click again to unlike
6. Heart empties, count decrements

### Flow 4: Viewing All Signatures

1. User clicks "All Signatures" filter
2. Sees complete list of signers
3. Scrolls through signatures
4. Clicks "Load More" for additional signatures
5. More signatures load below

## Best Practices for Users

### For Commenters

- Be respectful and constructive
- Use anonymous option if discussing sensitive topics
- Like comments you agree with
- Keep comments relevant to the petition

### For Petition Creators

- Monitor the discussion regularly
- Respond to questions and concerns
- Thank supporters for their comments
- Use feedback to improve petition messaging

### For Moderators

- Review flagged comments promptly
- Remove inappropriate content
- Maintain respectful discussion environment
- Provide clear moderation guidelines
