# Appeals Management System - Design Document

## Overview

The Appeals Management System provides a comprehensive in-app ticketing solution for managing petition moderation appeals. The system replaces email-based communication with a structured, trackable workflow that stores all conversations in Firestore, provides dedicated admin interfaces, and sends clean email notifications without exposing internal admin information to creators.

### Key Design Goals

1. **Centralized Communication**: All appeal conversations stored in Firestore with full audit trails
2. **Clean Separation**: Admin-only information never exposed to petition creators
3. **Professional Workflow**: Status-based appeal management with clear progression
4. **Email Integration**: Notifications sent via email but all data stored in-app
5. **Scalability**: Designed to handle thousands of concurrent appeals efficiently

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
├─────────────────────────────────────────────────────────────┤
│  Creator Dashboard  │  Admin Appeals Dashboard  │  Modals   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Layer                                │
├─────────────────────────────────────────────────────────────┤
│  /api/appeals/create  │  /api/appeals/[id]  │  /api/appeals │
│  /api/appeals/reply   │  /api/appeals/status                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Service Layer                              │
├─────────────────────────────────────────────────────────────┤
│  Appeals Service  │  Email Service  │  Notification Service │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                                 │
├─────────────────────────────────────────────────────────────┤
│  Firestore: appeals collection  │  Email Queue              │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend**: Next.js 14 with React Server Components
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Email**: Resend API (existing email service)
- **Authentication**: Firebase Auth (existing)
- **UI Components**: Existing component library (shadcn/ui)

## Components and Interfaces

### Data Models

#### Appeal Interface

```typescript
export interface Appeal {
  id: string;
  petitionId: string;
  petitionTitle: string;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  status: AppealStatus;
  messages: AppealMessage[];
  statusHistory: StatusChange[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export type AppealStatus = 'pending' | 'in-progress' | 'resolved' | 'rejected';

export interface AppealMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'creator' | 'moderator';
  content: string;
  createdAt: Date;
  isInternal?: boolean; // For moderator-only notes
}

export interface StatusChange {
  status: AppealStatus;
  changedBy: string;
  changedAt: Date;
  reason?: string;
}
```

### API Endpoints

#### POST /api/appeals/create

Creates a new appeal for a paused or rejected petition.

**Request Body:**

```typescript
{
  petitionId: string;
  message: string;
}
```

**Response:**

```typescript
{
  success: boolean;
  appealId: string;
  message: string;
}
```

**Logic:**

1. Validate user is petition creator
2. Validate petition status is 'paused' or 'rejected'
3. Check for existing open appeals for this petition
4. Create appeal document in Firestore
5. Send email notification to moderators
6. Return appeal ID

#### GET /api/appeals

Retrieves appeals list based on user role.

**Query Parameters:**

- `status`: Filter by appeal status
- `page`: Pagination page number
- `limit`: Results per page

**Response:**

```typescript
{
  appeals: Appeal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}
```

**Logic:**

- If creator: Return only their appeals
- If moderator/admin: Return all appeals with filters applied

#### GET /api/appeals/[id]

Retrieves a single appeal with full message thread.

**Response:**

```typescript
{
  appeal: Appeal;
  petition: {
    id: string;
    title: string;
    status: string;
    moderationNotes?: string;
  };
}
```

**Logic:**

1. Validate user has permission to view appeal
2. Fetch appeal with all messages
3. Fetch related petition data
4. Filter out internal moderator notes if user is creator

#### POST /api/appeals/[id]/reply

Adds a message to an appeal thread.

**Request Body:**

```typescript
{
  message: string;
  isInternal?: boolean; // Moderator-only notes
}
```

**Response:**

```typescript
{
  success: boolean;
  messageId: string;
}
```

**Logic:**

1. Validate user has permission to reply
2. Add message to appeal thread
3. Update appeal status if needed (pending → in-progress)
4. Send email notification to other party
5. Update appeal updatedAt timestamp

#### PATCH /api/appeals/[id]/status

Updates appeal status (moderator only).

**Request Body:**

```typescript
{
  status: AppealStatus;
  reason?: string; // Required for 'rejected' status
}
```

**Response:**

```typescript
{
  success: boolean;
  message: string;
}
```

**Logic:**

1. Validate user is moderator/admin
2. Validate status transition is valid
3. Update appeal status
4. Add status change to history
5. Send email notification to creator
6. If resolved, set resolvedAt and resolvedBy

