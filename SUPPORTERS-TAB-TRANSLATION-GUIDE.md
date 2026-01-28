# Supporters Tab Translation Guide

## Translation Keys Needed

Add these to `src/hooks/useTranslation.ts`:

### Arabic Translations

```typescript
// Supporters Tab
'supporters.comments': 'التعليقات',
'supporters.signatures': 'التوقيعات',
'supporters.latest': 'الأحدث',
'supporters.mostLiked': 'الأكثر إعجاباً',
'supporters.shareThoughts': 'شارك أفكارك',
'supporters.whySupport': 'لماذا تدعم هذه العريضة؟',
'supporters.commentAnonymously': 'علق بشكل مجهول',
'supporters.posting': 'جاري النشر...',
'supporters.postComment': 'نشر تعليق',
'supporters.cancel': 'إلغاء',
'supporters.joinDiscussion': 'انضم إلى النقاش',
'supporters.signInToComment': 'سجل الدخول للتعليق',
'supporters.signInMessage': 'سجل الدخول لمشاركة أفكارك ودعم هذه العريضة.',
'supporters.noComments': 'لا توجد تعليقات بعد',
'supporters.noSignatures': 'لا توجد توقيعات بعد',
'supporters.noActivity': 'لا يوجد نشاط بعد',
'supporters.firstComment': 'كن أول من يشارك أفكاره حول هذه العريضة.',
'supporters.firstSignature': 'كن أول من يوقع على هذه العريضة!',
'supporters.firstSupport': 'كن أول من يدعم هذه العريضة.',
'supporters.anonymous': 'مجهول',
'supporters.comment': 'تعليق',
'supporters.signature': 'توقيع',
'supporters.reply': 'رد',
'supporters.delete': 'حذف',
'supporters.commentDeleted': '[تم حذف التعليق]',
'supporters.showReplies': 'عرض {count} رد',
'supporters.hideReplies': 'إخفاء الردود',
'supporters.replyTo': 'الرد على {name}',
'supporters.replying': 'جاري الرد...',
'supporters.postReply': 'نشر الرد',
'supporters.deleteConfirm': 'هل أنت متأكد من حذف هذا التعليق؟',
'supporters.deleteSuccess': 'تم حذف التعليق بنجاح',
'supporters.replyDeleteSuccess': 'تم حذف الرد بنجاح',
'supporters.loadMore': 'تحميل المزيد',
'supporters.loading': 'جاري التحميل...',
'supporters.signInToLike': 'يرجى تسجيل الدخول للإعجاب بالتعليقات',
'supporters.signInToReply': 'يرجى تسجيل الدخول للرد',
```

### French Translations

```typescript
// Supporters Tab
'supporters.comments': 'Commentaires',
'supporters.signatures': 'Signatures',
'supporters.latest': 'Récents',
'supporters.mostLiked': 'Les plus aimés',
'supporters.shareThoughts': 'Partagez vos pensées',
'supporters.whySupport': 'Pourquoi soutenez-vous cette pétition ?',
'supporters.commentAnonymously': 'Commenter anonymement',
'supporters.posting': 'Publication...',
'supporters.postComment': 'Publier le commentaire',
'supporters.cancel': 'Annuler',
'supporters.joinDiscussion': 'Rejoindre la discussion',
'supporters.signInToComment': 'Se connecter pour commenter',
'supporters.signInMessage': 'Connectez-vous pour partager vos pensées et soutenir cette pétition.',
'supporters.noComments': 'Aucun commentaire pour le moment',
'supporters.noSignatures': 'Aucune signature pour le moment',
'supporters.noActivity': 'Aucune activité pour le moment',
'supporters.firstComment': 'Soyez le premier à partager vos pensées sur cette pétition.',
'supporters.firstSignature': 'Soyez le premier à signer cette pétition !',
'supporters.firstSupport': 'Soyez le premier à soutenir cette pétition.',
'supporters.anonymous': 'Anonyme',
'supporters.comment': 'Commentaire',
'supporters.signature': 'Signature',
'supporters.reply': 'Répondre',
'supporters.delete': 'Supprimer',
'supporters.commentDeleted': '[Commentaire supprimé]',
'supporters.showReplies': 'Afficher {count} réponse(s)',
'supporters.hideReplies': 'Masquer les réponses',
'supporters.replyTo': 'Répondre à {name}',
'supporters.replying': 'Réponse en cours...',
'supporters.postReply': 'Publier la réponse',
'supporters.deleteConfirm': 'Êtes-vous sûr de vouloir supprimer ce commentaire ?',
'supporters.deleteSuccess': 'Commentaire supprimé avec succès',
'supporters.replyDeleteSuccess': 'Réponse supprimée avec succès',
'supporters.loadMore': 'Charger plus',
'supporters.loading': 'Chargement...',
'supporters.signInToLike': 'Veuillez vous connecter pour aimer les commentaires',
'supporters.signInToReply': 'Veuillez vous connecter pour répondre',
```

