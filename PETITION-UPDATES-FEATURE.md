# Petition Updates Feature

## Overview

Added a timeline-based updates system for petitions where creators can post progress updates to keep supporters informed.

## Features

### For Petition Creators

- **Post Updates**: Button to add new updates with title and content
- **Update Form**:
  - Title field (max 100 characters)
  - Content field (max 1000 characters with counter)
  - Submit/Cancel buttons

### For All Users

- **Timeline View**: Updates displayed chronologically with latest at top
- **Timestamp**: Full date and time for each update
- **Author Info**: Shows who posted the update
- **Visual Timeline**: Clean timeline design with dots and connecting lines
- **Empty State**: Helpful message when no updates exist

## Implementation

### Component

- `src/components/petitions/PetitionUpdates.tsx`
  - Fetches updates from Firestore
  - Real-time updates list
  - Form for creators to add updates
  - Timeline UI with proper formatting

### Database

- **Collection**: `petitionUpdates`
- **Fields**:
  - `petitionId`: Reference to petition
  - `title`: Update title
  - `content`: Update content
  - `createdAt`: Timestamp
  - `createdBy`: User ID
  - `createdByName`: Display name

### Firestore Rules

```
match /petitionUpdates/{updateId} {
  allow read: if true;
  allow create: if request.auth != null;
  allow update, delete: if request.auth != null;
}
```

### Firestore Index

```json
{
  "collectionGroup": "petitionUpdates",
  "fields": [
    { "fieldPath": "petitionId", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```

## Usage

The component is integrated into the petition detail page:

```tsx
<PetitionUpdates
  petitionId={petition.id}
  isCreator={user?.uid === petition.creatorId}
/>
```

## UX Benefits

1. **Engagement**: Keeps supporters informed and engaged
2. **Transparency**: Shows petition progress and milestones
3. **Trust**: Builds credibility through regular communication
4. **Motivation**: Encourages more signatures when progress is shared

## Example Use Cases

- "We reached 1,000 signatures! Thank you!"
- "Meeting scheduled with city council next week"
- "Media coverage: Featured in local newspaper"
- "Petition delivered to decision makers"
- "Victory! The policy has been changed"
