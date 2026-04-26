/**
 * Translation mappings for PDF report
 * Converts English values to Arabic
 */

export const petitionTypeTranslations: Record<string, string> = {
  'Start': 'بدء',
  'Stop': 'إيقاف',
  'Change': 'تغيير',
  'Support': 'دعم',
};

export const categoryTranslations: Record<string, string> = {
  'Infrastructure': 'البنية التحتية',
  'Education': 'التعليم',
  'Health': 'الصحة',
  'Environment': 'البيئة',
  'Transportation': 'النقل',
  'Economy': 'الاقتصاد',
  'Social': 'اجتماعي',
  'Culture': 'الثقافة',
  'Sports': 'الرياضة',
  'Technology': 'التكنولوجيا',
  'Security': 'الأمن',
  'Justice': 'العدالة',
  'Housing': 'الإسكان',
  'Employment': 'التوظيف',
  'Youth': 'الشباب',
  'Women': 'المرأة',
  'Children': 'الأطفال',
  'Elderly': 'كبار السن',
  'Disability': 'ذوي الاحتياجات الخاصة',
  'Other': 'أخرى',
};

export const subcategoryTranslations: Record<string, string> = {
  'Transportation': 'النقل',
  'Roads': 'الطرق',
  'Public Transport': 'النقل العام',
  'Traffic': 'المرور',
  'Water': 'المياه',
  'Electricity': 'الكهرباء',
  'Sanitation': 'الصرف الصحي',
  'Waste Management': 'إدارة النفايات',
  'Parks': 'الحدائق',
  'Schools': 'المدارس',
  'Universities': 'الجامعات',
  'Hospitals': 'المستشفيات',
  'Clinics': 'العيادات',
  'Pollution': 'التلوث',
  'Green Spaces': 'المساحات الخضراء',
  'Other': 'أخرى',
};

export const addressedToTypeTranslations: Record<string, string> = {
  'Government': 'الحكومة',
  'Ministry': 'وزارة',
  'Municipality': 'البلدية',
  'Parliament': 'البرلمان',
  'Company': 'شركة',
  'Organization': 'منظمة',
  'Individual': 'فرد',
  'Other': 'أخرى',
};

export const publisherTypeTranslations: Record<string, string> = {
  'Individual': 'فرد',
  'Organization': 'منظمة',
  'Influencer': 'مؤثر',
  'Association': 'جمعية',
  'NGO': 'منظمة غير حكومية',
  'Other': 'أخرى',
};

export const statusTranslations: Record<string, string> = {
  'draft': 'مسودة',
  'pending': 'قيد المراجعة',
  'approved': 'موافق عليها',
  'rejected': 'مرفوضة',
  'closed': 'مغلقة',
  'archived': 'مؤرشفة',
};

export const pricingTierTranslations: Record<string, string> = {
  'free': 'مجاني',
  'starter': 'المبتدئ',
  'pro': 'محترف',
  'advanced': 'متقدم',
  'enterprise': 'مؤسسي',
};

/**
 * Translate a value using the appropriate translation map
 */
export function translateValue(value: string | undefined | null, type: 'petitionType' | 'category' | 'subcategory' | 'addressedToType' | 'publisherType' | 'status' | 'pricingTier'): string {
  if (!value) return 'غير محدد';
  
  const maps = {
    petitionType: petitionTypeTranslations,
    category: categoryTranslations,
    subcategory: subcategoryTranslations,
    addressedToType: addressedToTypeTranslations,
    publisherType: publisherTypeTranslations,
    status: statusTranslations,
    pricingTier: pricingTierTranslations,
  };
  
  return maps[type][value] || value;
}
