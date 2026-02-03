# Edit Photos Button Translation Fix

## Issue

The "Edit Photos" button on the review page (Step 6) was showing the translation key `review.editPhotos` instead of the actual translated text.

## Root Cause

The translation keys `review.editPhotos` were missing from the `useTranslation.ts` file. Although they appeared to be present when reading the file, they were not actually saved to disk.

## Solution

Added the missing translation keys to both Arabic and French sections:

### Arabic (Line 971)

```typescript
'review.editPhotos': 'انقر هنا لتعديل الصور',
```

### French (Line 2538)

```typescript
'review.editPhotos': 'Cliquez ici pour modifier les photos',
```

## Button Behavior

The red "Edit Photos" button appears on the review page when:

- User has uploaded more than 1 image
- User has selected the FREE tier (0-2,500 signatures)

When clicked, it navigates back to Step 3 (Media step) to allow the user to remove extra images.

## Files Modified

- `src/hooks/useTranslation.ts` - Added missing translation keys

## Testing

1. Create a petition with multiple images
2. Select FREE tier (0-2,500 signatures)
3. Navigate to review page (Step 6)
4. Verify button shows:
   - Arabic: "انقر هنا لتعديل الصور"
   - French: "Cliquez ici pour modifier les photos"
5. Click button and verify it navigates to Step 3

## Status

✅ Complete - Translation keys added and verified
