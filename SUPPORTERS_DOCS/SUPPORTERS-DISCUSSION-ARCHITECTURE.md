# Supporters Discussion - Architecture Diagram

## Component Hierarchy

```
PetitionDetailPage
│
├── Header
├── PetitionContent
│   ├── PetitionInfo
│   ├── TabNavigation
│   │   ├── [Petition Tab]
│   │   ├── [Supporters Tab] ← NEW
│   │   └── [Publisher Tab]
│   │
│   └── TabContent
│       ├── PetitionTab (description, media, etc.)
│       ├── SupportersTab ← NEW COMPONENT
│       │   │
│       │   └── PetitionSupporters
│       │       ├── Header
│       │       │   ├── Title & Count
│       │       │   └── Add Comment Button
│       │       │
│       │       ├── ViewFilter
│       │       │   ├── [All] button
│       │       │   ├── [Comments] button
│       │       │   └── [All Signatures] button
│       │       │
│       │       ├── SortFilter (Comments view only)
│       │       │   ├── [Latest] button
│       │       │   └── [Most Liked] button
│       │       │
│       │       ├── CommentForm (if logged in)
│       │       │   ├── Textarea
│       │       │   ├── Anonymous Checkbox
│       │       │   └── Submit/Cancel Buttons
│       │       │
│       │       └── ContentDisplay
│       │           ├── AllView (mixed feed)
│       │           │   ├── CommentItem(s)
│       │           │   └── SignatureItem(s) with comments
│       │           │
│       │           ├── CommentsView
│       │           │   └── CommentItem(s)
│       │           │       ├── Avatar
│       │           │       ├── Author & Badges
│       │           │       ├── Content
│       │           │       └── Actions (Like, Reply, Delete)
│       │           │
│       │           └── SignaturesView
│       │               ├── SignatureItem(s)
│       │               │   ├── Avatar
│       │               │   ├── Name & Location
│       │               │   ├── Optional Comment
│       │               │   └── Date
│       │               └── LoadMore Button
│       │
│       └── PublisherTab (creator info)
│
└── Footer
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interactions                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  PetitionSupporters Component                │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │ View State │  │ Sort State │  │ Form State │           │
│  └────────────┘  └────────────┘  └────────────┘           │
│                                                              │
│  ┌──────────────────────────────────────────────┐          │
│  │         React State Management                │          │
│  │  - comments: Comment[]                        │          │
│  │  - signatures: Signature[]                    │          │
│  │  - likedComments: Set<string>                 │          │
│  │  - loading, submitting, etc.                  │          │
│  └──────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Firestore Database                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  comments    │  │  signatures  │  │    users     │     │
│  │  collection  │  │  collection  │  │  collection  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Component Mount                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  useEffect Hook  │
                    └──────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
        ┌──────────────┐          ┌──────────────┐
        │loadComments()│          │loadSignatures│
        └──────────────┘          └──────────────┘
                │                           │
                ▼                           ▼
        ┌──────────────┐          ┌──────────────┐
        │   Firestore  │          │   Firestore  │
        │    Query     │          │    Query     │
        └──────────────┘          └──────────────┘
                │                           │
                ▼                           ▼
        ┌──────────────┐          ┌──────────────┐
        │setComments() │          │setSignatures │
        └──────────────┘          └──────────────┘
                │                           │
                └─────────────┬─────────────┘
                              ▼
                    ┌──────────────────┐
                    │  Render Content  │
                    └──────────────────┘
```

## User Interaction Flows

### Flow 1: Posting a Comment

```
User clicks "Add Comment"
        │
        ▼
Comment form appears
        │
        ▼
User types comment
        │
        ▼
User clicks "Post Comment"
        │
        ▼
handleSubmitComment()
        │
        ├─→ Validate input
        │
        ├─→ Create comment object
        │
        ├─→ addDoc(Firestore)
        │
        ├─→ Optimistic update (add to local state)
        │
        └─→ Close form
        │
        ▼
Comment appears at top of list
```

### Flow 2: Liking a Comment

```
User clicks heart icon
        │
        ▼
handleLikeComment(commentId)
        │
        ├─→ Check if already liked
        │
        ├─→ If liked: Unlike
        │   ├─→ updateDoc(Firestore) - decrement
        │   ├─→ Remove from likedComments set
        │   └─→ Update local comment state
        │
        └─→ If not liked: Like
            ├─→ updateDoc(Firestore) - increment
            ├─→ Add to likedComments set
            └─→ Update local comment state
        │
        ▼
Heart icon updates immediately
Like count updates immediately
```

### Flow 3: Switching Views

```
User clicks view filter button
        │
        ▼
setView('all' | 'comments' | 'signatures')
        │
        ▼
Component re-renders
        │
        ├─→ If 'all': Show getAllItems()
        │   └─→ Mixed comments + signatures with comments
        │
        ├─→ If 'comments': Show comments array
        │   └─→ Apply sort filter
        │
        └─→ If 'signatures': Show signatures array
            └─→ Show pagination
        │
        ▼
Content updates instantly
```

## Database Schema

