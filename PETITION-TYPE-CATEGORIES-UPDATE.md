# Petition Type Categories Update

## Status: ✅ COMPLETE

## Changes Made

Updated the petition type options in step 2 of the petition creation form with improved Arabic descriptions and added two new petition types.

### Previous Petition Types (4 types)

1. 🔄 تغيير - طلب تغيير في السياسة أو الممارسة
2. ✊ دعم - إظهار الدعم لقضية أو شخص
3. 🛑 إيقاف - منع حدوث شيء ما
4. 🚀 بدء - بدء مبادرة أو برنامج جديد

### Updated Petition Types (6 types)

1. 🔄 **تغيير** - طلب تغيير في سياسة أو ممارسة
2. ✊ **دعم** - إظهار الدعم لقضية أو شخص
3. ⛔ **إيقاف** - منع أو إيقاف إجراء أو قرار _(updated emoji and description)_
4. 🚀 **بدء** - إطلاق مبادرة أو برنامج جديد _(updated description)_
5. ⚖️ **مساءلة وعدالة** - المطالبة بالمحاسبة أو التحقيق أو تحقيق العدالة _(NEW)_
6. 📢 **توعية واعتراف** - رفع الوعي أو المطالبة بالاعتراف بقضية ما _(NEW)_

## Updates Made

### 1. Arabic Translations

**File**: `src/hooks/useTranslation.ts`

**Updated:**

```typescript
'form.stop': '⛔ إيقاف - منع أو إيقاف إجراء أو قرار',  // Changed emoji from 🛑 to ⛔
'form.start': '🚀 بدء - إطلاق مبادرة أو برنامج جديد',  // Updated description
```

**Added:**

```typescript
'form.accountability': '⚖️ مساءلة وعدالة - المطالبة بالمحاسبة أو التحقيق أو تحقيق العدالة',
'form.awareness': '📢 توعية واعتراف - رفع الوعي أو المطالبة بالاعتراف بقضية ما',
```

### 2. French Translations

**File**: `src/hooks/useTranslation.ts`

**Updated:**

```typescript
'form.stop': '⛔ Arrêter - Empêcher ou arrêter une action ou une décision',
'form.start': '🚀 Commencer - Lancer une nouvelle initiative ou programme',
```

**Added:**

```typescript
'form.accountability': '⚖️ Responsabilité et justice - Demander des comptes, une enquête ou la justice',
'form.awareness': '📢 Sensibilisation et reconnaissance - Sensibiliser ou demander la reconnaissance d\'une cause',
```

### 3. Form Options Updated

**File**: `src/app/petitions/create/page.tsx`

**Added two new options to the petition type select:**

```tsx
<option value="Accountability">{t('form.accountability')}</option>
<option value="Awareness">{t('form.awareness')}</option>
```

## Petition Type Descriptions

### Arabic (العربية)

| Type          | Emoji | Description                                    |
| ------------- | ----- | ---------------------------------------------- |
| تغيير         | 🔄    | طلب تغيير في سياسة أو ممارسة                   |
| دعم           | ✊    | إظهار الدعم لقضية أو شخص                       |
| إيقاف         | ⛔    | منع أو إيقاف إجراء أو قرار                     |
| بدء           | 🚀    | إطلاق مبادرة أو برنامج جديد                    |
| مساءلة وعدالة | ⚖️    | المطالبة بالمحاسبة أو التحقيق أو تحقيق العدالة |
| توعية واعتراف | 📢    | رفع الوعي أو المطالبة بالاعتراف بقضية ما       |

### French (Français)

| Type                              | Emoji | Description                                            |
| --------------------------------- | ----- | ------------------------------------------------------ |
| Changement                        | 🔄    | Demander un changement de politique ou de pratique     |
| Soutien                           | ✊    | Montrer le soutien pour une cause ou une personne      |
| Arrêter                           | ⛔    | Empêcher ou arrêter une action ou une décision         |
| Commencer                         | 🚀    | Lancer une nouvelle initiative ou programme            |
| Responsabilité et justice         | ⚖️    | Demander des comptes, une enquête ou la justice        |
| Sensibilisation et reconnaissance | 📢    | Sensibiliser ou demander la reconnaissance d'une cause |

### English (Fallback)

| Type           | Emoji | Description                                       |
| -------------- | ----- | ------------------------------------------------- |
| Change         | 🔄    | Request a change in policy or practice            |
| Support        | ✊    | Show support for a cause or person                |
| Stop           | ⛔    | Prevent or stop an action or decision             |
| Start          | 🚀    | Launch a new initiative or program                |
| Accountability | ⚖️    | Demand accountability, investigation, or justice  |
| Awareness      | 📢    | Raise awareness or demand recognition of an issue |

## Use Cases for New Types

### ⚖️ Accountability & Justice (مساءلة وعدالة)

Perfect for petitions demanding:

- Investigation into corruption or misconduct
- Legal action against wrongdoing
- Accountability from officials or organizations
- Justice for victims
- Transparency in government or corporate actions

**Example**: "نطالب بالتحقيق في قضية الفساد المالي في المشروع العمومي"

### 📢 Awareness & Recognition (توعية واعتراف)

Perfect for petitions seeking:

- Raising public awareness about an issue
- Recognition of a historical event or injustice
- Acknowledgment of a community's rights
- Official recognition of a cause or movement
- Educational campaigns

**Example**: "نطالب بالاعتراف الرسمي بيوم الذاكرة الوطنية"

## Files Modified

1. ✅ `src/hooks/useTranslation.ts` - Updated and added petition type translations (Arabic & French)
2. ✅ `src/app/petitions/create/page.tsx` - Added new petition type options to the form

## Testing

- ✅ Dev server compiled successfully
- ✅ No TypeScript errors
- ✅ Ready for user testing

### Test Steps

1. Navigate to `/petitions/create`
2. Complete step 1 (Publisher Information)
3. Click "Next" to go to step 2 (Petition Details)
4. Click on "نوع العريضة" dropdown
5. Verify all 6 petition types are displayed with correct emojis and descriptions:
   - 🔄 تغيير
   - ✊ دعم
   - ⛔ إيقاف (updated emoji)
   - 🚀 بدء
   - ⚖️ مساءلة وعدالة (NEW)
   - 📢 توعية واعتراف (NEW)
6. Test in French to verify translations
7. Select each type and verify form accepts the selection

## Summary

Successfully updated the petition type categories in step 2 of the petition creation form. Updated descriptions for existing types (Stop and Start), changed the Stop emoji from 🛑 to ⛔, and added two new petition types: "Accountability & Justice" (⚖️ مساءلة وعدالة) and "Awareness & Recognition" (📢 توعية واعتراف). All translations are available in Arabic and French with English fallback.
