# Addressed To Dropdown Update

## Status: ✅ COMPLETE

## Changes Made

Updated the "Addressed To" (من هو المخاطب بهذه العريضة؟) dropdown options with clearer, more descriptive Arabic text and improved French translations.

## Updated Options

### Arabic (العربية)

| Option       | Previous              | Updated                       |
| ------------ | --------------------- | ----------------------------- |
| Government   | 🏛️ مسؤول/وكالة حكومية | 🏛️ **مسؤول / جهة حكومية**     |
| Company      | 🏢 شركة/مؤسسة         | 🏢 **شركة أو جهة خاصة**       |
| Organization | 🏛️ منظمة/مؤسسة        | 🏛️ **منظمة أو جهة غير ربحية** |
| Community    | 🏘️ مجتمع/سلطة محلية   | 🏘️ **مجتمع / سلطة محلية**     |
| Individual   | 👤 فرد                | 👤 **فرد** _(no change)_      |
| Other        | 📝 أخرى               | 📝 **أخرى** _(no change)_     |

### French (Français)

| Option       | Previous                           | Updated                                           |
| ------------ | ---------------------------------- | ------------------------------------------------- |
| Government   | 🏛️ Officiel/Agence gouvernementale | 🏛️ **Officiel / Agence gouvernementale**          |
| Company      | 🏢 Entreprise/Corporation          | 🏢 **Entreprise ou entité privée**                |
| Organization | 🏛️ Organisation/Institution        | 🏛️ **Organisation ou entité à but non lucratif**  |
| Community    | 🏘️ Communauté/Autorité locale      | 🏘️ **Communauté / Autorité locale** _(no change)_ |
| Individual   | 👤 Individu                        | 👤 **Individu** _(no change)_                     |
| Other        | 📝 Autre                           | 📝 **Autre** _(no change)_                        |

### English (Fallback)

| Option       | Text                                 |
| ------------ | ------------------------------------ |
| Government   | 🏛️ Official / Government Agency      |
| Company      | 🏢 Company or Private Entity         |
| Organization | 🏛️ Organization or Non-Profit Entity |
| Community    | 🏘️ Community / Local Authority       |
| Individual   | 👤 Individual                        |
| Other        | 📝 Other                             |

## Key Improvements

### 1. Government (مسؤول / جهة حكومية)

- **Before**: مسؤول/وكالة حكومية
- **After**: مسؤول / جهة حكومية
- **Improvement**: Added spaces around "/" for better readability, changed "وكالة" to "جهة" for broader coverage

### 2. Company (شركة أو جهة خاصة)

- **Before**: شركة/مؤسسة
- **After**: شركة أو جهة خاصة
- **Improvement**: Changed from "/" to "أو" (or), specified "جهة خاصة" (private entity) to distinguish from non-profit organizations

### 3. Organization (منظمة أو جهة غير ربحية)

- **Before**: منظمة/مؤسسة
- **After**: منظمة أو جهة غير ربحية
- **Improvement**: Changed from "/" to "أو" (or), explicitly specified "غير ربحية" (non-profit) to clearly distinguish from private companies

### 4. Community (مجتمع / سلطة محلية)

- **Before**: مجتمع/سلطة محلية
- **After**: مجتمع / سلطة محلية
- **Improvement**: Added spaces around "/" for better readability

## Benefits

1. **Clearer Distinction**: The new text clearly distinguishes between:
   - Private companies (شركة أو جهة خاصة)
   - Non-profit organizations (منظمة أو جهة غير ربحية)
   - Government entities (مسؤول / جهة حكومية)

2. **Better Readability**:
   - Added spaces around "/" separators
   - Used "أو" (or) instead of "/" where appropriate

3. **More Inclusive Language**:
   - "جهة" (entity) is more inclusive than specific terms
   - Covers broader range of addressees

4. **Consistent Formatting**: All options now have consistent emoji placement and spacing

## Code Changes

### File: `src/hooks/useTranslation.ts`

**Arabic Translations Updated:**

```typescript
'form.government': '🏛️ مسؤول / جهة حكومية',
'form.company': '🏢 شركة أو جهة خاصة',
'form.organizationOption': '🏛️ منظمة أو جهة غير ربحية',
'form.community': '🏘️ مجتمع / سلطة محلية',
'form.individualOption': '👤 فرد',
'form.other': '📝 أخرى',
```

**French Translations Updated:**

```typescript
'form.government': '🏛️ Officiel / Agence gouvernementale',
'form.company': '🏢 Entreprise ou entité privée',
'form.organizationOption': '🏛️ Organisation ou entité à but non lucratif',
'form.community': '🏘️ Communauté / Autorité locale',
'form.individualOption': '👤 Individu',
'form.other': '📝 Autre',
```

## Dropdown Display Order

The dropdown now displays options in this order:

1. 🏛️ مسؤول / جهة حكومية (Government)
2. 🏢 شركة أو جهة خاصة (Company)
3. 🏛️ منظمة أو جهة غير ربحية (Organization)
4. 🏘️ مجتمع / سلطة محلية (Community)
5. 👤 فرد (Individual)
6. 📝 أخرى (Other)

## Use Cases

### 🏛️ مسؤول / جهة حكومية (Government)

Perfect for petitions addressed to:

- Government officials (ministers, mayors, etc.)
- Government agencies and departments
- Public institutions
- Regulatory bodies

**Example**: "وزير التعليم" (Minister of Education)

### 🏢 شركة أو جهة خاصة (Company)

Perfect for petitions addressed to:

- Private companies
- Corporations
- Private businesses
- Commercial entities

**Example**: "شركة النقل الحضري" (Urban Transport Company)

### 🏛️ منظمة أو جهة غير ربحية (Organization)

Perfect for petitions addressed to:

- Non-profit organizations
- NGOs
- Charities
- Associations
- Foundations

**Example**: "جمعية حماية البيئة" (Environmental Protection Association)

### 👤 فرد (Individual)

Perfect for petitions addressed to:

- Specific individuals
- Public figures
- Decision makers

**Example**: "رئيس الجامعة" (University President)

### 🏘️ مجتمع / سلطة محلية (Community)

Perfect for petitions addressed to:

- Local communities
- Municipal authorities
- Neighborhood councils
- Local government

**Example**: "مجلس الحي" (Neighborhood Council)

### 📝 أخرى (Other)

For any addressee that doesn't fit the above categories

## Files Modified

1. ✅ `src/hooks/useTranslation.ts` - Updated addressed to translations (Arabic & French)

## Testing

- ✅ Dev server compiled successfully
- ✅ No TypeScript errors
- ✅ Ready for user testing

### Test Steps

1. Navigate to `/petitions/create`
2. Complete step 1 (Publisher Information)
3. Click "Next" to go to step 2 (Petition Details)
4. Select a petition type
5. Click on "من هو المخاطب بهذه العريضة؟" dropdown
6. Verify all 6 options display with updated text:
   - 🏛️ مسؤول / جهة حكومية
   - 🏢 شركة أو جهة خاصة
   - 🏛️ منظمة أو جهة غير ربحية
   - 👤 فرد
   - 🏘️ مجتمع / سلطة محلية
   - 📝 أخرى
7. Test in French to verify translations
8. Select each option and verify form accepts the selection

## Summary

Successfully updated the "Addressed To" dropdown with clearer, more descriptive Arabic text that better distinguishes between private companies, non-profit organizations, and government entities. Added spaces for better readability and used "أو" (or) instead of "/" where appropriate. French translations were also improved to match the clarity of the Arabic text.