## Component Changes Needed

### 1. Import useTranslation

```typescript
import { useTranslation } from '@/hooks/useTranslation';
```

### 2. Add locale detection

```typescript
const { t, locale } = useTranslation();
const isRTL = locale === 'ar';
```

### 3. Update Tab Buttons

```typescript
// Before:
Comments ({comments.length})
Signatures ({signatures.length})

// After:
{t('supporters.comments')} ({comments.length})
{t('supporters.signatures')} ({signatures.length})
```

### 4. Update Sort Buttons

```typescript
// Before:
Latest
Most Liked

// After:
{t('supporters.latest')}
{t('supporters.mostLiked')}
```

### 5. Update Form Labels

```typescript
// Before:
Share your thoughts
Why do you support this petition?
Comment anonymously
Posting...
Post Comment
Cancel

// After:
{t('supporters.shareThoughts')}
{t('supporters.whySupport')}
{t('supporters.commentAnonymously')}
{t('supporters.posting')}
{t('supporters.postComment')}
{t('supporters.cancel')}
```

### 6. Update Empty States

```typescript
// Before:
No comments yet
Be the first to share your thoughts on this petition.

// After:
{t('supporters.noComments')}
{t('supporters.firstComment')}
```

### 7. Update Action Buttons

```typescript
// Before:
Reply
Delete
Show {count} replies
Hide replies

// After:
{t('supporters.reply')}
{t('supporters.delete')}
{t('supporters.showReplies', { count })}
{t('supporters.hideReplies')}
```

### 8. Add RTL Support

```typescript
// Add dir attribute to main container
<div className={className} dir={isRTL ? 'rtl' : 'ltr'}>

// Adjust spacing for RTL
className={`${isRTL ? 'mr-2' : 'ml-2'}`}

// Adjust flex direction for RTL
className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
```

## Quick Implementation Steps

1. **Add translations** to `src/hooks/useTranslation.ts` (both Arabic and French sections)

2. **Update component** `src/components/petitions/PetitionSupporters.tsx`:
   - Import `useTranslation`
   - Add `const { t, locale } = useTranslation()`
   - Add `const isRTL = locale === 'ar'`
   - Replace all hardcoded English text with `t('supporters.key')`
   - Add `dir={isRTL ? 'rtl' : 'ltr'}` to containers
   - Adjust spacing/positioning for RTL

3. **Test** in Arabic, French, and English

## Files to Modify

1. ✅ `src/hooks/useTranslation.ts` - Add ~40 translation keys
2. ✅ `src/components/petitions/PetitionSupporters.tsx` - Add translations and RTL support

## Expected Result

### Arabic (RTL):

```
┌─────────────────────────────────────────┐
│  [التوقيعات (1)]  [التعليقات (0)]      │
├─────────────────────────────────────────┤
│                                         │
│              💬                         │
│        لا توجد تعليقات بعد              │
│  كن أول من يشارك أفكاره حول هذه العريضة │
│                                         │
└─────────────────────────────────────────┘
```

### English/French (LTR):

```
┌─────────────────────────────────────────┐
│  [Comments (0)]  [Signatures (1)]       │
├─────────────────────────────────────────┤
│                                         │
│              💬                         │
│          No comments yet                │
│  Be the first to share your thoughts... │
│                                         │
└─────────────────────────────────────────┘
```

## Priority Items

1. **Tab labels** - "Comments" and "Signatures"
2. **Empty state** - "No comments yet" message
3. **Sort buttons** - "Latest" and "Most Liked"
4. **Form labels** - Comment form text
5. **Action buttons** - Reply, Delete, etc.
6. **RTL layout** - Proper right-to-left flow

## Testing Checklist

- [ ] Tab labels show in Arabic/French
- [ ] Empty state message translated
- [ ] Sort buttons translated
- [ ] Comment form translated
- [ ] Action buttons translated
- [ ] RTL layout works in Arabic
- [ ] Spacing correct in RTL
- [ ] All alerts/messages translated
