'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { X, Check, Loader2, CreditCard, Tag } from 'lucide-react';
import { PricingTier } from '@/types/petition';
import { UPGRADE_PRICING_TIERS } from '@/lib/petition-upgrade-utils';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

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

function PaymentForm({
  clientSecret,
  selectedTier,
  upgradePrice,
  originalPrice,
  betaMode,
  couponCode,
  petitionId,
  onSuccess,
  onClose,
}: Omit<UpgradePaymentModalProps, 'isOpen'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const tierConfig = UPGRADE_PRICING_TIERS[selectedTier];
  const isFree = betaMode && upgradePrice === 0;
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
      // If it's a free upgrade (beta mode), process directly
      if (isFree) {
        console.log('[Payment] Free upgrade (beta mode), processing...');
        
        const upgradeResponse = await fetch('/api/petitions/test-upgrade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            petitionId,
            selectedTier,
            paymentIntentId: 'beta_free_' + Date.now(),
            upgradePrice: 0,
          }),
        });

        const upgradeData = await upgradeResponse.json();
        
        if (upgradeData.success) {
          console.log('[Payment] Free upgrade completed successfully');
          onSuccess();
        } else {
          console.error('[Payment] Free upgrade failed:', upgradeData.error);
          setError('فشلت الترقية. يرجى المحاولة مرة أخرى.');
          setLoading(false);
        }
        return;
      }

      // Paid upgrade - process with Stripe
      if (!stripe || !elements || !clientSecret) {
        setError('نظام الدفع غير جاهز. يرجى المحاولة مرة أخرى.');
        setLoading(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('عنصر البطاقة غير موجود');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'فشلت عملية الدفع');
        setLoading(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        console.log('[Payment] Payment succeeded, triggering upgrade...');
        
        try {
          const upgradeResponse = await fetch('/api/petitions/test-upgrade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              petitionId,
              selectedTier,
              paymentIntentId: paymentIntent.id,
              upgradePrice,
            }),
          });

          const upgradeData = await upgradeResponse.json();
          
          if (upgradeData.success) {
            console.log('[Payment] Upgrade completed successfully');
            onSuccess();
          } else {
            console.error('[Payment] Upgrade failed:', upgradeData.error);
            setError('تم الدفع بنجاح ولكن فشلت الترقية. يرجى الاتصال بالدعم.');
            setLoading(false);
          }
        } catch (upgradeError) {
          console.error('[Payment] Failed to trigger upgrade:', upgradeError);
          setError('تم الدفع بنجاح ولكن فشلت الترقية. يرجى الاتصال بالدعم.');
          setLoading(false);
        }
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء معالجة الدفع');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tier Details */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-bold text-right mb-4">{tierConfig.name}</h3>
        
        {/* Pricing Breakdown */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">السعر</span>
            <span className="text-gray-700">{displayOriginalPrice.toFixed(2)} DH</span>
          </div>
          
          {betaMode && couponCode && (
            <div className="flex justify-between items-center text-purple-700">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>كود الخصم: {couponCode}</span>
              </div>
              <span className="font-semibold">-{displayOriginalPrice.toFixed(2)} DH</span>
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

        {/* Features */}
        <div className="space-y-2 pt-4 border-t border-green-200">
          {tierConfig.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2 text-right">
              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Beta Message */}
      {betaMode && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-900 text-sm text-center">
            جميع الباقات والترقيات مجانية طوال فترة الإطلاق التجريبي.
          </p>
        </div>
      )}

      {/* Card Input - Only show if not free */}
      {!isFree && (
        <div>
          <label className="block text-sm font-medium text-gray-700 text-right mb-2">
            <CreditCard className="inline w-4 h-4 ml-2" />
            معلومات البطاقة
          </label>
          <div className="p-4 border border-gray-300 rounded-lg bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-right text-sm">{error}</p>
        </div>
      )}

      {/* Terms Checkbox */}
      <div className="flex items-start gap-3 text-right">
        <input
          type="checkbox"
          id="terms"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="terms" className="text-sm text-gray-700 flex-1">
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

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          إلغاء
        </Button>
        <Button type="submit" disabled={loading || !agreedToTerms} className="gap-2">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              جاري المعالجة...
            </>
          ) : isFree ? (
            <>
              تأكيد الترقية المجانية
            </>
          ) : (
            <>
              إتمام الدفع ({upgradePrice.toFixed(2)} DH)
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function UpgradePaymentModal(props: UpgradePaymentModalProps) {
  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={props.onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-right flex-1">إتمام ترقية العريضة</h2>
          <button
            onClick={props.onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <Elements stripe={stripePromise}>
            <PaymentForm {...props} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
