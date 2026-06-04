'use client';

/**
 * Stripe checkout for one-off report PDF downloads (10 or 19 MAD).
 */

import { useEffect, useState } from 'react';
import type { Stripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, Check, Loader2, X } from 'lucide-react';
import { Petition } from '@/types/petition';
import {
  FREE_EXTRA_DOWNLOAD_PRICE_MAD,
  getDownloadPrice,
} from '@/lib/report-access-control';
import { getStripe, isStripeClientConfigured } from '@/lib/stripe';
import { mapReportPaymentApiError } from '@/lib/report-payment-errors';
import { Button } from '@/components/ui/button';

interface ReportPaymentModalProps {
  petition: Petition;
  userId: string;
  userEmail?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newDownloadCount: number) => void;
}

interface PaymentFormProps {
  petition: Petition;
  userId: string;
  userEmail?: string;
  clientSecret: string;
  price: number;
  onClose: () => void;
  onSuccess: (newDownloadCount: number) => void;
}

function PaymentForm({
  petition,
  userId,
  userEmail,
  clientSecret,
  price,
  onClose,
  onSuccess,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('نظام الدفع غير جاهز. يرجى المحاولة مرة أخرى.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('عنصر البطاقة غير موجود');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement },
        });

      if (stripeError) {
        setError(stripeError.message || 'فشلت عملية الدفع');
        return;
      }

      if (paymentIntent?.status !== 'succeeded') {
        setError('لم تكتمل عملية الدفع');
        return;
      }

      const code = petition.referenceCode || petition.id;
      const downloadResponse = await fetch(
        `/api/petitions/${code}/report/download?paymentId=${encodeURIComponent(paymentIntent.id)}`,
        {
          headers: { 'x-user-id': userId },
        },
      );

      if (!downloadResponse.ok) {
        const errData = await downloadResponse.json().catch(() => null);
        throw new Error(
          errData?.error?.details ||
            errData?.error?.message ||
            'فشل تحميل التقرير بعد الدفع',
        );
      }

      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `petition-report-${code}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(anchor);

      const countHeader = downloadResponse.headers.get(
        'X-Report-Download-Count',
      );
      const newCount = countHeader
        ? Number.parseInt(countHeader, 10)
        : (petition.reportDownloads || 0) + 1;

      onSuccess(Number.isFinite(newCount) ? newCount : (petition.reportDownloads || 0) + 1);
      onClose();
    } catch (err) {
      console.error('Report payment error:', err);
      setError(
        err instanceof Error ? err.message : 'حدث خطأ أثناء الدفع أو التحميل',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border p-4 space-y-3">
        <label className="text-sm font-medium">بيانات البطاقة</label>
        <div className="rounded-md border bg-background p-3">
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: '16px',
                  color: '#111827',
                  '::placeholder': { color: '#9ca3af' },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full gap-2">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CreditCard className="h-4 w-4" />
        )}
        {loading ? 'جاري الدفع والتحميل...' : `ادفع ${price} درهم وحمّل`}
      </Button>
    </form>
  );
}

export function ReportPaymentModal({
  petition,
  userId,
  userEmail,
  isOpen,
  onClose,
  onSuccess,
}: ReportPaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [price, setPrice] = useState(() =>
    Math.max(getDownloadPrice(petition), FREE_EXTRA_DOWNLOAD_PRICE_MAD),
  );
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [initError, setInitError] = useState('');
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setClientSecret(null);
      setInitError('');
      setStripeInstance(null);
      return;
    }

    if (!userId?.trim()) {
      setInitError(mapReportPaymentApiError('User not authenticated'));
      setLoadingIntent(false);
      return;
    }

    if (!isStripeClientConfigured()) {
      setInitError(
        'مفتاح Stripe العام غير متوفر في الواجهة. أعد نشر الموقع بعد التحقق من NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.',
      );
      setLoadingIntent(false);
      return;
    }

    let cancelled = false;

    async function createIntent() {
      setLoadingIntent(true);
      setInitError('');
      setStripeInstance(null);

      try {
        const response = await fetch(
          `/api/petitions/${petition.referenceCode || petition.id}/report/payment-intent`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: userId.trim(),
              userEmail,
              clientReportDownloads: petition.reportDownloads ?? 0,
            }),
          },
        );

        const data = await response.json();
        if (!data.success || !data.clientSecret) {
          throw new Error(
            mapReportPaymentApiError(
              typeof data.error === 'string' ? data.error : undefined,
              typeof data.code === 'string' ? data.code : undefined,
            ),
          );
        }

        const stripe = await getStripe();
        if (!stripe) {
          throw new Error(
            'تعذر تحميل Stripe. حدّث الصفحة أو جرّب متصفحاً آخر.',
          );
        }

        if (!cancelled) {
          setClientSecret(data.clientSecret);
          setPrice(data.price || getDownloadPrice(petition));
          setStripeInstance(stripe);
        }
      } catch (err) {
        if (!cancelled) {
          const raw =
            err instanceof Error ? err.message : 'تعذر بدء عملية الدفع';
          setInitError(mapReportPaymentApiError(raw));
        }
      } finally {
        if (!cancelled) {
          setLoadingIntent(false);
        }
      }
    }

    void createIntent();

    return () => {
      cancelled = true;
    };
  }, [
    isOpen,
    petition.id,
    petition.referenceCode,
    petition.reportDownloads,
    petition.pricingTier,
    userId,
    userEmail,
  ]);

  if (!isOpen) return null;

  const displayPrice = price || getDownloadPrice(petition);

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
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="space-y-2">
            <h2 id="report-payment-title" className="text-lg font-semibold">
              تحميل تقرير العريضة
            </h2>
            <p className="text-sm text-muted-foreground">
              لقد استخدمت التحميلات المجانية لهذه العريضة
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-muted"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 py-2">
          <div className="text-center">
            <p className="text-3xl font-bold">{displayPrice} درهم</p>
            <p className="text-sm text-muted-foreground">لتحميل واحد إضافي</p>
          </div>

          <ul className="space-y-2">
            {[
              'تقرير PDF رسمي',
              'رمز QR للتحقق',
              'جميع الإحصائيات',
              'صالح للتقديم الرسمي',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-600 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {loadingIntent && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-6">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>جاري تجهيز الدفع...</span>
            </div>
          )}

          {initError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {initError}
            </p>
          )}

          {clientSecret && stripeInstance && !loadingIntent && (
            <Elements stripe={stripeInstance} options={{ clientSecret }}>
              <PaymentForm
                petition={petition}
                userId={userId}
                userEmail={userEmail}
                clientSecret={clientSecret}
                price={displayPrice}
                onClose={onClose}
                onSuccess={onSuccess}
              />
            </Elements>
          )}

          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full"
            disabled={loadingIntent}
          >
            إلغاء
          </Button>
        </div>
      </div>
    </div>
  );
}
