# Petition Page Layout Reorganization

## Changes Made

Reorganized the petition detail page (`/petitions/[id]`) to improve the user experience and information hierarchy.

## New Layout Order

### 1. Title + Meta Information

- **Title**: Large, prominent petition title
- **Meta**: Status badge, category, author name, and creation date all in one line
- Example: `[Pending] Culture • By John Doe • 11/12/2025`

### 2. Media (Images Only)

- Petition images displayed prominently below the title
- Full-width display for maximum visual impact
- Note: YouTube videos now appear after the petition description in the "Petition" tab

### 3. Progress Bar + Action Buttons

- **Progress Bar**: Shows current signatures vs goal with percentage
- **Action Buttons**:
  - "Sign This Petition" (primary button)
  - "Share" button
  - "QR Code" button
- All buttons are easily accessible and prominent

### 4. Petition Tabs

- **Petition** tab (default/open by default)
- **Publisher** tab
- **Comments** tab
- **Signees** tab

### 5. Petition Tab Content (Reorganized)

#### Order within "Petition" tab:

1. **Petition Description** (FIRST)

   - "About this petition" heading
   - Full petition text/description

2. **Video** (RIGHT AFTER description)

   - YouTube video embedded if provided
   - Appears immediately after reading the petition text
   - Full-width responsive embed
   - Provides visual context to support the written petition

3. **Publisher Information** (AFTER description and video)

   - Publisher type (Individual/Organization)
   - Publisher name
   - Displayed in blue-themed card

4. **Petition Details** (AFTER publisher info)
   - Petition type (Change/Support/Stop/Start)
   - Addressed to (Government/Company/etc.)
   - Specific target
   - Displayed in purple-themed card

## Benefits

1. **Better Information Hierarchy**: Most important content (description) comes first
2. **Improved Readability**: Meta information consolidated in one line
3. **Visual Flow**: Image → Progress → Actions → Content
4. **Context After Content**: Publisher and petition details provide context after reading the main petition text
5. **Default Tab**: "Petition" tab opens by default, showing the main content immediately

## Files Modified

- `3arida-app/src/app/petitions/[id]/page.tsx`
  - Reorganized title and meta information
  - Moved petition description to top of "Petition" tab
  - Moved Publisher Information and Petition Details blocks after description
  - Maintained all existing functionality

## User Experience Improvements

- Users see the petition story/description first
- Supporting information (publisher, details) provides context after reading
- Clear visual hierarchy guides the eye through the content
- Action buttons are prominent and easy to find
- Default tab shows the most important content immediately
