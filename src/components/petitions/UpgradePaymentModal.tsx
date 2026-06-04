'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Stripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { X, Check, Loader2, CreditCard, Tag, CheckCircle2 } from 'lucide-react';
import { PricingTier } from '@/types/petition';
import {
  UPGRADE_PRICING_TIERS,
  getNewSignatureLimit,
} from '@/lib/petition-upgrade-utils';
import { PAID_TIER_FREE_DOWNLOADS } from '@/lib/report-access-control';
import { getStripe, isStripeClientConfigured } from '@/lib/stripe';

type ModalPhase = 'checkout' | 'processing' | 'complete' | 'error';

interface UpgradePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientSecret?: string;
  selectedTier: PricingTier;
  upgradePrice: number;
  originalPrice?: number;
  betaMode?: boolean;
  couponCode?: string;
  petitionId: string;
  onSuccess: () => void;
}

interface CheckoutFormProps {
  clientSecret?: string;
  selectedTier: PricingTier;
  upgradePrice: number;
  originalPrice?: number;
  betaMode?: boolean;
  couponCode?: string;
  isFree: boolean;
  onPaymentConfirmed: (paymentIntentId: string) => void;
  onPaymentFailed: (message: string) => void;
}

function CheckoutForm({
  clientSecret,
  selectedTier,
  upgradePrice,
  originalPrice,
  betaMode,
  couponCode,
  isFree,
  onPaymentConfirmed,
  onPaymentFailed,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const tierConfig = UPGRADE_PRICING_TIERS[selectedTier];
  const displayOriginalPrice = originalPrice || upgradePrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      setError('يرجى الموافقة على الشروط والأحكام');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isFree) {
        onPaymentConfirmed(`beta_free_${Date.now()}`);
        return;
      }

      if (!stripe || !elements || !clientSecret) {
        setError('نظام الدفع غير جاهز. يرجى المحاولة مرة أخرى.');
        setLoading(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError('عنصر البطاقة غير موجود. انتظر حتى يظهر حقل البطاقة.');
        setLoading(false);
        return;
      }

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement },
        });

      if (stripeError) {
        const msg = stripeError.message || 'فشلت عملية الدفع';
        setError(msg);
        onPaymentFailed(msg);
        setLoading(false);
        return;
      }

      if (paymentIntent?.status !== 'succeeded') {
        const msg = 'لم تكتمل عملية الدفع';
        setError(msg);
        onPaymentFailed(msg);
        setLoading(false);
        return;
      }

      onPaymentConfirmed(paymentIntent.id);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'حدث خطأ أثناء معالجة الدفع';
      setError(msg);
      onPaymentFailed(msg);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-bold text-right mb-4">{tierConfig.name}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">السعر</span>
            <span className="text-gray-700">
              {displayOriginalPrice.toFixed(2)} DH
            </span>
          </div>
          {betaMode && couponCode && (
            <div className="flex justify-between items-center text-purple-700">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>كود الخصم: {couponCode}</span>
              </div>
              <span className="font-semibold">
                -{displayOriginalPrice.toFixed(2)} DH
              </span>
            </div>
          )}
          <div className="border-t border-gray-300 pt-2 mt-2">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>المجموع</span>
              <span className={isFree ? 'text-green-600' : 'text-gray-900'}>
                {upgradePrice.toFixed(2)} DH
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-2 pt-4 border-t border-green-200">
          {tierConfig.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2 text-right">
              <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {betaMode && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-900 text-sm text-center">
            جميع الباقات والترقيات مجانية طوال فترة الإطلاق التجريبي.
          </p>
        </div>
      )}

      {!isFree && (
        <div>
          <label className="block text-sm font-medium text-gray-700 text-right mb-2">
            <CreditCard className="inline w-4 h-4 ml-2" />
            معلومات البطاقة
          </label>
          <div className="p-4 border border-gray-300 rounded-lg bg-white">
            <CardElement
              options={{
                hidePostalCode: true,
                disabled: loading,
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': { color: '#aab7c4' },
                  },
                  invalid: { color: '#9e2146' },
                },
              }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-right text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <p className="text-sm text-center text-muted-foreground animate-pulse">
          جاري تأكيد الدفع — لا تغلق النافذة
        </p>
      )}

      <div className="flex items-start gap-3 text-right">
        <input
          type="checkbox"
          id="upgrade-terms"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-1"
          disabled={loading}
        />
        <label htmlFor="upgrade-terms" className="text-sm text-gray-700 flex-1">
          أوافق على{' '}
          <a href="/terms" target="_blank" className="text-green-600 hover:underline">
            الشروط والأحكام
          </a>{' '}
          و{' '}
          <a href="/privacy" target="_blank" className="text-green-600 hover:underline">
            سياسة الخصوصية
          </a>
        </label>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="submit" disabled={loading || !agreedToTerms} className="gap-2 flex-1">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              جاري تأكيد الدفع...
            </>
          ) : isFree ? (
            'تأكيد الترقية المجانية'
          ) : (
            `إتمام الدفع (${upgradePrice.toFixed(2)} DH)`
          )}
        </Button>
      </div>
    </form>
  );
}

