# Requirements Document

## Introduction

The Appeals Management System is an in-app ticketing system that allows petition creators to appeal moderation decisions (paused or rejected petitions) directly through the platform. The system stores all communications in Firestore, provides a dedicated admin interface for managing appeals, and sends email notifications while maintaining full conversation history and audit trails.

## Glossary

- **Appeal**: A formal request from a petition creator to review a moderation decision
- **Petition Creator**: The user who created a petition that has been paused or rejected
- **Moderator**: An admin user with permissions to review and respond to appeals
- **Appeal Status**: The current state of an appeal (pending, in-progress, resolved, rejected)
- **Appeal Thread**: The complete conversation history between creator and moderator for a specific appeal

## Requirements

### Requirement 1

**User Story:** As a petition creator, I want to submit an appeal when my petition is paused or rejected, so that I can request a review of the moderation decision.

#### Acceptance Criteria

1. WHEN a petition status is paused or rejected THEN the system SHALL display a "Contact Moderator" button on the petition page
2. WHEN a creator clicks "Contact Moderator" THEN the system SHALL display a modal with petition preview and appeal form
3. WHEN submitting an appeal THEN the system SHALL require a message explaining the appeal reason
4. WHEN an appeal is submitted THEN the system SHALL store the appeal in Firestore with status "pending"
5. WHEN an appeal is created THEN the system SHALL send an email notification to moderators without including admin-only links

### Requirement 2

**User Story:** As a moderator, I want to view all appeals in a dedicated admin interface, so that I can efficiently manage and respond to creator requests.

#### Acceptance Criteria

1. WHEN a moderator accesses the appeals dashboard THEN the system SHALL display all appeals with filtering by status
2. WHEN viewing appeals list THEN the system SHALL show appeal ID, petition title, creator name, status, and submission date
3. WHEN a moderator clicks an appeal THEN the system SHALL display the full appeal thread with petition details
4. WHEN viewing an appeal THEN the system SHALL provide a direct link to the petition admin page
5. WHEN filtering appeals THEN the system SHALL support filtering by pending, in-progress, resolved, and rejected statuses

### Requirement 3

**User Story:** As a moderator, I want to respond to appeals directly from the admin panel, so that I can communicate with creators without using email.

#### Acceptance Criteria

1. WHEN a moderator views an appeal THEN the system SHALL display a reply form at the bottom of the thread
2. WHEN a moderator submits a reply THEN the system SHALL store the message in the appeal thread
3. WHEN a moderator replies THEN the system SHALL send an email notification to the creator with the message content only
4. WHEN a moderator replies THEN the system SHALL update the appeal status to "in-progress" if currently pending
5. WHEN sending email notifications THEN the system SHALL exclude admin links and internal information from creator emails

### Requirement 4

**User Story:** As a petition creator, I want to view my appeal history and respond to moderator messages, so that I can continue the conversation until my issue is resolved.

#### Acceptance Criteria

1. WHEN a creator accesses their dashboard THEN the system SHALL display a section showing all their appeals
2. WHEN a creator clicks an appeal THEN the system SHALL display the full conversation thread
3. WHEN viewing an appeal thread THEN the system SHALL show all messages with timestamps and sender identification
4. WHEN a moderator has replied THEN the system SHALL allow the creator to respond with additional information
5. WHEN a creator responds THEN the system SHALL notify moderators via email without exposing creator email addresses

### Requirement 5

**User Story:** As a moderator, I want to update appeal status and close resolved appeals, so that I can maintain an organized appeals queue.

#### Acceptance Criteria

1. WHEN viewing an appeal THEN the system SHALL provide status update controls
2. WHEN a moderator changes status to "resolved" THEN the system SHALL notify the creator via email
3. WHEN a moderator changes status to "rejected" THEN the system SHALL require a rejection reason
4. WHEN an appeal is resolved THEN the system SHALL prevent further replies unless reopened
5. WHEN an appeal status changes THEN the system SHALL log the change with timestamp and moderator ID

### Requirement 6

**User Story:** As a platform administrator, I want comprehensive audit trails for all appeals, so that I can track moderation quality and resolve disputes.

#### Acceptance Criteria

1. WHEN an appeal is created THEN the system SHALL record creator ID, petition ID, and submission timestamp
2. WHEN messages are added THEN the system SHALL record sender ID, message content, and timestamp
3. WHEN status changes occur THEN the system SHALL record the change, moderator ID, and timestamp
4. WHEN viewing appeal history THEN the system SHALL display all actions in chronological order
5. WHEN exporting appeal data THEN the system SHALL include complete conversation history and metadata

### Requirement 7

**User Story:** As a system administrator, I want appeals data properly secured in Firestore, so that only authorized users can access sensitive appeal information.

#### Acceptance Criteria

1. WHEN storing appeals THEN the system SHALL use a dedicated "appeals" collection in Firestore
2. WHEN a creator accesses appeals THEN the system SHALL only show appeals they created
3. WHEN a moderator accesses appeals THEN the system SHALL show all appeals based on their permissions
4. WHEN writing to appeals collection THEN the system SHALL validate user permissions through Firestore security rules
5. WHEN reading appeal data THEN the system SHALL enforce role-based access control

### Requirement 8

**User Story:** As a petition creator, I want to receive email notifications about appeal updates, so that I stay informed without constantly checking the platform.

#### Acceptance Criteria

1. WHEN a moderator replies to an appeal THEN the system SHALL send an email to the creator with the message content
2. WHEN an appeal status changes THEN the system SHALL send an email notification to the creator
3. WHEN sending creator emails THEN the system SHALL use clean, professional formatting without admin-specific content
4. WHEN a creator replies THEN the system SHALL send an email notification to moderators
5. WHEN sending emails THEN the system SHALL include a link to view the full appeal thread in the app
