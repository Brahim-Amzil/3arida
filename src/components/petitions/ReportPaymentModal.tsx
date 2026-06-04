'use client';

/**
 * Stripe checkout for one-off report PDF downloads (10 or 19 MAD).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Stripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, Check, CheckCircle2, Loader2, X } from 'lucide-react';
import { Petition } from '@/types/petition';
import {
  FREE_EXTRA_DOWNLOAD_PRICE_MAD,
  getDownloadPrice,
} from '@/lib/report-access-control';
import { getStripe, isStripeClientConfigured } from '@/lib/stripe';
import { mapReportPaymentApiError } from '@/lib/report-payment-errors';
import { Button } from '@/components/ui/button';

type ModalPhase = 'checkout' | 'processing' | 'complete' | 'error';

const PROCESS_STEPS = [
  'تأكيد الدفع',
  'إنشاء تقرير PDF',
  'تحميل الملف',
] as const;

interface ReportPaymentModalProps {
  petition: Petition;
  userId: string;
  userEmail?: string;
  isOpen: boolean;
  onClose: () => void;
  /** Updates download badge only — modal stays open until user closes. */
  onSuccess: (newDownloadCount: number) => void;
}

interface PaymentFormProps {
  clientSecret: string;
  price: number;
  disabled: boolean;
  onPaymentConfirmed: (paymentIntentId: string) => void;
  onPaymentFailed: (message: string) => void;
}

function mapStripePaymentError(message: string): string {
  if (message.includes('Element') && message.includes('mounted')) {
    return 'حقل البطاقة غير جاهز. انتظر لحظة ثم أعد المحاولة.';
  }
  return message;
}

function PaymentForm({
  clientSecret,
  price,
  disabled,
  onPaymentConfirmed,
  onPaymentFailed,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('نظام الدفع غير جاهز. يرجى المحاولة مرة أخرى.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('عنصر البطاقة غير موجود. انتظر حتى يظهر حقل البطاقة.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement },
        });

      if (stripeError) {
        const msg = mapStripePaymentError(
          stripeError.message || 'فشلت عملية الدفع',
        );
        setError(msg);
        onPaymentFailed(msg);
        setSubmitting(false);
        return;
      }

      if (paymentIntent?.status !== 'succeeded') {
        const msg = 'لم تكتمل عملية الدفع';
        setError(msg);
        onPaymentFailed(msg);
        setSubmitting(false);
        return;
      }

      // Keep CardElement mounted until confirm finishes; parent switches phase after this.
      onPaymentConfirmed(paymentIntent.id);
    } catch (err) {
      console.error('Report payment error:', err);
      const msg = mapStripePaymentError(
        err instanceof Error ? err.message : 'حدث خطأ أثناء الدفع',
      );
      setError(msg);
      onPaymentFailed(msg);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border p-4 space-y-3">
        <label className="text-sm font-medium">بيانات البطاقة</label>
        <div className="rounded-md border bg-background p-3">
          <CardElement
            onChange={(event) => {
              setCardComplete(event.complete);
              if (event.error) {
                setError(event.error.message);
              } else {
                setError('');
              }
            }}
            options={{
              hidePostalCode: true,
              disabled: disabled || submitting,
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

      {submitting && (
        <p className="text-sm text-center text-muted-foreground animate-pulse">
          جاري تأكيد الدفع مع البنك — لا تغلق النافذة
        </p>
      )}

      <Button
        type="submit"
        disabled={disabled || submitting || !cardComplete}
        className="w-full gap-2"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CreditCard className="h-4 w-4" />
        )}
        {submitting ? 'جاري تأكيد الدفع...' : `ادفع ${price} درهم وحمّل`}
      </Button>
    </form>
  );
}

