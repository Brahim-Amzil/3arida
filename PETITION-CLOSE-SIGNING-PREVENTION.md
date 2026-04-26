# Petition Close - Signing Prevention Implementation

## Date: February 9, 2026

## Issue Reported

User closed a petition but:

1. ❌ Petition still accepted signatures
2. ❌ No message shown that petition is closed

## Fix Implemented

### 1. Frontend - Petition Detail Page ✅

**File**: `src/app/petitions/[id]/page.tsx`

#### Added Closed Petition Alert

- Blue alert box appears above sign button when `petition.closedByCreator === true`
- Shows "العريضة مغلقة" (Petition Closed) message
- Displays closing message if creator provided one
- Uses Archive icon for visual consistency

#### Updated Sign Button

- Added `petition.closedByCreator` to disabled condition
- Button shows "العريضة مغلقة" text when closed
- Archive icon displayed on button when closed
- Button is disabled (cannot be clicked)

### 2. Backend - Sign Petition Validation ✅

**File**: `src/lib/petitions.ts`

#### Added Closed Petition Check

- Validates `petition.closedByCreator` before allowing signature
- Throws error: "This petition has been closed by its creator and is no longer accepting signatures"
- Check happens after status validation, before signature count check
- Prevents any backend signing attempts on closed petitions

## Changes Made

### Frontend Changes

```typescript
// Added closed petition alert
{petition.closedByCreator && (
  <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
    // Alert content with closing message
  </div>
)}

// Updated sign button disabled condition
disabled={
  petition.status !== 'approved' ||
  petition.closedByCreator ||  // NEW
  signingLoading ||
  hasUserSigned
}

// Updated button text for closed state
petition.closedByCreator ? (
  <>
    <Archive className="w-5 h-5 mr-2 inline" />
    العريضة مغلقة
  </>
) : (
  t('petition.signPetition')
)
```

### Backend Changes

```typescript
// Added validation in signPetition function
if (petition.closedByCreator) {
  throw new Error(
    'This petition has been closed by its creator and is no longer accepting signatures',
  );
}
```

## User Experience

### Before Closing

- Sign button enabled and green
- Shows "وقع على العريضة" (Sign Petition)
- Clicking signs the petition

### After Closing

- Blue alert appears: "العريضة مغلقة"
- Shows closing message if provided
- Sign button disabled and grayed out
- Button shows "العريضة مغلقة" with Archive icon
- Clicking does nothing (disabled)
- Backend rejects any signing attempts

## Testing Checklist

### Frontend Tests

- [x] Closed alert appears when petition is closed
- [x] Closing message displays if provided
- [x] Sign button is disabled
- [x] Sign button shows "العريضة مغلقة" text
- [x] Archive icon appears on button
- [x] Button cannot be clicked

### Backend Tests

- [x] Signing attempt throws error
- [x] Error message is clear
- [x] No signature created in database
- [x] Petition signature count unchanged

### Edge Cases

- [x] Works for logged-in users
- [x] Works for non-logged-in users
- [x] Works with existing signatures
- [x] Works with no signatures
- [x] Works with closing message
- [x] Works without closing message

## Files Modified

1. `src/app/petitions/[id]/page.tsx` - Added alert and button updates
2. `src/lib/petitions.ts` - Added backend validation

## Visual Design

### Closed Alert

- **Background**: Blue (bg-blue-50)
- **Border**: Left border, blue (border-blue-500)
- **Icon**: Archive icon, blue
- **Text**: Blue shades (text-blue-800, text-blue-700)
- **Message Box**: Lighter blue background (bg-blue-100)

### Sign Button (Closed State)

- **State**: Disabled
- **Text**: "العريضة مغلقة"
- **Icon**: Archive icon
- **Style**: Grayed out (default disabled style)

## Next Steps

1. ✅ Test closing a petition
2. ✅ Verify alert appears
3. ✅ Verify button is disabled
4. ✅ Try to sign (should fail)
5. ⏳ Add closed badge to petition cards (future)
6. ⏳ Add translation keys (future)

## Notes

- Alert uses same styling as rejected/paused alerts for consistency
- Backend validation ensures security even if frontend is bypassed
- Closing message is optional and only shown if provided
- Archive icon used throughout for "close" action consistency
