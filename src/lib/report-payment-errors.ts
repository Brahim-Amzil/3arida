/**
 * Arabic user-facing messages for report PDF payment API errors.
 */

export function mapReportPaymentApiError(
  error?: string,
  code?: string,
): string {
  if (code === 'COUNT_MISMATCH') {
    return 'عداد التحميلات غير متزامن مع الخادم. حدّث الصفحة (F5) ثم حاول الدفع مرة أخرى.';
  }

  const message = typeof error === 'string' ? error.trim() : '';

  if (!message) {
    return 'تعذر بدء عملية الدفع';
  }

  if (message.includes('STRIPE_SECRET_KEY')) {
    return 'خطأ في إعداد الدفع على الخادم. يرجى التواصل مع الدعم.';
  }

  if (
    message.includes('not authenticated') ||
    message.includes('User not authenticated')
  ) {
    return 'يجب تسجيل الدخول لإتمام الدفع.';
  }

  if (message.includes('permission')) {
    return 'ليس لديك صلاحية دفع تحميل تقرير هذه العريضة.';
  }

  if (message.includes('No payment required')) {
    return 'لا حاجة للدفع لهذا التحميل حسب سجل الخادم. حدّث الصفحة؛ إن استمر الخطأ تواصل مع الدعم.';
  }

  if (message.includes('Petition not found')) {
    return 'لم يتم العثور على العريضة.';
  }

  return message;
}
