# Upgrade Tier Button Implementation

## Feature Overview
Added a green "Upgrade Tier" button below the red "Edit Photos" button when users have multiple images but selected the FREE tier, providing a clear upgrade path.

## User Experience Flow

### Current Scenario:
1. User uploads multiple images (2-5 photos)
2. User selects FREE tier (0-2,500 signatures)
3. Review page shows warning about image limit
4. Images beyond limit #1 are greyed out with red X
5. **Red button**: "انقر هنا لتعديل الصور" (Click here to edit photos)
6. **NEW Green button**: "انقر هنا لتغيير الخطة والاحتفاظ بجميع الصور" (Click here to change plan and keep all photos)

### Button Actions:
- **Red Button** → Navigate to Step 3 (Media step) to remove extra photos
- **Green Button** → Navigate to Step 5 (Pricing step) to upgrade tier

## Visual Design

### Red Button (Edit Photos):
- Background: `bg-red-500 hover:bg-red-600`
- Icon: Edit/pencil icon
- Purpose: Remove extra photos to fit free tier

### Green Button (Upgrade Tier):
- Background: `bg-green-500 hover:bg-green-600`
- Icon: Trending up arrow (upgrade/growth icon)
- Purpose: Upgrade to paid tier to keep all photos

### Layout:
```
┌─────────────────────────────────────┐
│  [Image 1] [Image 2] [Image 3]      │
│     ✓        ❌        ❌           │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  🖊️  انقر هنا لتعديل الصور    │ │ ← Red
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  📈  انقر هنا لتغيير الخطة...  │ │ ← Green
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Implementation Details

### Condition for Display:
```typescript
{formData.mediaUrls.length > 1 &&
  calculatePricingTier(formData.targetSignatures) === 'free' && (
  // Show both buttons
)}
```

### Button Container:
- Uses `space-y-3` for consistent spacing between buttons
- Both buttons are full width (`w-full`)
- Both have shadow and hover effects

### Navigation:
- **Red Button**: `setCurrentStep(3)` → Media step
- **Green Button**: `setCurrentStep(5)` → Pricing step

## Translation Keys Added

### Arabic:
```typescript
'review.upgradeTier': 'انقر هنا لتغيير الخطة والاحتفاظ بجميع الصور'
```

### French:
```typescript
'review.upgradeTier': 'Cliquez ici pour changer de plan et conserver toutes les photos'
```

## Benefits

### User Experience:
✅ **Clear choice** - Remove photos vs upgrade tier
✅ **No dead end** - Always provides a path forward
✅ **Revenue opportunity** - Encourages upgrades
✅ **Reduces friction** - Users don't lose their uploaded photos

### Business Impact:
✅ **Conversion funnel** - Guides users to paid tiers
✅ **Value demonstration** - Shows benefit of upgrading
✅ **Reduced abandonment** - Users don't give up when hitting limits

## Files Modified

### `src/app/petitions/create/page.tsx`
- Added green upgrade button below red edit button
- Used trending up arrow icon for upgrade concept
- Added navigation to Step 5 (Pricing)

### `src/hooks/useTranslation.ts`
- Added `review.upgradeTier` translation key
- Arabic and French translations provided

## Testing Checklist

- [ ] Upload multiple images (2-5 photos)
- [ ] Select FREE tier (0-2,500 signatures)
- [ ] Navigate to review page (Step 6)
- [ ] Verify both buttons appear:
  - [ ] Red "Edit Photos" button
  - [ ] Green "Upgrade Tier" button
- [ ] Click red button → Should go to Step 3 (Media)
- [ ] Click green button → Should go to Step 5 (Pricing)
- [ ] Test in both Arabic and French languages
- [ ] Verify buttons don't appear when:
  - [ ] Only 1 image uploaded
  - [ ] Paid tier already selected

## Future Enhancements

### Smart Messaging:
- Show specific tier needed: "Upgrade to Starter (69 MAD) to keep 3 photos"
- Calculate minimum tier based on image count

### Visual Improvements:
- Add tier comparison tooltip
- Show price difference inline
- Animate button appearance

### Analytics:
- Track button click rates
- Measure conversion from free to paid
- A/B test button colors and messaging

## Status
✅ Complete - Both buttons implemented with proper translations and navigation