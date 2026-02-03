# Image Limit by Tier - Implementation Plan

**Date**: January 30, 2025  
**Status**: Planning

## Requirements

### Image Limits by Tier

- **Free tier**: 1 image max
- **All paid tiers (Starter+)**: 5 images max
- **System absolute max**: 10 images (for future flexibility)

## Current State Analysis

### What Exists

- ✅ Single image upload working
- ✅ Image stored in `formData.mediaUrls` array
- ✅ Firebase Storage integration
- ✅ Image validation
- ✅ Image deletion

### What Needs to Change

- ❌ UI only shows/handles 1 image
- ❌ No tier checking on upload
- ❌ No image counter display
- ❌ No upgrade prompt when limit reached
- ❌ Need to support multiple image uploads
- ❌ Need image gallery/grid display

## Implementation Steps

### Phase 1: Backend/Logic (EASY)

1. ✅ Add `maxImages` to `TierFeatureAccess` interface
2. ✅ Add `getMaxImages(tier)` function
3. ✅ Add `canAddMoreImages(tier, count)` function
4. ✅ Set `ABSOLUTE_MAX_IMAGES = 10`

### Phase 2: UI Changes (MEDIUM)

1. **Image Upload Section**
   - Show image counter: "1 of 1 images" (free) or "2 of 5 images" (paid)
   - Display uploaded images in a grid (not just one)
   - Each image has a remove button
   - Upload button disabled when limit reached
   - Show upgrade prompt when free user tries to add 2nd image

2. **Image Gallery Display**
   - Grid layout for multiple images
   - Thumbnail view with remove buttons
   - Drag to reorder (optional for v1)

3. **Review Step**
   - Show all uploaded images
   - Grid layout

### Phase 3: Tier Integration (EASY)

1. Get user's tier from petition pricing
2. Check tier before allowing upload
3. Show upgrade modal when limit reached
4. Update validation to enforce limits

## Technical Considerations

### Data Structure

Current: `mediaUrls: string[]` ✅ Already an array!  
No database changes needed - just UI changes

### File Naming

Each image needs unique path:

- `petitions/{petitionId}/image_1_{timestamp}.jpg`
- `petitions/{petitionId}/image_2_{timestamp}.jpg`
- etc.

### Storage Cleanup

When removing images, delete from Firebase Storage to avoid orphaned files

## Complexity Assessment

### Easy Parts (30 min)

- ✅ Tier restriction logic (DONE)
- Image counter display
- Disable upload button when limit reached

### Medium Parts (1-2 hours)

- Multi-image upload UI
- Image grid display
- Remove individual images
- Update review step

### Optional (Future)

- Drag to reorder images
- Image captions
- Set primary/cover image
- Image cropping/editing

## Recommendation

**Should we implement this now?**

**Pros:**

- Clear value proposition for paid tiers
- Easy to understand benefit
- Good conversion driver

**Cons:**

- Requires UI changes to petition creation form
- Need to update review step
- Need to test multi-image display on petition pages
- Takes 1-2 hours to implement properly

**My Recommendation**:
Let's implement this as the NEXT feature after we test the current tier restrictions (Total Signatures, Updates, Appeals). This way we can:

1. Test current restrictions first
2. Get user feedback
3. Then add image limits as a second wave of restrictions

**OR** if you want maximum impact at launch, I can implement it now (1-2 hours).

What do you prefer?
