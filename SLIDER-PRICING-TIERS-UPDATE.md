# Slider Pricing Tiers Update & RTL Support

**Date:** January 27, 2026  
**Status:** ✅ Complete

## Overview

Updated the signature goal slider in the petition creation form to reflect the new 5-tier pricing structure and added RTL support for proper display in Arabic.

## Changes Made

### 1. Updated Pricing Tiers Structure

#### Old Tiers (4 tiers):

- Free: 0-2,500 signatures (0 MAD)
- Basic: 2,501-5,000 signatures (49 MAD)
- Premium: 5,001-10,000 signatures (79 MAD)
- Enterprise: 10,001-100,000 signatures (199 MAD)

#### New Tiers (5 tiers):

- **Free**: 0-2,500 signatures (0 MAD)
- **Starter**: 2,501-10,000 signatures (69 MAD)
- **Pro**: 10,001-30,000 signatures (129 MAD)
- **Advanced**: 30,001-75,000 signatures (229 MAD)
- **Enterprise**: 75,001-100,000 signatures (369 MAD)

### 2. Slider Markers Updated

#### Before:

```
100 --- 25K --- 50K --- 100K
```

#### After:

```
100 --- 10K --- 30K --- 75K --- 100K
```

The new markers align with the tier boundaries:

- 10K: Starter/Pro boundary
- 30K: Pro/Advanced boundary
- 75K: Advanced/Enterprise boundary

### 3. RTL Support Added

Added `dir="ltr"` attribute to both:

- The range input slider
- The marker labels container

This ensures the slider always moves left-to-right (100 on left, 100K on right) regardless of the page's RTL direction, which is the expected behavior for numeric ranges.

```tsx
<input
  type="range"
  dir="ltr"
  // ... other props
/>
<div className="flex justify-between text-xs text-gray-500 mt-1" dir="ltr">
  <span>100</span>
  <span>10K</span>
  <span>30K</span>
  <span>75K</span>
  <span>100K</span>
</div>
```

## Files Modified

### 1. `src/types/petition.ts`

- Updated `PricingTier` type to include 'advanced' tier

```typescript
export type PricingTier =
  | 'free'
  | 'basic'
  | 'premium'
  | 'advanced'
  | 'enterprise';
```

### 2. `src/lib/petition-utils.ts`

- Updated `PRICING_TIERS` configuration with new tier names and prices
- Updated `calculatePricingTier()` function to handle 5 tiers
- Changed tier names:
  - 'Basic' → 'Starter'
  - 'Premium' → 'Pro'
  - Added 'Advanced' tier

### 3. `src/app/petitions/create/page.tsx`

- Updated slider markers from `[100, 25K, 50K, 100K]` to `[100, 10K, 30K, 75K, 100K]`
- Added `dir="ltr"` to slider input for RTL support
- Added `dir="ltr"` to marker labels container

## Pricing Tier Logic

The `calculatePricingTier()` function now correctly assigns tiers:

```typescript
if (signatures <= 2500)
  return 'free'; // 0-2,500
else if (signatures <= 10000)
  return 'basic'; // 2,501-10,000 (Starter)
else if (signatures <= 30000)
  return 'premium'; // 10,001-30,000 (Pro)
else if (signatures <= 75000)
  return 'advanced'; // 30,001-75,000 (Advanced)
else return 'enterprise'; // 75,001-100,000
```

## Visual Behavior

### Slider Display

- Green progress bar fills from left to right
- Thumb position indicates current signature goal
- Markers show tier boundaries
- Works correctly in both LTR and RTL layouts

### Price Display

Shows the tier name and price below the slider:

- "Free Plan - مجاني" (0 MAD)
- "Starter Plan - 69 MAD"
- "Pro Plan - 129 MAD"
- "Advanced Plan - 229 MAD"
- "Enterprise Plan - 369 MAD"

## Testing

✅ Code compiles without errors  
✅ TypeScript types updated correctly  
✅ Slider markers align with tier boundaries  
✅ RTL support working (slider always LTR)  
✅ Price calculation matches new tiers  
✅ Dev server running successfully

## Consistency

The slider now matches:

- ✅ Pricing page tier structure
- ✅ PayPal payment integration
- ✅ Petition creation flow
- ✅ Admin dashboard pricing display

## User Experience

1. **Clear Tier Boundaries**: Markers at 10K, 30K, and 75K show where prices change
2. **RTL Compatible**: Slider works correctly in Arabic layout
3. **Visual Feedback**: Green progress bar shows selected range
4. **Price Preview**: Real-time price display as user moves slider
5. **Accurate Pricing**: Matches the pricing page exactly

## Notes

- The slider range remains 100-100,000 signatures
- Step size is 100 signatures for smooth adjustment
- The `dir="ltr"` attribute is crucial for RTL layouts - without it, the slider would be reversed in Arabic
- All tier calculations are centralized in `petition-utils.ts` for consistency
