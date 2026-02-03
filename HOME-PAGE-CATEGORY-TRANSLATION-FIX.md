# Home Page Category Translation Fix

## Issue

Category names on the home page were displaying in English only, not translating to Arabic or French based on the selected locale.

## Root Cause

The home page was directly displaying `category.name` from the database without checking for available translations.

## Solution

Added translation logic to map category names to their translation keys:

```typescript
const categoryKey = `categories.${category.name.toLowerCase().replace(/\s+/g, '')}`;
const translatedName =
  t(categoryKey) !== categoryKey ? t(categoryKey) : category.name;
```

This approach:

1. Converts category name to translation key format (e.g., "Social Justice" → "categories.socialjustice")
2. Attempts to translate using the key
3. Falls back to original name if translation doesn't exist

## Translation Keys Used

The following translation keys are already defined in `src/hooks/useTranslation.ts`:

### Arabic

- `categories.environment`: 'البيئة'
- `categories.education`: 'التعليم'
- `categories.economy`: 'الاقتصاد'
- `categories.culture`: 'الثقافة'
- `categories.socialjustice`: 'العدالة الاجتماعية'
- `categories.politics`: 'السياسة'
- `categories.infrastructure`: 'البنية التحتية'
- `categories.healthcare`: 'الرعاية الصحية'

### French

- `categories.environment`: 'Environnement'
- `categories.education`: 'Éducation'
- `categories.economy`: 'Économie'
- `categories.culture`: 'Culture'
- `categories.socialjustice`: 'Justice sociale'
- `categories.politics`: 'Politique'
- `categories.infrastructure`: 'Infrastructure'
- `categories.healthcare`: 'Soins de santé'

## Files Modified

- `src/app/page.tsx` - Added category name translation logic

## Testing

- [x] Categories display in English when locale is 'en'
- [x] Categories display in Arabic when locale is 'ar'
- [x] Categories display in French when locale is 'fr'
- [x] Fallback to English name if translation missing
- [x] Category links still work correctly

## Notes

- The petition pinning feature spec is complete and ready for implementation when needed
- All existing translation keys were already in place, just needed to be used
