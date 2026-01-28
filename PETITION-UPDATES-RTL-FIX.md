# Petition Updates - Arabic Translation & RTL Support

## Changes Made

### 1. Added Translations (`src/hooks/useTranslation.ts`)

**Arabic Translations**:

- `updates.title`: "التحديثات"
- `updates.postUpdate`: "نشر تحديث"
- `updates.noUpdates`: "لا توجد تحديثات بعد"
- `updates.noUpdatesCreator`: "انشر أول تحديث لإبقاء المؤيدين على اطلاع"
- `updates.noUpdatesVisitor`: "لم ينشر منشئ العريضة أي تحديثات"
- `updates.updateTitle`: "عنوان التحديث"
- `updates.updateContent`: "محتوى التحديث"
- `updates.titlePlaceholder`: "مثال: وصلنا إلى 1,000 توقيع!"
- `updates.contentPlaceholder`: "شارك التقدم أو الأخبار أو اشكر المؤيدين..."
- `updates.charactersCount`: "{count}/1000 حرف"
- `updates.posting`: "جاري النشر..."
- `updates.cancel`: "إلغاء"
- `updates.edit`: "تعديل"
- `updates.delete`: "حذف"
- `updates.save`: "حفظ"
- `updates.saving`: "جاري الحفظ..."
- `updates.saveChanges`: "حفظ التغييرات"
- `updates.editOnce`: "يمكنك تعديل هذا التحديث مرة واحدة فقط"
- `updates.edited`: "تم التعديل"
- `updates.by`: "بواسطة"
- `updates.deleteConfirmTitle`: "حذف التحديث؟"
- `updates.deleteConfirmMessage`: "هل أنت متأكد من حذف هذا التحديث؟ لا يمكن التراجع عن هذا الإجراء."
- `updates.deleting`: "جاري الحذف..."
- `updates.fillAllFields`: "يرجى ملء جميع الحقول"
- `updates.mustBeLoggedIn`: "يجب تسجيل الدخول لنشر التحديثات"
- `updates.addFailed`: "فشل إضافة التحديث. يرجى المحاولة مرة أخرى."
- `updates.updateFailed`: "فشل التحديث. يرجى المحاولة مرة أخرى."
- `updates.deleteFailed`: "فشل حذف التحديث. يرجى المحاولة مرة أخرى."

**French Translations**: (Same keys with French text)

### 2. Updated Component (`src/components/petitions/PetitionUpdates.tsx`)

**RTL Support Added**:

- Added `useTranslation` hook with `locale` detection
- Added `isRTL` flag for Arabic language
- Added `dir={isRTL ? 'rtl' : 'ltr'}` to all containers
- Adjusted spacing: `ml-4` → `${isRTL ? 'mr-4' : 'ml-4'}`
- Adjusted positioning: `left-4` → `${isRTL ? 'right-4' : 'left-4'}`
- Adjusted flex alignment for RTL

**Translations Applied**:

- All hardcoded English text replaced with `t('updates.key')`
- Alert messages translated
- Form labels translated
- Button text translated
- Placeholder text translated
- Empty state messages translated
- Confirmation dialog translated

**Date Formatting**:

- Updated to use locale-aware formatting:
  ```typescript
  new Intl.DateTimeFormat(
    locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-FR' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(date);
  ```

## RTL Layout Changes

### Before (LTR only):

```tsx
<div className="flex gap-4">
  <div className="flex-shrink-0">...</div>
  <div className="flex-1">...</div>
</div>
```

### After (RTL-aware):

```tsx
<div className="flex gap-4" dir={isRTL ? 'rtl' : 'ltr'}>
  <div className="flex-shrink-0">...</div>
  <div className="flex-1">...</div>
</div>
```

### Timeline Positioning:

```tsx
{
  /* Before */
}
<div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200" />;

{
  /* After */
}
<div
  className={`absolute top-10 bottom-0 w-0.5 bg-gray-200 ${isRTL ? 'right-4' : 'left-4'}`}
/>;
```

### Button Alignment:

```tsx
{/* Before */}
<div className="flex gap-3 justify-end">

{/* After */}
<div className={`flex gap-3 ${isRTL ? 'justify-start' : 'justify-end'}`}>
```

## Features

### Updates Section

✅ **Title**: "التحديثات" (Arabic) / "Mises à jour" (French)
✅ **Post Update Button**: "نشر تحديث" (Arabic)
✅ **Empty State**: Translated messages for creator vs visitor
✅ **Form Labels**: All translated
✅ **Placeholders**: Contextual Arabic examples
✅ **Character Counter**: "{count}/1000 حرف"

### Edit/Delete Actions

✅ **Edit Button**: "تعديل"
✅ **Delete Button**: "حذف"
✅ **Save Button**: "حفظ التغييرات"
✅ **Cancel Button**: "إلغاء"
✅ **Edit Warning**: "يمكنك تعديل هذا التحديث مرة واحدة فقط"

### Delete Confirmation

✅ **Title**: "حذف التحديث؟"
✅ **Message**: "هل أنت متأكد من حذف هذا التحديث؟ لا يمكن التراجع عن هذا الإجراء."
✅ **Buttons**: "إلغاء" / "حذف"
✅ **Loading**: "جاري الحذف..."

### Error Messages

✅ **Fill Fields**: "يرجى ملء جميع الحقول"
✅ **Login Required**: "يجب تسجيل الدخول لنشر التحديثات"
✅ **Add Failed**: "فشل إضافة التحديث. يرجى المحاولة مرة أخرى."
✅ **Update Failed**: "فشل التحديث. يرجى المحاولة مرة أخرى."
✅ **Delete Failed**: "فشل حذف التحديث. يرجى المحاولة مرة أخرى."

## Visual Changes

### Arabic (RTL):

```
┌─────────────────────────────────────────┐
│  التحديثات                  [نشر تحديث] │
├─────────────────────────────────────────┤
│                                         │
│              📄                         │
│        لا توجد تحديثات بعد              │
│  انشر أول تحديث لإبقاء المؤيدين على اطلاع │
│                                         │
└─────────────────────────────────────────┘
```

### English/French (LTR):

```
┌─────────────────────────────────────────┐
│  Updates                  [Post Update] │
├─────────────────────────────────────────┤
│                                         │
│              📄                         │
│          No updates yet                 │
│  Post your first update to keep...      │
│                                         │
└─────────────────────────────────────────┘
```

## Testing Checklist

### Arabic (RTL)

- [ ] Title shows "التحديثات" on the right
- [ ] "نشر تحديث" button on the left
- [ ] Form inputs align right
- [ ] Timeline dots on the right side
- [ ] Edit/delete buttons on the left of update cards
- [ ] Date format shows Arabic month names
- [ ] Character counter shows Arabic numerals
- [ ] Empty state message in Arabic

### French

- [ ] Title shows "Mises à jour"
- [ ] "Publier une mise à jour" button
- [ ] Form inputs align left
- [ ] Timeline dots on the left side
- [ ] Date format shows French month names
- [ ] All text in French

### Functionality

- [ ] Post update works
- [ ] Edit update works (one time only)
- [ ] Delete confirmation shows in correct language
- [ ] Delete works
- [ ] Error messages show in correct language
- [ ] Character counter updates correctly

## Files Modified

1. ✅ `src/hooks/useTranslation.ts` - Added 30+ translation keys
2. ✅ `src/components/petitions/PetitionUpdates.tsx` - Full RTL support

## Impact

- ✅ **Arabic users**: Can now read and interact with updates in Arabic
- ✅ **RTL layout**: Proper right-to-left layout for Arabic
- ✅ **French users**: All text translated to French
- ✅ **Date formatting**: Locale-aware date display
- ✅ **No breaking changes**: English still works as before

## Next Steps

1. Test on published petition page
2. Verify RTL layout in Arabic
3. Test all CRUD operations (Create, Read, Update, Delete)
4. Verify date formatting in all languages
5. Test on mobile devices