### Comments Collection

```javascript
{
  id: string,                    // Auto-generated
  petitionId: string,            // Reference to petition
  authorId: string,              // User ID
  authorName: string,            // Display name or "Anonymous"
  content: string,               // Comment text
  createdAt: Timestamp,          // When posted
  isAnonymous: boolean,          // Privacy flag
  likes: number,                 // Like count
  likedBy: string[]              // Array of user IDs who liked
}
```

### Signatures Collection

```javascript
{
  id: string,                    // Auto-generated
  petitionId: string,            // Reference to petition
  userId: string,                // User ID
  signerName: string,            // Display name
  signerPhone: string,           // Verified phone
  signerLocation: {              // Location object
    city: string,
    country: string
  },
  comment: string,               // Optional signature comment
  createdAt: Timestamp,          // When signed
  verifiedAt: Timestamp          // When phone verified
}
```

## Component Props Interface

```typescript
interface PetitionSupportersProps {
  petitionId: string; // Required: Petition ID
  className?: string; // Optional: Additional CSS classes
}

interface Comment {
  id: string;
  petitionId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  isAnonymous: boolean;
  likes: number;
  likedBy?: string[];
}

interface Signature {
  id: string;
  name: string;
  location?: {
    city?: string;
    country?: string;
  };
  comment?: string;
  signedAt: Date;
}
```

## Performance Optimization Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                   Performance Layers                         │
└─────────────────────────────────────────────────────────────┘

Layer 1: Component Lazy Loading
├─→ Next.js dynamic import
├─→ Loads only when tab is clicked
└─→ Reduces initial bundle size

Layer 2: Data Pagination
├─→ Signatures: 20 per page
├─→ Load more on demand
└─→ Reduces initial data transfer

Layer 3: Client-Side Caching
├─→ Comments cached after load
├─→ Sort operations client-side
└─→ Reduces Firestore reads

Layer 4: Optimistic Updates
├─→ UI updates immediately
├─→ Firestore updates in background
└─→ Better perceived performance

Layer 5: Efficient Queries
├─→ Indexed Firestore queries
├─→ Limit and pagination
└─→ Only fetch what's needed
```

## Security Considerations

```
┌─────────────────────────────────────────────────────────────┐
│                   Security Measures                          │
└─────────────────────────────────────────────────────────────┘

Authentication
├─→ User must be logged in to comment
├─→ User must be logged in to like
└─→ Anonymous viewing allowed

Authorization
├─→ Users can only delete own comments
├─→ Admins can moderate all content
└─→ Firestore rules enforce permissions

Data Validation
├─→ Comment length limits
├─→ XSS prevention (React escaping)
├─→ Input sanitization
└─→ Rate limiting (Firestore rules)

Privacy
├─→ Anonymous commenting option
├─→ User data protected
└─→ GDPR compliant
```

## Error Handling Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                   Error Handling                             │
└─────────────────────────────────────────────────────────────┘

Network Errors
├─→ Try-catch blocks
├─→ User-friendly error messages
└─→ Retry mechanisms

Validation Errors
├─→ Form validation
├─→ Disabled submit buttons
└─→ Clear error messages

Loading States
├─→ Skeleton screens
├─→ Loading spinners
└─→ Progress indicators

Empty States
├─→ No data messages
├─→ Call-to-action prompts
└─→ Helpful guidance
```

## Accessibility Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Accessibility Features                     │
└─────────────────────────────────────────────────────────────┘

Keyboard Navigation
├─→ Tab through all interactive elements
├─→ Enter/Space to activate
└─→ Escape to close modals

Screen Reader Support
├─→ Semantic HTML
├─→ ARIA labels
├─→ Alt text for icons
└─→ Status announcements

Visual Accessibility
├─→ High contrast colors
├─→ Focus indicators
├─→ Readable font sizes
└─→ Color-blind friendly
```

## Testing Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Testing Strategy                           │
└─────────────────────────────────────────────────────────────┘

Unit Tests (Future)
├─→ Component rendering
├─→ State management
├─→ Helper functions
└─→ Data transformations

Integration Tests (Future)
├─→ Firestore interactions
├─→ User flows
├─→ Form submissions
└─→ Like functionality

E2E Tests (Future)
├─→ Complete user journeys
├─→ Cross-browser testing
├─→ Mobile testing
└─→ Performance testing

Manual Testing (Current)
├─→ Comprehensive test cases
├─→ Browser compatibility
├─→ Accessibility audit
└─→ User acceptance testing
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Deployment Flow                            │
└─────────────────────────────────────────────────────────────┘

Development
├─→ Local testing
├─→ Code review
└─→ Documentation

Staging
├─→ Deploy to staging
├─→ QA testing
└─→ UAT

Production
├─→ Deploy to production
├─→ Monitoring
├─→ User feedback
└─→ Metrics tracking

Rollback (if needed)
├─→ Revert commit
├─→ Redeploy
└─→ Incident report
```

---

This architecture provides a comprehensive view of how the Supporters Discussion feature is structured, how data flows through the system, and how different components interact with each other.
