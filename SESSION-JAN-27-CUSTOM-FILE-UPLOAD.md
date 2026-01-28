# Custom File Upload Button Implementation

**Date:** January 27, 2026  
**Status:** ✅ Complete

## Overview

Implemented a custom file upload button for the petition creation form to replace the browser's native file input, allowing for full translation control and better UX.

## Problem

The native browser file input shows text like "No file chosen" / "Choose File" which cannot be translated as it's controlled by the browser.

## Solution

Created a custom file upload button with:

- Hidden native `<input type="file">` element
- Custom `<label>` styled as a button with green dashed border
- Image icon (📷) for visual clarity
- Fully translated button text that changes based on state

## Implementation Details

### 1. Custom Button Design

```tsx
<input
  type="file"
  id="petition-image-upload"
  accept="image/*"
  onChange={handleImageUpload}
  disabled={uploadingImage}
  className="hidden"
/>
<label
  htmlFor="petition-image-upload"
  className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors border-green-500 bg-green-50 hover:bg-green-100"
>
  <svg className="w-5 h-5 ml-2 text-green-600">
    {/* Image icon */}
  </svg>
  <span className="text-sm font-medium text-green-700">
    {formData.mediaUrls && formData.mediaUrls.length > 0
      ? t('form.changeFile')
      : t('form.chooseFile')}
  </span>
</label>
```

### 2. Translation Keys Added

#### Arabic (ar)

```typescript
'form.chooseFile': 'اختر ملف',
'form.noFileChosen': 'لم يتم اختيار ملف',
'form.changeFile': 'تغيير الملف',
```

#### French (fr)

```typescript
'form.chooseFile': 'Choisir un fichier',
'form.noFileChosen': 'Aucun fichier choisi',
'form.changeFile': 'Changer le fichier',
```

### 3. Button States

- **No file selected:** Shows "اختر ملف" (Choose File)
- **File selected:** Shows "تغيير الملف" (Change File)
- **Uploading:** Button disabled with gray styling + loading spinner

### 4. Visual Design

- Green dashed border (`border-green-500`)
- Light green background (`bg-green-50`)
- Hover effect (`hover:bg-green-100`)
- Image icon on the right (RTL layout)
- Disabled state with gray colors when uploading

## Files Modified

1. **src/app/petitions/create/page.tsx**
   - Replaced native file input with custom button
   - Added conditional text based on file selection state
   - Maintained all existing functionality (validation, upload, preview)

2. **src/hooks/useTranslation.ts**
   - Added `form.chooseFile` translation key
   - Added `form.noFileChosen` translation key (for future use)
   - Added `form.changeFile` translation key
   - Translations in both Arabic and French

## Testing

✅ Code compiles without errors  
✅ Dev server running successfully on port 3001  
✅ Translation keys properly defined  
✅ RTL layout support with icon positioning  
✅ Disabled state during upload  
✅ File selection functionality preserved

## User Experience Improvements

1. **Fully Translated:** All text is now translatable
2. **Clear Visual Feedback:** Green styling indicates it's an upload area
3. **State Awareness:** Button text changes when file is selected
4. **Consistent Design:** Matches the platform's green color scheme
5. **RTL Support:** Icon positioned correctly for Arabic layout

## Next Steps

- User testing to verify the button is intuitive
- Consider adding file name display below the button
- Monitor for any accessibility concerns

## Notes

- The `form.noFileChosen` key was added but not currently used in the UI
- Can be used in the future if we want to show "No file chosen" text separately
- All existing file upload functionality (validation, storage, preview) remains unchanged
