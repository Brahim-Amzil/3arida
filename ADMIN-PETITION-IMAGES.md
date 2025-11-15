# Admin Petition Card Images

## Feature Added

Added petition images to admin petition cards in the moderation page. Images now appear on the left side of each card with petition details on the right.

## Layout Structure

### Before

```
┌─────────────────────────────────────────┐
│ Title + Status Badge                    │
│ Description                             │
│ Category | Signatures | Created | Tier  │
│ Moderator Notes                         │
│                          [Review Button]│
└─────────────────────────────────────────┘
```

### After

```
┌─────────────────────────────────────────┐
│  ┌────────┐  Title + Status Badge       │
│  │        │  Description                │
│  │ Image  │  Category | Signatures      │
│  │        │  Created | Tier             │
│  └────────┘  Moderator Notes            │
│                        [Review Button]  │
└─────────────────────────────────────────┘
```

## Implementation

### Image Display

**With Image:**

```tsx
<img
  src={petition.mediaUrls[0]}
  alt={petition.title}
  className="w-48 h-32 object-cover rounded-lg"
/>
```

**Without Image (Placeholder):**

```tsx
<div className="w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
  <svg className="w-12 h-12 text-gray-400">{/* Image icon */}</svg>
</div>
```

### Dimensions

- **Width**: 192px (w-48)
- **Height**: 128px (h-32)
- **Aspect Ratio**: 3:2
- **Object Fit**: cover (maintains aspect ratio, crops if needed)
- **Border Radius**: rounded-lg

### Placeholder

When a petition has no image:

- Gray background (#F3F4F6)
- Centered image icon
- Same dimensions as actual images
- Maintains consistent card layout

## Features

### Responsive Design

- Image is flex-shrink-0 (doesn't shrink on small screens)
- Content area is flex-1 (takes remaining space)
- Minimum width constraint on content (min-w-0)

### Visual Consistency

- All cards have same height for image area
- Rounded corners match card design
- Proper spacing with gap-6 between image and content

### Performance

- Uses standard img tag for admin panel (faster loading)
- Could be upgraded to Next.js Image component for optimization
- Images are already uploaded and optimized in Firebase Storage

## Benefits

1. **Visual Recognition**: Quickly identify petitions by their images
2. **Professional Look**: More polished admin interface
3. **Better UX**: Easier to scan and find specific petitions
4. **Consistent Layout**: All cards have uniform structure
5. **Graceful Fallback**: Placeholder for petitions without images

## Example Use Cases

### Scenario 1: Petition with Image

Admin sees:

- Petition image on left (e.g., protest photo)
- Title and details on right
- Easy to recognize and remember

### Scenario 2: Petition without Image

Admin sees:

- Gray placeholder with image icon
- Same layout as petitions with images
- No broken layout or missing elements

### Scenario 3: Scanning Multiple Petitions

Admin can:

- Quickly scan images to find specific petition
- Identify petition types by visual content
- Make faster moderation decisions

## Files Modified

- `3arida-app/src/app/admin/petitions/page.tsx`
  - Added Image import from Next.js
  - Added image display section
  - Added placeholder for petitions without images
  - Restructured card layout with flex
  - Maintained all existing functionality

## Technical Details

### Image Source

- Uses `petition.mediaUrls[0]` (first uploaded image)
- Falls back to placeholder if no images exist
- Images are stored in Firebase Storage

### CSS Classes

- `w-48 h-32`: Fixed dimensions
- `object-cover`: Maintains aspect ratio
- `rounded-lg`: Rounded corners
- `flex-shrink-0`: Prevents image from shrinking
- `flex-1 min-w-0`: Content takes remaining space

### Accessibility

- Alt text uses petition title
- Placeholder has descriptive icon
- Maintains semantic HTML structure
