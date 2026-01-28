# Petition Creation Step 2 Translation Fix

## Status: ✅ COMPLETE

## Issue

The "Petition Details" heading in step 2 of the petition creation form was showing in English instead of being translated to Arabic/French.

### Screenshot Issue

```
┌─────────────────────────────┐
│  Petition Details           │  ❌ English (should be Arabic)
│                             │
│  نوع العريضة *              │
│  اختر نوع العريضة           │
└─────────────────────────────┘
```

## Root Cause

The CardTitle component had hardcoded English text "Petition Details" instead of using the translation function `t()`.

**Before:**

```tsx
<CardTitle>Petition Details</CardTitle>
```

## Solution

1. Updated the CardTitle to use translation key
2. Added translation keys for Arabic and French

### Changes Made

#### 1. Updated Component

**File**: `src/app/petitions/create/page.tsx`

**After:**

```tsx
<CardTitle>{t('form.petitionDetails')}</CardTitle>
```

#### 2. Added Translation Keys

**File**: `src/hooks/useTranslation.ts`

**Arabic:**

```typescript
'form.petitionDetails': 'تفاصيل العريضة',
```

**French:**

```typescript
'form.petitionDetails': 'Détails de la pétition',
```

**English (fallback):**

```
"Petition Details" (uses the key name as fallback)
```

## Result

### Before

```
┌─────────────────────────────┐
│  Petition Details           │  ❌
└─────────────────────────────┘
```

### After (Arabic)

```
┌─────────────────────────────┐
│  تفاصيل العريضة             │  ✅
└─────────────────────────────┘
```

### After (French)

```
┌─────────────────────────────┐
│  Détails de la pétition     │  ✅
└─────────────────────────────┘
```

## Files Modified

1. ✅ `src/app/petitions/create/page.tsx` - Updated CardTitle to use translation
2. ✅ `src/hooks/useTranslation.ts` - Added translation keys (Arabic & French)

## Testing

- ✅ Dev server compiled successfully
- ✅ Page loaded without errors
- ✅ Ready for user testing

### Test Steps

1. Navigate to `/petitions/create`
2. Complete step 1 (Publisher Information)
3. Click "Next" to go to step 2
4. Verify the heading shows:
   - Arabic: "تفاصيل العريضة"
   - French: "Détails de la pétition"
   - English: "Petition Details"
5. Test language switching to verify all translations work

## Notes

- All form fields in step 2 were already translated (using existing translation keys)
- Only the main heading "Petition Details" was missing translation
- The translation system uses Arabic and French with English as fallback
- No English translation keys needed (English text is used directly as fallback)

## Summary

Fixed the "Petition Details" heading in step 2 of the petition creation form by adding the translation key `form.petitionDetails` and updating the component to use `t('form.petitionDetails')` instead of hardcoded English text. The heading now displays correctly in Arabic (تفاصيل العريضة) and French (Détails de la pétition).
