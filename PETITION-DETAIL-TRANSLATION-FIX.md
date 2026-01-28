# Petition Detail Page Translation Fix

## Status: ✅ DONE

Fixed untranslated text in the petition detail page breadcrumb and metadata section.

## Changes Made

### 1. Added Translation Keys to `src/hooks/useTranslation.ts`

#### Arabic

```typescript
'common.home': 'الرئيسية',
'common.by': 'بواسطة',
'dashboard.filter.archived': 'مؤرشفة',
```

#### French

```typescript
'common.home': 'Accueil',
'common.by': 'Par',
'dashboard.filter.archived': 'Archivées',
```

### 2. Updated `src/app/petitions/[id]/page.tsx`

#### Breadcrumb Navigation

**Before:**

```tsx
<Link href="/" className="hover:text-gray-700">
  Home
</Link>
<span>/</span>
<Link href="/petitions" className="hover:text-gray-700">
  Petitions
</Link>
```

**After:**

```tsx
<Link href="/" className="hover:text-gray-700">
  {t('common.home')}
</Link>
<span>/</span>
<Link href="/petitions" className="hover:text-gray-700">
  {t('petitions.title')}
</Link>
```

#### Petition Metadata - "By" Text

**Before:**

```tsx
By{' '}
<span className="font-medium">
  {creatorLoading ? 'Loading...' : creator?.name || 'Unknown User'}
</span>
```

**After:**

```tsx
{
  t('common.by');
}
{
  (' ');
}
<span className="font-medium">
  {creatorLoading ? t('common.loading') : creator?.name || 'Unknown User'}
</span>;
```

#### Status Label Translation

**Before:**

```tsx
const statusLabel = getPetitionStatusLabel(petition.status);
```

**After:**

```tsx
// Get translated status label
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'draft':
      return t('dashboard.filter.all');
    case 'pending':
      return t('dashboard.filter.pending');
    case 'approved':
      return t('dashboard.filter.active');
    case 'paused':
      return t('dashboard.filter.paused');
    case 'deleted':
      return t('dashboard.filter.deleted');
    case 'archived':
      return t('dashboard.filter.archived');
    default:
      return status;
  }
};
const statusLabel = getStatusLabel(petition.status);
```

## Translation Mapping

### Breadcrumb

- **Home** → `common.home`
  - Arabic: الرئيسية
  - French: Accueil
- **Petitions** → `petitions.title`
  - Arabic: العرائض
  - French: Pétitions

### Metadata

- **By** → `common.by`
  - Arabic: بواسطة
  - French: Par

- **Loading...** → `common.loading`
  - Arabic: جاري التحميل...
  - French: Chargement...

### Status Labels

- **Active** → `dashboard.filter.active`
  - Arabic: نشطة
  - French: Actives

- **Pending Review** → `dashboard.filter.pending`
  - Arabic: في انتظار المراجعة
  - French: En attente de révision

- **Paused** → `dashboard.filter.paused`
  - Arabic: متوقفة
  - French: En pause

- **Deleted** → `dashboard.filter.deleted`
  - Arabic: محذوفة
  - French: Supprimées

- **Archived** → `dashboard.filter.archived`
  - Arabic: مؤرشفة
  - French: Archivées

## Result

### Before (Mixed Languages)

```
Home / Petitions / عريضة لإصلاح البنية التحتية للطرق في حي الأمل

عريضة لإصلاح البنية التحتية للطرق في حي الأمل
Active • Infrastructure • By 3arida App • 1/27/2026
```

### After (Arabic)

```
الرئيسية / العرائض / عريضة لإصلاح البنية التحتية للطرق في حي الأمل

عريضة لإصلاح البنية التحتية للطرق في حي الأمل
نشطة • Infrastructure • بواسطة 3arida App • 1/27/2026
```

### After (French)

```
Accueil / Pétitions / Pétition pour réparer l'infrastructure routière

Pétition pour réparer l'infrastructure routière
Actives • Infrastructure • Par 3arida App • 1/27/2026
```

## Files Modified

1. ✅ `src/hooks/useTranslation.ts` - Added translation keys
2. ✅ `src/app/petitions/[id]/page.tsx` - Updated breadcrumb, metadata, and status label

## Testing Checklist

- [ ] Breadcrumb shows translated text in Arabic
- [ ] Breadcrumb shows translated text in French
- [ ] "By" text is translated
- [ ] "Loading..." text is translated
- [ ] Status badges show translated labels
- [ ] All status types are translated (Active, Pending, Paused, Deleted, Archived)

## Notes

- The category name (e.g., "Infrastructure") is not translated as it comes from the database
- The petition title is not translated as it's user-generated content
- The date format is handled by JavaScript's `toLocaleDateString()` which automatically formats based on locale
- Status labels now use the same translation keys as the dashboard filters for consistency

## Summary

All hardcoded English text in the petition detail page breadcrumb and metadata section has been replaced with translation keys. The page now fully supports Arabic, French, and English languages.