### Frontend Components

#### ContactModeratorModal (Enhanced)

**Location:** `src/components/moderation/ContactModeratorModal.tsx`

**Changes:**

- Replace direct email sending with API call to `/api/appeals/create`
- Show success message with appeal ID
- Link to view appeal in dashboard

#### CreatorAppealsSection

**Location:** `src/components/appeals/CreatorAppealsSection.tsx`

**Purpose:** Display creator's appeals in their dashboard

**Features:**

- List all appeals with status badges
- Click to view full thread
- Reply to open appeals
- Visual indicators for unread moderator replies

#### AppealThreadView

**Location:** `src/components/appeals/AppealThreadView.tsx`

**Purpose:** Display full conversation thread

**Features:**

- Message bubbles with sender identification
- Timestamps
- Status badges
- Reply form (if appeal is open)
- Petition preview card

#### AdminAppealsPage

**Location:** `src/app/admin/appeals/page.tsx`

**Purpose:** Admin dashboard for managing all appeals

**Features:**

- Filterable appeals list (by status)
- Search by petition title or creator name
- Quick status indicators
- Pagination
- Click to view full appeal

#### AdminAppealDetailPage

**Location:** `src/app/admin/appeals/[id]/page.tsx`

**Purpose:** Detailed view of single appeal for moderators

**Features:**

- Full message thread
- Petition details with admin link
- Reply form
- Status update controls
- Internal notes section (moderator-only)
- Action buttons (resolve, reject, reopen)

### Service Layer

#### Appeals Service

**Location:** `src/lib/appeals-service.ts`

**Functions:**

```typescript
// Create new appeal
async function createAppeal(
  petitionId: string,
  creatorId: string,
  message: string
): Promise<string>;

// Get appeals for user
async function getAppealsForUser(
  userId: string,
  role: string,
  filters?: AppealFilters
): Promise<Appeal[]>;

// Get single appeal
async function getAppeal(
  appealId: string,
  userId: string,
  role: string
): Promise<Appeal | null>;

// Add message to appeal
async function addAppealMessage(
  appealId: string,
  senderId: string,
  senderRole: 'creator' | 'moderator',
  message: string,
  isInternal?: boolean
): Promise<string>;

// Update appeal status
async function updateAppealStatus(
  appealId: string,
  status: AppealStatus,
  moderatorId: string,
  reason?: string
): Promise<void>;

// Check for existing open appeals
async function hasOpenAppeal(petitionId: string): Promise<boolean>;
```

#### Email Templates

**Location:** `src/lib/email-templates.ts`

**New Templates:**

```typescript
// For moderators when appeal is created
export function appealCreatedEmail(
  petitionTitle: string,
  creatorName: string,
  message: string,
  appealId: string
): string;

// For creators when moderator replies
export function appealReplyEmail(
  creatorName: string,
  petitionTitle: string,
  moderatorMessage: string,
  appealId: string
): string;

// For creators when status changes
export function appealStatusChangeEmail(
  creatorName: string,
  petitionTitle: string,
  newStatus: AppealStatus,
  reason?: string,
  appealId?: string
): string;

// For moderators when creator replies
export function appealCreatorReplyEmail(
  petitionTitle: string,
  creatorName: string,
  message: string,
  appealId: string
): string;
```

**Key Design Principle:** Creator emails NEVER include:

- Admin panel links
- Internal moderator notes
- System IDs or technical details
- Other creators' information

## Data Models

### Firestore Collections

#### appeals Collection

```
appeals/
  {appealId}/
    id: string
    petitionId: string
    petitionTitle: string
    creatorId: string
    creatorName: string
    creatorEmail: string
    status: 'pending' | 'in-progress' | 'resolved' | 'rejected'
    createdAt: timestamp
    updatedAt: timestamp
    resolvedAt: timestamp | null
    resolvedBy: string | null
    resolutionNotes: string | null

    messages: [
      {
        id: string
        senderId: string
        senderName: string
        senderRole: 'creator' | 'moderator'
        content: string
        createdAt: timestamp
        isInternal: boolean
      }
    ]

    statusHistory: [
      {
        status: string
        changedBy: string
        changedAt: timestamp
        reason: string | null
      }
    ]
```

### Firestore Indexes

Required composite indexes:

1. `appeals` collection: `creatorId` (ASC) + `status` (ASC) + `createdAt` (DESC)
2. `appeals` collection: `status` (ASC) + `createdAt` (DESC)
3. `appeals` collection: `petitionId` (ASC) + `status` (ASC)