function ProcessingView({
  statusMessage,
  progressPercent,
  activeStep,
  paymentConfirmed,
}: {
  statusMessage: string;
  progressPercent: number;
  activeStep: number;
  paymentConfirmed: boolean;
}) {
  return (
    <div className="space-y-5 py-2">
      {paymentConfirmed && (
        <div
          className="flex items-center gap-2 text-green-800 bg-green-50 border border-green-200 rounded-lg p-4"
          role="status"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
          <div>
            <p className="font-semibold">تم الدفع بنجاح</p>
            <p className="text-sm text-green-700">
              تم خصم المبلغ من بطاقتك. جاري تجهيز التقرير...
            </p>
          </div>
        </div>
      )}

      <p className="text-sm text-center text-muted-foreground">{statusMessage}</p>

      <div className="space-y-2">
        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
        <p className="text-xs text-center text-muted-foreground tabular-nums">
          {Math.round(progressPercent)}%
        </p>
      </div>

      <ul className="space-y-2">
        {PROCESS_STEPS.map((label, index) => {
          const stepNum = index + 1;
          const isDone = activeStep > stepNum;
          const isActive = activeStep === stepNum;

          return (
            <li
              key={label}
              className={`flex items-center gap-2 text-sm rounded-md px-2 py-1.5 ${
                isActive ? 'bg-primary/10 text-primary font-medium' : ''
              } ${isDone ? 'text-green-700' : 'text-muted-foreground'}`}
            >
              {isDone ? (
                <Check className="h-4 w-4 shrink-0 text-green-600" />
              ) : isActive ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              ) : (
                <span className="h-4 w-4 shrink-0 rounded-full border border-muted-foreground/40" />
              )}
              <span>{label}</span>
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-center text-muted-foreground">
        قد يستغرق إنشاء التقرير حتى دقيقة — لا تغلق هذه النافذة
      </p>
    </div>
  );
}

function CompleteView({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-5 py-4 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-8 w-8 text-green-600" />
      </div>
      <div className="space-y-2">
        <p className="text-lg font-semibold text-green-800">
          تم التحميل بنجاح
        </p>
        <p className="text-sm text-muted-foreground">
          تحقق من مجلد التحميلات على جهازك.
          <br />
          ملف PDF جاهز للتقديم الرسمي.
        </p>
      </div>
      <Button onClick={onClose} className="w-full">
        إغلاق
      </Button>
    </div>
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

  const [phase, setPhase] = useState<ModalPhase>('checkout');
  const [statusMessage, setStatusMessage] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [activeStep, setActiveStep] = useState(1);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [flowError, setFlowError] = useState('');

  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetFlow = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setPhase('checkout');
    setStatusMessage('');
    setProgressPercent(0);
    setActiveStep(1);
    setPaymentConfirmed(false);
    setFlowError('');
  }, []);

  const handleModalClose = useCallback(() => {
    if (phase === 'processing') {
      return;
    }
    resetFlow();
    onClose();
  }, [phase, resetFlow, onClose]);

  const startProgressTick = useCallback((from: number, cap: number) => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
    progressTimerRef.current = setInterval(() => {
      setProgressPercent((current) => {
        if (current >= cap) {
          return current;
        }
        return Math.min(cap, current + 1.5);
      });
    }, 180);
  }, []);

  const stopProgressTick = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  const runDownloadAfterPayment = useCallback(
    async (paymentIntentId: string) => {
      const code = petition.referenceCode || petition.id;

      setPhase('processing');
      setPaymentConfirmed(true);
      setActiveStep(2);
      setProgressPercent(35);
      setStatusMessage('جاري إنشاء تقرير PDF على الخادم...');
      startProgressTick(35, 82);

      try {
        const downloadResponse = await fetch(
          `/api/petitions/${code}/report/download?paymentId=${encodeURIComponent(paymentIntentId)}`,
          { headers: { 'x-user-id': userId } },
        );

        if (!downloadResponse.ok) {
          const errData = await downloadResponse.json().catch(() => null);
          throw new Error(
            errData?.error?.details ||
              errData?.error?.message ||
              'فشل تحميل التقرير بعد الدفع',
          );
        }

        stopProgressTick();
        setActiveStep(3);
        setProgressPercent(88);
        setStatusMessage('جاري حفظ الملف على جهازك...');

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

        if (Number.isFinite(newCount)) {
          onSuccess(newCount);
        }

        setProgressPercent(100);
        setActiveStep(4);
        setPhase('complete');
      } catch (err) {
        stopProgressTick();
        console.error('Report download after payment:', err);
        setFlowError(
          err instanceof Error
            ? err.message
            : 'حدث خطأ أثناء تحميل التقرير بعد الدفع',
        );
        setPhase('error');
      }
    },
    [
      petition.id,
      petition.referenceCode,
      petition.reportDownloads,
      userId,
      onSuccess,
      startProgressTick,
      stopProgressTick,
    ],
  );

  useEffect(() => {
    if (!isOpen) {
      setClientSecret(null);
      setInitError('');
      setStripeInstance(null);
      resetFlow();
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
    resetFlow,
  ]);

  useEffect(() => {
    return () => {
      stopProgressTick();
    };
  }, [stopProgressTick]);

  if (!isOpen) return null;

  const displayPrice = price || getDownloadPrice(petition);
  const isProcessing = phase === 'processing';
  const canDismiss = phase !== 'processing';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {canDismiss ? (
        <button
          type="button"
          className="absolute inset-0 bg-black/50"
          aria-label="إغلاق"
          onClick={handleModalClose}
        />
      ) : (
        <div className="absolute inset-0 bg-black/50" aria-hidden />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-payment-title"
        aria-busy={isProcessing}
        className="relative z-10 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg"
        dir="rtl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="space-y-2">
            <h2 id="report-payment-title" className="text-lg font-semibold">
              {phase === 'complete'
                ? 'اكتمل التحميل'
                : phase === 'processing'
                  ? 'جاري تجهيز التقرير'
                  : 'تحميل تقرير العريضة'}
            </h2>
            {phase === 'checkout' && (
              <p className="text-sm text-muted-foreground">
                لقد استخدمت التحميلات المجانية لهذه العريضة
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            disabled={!canDismiss}
            className="rounded-full p-1 hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 py-2">
          {phase === 'checkout' && (
            <>
              <div className="text-center">
                <p className="text-3xl font-bold">{displayPrice} درهم</p>
                <p className="text-sm text-muted-foreground">
                  لتحميل واحد إضافي
                </p>
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
                    clientSecret={clientSecret}
                    price={displayPrice}
                    disabled={false}
                    onPaymentConfirmed={runDownloadAfterPayment}
                    onPaymentFailed={() => {
                      stopProgressTick();
                      setPhase('checkout');
                      setProgressPercent(0);
                      setPaymentConfirmed(false);
                      setFlowError('');
                    }}
                  />
                </Elements>
              )}

              {canDismiss && (
                <Button onClick={handleModalClose} variant="ghost" className="w-full">
                  إلغاء
                </Button>
              )}
            </>
          )}

          {phase === 'processing' && (
            <ProcessingView
              statusMessage={statusMessage}
              progressPercent={progressPercent}
              activeStep={activeStep}
              paymentConfirmed={paymentConfirmed}
            />
          )}

          {phase === 'complete' && <CompleteView onClose={handleModalClose} />}

          {phase === 'error' && (
            <div className="space-y-4">
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                {flowError}
              </p>
              <Button onClick={handleModalClose} variant="outline" className="w-full">
                إغلاق
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
