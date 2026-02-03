# Petition Template System Implementation - COMPLETE

## Overview

**STATUS**: ✅ COMPLETE  
**FEATURE**: Pre-filled petition templates from influencers page

## What Was Implemented

### 1. Template Data Structure

Created `PETITION_TEMPLATES` object with 6 pre-defined petition templates matching the influencers page:

```typescript
const PETITION_TEMPLATES: Record<
  string,
  {
    title: string;
    description: string;
    category: string;
    subcategory: string;
    petitionType: string;
    addressedToType: string;
    addressedToSpecific: string;
    targetSignatures: number;
    tags: string;
  }
> = {
  '1': {
    /* Forest Protection */
  },
  '2': {
    /* Free Internet in Rural Schools */
  },
  '3': {
    /* Mental Health for Youth */
  },
  '4': {
    /* Disability Rights */
  },
  '5': {
    /* Public Transportation */
  },
  '6': {
    /* Cultural Heritage */
  },
};
```

### 2. URL Parameter Handling

- ✅ Added `useSearchParams` hook to petition creation form
- ✅ Template ID passed via `?template={id}` URL parameter
- ✅ Automatic form pre-filling when template parameter is detected

### 3. Template Loading Logic

```typescript
useEffect(() => {
  const templateId = searchParams.get('template');
  if (templateId && PETITION_TEMPLATES[templateId]) {
    const template = PETITION_TEMPLATES[templateId];

    // Pre-fill form data
    setFormData((prev) => ({
      ...prev,
      title: template.title,
      description: template.description,
      category: template.category,
      subcategory: template.subcategory,
      petitionType: template.petitionType,
      addressedToType: template.addressedToType,
      addressedToSpecific: template.addressedToSpecific,
      targetSignatures: template.targetSignatures,
      tags: template.tags,
    }));

    // Navigate to content step (step 2)
    setCurrentStep(2);
  }
}, [searchParams]);
```

### 4. User Experience Flow

1. **User clicks "Adopt this petition"** on influencers page
2. **Redirected to** `/petitions/create?template=1` (example)
3. **Form automatically pre-fills** with template data
4. **User taken to step 2** (content step) since basic info is filled
5. **User can modify** title, description, or other fields as needed
6. **Continue normal** petition creation process

## Template Details

### Template 1: Forest Protection

- **Title**: حماية الغابات المغربية من التصحر
- **Category**: Environment → Climate Change
- **Type**: Start petition
- **Target**: 10,000 signatures
- **Addressed to**: وزارة الانتقال الطاقي والتنمية المستدامة

### Template 2: Rural Internet Access

- **Title**: توفير الإنترنت المجاني في المدارس الريفية
- **Category**: Education → Educational Access
- **Type**: Start petition
- **Target**: 5,000 signatures
- **Addressed to**: وزارة التربية الوطنية والتعليم الأولي والرياضة

### Template 3: Youth Mental Health

- **Title**: تحسين خدمات الصحة النفسية للشباب
- **Category**: Healthcare → Mental Health
- **Type**: Start petition
- **Target**: 7,500 signatures
- **Addressed to**: وزارة الصحة والحماية الاجتماعية

### Template 4: Disability Rights

- **Title**: دعم حقوق الأشخاص ذوي الإعاقة
- **Category**: Social Justice → Disability Rights
- **Type**: Support petition
- **Target**: 3,000 signatures
- **Addressed to**: وزارة التضامن والإدماج الاجتماعي والأسرة

### Template 5: Public Transportation

- **Title**: تطوير النقل العمومي في المدن الكبرى
- **Category**: Infrastructure → Transportation
- **Type**: Start petition
- **Target**: 15,000 signatures
- **Addressed to**: وزارة التجهيز والنقل واللوجستيك والماء

### Template 6: Cultural Heritage

- **Title**: الحفاظ على التراث الثقافي المغربي
- **Category**: Culture → Cultural Heritage
- **Type**: Support petition
- **Target**: 2,500 signatures
- **Addressed to**: وزارة الشباب والثقافة والتواصل

## Technical Implementation

### Files Modified:

1. **`src/app/petitions/create/page.tsx`**
   - Added `useSearchParams` import
   - Added `PETITION_TEMPLATES` constant
   - Added template loading `useEffect`
   - Form pre-filling logic

2. **`src/app/influencers/page.tsx`**
   - Links already correctly set up: `/petitions/create?template=${idea.id}`

### URL Structure:

- **Template adoption**: `/petitions/create?template=1`
- **Regular creation**: `/petitions/create`

### Error Handling:

- Invalid template IDs are ignored (no error thrown)
- Form continues to work normally if template not found
- Console logging for debugging template loading

## Benefits

### For Users:

- **Reduced friction**: No need to start from scratch
- **Professional content**: Well-written, comprehensive descriptions
- **Proper categorization**: Templates include correct categories and targets
- **Government addressing**: Proper ministry names and addressing

### For Platform:

- **Higher completion rates**: Pre-filled forms are more likely to be completed
- **Better quality**: Templates ensure comprehensive petition descriptions
- **Faster onboarding**: Users can create petitions quickly
- **Consistent formatting**: All template-based petitions follow same structure

## Future Enhancements

### Phase 2 Features:

1. **Template Management System**
   - Admin interface to create/edit templates
   - Template categories and filtering
   - Template usage analytics

2. **Dynamic Templates**
   - User-generated templates
   - Community template sharing
   - Template rating system

3. **Enhanced Pre-filling**
   - Publisher information pre-filling
   - Location-based templates
   - Seasonal/trending templates

4. **Template Customization**
   - Template variations (different target audiences)
   - Localized templates (city-specific)
   - Industry-specific templates

---

**IMPLEMENTATION COMPLETE**: Users can now click "Adopt this petition" on the influencers page and be taken to a pre-filled petition creation form with the title, description, category, and other details automatically filled in. This significantly reduces friction and improves the user experience for creating petitions based on suggested ideas.
