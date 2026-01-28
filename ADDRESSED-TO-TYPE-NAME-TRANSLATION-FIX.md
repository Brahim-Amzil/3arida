# Addressed To Type Name Translation Fix

## Status: ✅ COMPLETE

## Issue

When selecting an "Addressed To" option (Government, Company, etc.), the label and placeholder for the "Specific Name" field were showing the English type name instead of translating it to Arabic or French.

### Example of the Problem:

```
الاسم المحدد لـ Government *     ❌ (English word in Arabic sentence)
أدخل الاسم المحدد لـ government   ❌ (English word in Arabic placeholder)
```

### Expected Result:

```
الاسم المحدد لـ المسؤول / الجهة الحكومية *     ✅ (Fully Arabic)
أدخل الاسم المحدد لـ المسؤول / الجهة الحكومية   ✅ (Fully Arabic)
```

## Root Cause

The form was passing the English value directly from `formData.addressedToType` (e.g., "Government", "Company") to the translation function, which was then inserted into the Arabic/French text without translation.

**Before:**

```tsx
{
  t('form.specificName', { type: formData.addressedToType });
}
// Result: "الاسم المحدد لـ Government *"
```

## Solution

Created separate translation keys for each type name and used a nested translation call to translate the type name before inserting it into the label.

**After:**

```tsx
{
  t('form.specificName', {
    type: t(`form.${formData.addressedToType.toLowerCase()}Type`),
  });
}
// Result: "الاسم المحدد لـ المسؤول / الجهة الحكومية *"
```

## Translation Keys Added

### Arabic (العربية)

| Type Value   | Translation Key         | Translation                  |
| ------------ | ----------------------- | ---------------------------- |
| Government   | `form.governmentType`   | المسؤول / الجهة الحكومية     |
| Company      | `form.companyType`      | الشركة أو الجهة الخاصة       |
| Organization | `form.organizationType` | المنظمة أو الجهة غير الربحية |
| Community    | `form.communityType`    | المجتمع / السلطة المحلية     |
| Individual   | `form.individualType`   | الفرد                        |
| Other        | `form.otherType`        | الجهة الأخرى                 |

### French (Français)

| Type Value   | Translation Key         | Translation                                   |
| ------------ | ----------------------- | --------------------------------------------- |
| Government   | `form.governmentType`   | l'officiel / l'agence gouvernementale         |
| Company      | `form.companyType`      | l'entreprise ou l'entité privée               |
| Organization | `form.organizationType` | l'organisation ou l'entité à but non lucratif |
| Community    | `form.communityType`    | la communauté / l'autorité locale             |
| Individual   | `form.individualType`   | l'individu                                    |
| Other        | `form.otherType`        | l'autre entité                                |

## Code Changes

### 1. Translation Keys Added

**File**: `src/hooks/useTranslation.ts`

**Arabic:**

```typescript
// Addressed To Type Names (for use in labels)
'form.governmentType': 'المسؤول / الجهة الحكومية',
'form.companyType': 'الشركة أو الجهة الخاصة',
'form.organizationType': 'المنظمة أو الجهة غير الربحية',
'form.communityType': 'المجتمع / السلطة المحلية',
'form.individualType': 'الفرد',
'form.otherType': 'الجهة الأخرى',
```

**French:**

```typescript
// Addressed To Type Names (for use in labels)
'form.governmentType': "l'officiel / l'agence gouvernementale",
'form.companyType': "l'entreprise ou l'entité privée",
'form.organizationType': "l'organisation ou l'entité à but non lucratif",
'form.communityType': 'la communauté / l\'autorité locale',
'form.individualType': "l'individu",
'form.otherType': "l'autre entité",
```

### 2. Form Component Updated

**File**: `src/app/petitions/create/page.tsx`

**Before:**

```tsx
<label className="block text-sm font-medium text-gray-700 mb-2">
  {t('form.specificName', { type: formData.addressedToType })}
</label>
<input
  placeholder={t('form.enterSpecificName', {
    type: formData.addressedToType.toLowerCase(),
  })}
/>
```

**After:**

```tsx
<label className="block text-sm font-medium text-gray-700 mb-2">
  {t('form.specificName', {
    type: t(`form.${formData.addressedToType.toLowerCase()}Type`)
  })}
</label>
<input
  placeholder={t('form.enterSpecificName', {
    type: t(`form.${formData.addressedToType.toLowerCase()}Type`),
  })}
/>
```