function ProcessingView({
  statusMessage,
  progressPercent,
  paymentConfirmed,
}: {
  statusMessage: string;
  progressPercent: number;
  paymentConfirmed: boolean;
}) {
  return (
    <div className="space-y-5 py-2">
      {paymentConfirmed && (
        <div className="flex items-center gap-2 text-green-800 bg-green-50 border border-green-200 rounded-lg p-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
          <div>
            <p className="font-semibold">تم الدفع بنجاح</p>
            <p className="text-sm text-green-700">
              جاري تطبيق الترقية على عريضتك...
            </p>
          </div>
        </div>
      )}
      <p className="text-sm text-center text-muted-foreground">{statusMessage}</p>
      <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>
      <p className="text-xs text-center text-muted-foreground">
        لا تغلق هذه النافذة حتى تكتمل الترقية
      </p>
    </div>
  );
}

export function UpgradePaymentModal(props: UpgradePaymentModalProps) {
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
  const [phase, setPhase] = useState<ModalPhase>('checkout');
  const [statusMessage, setStatusMessage] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [flowError, setFlowError] = useState('');

  const isFree = Boolean(props.betaMode && props.upgradePrice === 0);
  const needsStripe = !isFree;
  const tierConfig = UPGRADE_PRICING_TIERS[props.selectedTier];
  const signatureLimit = getNewSignatureLimit(props.selectedTier);

  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetFlow = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setPhase('checkout');
    setStatusMessage('');
    setProgressPercent(0);
    setPaymentConfirmed(false);
    setFlowError('');
  }, []);

  const stopProgressTick = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  const startProgressTick = useCallback((cap: number) => {
    stopProgressTick();
    progressTimerRef.current = setInterval(() => {
      setProgressPercent((current) => Math.min(cap, current + 2));
    }, 160);
  }, [stopProgressTick]);

  const handleModalClose = useCallback(() => {
    if (phase === 'processing') {
      return;
    }
    resetFlow();
    props.onClose();
  }, [phase, resetFlow, props]);

  const handleCompleteClose = useCallback(() => {
    resetFlow();
    props.onSuccess();
    props.onClose();
  }, [resetFlow, props]);

  const applyUpgrade = useCallback(
    async (paymentIntentId: string) => {
      setPhase('processing');
      setPaymentConfirmed(true);
      setProgressPercent(40);
      setStatusMessage('جاري ترقية العريضة وتفعيل المزايا...');
      startProgressTick(88);

      try {
        const upgradeResponse = await fetch('/api/petitions/test-upgrade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            petitionId: props.petitionId,
            selectedTier: props.selectedTier,
            paymentIntentId,
            upgradePrice: props.upgradePrice,
          }),
        });

        const upgradeData = await upgradeResponse.json();
        stopProgressTick();

        if (!upgradeData.success) {
          throw new Error(upgradeData.error || 'فشلت الترقية');
        }

        setProgressPercent(100);
        setPhase('complete');
      } catch (err) {
        stopProgressTick();
        setFlowError(
          err instanceof Error
            ? err.message
            : 'تم الدفع ولكن فشلت الترقية. تواصل مع الدعم.',
        );
        setPhase('error');
      }
    },
    [
      props.petitionId,
      props.selectedTier,
      props.upgradePrice,
      startProgressTick,
      stopProgressTick,
    ],
  );

  useEffect(() => {
    if (!props.isOpen) {
      setStripeInstance(null);
      resetFlow();
      return;
    }

    if (!needsStripe) {
      return;
    }

    let cancelled = false;
    getStripe().then((stripe) => {
      if (!cancelled) {
        setStripeInstance(stripe);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [props.isOpen, needsStripe, resetFlow]);

  useEffect(() => {
    return () => stopProgressTick();
  }, [stopProgressTick]);

  if (!props.isOpen) return null;

  const canDismiss = phase !== 'processing';
  const stripeReady = !needsStripe || (stripeInstance && props.clientSecret);
  const stripeConfigMissing = needsStripe && !isStripeClientConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-right flex-1">
            {phase === 'complete'
              ? 'تمت الترقية بنجاح'
              : phase === 'processing'
                ? 'جاري تطبيق الترقية'
                : 'إتمام ترقية العريضة'}
          </h2>
          <button
            type="button"
            onClick={handleModalClose}
            disabled={!canDismiss}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-40"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {phase === 'checkout' && (
            <>
              {stripeConfigMissing && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  مفتاح Stripe غير متوفر. أعد نشر الموقع أو أضف المفاتيح إلى .env.local
                </p>
              )}

              {!stripeConfigMissing && needsStripe && !props.clientSecret && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  جلسة الدفع غير جاهزة. أغلق النافذة وحاول الترقية مرة أخرى.
                </p>
              )}

              {!stripeConfigMissing && needsStripe && !stripeReady && (
                <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>جاري تجهيز الدفع...</span>
                </div>
              )}

              {!stripeConfigMissing && isFree && (
                <CheckoutForm
                  selectedTier={props.selectedTier}
                  upgradePrice={props.upgradePrice}
                  originalPrice={props.originalPrice}
                  betaMode={props.betaMode}
                  couponCode={props.couponCode}
                  isFree
                  onPaymentConfirmed={applyUpgrade}
                  onPaymentFailed={(msg) => {
                    setFlowError(msg);
                    setPhase('error');
                  }}
                />
              )}

              {!stripeConfigMissing && needsStripe && stripeReady && stripeInstance && (
                <Elements
                  stripe={stripeInstance}
                  options={{ clientSecret: props.clientSecret }}
                >
                  <CheckoutForm
                    clientSecret={props.clientSecret}
                    selectedTier={props.selectedTier}
                    upgradePrice={props.upgradePrice}
                    originalPrice={props.originalPrice}
                    betaMode={props.betaMode}
                    couponCode={props.couponCode}
                    isFree={false}
                    onPaymentConfirmed={applyUpgrade}
                    onPaymentFailed={(msg) => {
                      setFlowError(msg);
                      setPhase('error');
                    }}
                  />
                </Elements>
              )}

              {canDismiss && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full mt-4"
                  onClick={handleModalClose}
                >
                  إلغاء
                </Button>
              )}
            </>
          )}

          {phase === 'processing' && (
            <ProcessingView
              statusMessage={statusMessage}
              progressPercent={progressPercent}
              paymentConfirmed={paymentConfirmed}
            />
          )}

          {phase === 'complete' && (
            <div className="space-y-5 py-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2 text-right">
                <p className="text-lg font-semibold text-green-800">
                  تمت ترقية عريضتك إلى {tierConfig.name}
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>
                    • هدف التوقيعات:{' '}
                    <span className="font-medium text-foreground">
                      {signatureLimit.toLocaleString('ar-MA')}
                    </span>
                  </li>
                  <li>
                    • تحميلات التقرير المجانية:{' '}
                    <span className="font-medium text-foreground">
                      {PAID_TIER_FREE_DOWNLOADS} لكل عريضة
                    </span>
                  </li>
                  <li>• السعر الإضافي للتحميل بعد ذلك: 10 درهم</li>
                </ul>
              </div>
              <Button onClick={handleCompleteClose} className="w-full">
                إغلاق
              </Button>
            </div>
          )}

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