### Firestore Security Rules

```javascript
match /appeals/{appealId} {
  // Creators can read their own appeals
  allow read: if request.auth != null &&
    (resource.data.creatorId == request.auth.uid ||
     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['moderator', 'admin']);

  // Creators can create appeals for their own petitions
  allow create: if request.auth != null &&
    request.resource.data.creatorId == request.auth.uid &&
    exists(/databases/$(database)/documents/petitions/$(request.resource.data.petitionId)) &&
    get(/databases/$(database)/documents/petitions/$(request.resource.data.petitionId)).data.creatorId == request.auth.uid;

  // Only moderators/admins can update appeals
  allow update: if request.auth != null &&
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['moderator', 'admin'];

  // No one can delete appeals (audit trail)
  allow delete: if false;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Contact button visibility based on petition status

_For any_ petition, the "Contact Moderator" button should be displayed if and only if the petition status is 'paused' or 'rejected'
**Validates: Requirements 1.1**

### Property 2: Empty appeal messages are rejected

_For any_ appeal submission attempt, if the message is empty or contains only whitespace, the system should reject the submission
**Validates: Requirements 1.3**

### Property 3: New appeals have pending status

_For any_ successfully created appeal, the appeal status should be 'pending' immediately after creation
**Validates: Requirements 1.4**

### Property 4: Moderator emails exclude admin links

_For any_ email sent to moderators about a new appeal, the email content should not contain any admin panel URLs or internal system links
**Validates: Requirements 1.5**

### Property 5: Appeal filtering returns correct results

_For any_ status filter applied to the appeals list, all returned appeals should have that exact status
**Validates: Requirements 2.1, 2.5**

### Property 6: Appeal list items contain required fields

_For any_ appeal displayed in the appeals list, the rendered output should contain appeal ID, petition title, creator name, status, and submission date
**Validates: Requirements 2.2**

### Property 7: Moderator replies are stored in thread

_For any_ moderator reply submitted to an appeal, the message should appear in the appeal's messages array with correct sender information
**Validates: Requirements 3.2**

### Property 8: Creator emails exclude admin content

_For any_ email sent to a petition creator, the email content should not contain admin panel links, internal notes, or system IDs
**Validates: Requirements 3.3, 3.5**

### Property 9: Pending appeals transition to in-progress on first reply

_For any_ appeal with status 'pending', when a moderator adds the first reply, the appeal status should change to 'in-progress'
**Validates: Requirements 3.4**

### Property 10: Creators only see their own appeals

_For any_ creator user querying appeals, all returned appeals should have creatorId matching the user's ID
**Validates: Requirements 4.1, 7.2**

### Property 11: Appeal messages include required metadata

_For any_ message in an appeal thread, the message should have senderId, senderName, senderRole, content, and createdAt timestamp
**Validates: Requirements 4.3, 6.2**

### Property 12: Creator emails protect privacy

_For any_ email sent to moderators when a creator replies, the email should not expose the creator's email address
**Validates: Requirements 4.5**

### Property 13: Status change to rejected requires reason

_For any_ attempt to change an appeal status to 'rejected', the operation should fail if no reason is provided
**Validates: Requirements 5.3**

### Property 14: Resolved appeals reject new replies

_For any_ appeal with status 'resolved', attempts to add new non-moderator messages should be rejected
**Validates: Requirements 5.4**

### Property 15: Status changes are logged in audit trail

_For any_ appeal status change, a new entry should be added to statusHistory with the new status, moderator ID, and timestamp
**Validates: Requirements 5.5, 6.3**

### Property 16: New appeals have required fields

_For any_ created appeal, the appeal document should contain creatorId, petitionId, and createdAt timestamp
**Validates: Requirements 6.1**

### Property 17: Status history is chronologically ordered

_For any_ appeal with multiple status changes, the statusHistory array should be sorted by timestamp in ascending order
**Validates: Requirements 6.4**

### Property 18: Appeal exports are complete

_For any_ appeal export operation, the exported data should include all messages, all status history entries, and all metadata fields
**Validates: Requirements 6.5**

### Property 19: Moderators see all appeals

_For any_ moderator or admin user querying appeals, the results should include appeals from all creators (not filtered by creatorId)
**Validates: Requirements 7.3**

### Property 20: Unauthorized writes are rejected

_For any_ attempt to write to the appeals collection by a non-authenticated user or a user without proper permissions, the operation should be rejected by Firestore security rules
**Validates: Requirements 7.4**

### Property 21: Role-based read access is enforced

_For any_ attempt to read an appeal, the operation should succeed only if the user is the creator of that appeal or has moderator/admin role
**Validates: Requirements 7.5**

### Property 22: Status change emails are sent

_For any_ appeal status change, an email notification should be sent to the creator with the new status information
**Validates: Requirements 5.2, 8.2**

### Property 23: Creator reply emails notify moderators

_For any_ message added by a creator to an appeal thread, an email notification should be sent to moderators
**Validates: Requirements 8.4**

### Property 24: Appeal emails contain app links

_For any_ email sent about an appeal (to creator or moderator), the email should contain a link to view the full appeal thread in the application
**Validates: Requirements 8.5**

## Error Handling

### Client-Side Validation

1. **Form Validation**

   - Empty message validation before submission
   - Character limits (e.g., 5000 characters for appeal messages)
   - Real-time validation feedback

2. **Permission Checks**

   - Verify user is petition creator before showing appeal form
   - Verify user is moderator before showing admin controls
   - Graceful degradation if permissions change during session

3. **Network Error Handling**
   - Retry logic for failed API calls
   - Offline detection and user notification
   - Optimistic UI updates with rollback on failure

### Server-Side Error Handling

1. **Authentication Errors**

   - Return 401 for unauthenticated requests
   - Return 403 for unauthorized actions
   - Log security violations for audit

2. **Validation Errors**

   - Return 400 with detailed error messages
   - Validate all inputs before database operations
   - Sanitize user input to prevent injection attacks

3. **Database Errors**

   - Retry transient Firestore errors
   - Log all database errors with context
   - Return 500 with generic message (don't expose internals)

4. **Email Errors**
   - Queue failed emails for retry
   - Log email failures but don't block appeal creation
   - Notify admins of persistent email failures

### Error Recovery

1. **Appeal Creation Failures**

   - If Firestore write succeeds but email fails: Log error, appeal still created
   - If Firestore write fails: Return error, no appeal created
   - Provide clear error messages to users

2. **Message Delivery Failures**

   - Store message even if email fails
   - Retry email delivery up to 3 times
   - Mark email as failed after retries exhausted

3. **Status Update Failures**
   - Use Firestore transactions for atomic updates
   - Rollback on any failure in the update chain
   - Notify moderator of failure with retry option

## Testing Strategy

### Unit Testing

The testing strategy follows a dual approach with both unit tests and property-based tests:

**Unit Tests** verify specific examples and edge cases:

- Appeal creation with valid data
- Appeal creation with invalid data (empty message, non-existent petition)
- Status transitions (pending → in-progress → resolved)
- Permission checks (creator vs moderator access)
- Email template rendering
- Firestore security rules validation

**Property-Based Tests** verify universal properties across all inputs:

- All properties listed in the Correctness Properties section will be implemented as property-based tests
- Each test will use fast-check library (for TypeScript/JavaScript)
- Tests will run a minimum of 100 iterations with random data
- Each property test will be tagged with the format: `**Feature: appeals-system, Property {number}: {property_text}**`

### Integration Testing

1. **API Endpoint Tests**

   - Test all API routes with various inputs
   - Test authentication and authorization
   - Test error responses

2. **Firestore Integration**

   - Test CRUD operations on appeals collection
   - Test security rules enforcement
   - Test query performance with large datasets

3. **Email Integration**
   - Test email sending with mock SMTP
   - Verify email content and formatting
   - Test email queue processing

### End-to-End Testing

1. **Creator Flow**

   - Create appeal from paused petition
   - View appeal in dashboard
   - Reply to moderator message
   - Receive email notifications

2. **Moderator Flow**

   - View appeals dashboard
   - Filter appeals by status
   - Reply to appeal
   - Update appeal status
   - Verify email notifications sent

3. **Complete Appeal Lifecycle**
   - Create appeal → Moderator replies → Creator responds → Status resolved
   - Verify all data stored correctly
   - Verify all emails sent correctly
   - Verify audit trail complete

### Property-Based Testing Configuration

- **Library**: fast-check (JavaScript/TypeScript property testing library)
- **Minimum Iterations**: 100 per property test
- **Test Tagging**: Each property-based test must include a comment with the format:
  ```typescript
  // **Feature: appeals-system, Property 1: Contact button visibility based on petition status**
  ```
- **Coverage Goal**: All 24 correctness properties must have corresponding property-based tests

### Test Data Generation

For property-based tests, we'll need generators for:

- Random appeals with various statuses
- Random messages with different senders
- Random petition data
- Random user profiles (creators, moderators, admins)
- Random timestamps and date ranges
- Random email addresses and names

## Performance Considerations

### Database Optimization

1. **Indexing Strategy**

   - Composite indexes for common queries (status + createdAt, creatorId + status)
   - Single-field indexes on frequently filtered fields
   - Monitor index usage and adjust as needed

2. **Query Optimization**

   - Limit query results (pagination)
   - Use cursors for large result sets
   - Cache frequently accessed appeals

3. **Write Optimization**
   - Batch writes when possible
   - Use transactions for atomic updates
   - Minimize document size (avoid large arrays)

### Caching Strategy

1. **Client-Side Caching**

   - Cache appeal lists in React state
   - Invalidate cache on mutations
   - Use SWR or React Query for data fetching

2. **Server-Side Caching**
   - Cache petition data (rarely changes)
   - Cache user profiles
   - Use Redis for session data if needed

### Scalability

1. **Horizontal Scaling**

   - Stateless API design allows multiple instances
   - Firestore handles scaling automatically
   - Email queue can be distributed

2. **Rate Limiting**

   - Limit appeal creation (e.g., 5 per hour per user)
   - Limit message sending (e.g., 10 per hour per appeal)
   - Prevent spam and abuse

3. **Monitoring**
   - Track appeal creation rate
   - Monitor email delivery success rate
   - Alert on error rate spikes
   - Track response times for all API endpoints

## Security Considerations

### Authentication & Authorization

1. **Firebase Auth Integration**

   - All API routes require authentication
   - Role-based access control (creator, moderator, admin)
   - Token validation on every request

2. **Firestore Security Rules**
   - Enforce read/write permissions at database level
   - Validate data structure on writes
   - Prevent unauthorized access to appeals

### Data Privacy

1. **PII Protection**

   - Never expose creator email to other creators
   - Filter admin-only information from creator views
   - Encrypt sensitive data at rest (Firestore default)

2. **Email Security**
   - Sanitize email content to prevent XSS
   - Use secure email templates
   - Validate email addresses before sending

### Input Validation

1. **Server-Side Validation**

   - Validate all inputs before processing
   - Sanitize user-generated content
   - Prevent SQL/NoSQL injection

2. **Rate Limiting**
   - Prevent abuse through excessive appeals
   - Throttle API requests per user
   - Block suspicious activity patterns

## Deployment Strategy

### Phase 1: Database Setup

1. Create appeals collection in Firestore
2. Deploy security rules
3. Create required indexes
4. Test with sample data

### Phase 2: Backend Implementation

1. Implement appeals service
2. Create API routes
3. Add email templates
4. Deploy to staging environment

### Phase 3: Frontend Implementation

1. Update ContactModeratorModal
2. Create creator appeals section
3. Build admin appeals dashboard
4. Deploy to staging environment

### Phase 4: Testing & QA

1. Run all unit tests
2. Run property-based tests
3. Perform integration testing
4. Conduct end-to-end testing
5. User acceptance testing

### Phase 5: Production Deployment

1. Deploy backend to production
2. Deploy frontend to production
3. Monitor for errors
4. Gradual rollout to users

### Rollback Plan

If critical issues are discovered:

1. Revert frontend changes (hide appeal features)
2. Keep backend running (don't break existing appeals)
3. Fix issues in staging
4. Redeploy when stable

## Future Enhancements

### Phase 2 Features (Post-MVP)

1. **Appeal Analytics**

   - Track average response time
   - Monitor resolution rates
   - Identify common appeal reasons

2. **Bulk Operations**

   - Bulk status updates
   - Bulk email sending
   - Export multiple appeals

3. **Advanced Filtering**

   - Filter by date range
   - Filter by moderator
   - Full-text search in messages

4. **Notifications**

   - In-app notifications for new messages
   - Push notifications for mobile
   - SMS notifications (optional)

5. **Appeal Templates**

   - Pre-written response templates for moderators
   - Common rejection reasons
   - Quick reply options

6. **Escalation System**
   - Escalate unresolved appeals after X days
   - Assign appeals to specific moderators
   - Priority levels for urgent appeals
