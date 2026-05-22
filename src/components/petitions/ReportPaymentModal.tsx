'use client';

/**
 * Modal for purchasing additional report downloads (10 or 19 MAD by tier).
 * Uses inline Arabic copy — verify/dashboard routes are outside [locale] layout.
 */

import { useState } from 'react';
import { CreditCard, Check } from 'lucide-react';
import { Petition } from '@/types/petition';
import { getDownloadPrice } from '@/lib/report-access-control';
import { Button } from '@/components/ui/button';

interface ReportPaymentModalProps {
  petition: Petition;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReportPaymentModal({
  petition,
  isOpen,
  onClose,
  onSuccess,
}: ReportPaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | null>(null);
  const price = getDownloadPrice(petition);

  const handlePayment = async (method: 'stripe' | 'paypal') => {
    setIsProcessing(true);
    setPaymentMethod(method);

    try {
      // TODO: Implement actual payment processing (RPT-06)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert(`جاري المعالجة... — تقرير PDF رسمي`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      alert(
        'فشل الدفع: ' +
          (error instanceof Error ? error.message : 'خطأ في الشبكة'),
      );
    } finally {
      setIsProcessing(false);
      setPaymentMethod(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="إغلاق"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-payment-title"
        className="relative z-10 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg"
        dir="rtl"
      >
        <div className="mb-4 space-y-2">
          <h2 id="report-payment-title" className="text-lg font-semibold">
            تحميل تقرير العريضة
          </h2>
          <p className="text-sm text-muted-foreground">
            لقد استخدمت التحميلات المجانية لهذه العريضة
          </p>
        </div>

        <div className="space-y-6 py-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{price} درهم</p>
            <p className="text-sm text-muted-foreground">لتحميل واحد إضافي</p>
          </div>

          <div className="space-y-2">
            <p className="font-semibold">ما ستحصل عليه:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600 shrink-0" />
                <span className="text-sm">تقرير PDF رسمي</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600 shrink-0" />
                <span className="text-sm">رمز QR للتحقق</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600 shrink-0" />
                <span className="text-sm">جميع الإحصائيات</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600 shrink-0" />
                <span className="text-sm">صالح للتقديم الرسمي</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => handlePayment('stripe')}
              disabled={isProcessing}
              className="w-full gap-2"
              variant="default"
            >
              <CreditCard className="h-4 w-4" />
              {isProcessing && paymentMethod === 'stripe'
                ? 'جاري المعالجة...'
                : 'الدفع بواسطة Stripe'}
            </Button>

            <Button
              onClick={() => handlePayment('paypal')}
              disabled={isProcessing}
              className="w-full gap-2"
              variant="outline"
            >
              <CreditCard className="h-4 w-4" />
              {isProcessing && paymentMethod === 'paypal'
                ? 'جاري المعالجة...'
                : 'الدفع بواسطة PayPal'}
            </Button>
          </div>

          <Button onClick={onClose} variant="ghost" className="w-full" disabled={isProcessing}>
            إلغاء
          </Button>
        </div>
      </div>
    </div>
  );
}