## How It Works

### Translation Flow:

1. User selects "Government" from dropdown
2. `formData.addressedToType` = "Government"
3. Form converts to lowercase: "government"
4. Builds translation key: `form.governmentType`
5. Translates the key: "المسؤول / الجهة الحكومية"
6. Inserts translated text into label: "الاسم المحدد لـ المسؤول / الجهة الحكومية \*"

### Example for Each Type:

#### Government (مسؤول / جهة حكومية)

- **Label**: الاسم المحدد لـ **المسؤول / الجهة الحكومية** \*
- **Placeholder**: أدخل الاسم المحدد لـ **المسؤول / الجهة الحكومية**

#### Company (شركة أو جهة خاصة)

- **Label**: الاسم المحدد لـ **الشركة أو الجهة الخاصة** \*
- **Placeholder**: أدخل الاسم المحدد لـ **الشركة أو الجهة الخاصة**

#### Organization (منظمة أو جهة غير ربحية)

- **Label**: الاسم المحدد لـ **المنظمة أو الجهة غير الربحية** \*
- **Placeholder**: أدخل الاسم المحدد لـ **المنظمة أو الجهة غير الربحية**

#### Community (مجتمع / سلطة محلية)

- **Label**: الاسم المحدد لـ **المجتمع / السلطة المحلية** \*
- **Placeholder**: أدخل الاسم المحدد لـ **المجتمع / السلطة المحلية**

#### Individual (فرد)

- **Label**: الاسم المحدد لـ **الفرد** \*
- **Placeholder**: أدخل الاسم المحدد لـ **الفرد**

#### Other (أخرى)

- **Label**: الاسم المحدد لـ **الجهة الأخرى** \*
- **Placeholder**: أدخل الاسم المحدد لـ **الجهة الأخرى**

## Before vs After

### Before (Mixed Languages ❌)

```
┌─────────────────────────────────────────┐
│ من هو المخاطب بهذه العريضة؟ *          │
│ ┌─────────────────────────────────────┐ │
│ │ 🏛️ مسؤول / جهة حكومية             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ الاسم المحدد لـ Government *            │  ❌
│ ┌─────────────────────────────────────┐ │
│ │ أدخل الاسم المحدد لـ government     │ │  ❌
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### After (Fully Translated ✅)

```
┌─────────────────────────────────────────┐
│ من هو المخاطب بهذه العريضة؟ *          │
│ ┌─────────────────────────────────────┐ │
│ │ 🏛️ مسؤول / جهة حكومية             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ الاسم المحدد لـ المسؤول / الجهة الحكومية *  │  ✅
│ ┌─────────────────────────────────────┐ │
│ │ أدخل الاسم المحدد لـ المسؤول / الجهة │ │  ✅
│ │ الحكومية                            │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## Files Modified

1. ✅ `src/hooks/useTranslation.ts` - Added 6 type name translation keys (Arabic & French)
2. ✅ `src/app/petitions/create/page.tsx` - Updated to use nested translation for type names

## Testing

- ✅ Dev server compiled successfully
- ✅ No TypeScript errors
- ✅ Ready for user testing

### Test Steps

1. Navigate to `/petitions/create`
2. Complete step 1 (Publisher Information)
3. Click "Next" to go to step 2 (Petition Details)
4. Select a petition type
5. For each "Addressed To" option, verify:
   - Select "مسؤول / جهة حكومية" → Label shows "الاسم المحدد لـ **المسؤول / الجهة الحكومية** \*"
   - Select "شركة أو جهة خاصة" → Label shows "الاسم المحدد لـ **الشركة أو الجهة الخاصة** \*"
   - Select "منظمة أو جهة غير ربحية" → Label shows "الاسم المحدد لـ **المنظمة أو الجهة غير الربحية** \*"
   - Select "مجتمع / سلطة محلية" → Label shows "الاسم المحدد لـ **المجتمع / السلطة المحلية** \*"
   - Select "فرد" → Label shows "الاسم المحدد لـ **الفرد** \*"
   - Select "أخرى" → Label shows "الاسم المحدد لـ **الجهة الأخرى** \*"
6. Verify placeholders also show translated text
7. Test in French to verify French translations work correctly

## Summary

Successfully fixed the mixed language issue in the "Specific Name" field by creating separate translation keys for each addressee type name and using nested translation calls. The label and placeholder now display fully translated text in Arabic and French instead of mixing English words into Arabic/French sentences.
