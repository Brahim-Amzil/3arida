# Firestore Indexes Cleanup Guide

## How to disable unused indexes

1. Go to Firebase Console → Firestore → Indexes
2. Click "Single field" tab
3. Review each index
4. For fields you never query directly (e.g., `description`, `moderationNotes`), click the 3-dot menu → Disable

## Fields safe to disable single-field indexes for:
- `description` (never queried directly)
- `moderationNotes` (never queried directly)
- `mediaUrls` (array, not queried)
- `qrCodeUrl` (never queried)

## Fields to KEEP indexes for:
- `creatorId` (used in dashboard queries)
- `status` (used in admin/petition list queries)
- `createdAt` (used for ordering)
- `category` (used for filtering)
- `isPublic` (used for filtering)
- `userId` (used in notifications/signatures)

## Note
This is a low-priority optimization. Only do this if you see high write costs.
