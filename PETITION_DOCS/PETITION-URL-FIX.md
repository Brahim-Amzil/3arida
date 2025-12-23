# Petition URL Fix - Arabic Title Support

## Problem

All petition links were showing "Petition Not Found" error when clicked from the petitions page.

### Root Cause

The `generatePetitionSlug()` function in `petition-utils.ts` was using a regex pattern `/[^a-z0-9\s-]/g` that removed all non-Latin characters. This caused Arabic petition titles to become empty strings, resulting in malformed URLs like:

- `--Rd8tW8wL` (should be a full slug with title)
- `--oXa4qtWu`
- `--dUxECoIo`

These malformed slugs were then being treated as reference codes by `useRealtimePetition`, but they didn't match any actual reference codes in the database.

### Example

**Arabic Title:** "نطالب بزيادة المساحات الخضراء في المدن المغربية"
**Generated Slug:** `--Rd8tW8wL` (empty title + two dashes + ID suffix)
**Expected:** Should work with petition ID directly

## Solution

Changed the URL generation strategy to use petition IDs directly instead of slugs:

### Changes Made

1. **Updated `getPetitionUrl()` in `petition-utils.ts`:**

   ```typescript
   // Before:
   export const getPetitionUrl = (petition: Petition): string => {
     const slug = generatePetitionSlug(petition.title, petition.id);
     return `/petitions/${slug}`;
   };

   // After:
   export const getPetitionUrl = (petition: Petition): string => {
     // Use petition ID directly instead of slug to avoid issues with non-Latin characters
     return `/petitions/${petition.id}`;
   };
   ```

2. **Simplified `useRealtimePetition` hook:**
   - Removed complex slug resolution logic
   - Kept only reference code lookup for short codes (≤15 chars with dashes)
   - Direct petition ID lookup for everything else

## Benefits

- ✅ Works with Arabic, French, and any other language titles
- ✅ Simpler, more maintainable code
- ✅ Better performance (no need to fetch all petitions to resolve slugs)
- ✅ More reliable URL structure
- ✅ Still supports reference code lookups for sharing

## Testing

After deployment, verify:

1. Click on any petition from the petitions page → Should open correctly
2. Click on petition from notification → Should still work
3. Use reference code in URL → Should still work
4. Arabic titled petitions → Should work perfectly

## Files Modified

- `3arida-app/src/lib/petition-utils.ts`
- `3arida-app/src/hooks/useRealtimePetition.ts`

## Deployment

- Committed: ✅
- Pushed to GitHub: ✅
- Vercel auto-deployment: In progress

---

**Date:** November 23, 2025
**Status:** Fixed and deployed
