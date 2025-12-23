# Implementation Plan - Appeals Management System

## Overview

This implementation plan converts the appeals system design into actionable coding tasks. Each task builds incrementally on previous work, with property-based tests integrated throughout to catch bugs early.

---

- [x] 1. Set up project foundation and data models

  - Install fast-check library for property-based testing
  - Create TypeScript interfaces for Appeal, AppealMessage, and StatusChange
  - Define AppealStatus type and AppealFilters interface
  - Set up test utilities and generators for property-based testing
  - _Requirements: 6.1, 6.2, 6.3_

- [ ]\* 1.1 Write property test for appeal data model

  - **Property 16: New appeals have required fields**
  - **Validates: Requirements 6.1**

- [x] 2. Implement Firestore security rules and indexes

  - [x] 2.1 Add appeals collection security rules to firestore.rules

    - Implement read rules (creators see own appeals, moderators see all)
    - Implement create rules (creators can create for their petitions)
    - Implement update rules (only moderators/admins)
    - Prevent delete operations (audit trail preservation)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ]\* 2.2 Write property test for security rules

    - **Property 20: Unauthorized writes are rejected**
    - **Property 21: Role-based read access is enforced**
    - **Validates: Requirements 7.4, 7.5**

  - [x] 2.3 Add composite indexes to firestore.indexes.json
    - Add index for creatorId + status + createdAt
    - Add index for status + createdAt
    - Add index for petitionId + status
    - _Requirements: 7.1_

- [x] 3. Create appeals service layer

  - [x] 3.1 Implement core appeals service functions

    - Write createAppeal function with validation
    - Write getAppealsForUser with role-based filtering
    - Write getAppeal with permission checks
    - Write addAppealMessage with status updates
    - Write updateAppealStatus with validation
    - Write hasOpenAppeal check function
    - _Requirements: 1.4, 2.1, 3.2, 4.1, 5.1, 5.5_

  - [ ]\* 3.2 Write property test for appeal creation

    - **Property 2: Empty appeal messages are rejected**
    - **Property 3: New appeals have pending status**
    - **Validates: Requirements 1.3, 1.4**

  - [ ]\* 3.3 Write property test for creator filtering

    - **Property 10: Creators only see their own appeals**
    - **Validates: Requirements 4.1, 7.2**

  - [ ]\* 3.4 Write property test for moderator access

    - **Property 19: Moderators see all appeals**
    - **Validates: Requirements 7.3**

  - [ ]\* 3.5 Write property test for status transitions
    - **Property 9: Pending appeals transition to in-progress on first reply**
    - **Property 13: Status change to rejected requires reason**
    - **Property 14: Resolved appeals reject new replies**
    - **Validates: Requirements 3.4, 5.3, 5.4**

- [x] 4. Build email templates for appeals

  - [x] 4.1 Create appeal email template functions

    - Write appealCreatedEmail template (for moderators)
    - Write appealReplyEmail template (for creators)
    - Write appealStatusChangeEmail template (for creators)
    - Write appealCreatorReplyEmail template (for moderators)
    - Ensure all templates exclude admin-only information
    - _Requirements: 1.5, 3.3, 3.5, 4.5, 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]\* 4.2 Write property test for email privacy
    - **Property 4: Moderator emails exclude admin links**
    - **Property 8: Creator emails exclude admin content**
    - **Property 12: Creator emails protect privacy**
    - **Property 24: Appeal emails contain app links**
    - **Validates: Requirements 1.5, 3.3, 3.5, 4.5, 8.5**

- [x] 5. Implement API endpoints

  - [x] 5.1 Create POST /api/appeals/create endpoint

    - Validate user is petition creator
    - Validate petition status is paused or rejected
    - Check for existing open appeals
    - Create appeal in Firestore
    - Send email notification to moderators
    - Return appeal ID
    - _Requirements: 1.1, 1.3, 1.4, 1.5_

  - [x] 5.2 Create GET /api/appeals endpoint

    - Implement role-based filtering (creator vs moderator)
    - Add status filtering
    - Add pagination support
    - Return appeals list with metadata
    - _Requirements: 2.1, 2.5, 4.1_

  - [ ]\* 5.3 Write property test for appeals filtering

    - **Property 5: Appeal filtering returns correct results**
    - **Validates: Requirements 2.1, 2.5**

  - [x] 5.4 Create GET /api/appeals/[id] endpoint

    - Validate user has permission to view appeal
    - Fetch appeal with all messages
    - Fetch related petition data
    - Filter internal moderator notes for creators
    - _Requirements: 4.2, 4.3_

  - [x] 5.5 Create POST /api/appeals/[id]/reply endpoint

    - Validate user has permission to reply
    - Add message to appeal thread
    - Update appeal status if needed (pending → in-progress)
    - Send email notification to other party
    - Update appeal updatedAt timestamp
    - _Requirements: 3.1, 3.2, 3.4, 4.4, 8.1, 8.4_

  - [ ]\* 5.6 Write property test for message storage

    - **Property 7: Moderator replies are stored in thread**
    - **Property 11: Appeal messages include required metadata**
    - **Validates: Requirements 3.2, 4.3, 6.2**

  - [x] 5.7 Create PATCH /api/appeals/[id]/status endpoint

    - Validate user is moderator/admin
    - Validate status transition is valid
    - Update appeal status
    - Add status change to history
    - Send email notification to creator
    - Set resolvedAt and resolvedBy if resolved
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [ ]\* 5.8 Write property test for status changes
    - **Property 15: Status changes are logged in audit trail**
    - **Property 17: Status history is chronologically ordered**
    - **Property 22: Status change emails are sent**
    - **Validates: Requirements 5.2, 5.5, 6.3, 6.4, 8.2**

