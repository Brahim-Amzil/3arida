# Admin Header Background

## Issue

When in admin or moderator mode, the header should have a light red background across the full window width to visually indicate the user is in an administrative area.

## Solution

Added conditional background styling to the Header component that detects when the user is in admin/moderator areas and applies a light red background.

### Changes Made

1. **Added usePathname import** (line 5)

   ```typescript
   import { useRouter, usePathname } from 'next/navigation';
   ```

2. **Added pathname detection** (line 164)

   ```typescript
   const pathname = usePathname();
   ```

3. **Added admin area detection logic** (lines 166-167)

   ```typescript
   const isAdminArea =
     pathname?.startsWith('/admin') || pathname?.startsWith('/moderator');
   ```

4. **Updated header background styling** (lines 189 & 261)
   ```typescript
   className={`shadow-sm border-b ${isAdminArea ? 'bg-red-50' : 'bg-white'}`}
   ```

## Implementation Details

### Admin Area Detection

The component checks if the current pathname starts with:

- `/admin` - Admin dashboard and all admin pages
- `/moderator` - Moderator pages

### Background Colors

- **Normal mode**: `bg-white` (white background)
- **Admin mode**: `bg-red-50` (light red background)

The `bg-red-50` is a very light red/pink color from Tailwind CSS that provides a subtle visual indicator without being too distracting.

### Full Width

The background is applied to the `<header>` element which spans the full window width, providing a clear visual distinction when in admin mode.

## Visual Result

**Normal Mode:**

- White background header
- Standard appearance

**Admin/Moderator Mode:**

- Light red/pink background header
- Spans full window width
- Provides clear visual feedback that user is in administrative area

## Files Modified

- `src/components/layout/Header.tsx`

## Testing

- [x] Header shows white background on normal pages
- [x] Header shows light red background on `/admin` pages
- [x] Header shows light red background on `/moderator` pages
- [x] Background spans full window width
- [x] No TypeScript errors
- [x] Works with both loading and mounted states

## Status

✅ **COMPLETE** - Ready for use
