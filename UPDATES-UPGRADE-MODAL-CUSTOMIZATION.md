# Updates Upgrade Modal Customization

## Overview

Customized the upgrade modal that appears when free tier users try to add petition updates, with specific messaging and call-to-action for the updates feature.

## Changes Made

### 1. Modal Content Updates

**Title**:

- **Arabic**: "أبقِ الموقعين على اطلاع" (Keep Signees Updated)
- **French**: "Tenez les signataires informés" (Keep Signees Informed)

**Description**:

- **Arabic**: "إضافة التحديثات غير متاحة للعرائض المجانية. يرجى النقر أدناه للتغيير إلى خطة مدفوعة. تبدأ الخطط من 69 درهم مغربي."
- **French**: "L'ajout de mises à jour n'est pas disponible pour les pétitions gratuites. Veuillez cliquer ci-dessous pour passer à un plan payant. Les plans commencent à 69 dirhams marocains."

**English Translation**:

- "Adding Updates is not available for free petitions. Please click below to change to a paid tier. Tiers start at 69 Moroccan Dirham."

### 2. Button Text

- **Arabic**: "عرض جميع الخطط" (View All Plans)
- **French**: "Voir tous les plans" (View All Plans)

### 3. Functionality

- **Button Action**: Redirects to `/pricing` page when clicked
- **Modal Behavior**: Closes automatically when button is clicked
- **Pricing Display**: Shows "69 MAD" as starting price

## User Experience Flow

1. **User clicks "إضافة تحديث" (Add Update) button** on free petition
2. **Upgrade modal appears** with:
   - Megaphone icon with lock overlay
   - Title: "Keep Signees Updated"
   - Description explaining updates are not available for free
   - Pricing information (starts at 69 MAD)
   - Green "عرض جميع الخطط" button
   - Gray "ربما لاحقاً" (Maybe Later) button
3. **User clicks "عرض جميع الخطط"** → Redirected to pricing page
4. **User clicks "ربما لاحقاً"** → Modal closes, stays on petition page

## Visual Design

### Modal Structure:

```
┌─────────────────────────────────┐
│                              ✕  │
│        📢 (with 🔒)             │
│                                 │
│    أبقِ الموقعين على اطلاع      │
│                                 │
│  إضافة التحديثات غير متاحة...    │
│                                 │
│         يبدأ من                 │
│          69                     │
│        currency.mad             │
│       دفعة واحدة                │
│                                 │
│  ┌─────────────────────────────┐ │
│  │    عرض جميع الخطط          │ │ ← Green
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │      ربما لاحقاً           │ │ ← Gray
│  └─────────────────────────────┘ │
└─────────────────────────────────┘
```

## Files Modified

### `src/components/ui/UpgradeModal.tsx`

- Updated `updates` feature configuration
- Changed title and description for updates context
- Maintained existing functionality and styling

### `src/hooks/useTranslation.ts`

- Updated `upgrade.updates.title` translations
- Updated `upgrade.updates.description` translations
- Kept existing `upgrade.viewPlans` translation (already correct)

## Translation Keys Used

```typescript
// Arabic
'upgrade.updates.title': 'أبقِ الموقعين على اطلاع'
'upgrade.updates.description': 'إضافة التحديثات غير متاحة للعرائض المجانية. يرجى النقر أدناه للتغيير إلى خطة مدفوعة. تبدأ الخطط من 69 درهم مغربي.'
'upgrade.viewPlans': 'عرض جميع الخطط'
'upgrade.maybeLater': 'ربما لاحقاً'
'upgrade.startsAt': 'يبدأ من'
'currency.mad': 'درهم'
'upgrade.oneTime': 'دفعة واحدة'

// French
'upgrade.updates.title': 'Tenez les signataires informés'
'upgrade.updates.description': "L'ajout de mises à jour n'est pas disponible pour les pétitions gratuites. Veuillez cliquer ci-dessous pour passer à un plan payant. Les plans commencent à 69 dirhams marocains."
'upgrade.viewPlans': 'Voir tous les plans'
```

## Business Impact

### Conversion Funnel:

1. **Feature Discovery** → User tries to add update
2. **Value Proposition** → Modal explains benefit of updates
3. **Clear Pricing** → Shows starting price (69 MAD)
4. **Call to Action** → Direct link to pricing page
5. **Conversion** → User can upgrade to access feature

### Benefits:

✅ **Clear messaging** - Explains why feature is locked
✅ **Value proposition** - Emphasizes keeping signees updated
✅ **Transparent pricing** - Shows exact starting cost
✅ **Easy upgrade path** - One click to pricing page
✅ **Non-intrusive** - "Maybe Later" option available

## Testing Checklist

- [ ] Create free petition
- [ ] Try to click "إضافة تحديث" button
- [ ] Verify modal appears with correct content
- [ ] Check Arabic translations are correct
- [ ] Check French translations are correct
- [ ] Click "عرض جميع الخطط" → Should redirect to `/pricing`
- [ ] Click "ربما لاحقاً" → Should close modal
- [ ] Click X button → Should close modal
- [ ] Click outside modal → Should close modal
- [ ] Test on mobile devices
- [ ] Verify modal doesn't appear for paid tier petitions

## Status

✅ Complete - Modal customized with specific updates messaging and proper translations