- [x] 6. Update ContactModeratorModal component

  - [x] 6.1 Refactor modal to use appeals API

    - Replace direct email sending with /api/appeals/create call
    - Update success message to show appeal ID
    - Add link to view appeal in dashboard
    - Keep existing petition preview and validation
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ]\* 6.2 Write property test for button visibility
    - **Property 1: Contact button visibility based on petition status**
    - **Validates: Requirements 1.1**

- [x] 7. Build creator appeals interface

  - [x] 7.1 Create CreatorAppealsSection component

    - Display list of creator's appeals with status badges
    - Show unread indicator for new moderator replies
    - Add click handler to view full thread
    - Implement loading and error states
    - _Requirements: 4.1, 4.2_

  - [ ]\* 7.2 Write property test for appeals list display

    - **Property 6: Appeal list items contain required fields**
    - **Validates: Requirements 2.2**

  - [x] 7.2 Create AppealThreadView component

    - Display full conversation thread with message bubbles
    - Show sender identification and timestamps
    - Add status badges
    - Include petition preview card
    - Add reply form for open appeals
    - _Requirements: 4.2, 4.3, 4.4_

  - [x] 7.3 Integrate appeals section into creator dashboard
    - Add appeals section to /dashboard page
    - Show appeals count badge
    - Link to full appeals view
    - _Requirements: 4.1_

- [x] 8. Build admin appeals dashboard

  - [x] 8.1 Create admin appeals list page at /admin/appeals

    - Display all appeals with filtering by status
    - Add search by petition title or creator name
    - Implement pagination
    - Show quick status indicators
    - Add click handler to view appeal details
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 8.2 Create admin appeal detail page at /admin/appeals/[id]

    - Display full message thread
    - Show petition details with admin link
    - Add reply form for moderators
    - Add status update controls
    - Include internal notes section (moderator-only)
    - Add action buttons (resolve, reject, reopen)
    - _Requirements: 2.3, 2.4, 3.1, 3.2, 5.1_

  - [x] 8.3 Update AdminNav to include appeals link
    - Add "Appeals" navigation item
    - Show unread appeals count badge
    - _Requirements: 2.1_

- [x] 9. Implement email notification system

  - [x] 9.1 Integrate appeal emails with existing email service

    - Add appeal email templates to email-notifications.ts
    - Create sendAppealCreatedEmail function
    - Create sendAppealReplyEmail function
    - Create sendAppealStatusChangeEmail function
    - Use existing email queue if enabled
    - _Requirements: 1.5, 3.3, 4.5, 8.1, 8.2, 8.4_

  - [ ]\* 9.2 Write property test for email notifications
    - **Property 23: Creator reply emails notify moderators**
    - **Validates: Requirements 8.4**

- [x] 10. Add audit trail and export functionality

  - [x] 10.1 Implement appeal export function

    - Create exportAppealData function
    - Include all messages, status history, and metadata
    - Support JSON and CSV formats
    - _Requirements: 6.5_

  - [ ]\* 10.2 Write property test for export completeness
    - **Property 18: Appeal exports are complete**
    - **Validates: Requirements 6.5**

- [x] 11. Checkpoint - Ensure all tests pass

  - Run all unit tests
  - Run all property-based tests (minimum 100 iterations each)
  - Fix any failing tests
  - Verify API endpoints work correctly
  - Test email notifications
  - Ensure all tests pass, ask the user if questions arise.

- [ ]\* 12. Write integration tests for complete appeal lifecycle

  - Test creator creates appeal → moderator replies → creator responds → status resolved
  - Verify all data stored correctly in Firestore
  - Verify all emails sent correctly
  - Verify audit trail is complete
  - Test error handling and edge cases
  - _Requirements: All_

- [ ] 13. Final testing and deployment preparation

  - [x] 13.1 Deploy Firestore security rules and indexes

    - Deploy rules to production
    - Create indexes in production
    - Verify rules work correctly
    - _Requirements: 7.1, 7.4, 7.5_

  - [x] 13.2 Test in staging environment

    - Create test appeals
    - Test moderator workflow
    - Test creator workflow
    - Verify email delivery
    - Test on mobile devices
    - _Requirements: All_

  - [x] 13.3 Monitor and verify production deployment
    - Deploy to production
    - Monitor error logs
    - Track appeal creation rate
    - Monitor email delivery success rate
    - Verify performance metrics
    - _Requirements: All_
