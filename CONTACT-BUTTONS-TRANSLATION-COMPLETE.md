# Contact Buttons - Translation Complete

## Summary

Added full Arabic translation support to the ContactButtons component for the tier-restricted moderator contact feature.

## Translations Added

### Arabic (messages/ar.json)

Added to `contactModerator` section:

```json
{
  "contactModeratorButton": "تواصل مع المشرف",
  "contactSupportButton": "تواصل مع الدعم",
  "lockedTitle": "التواصل المباشر مع المشرفين متاح للعرائض المدفوعة فقط",
  "lockedDescription": "يمكنك استخدام نموذج الدعم العام أو ترقية عريضتك للحصول على دعم مباشر من المشرفين",
  "paidPetitionsOnly": "التواصل المباشر مع المشرفين مخصص للعرائض المدفوعة"
}
```

### Translation Keys

1. **contactModeratorButton**: Button text for "Contact Moderator"
2. **contactSupportButton**: Button text for "Contact Support"
3. **lockedTitle**: Main message when feature is locked
4. **lockedDescription**: Explanation and alternative options
5. **paidPetitionsOnly**: Helper text below buttons

## Component Updates

### ContactButtons.tsx

**Changes:**

- Added `useTranslation` hook import
- Replaced all hardcoded Arabic text with translation keys
- All text now properly translates based on locale

**Translated Elements:**

- Button labels (both moderator and support)
- Inline locked message (title and description)
- Helper text for free tier users

## Text Alignment

All text is properly aligned:

- Helper text: `text-right` (right-aligned for Arabic)
- Inline message: Properly structured with RTL support
- Button text: Centered within buttons

## Testing

Verify translations work:

- [ ] Free petition shows Arabic text correctly
- [ ] Paid petition shows Arabic text correctly
- [ ] Locked message displays in Arabic
- [ ] Helper text is right-aligned
- [ ] All text is readable and properly formatted
- [ ] Switching locales (if supported) works correctly

## Files Modified

1. **messages/ar.json** - Added 5 new translation keys
2. **src/components/moderation/ContactButtons.tsx** - Integrated translations

## Benefits

- ✅ Fully localized user experience
- ✅ Consistent with rest of application
- ✅ Easy to add more languages in future
- ✅ Maintainable translation system
- ✅ Professional Arabic text
