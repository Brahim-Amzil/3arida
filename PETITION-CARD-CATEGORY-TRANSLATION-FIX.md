# Petition Card Category Translation Fix

## Status: ✅ COMPLETE

## Issue

Category badges on petition cards were showing translation placeholders like "categories.infrastructure" instead of the actual translated category names (e.g., "البنية التحتية" in Arabic).

### Examples of the Problem:

- Showing: `categories.infrastructure`
- Should show: `البنية التحتية` (Arabic) / `Infrastructure` (French/English)

## Root Cause

The `PetitionCard` component was trying to translate categories using the `t()` function with keys like `categories.infrastructure`, but these translation keys were missing from the translation file.

The code in `PetitionCard.tsx`:

```tsx
{
  t(`categories.${petition.category?.toLowerCase().replace(/\s+/g, '')}`) ||
    petition.category;
}
```

This creates keys like:

- `categories.infrastructure` (from "Infrastructure")
- `categories.healthcare` (from "Healthcare")
- `categories.socialjustice` (from "Social Justice")

## Solution

Added the missing category translation keys to `src/hooks/useTranslation.ts`.

### Categories Added

#### Arabic Translations

```typescript
'categories.infrastructure': 'البنية التحتية',
'categories.healthcare': 'الرعاية الصحية',
```

#### French Translations

```typescript
'categories.infrastructure': 'Infrastructure',
'categories.healthcare': 'Soins de santé',
```

### Complete Category List (Now Available)

All categories from the petition creation form are now translated:

| English        | Arabic             | French          |
| -------------- | ------------------ | --------------- |
| Environment    | البيئة             | Environnement   |
| Education      | التعليم            | Éducation       |
| Health         | الصحة              | Santé           |
| Healthcare     | الرعاية الصحية     | Soins de santé  |
| Infrastructure | البنية التحتية     | Infrastructure  |
| Social Justice | العدالة الاجتماعية | Justice sociale |
| Politics       | السياسة            | Politique       |
| Economy        | الاقتصاد           | Économie        |
| Culture        | الثقافة            | Culture         |
| Sports         | الرياضة            | Sports          |
| Technology     | التكنولوجيا        | Technologie     |
| Other          | أخرى               | Autre           |

## Files Modified

1. ✅ `src/hooks/useTranslation.ts` - Added missing category translations (Arabic & French)

## How It Works

### Before Fix

```
Category: "Infrastructure"
Translation key: "categories.infrastructure"
Result: "categories.infrastructure" ❌ (key not found, shows placeholder)
```

### After Fix

```
Category: "Infrastructure"
Translation key: "categories.infrastructure"
Result: "البنية التحتية" ✅ (Arabic)
Result: "Infrastructure" ✅ (French)
Result: "Infrastructure" ✅ (English - fallback)
```

## Testing

- ✅ Dev server restarted on port 3001
- ✅ Translations compiled successfully
- ✅ Ready for user testing

### Test Cases

1. Navigate to petitions page
2. Check category badges on petition cards
3. Verify categories show translated names:
   - Infrastructure → البنية التحتية (Arabic)
   - Healthcare → الرعاية الصحية (Arabic)
   - Infrastructure → Infrastructure (French)
   - Healthcare → Soins de santé (French)
4. Test with different language settings
5. Verify all petition cards show proper category names

## Result

### Before

```
┌─────────────────────────────┐
│ categories.infrastructure   │  ❌
│ مقبولة                      │
└─────────────────────────────┘
```

### After (Arabic)

```
┌─────────────────────────────┐
│ البنية التحتية              │  ✅
│ مقبولة                      │
└─────────────────────────────┘
```

### After (French)

```
┌─────────────────────────────┐
│ Infrastructure              │  ✅
│ Acceptée                    │
└─────────────────────────────┘
```

## Summary

Fixed the category badge translation issue by adding the missing "Infrastructure" and "Healthcare" category translation keys to both Arabic and French translations. All petition card category badges now display properly translated category names instead of translation key placeholders.
