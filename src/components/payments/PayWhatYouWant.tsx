'use client';

import React, { useEffect, useState } from 'react';
import type { Stripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useAuth } from '@/components/auth/AuthProvider';
import { getStripe } from '@/lib/stripe';

/**
 * Payment Form Component (inside Stripe Elements)
 */
function DonationPaymentForm({
  amount,
  onSuccess,
  onCancel,
}: {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/petitions/success?donation=true`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'حدث خطأ في معالجة الدفع');
        setIsProcessing(false);
      } else {
        // Payment successful
        onSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ غير متوقع');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              جاري المعالجة...
            </>
          ) : (
            `تأكيد المساهمة - ${amount} DH`
          )}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          variant="outline"
          className="px-6"
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}

/**
 * Pay What You Want Component
 *
 * Allows users to voluntarily support the platform during beta.
 * Culturally appropriate for Moroccan market (تضامن).
 */
export default function PayWhatYouWant() {
  const { user, userProfile } = useAuth();
  const [amount, setAmount] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouAmount, setThankYouAmount] = useState<number | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);

  const suggestedAmounts = [20, 50, 100, 200];

  useEffect(() => {
    if (!showPayment || !clientSecret) {
      setStripeInstance(null);
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
  }, [showPayment, clientSecret]);

  function getDonorEmail() {
    return (user?.email || userProfile?.email || '').trim();
  }

  function getDonorName() {
    return (
      user?.displayName ||
      userProfile?.name ||
      user?.email?.split('@')[0] ||
      userProfile?.email?.split('@')[0] ||
      'Supporter'
    );
  }

  function handleTipAgain() {
    setShowThankYou(false);
    setThankYouAmount(null);
    setAmount('');
    setClientSecret('');
    setShowPayment(false);
  }

  const handleDonate = async () => {
    const donationAmount = parseInt(amount);
    if (!donationAmount || donationAmount < 1) {
      alert('الرجاء إدخال مبلغ صحيح');
      return;
    }

    setIsLoading(true);

    try {
      // Create payment intent
      const donorEmail = getDonorEmail();

      const response = await fetch('/api/stripe/create-donation-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: donationAmount,
          userId: user?.uid || 'anonymous',
          userName: getDonorName(),
          userEmail: donorEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      setClientSecret(data.clientSecret);
      setShowPayment(true);
    } catch (error: any) {
      console.error('Error creating donation intent:', error);
      alert('حدث خطأ في إنشاء الدفع. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    const donationAmount = parseInt(amount, 10);

    setShowPayment(false);
    setThankYouAmount(donationAmount);
    setShowThankYou(true);
    // Thank-you email is sent once via Stripe webhook (avoids duplicate with client call)
  };

  const handleCancel = () => {
    setShowPayment(false);
    setClientSecret('');
  };

  if (showThankYou) {
    const donorEmail = getDonorEmail();

    return (
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300">
        <div className="text-center">
          <div className="text-5xl mb-4">🙏</div>
          <h3 className="text-2xl font-bold text-green-900 mb-2">
            شكراً جزيلاً!
          </h3>
          {thankYouAmount != null && (
            <p className="text-green-900 font-semibold mb-2">
              تم استلام مساهمتك: {thankYouAmount} DH
            </p>
          )}
          <p className="text-green-800 mb-4">
            مساهمتك تساعدنا في تطوير المنصة وخدمة المجتمع بشكل أفضل
          </p>
          {donorEmail ? (
            <p className="text-sm text-green-700 mb-4">
              ستصلك رسالة شكر على {donorEmail} خلال دقائق (تحقق من البريد الوارد
              والرسائل غير المرغوب فيها)
            </p>
          ) : (
            <p className="text-sm text-amber-700 mb-4">
              لم نتمكن من تحديد بريدك الإلكتروني لإرسال رسالة الشكر
            </p>
          )}
          <Button
            type="button"
            onClick={handleTipAgain}
            variant="outline"
            className="border-green-600 text-green-800 hover:bg-green-100"
          >
            ساهم مرة أخرى
          </Button>
        </div>
      </Card>
    );
  }

  if (showPayment && clientSecret) {
    if (!stripeInstance) {
      return (
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300">
          <p className="text-center text-purple-800">جاري تجهيز الدفع...</p>
        </Card>
      );
    }

    return (
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">💝</div>
          <h3 className="text-2xl font-bold text-purple-900 mb-2">
            إتمام المساهمة
          </h3>
          <p className="text-purple-800 text-lg font-semibold">
            المبلغ: {amount} DH
          </p>
        </div>

        <Elements
          stripe={stripeInstance}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#9333ea',
              },
            },
            locale: 'ar',
          }}
        >
          <DonationPaymentForm
            amount={parseInt(amount)}
            onSuccess={handlePaymentSuccess}
            onCancel={handleCancel}
          />
        </Elements>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300">
      <div className="text-center">
        <div className="text-4xl mb-3">💝</div>
        <h3 className="text-2xl font-bold text-purple-900 mb-2">
          ساهم في دعم المنصة
        </h3>
        <p className="text-purple-800 font-semibold mb-4">
          المنصة مجانية 100% خلال فترة الإطلاق التجريبي. دعمك الإختياري يساعدنا
          على تطوير المنصة، تحسين الأداء، والحفاظ عليها كمنصة مُستقلة و بذون
          إعلانات.
        </p>

        {/* Suggested Amounts */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {suggestedAmounts.map((suggested) => (
            <button
              key={suggested}
              onClick={() => setAmount(suggested.toString())}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                amount === suggested.toString()
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-purple-600 border-2 border-purple-300 hover:bg-purple-50'
              }`}
            >
              {suggested} DH
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-purple-900 mb-2">
            أو أدخل مبلغاً آخر
          </label>
          <div className="flex gap-2 max-w-xs mx-auto">
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="المبلغ"
              className="flex-1 px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
            />
            <span className="flex items-center text-purple-900 font-semibold">
              DH
            </span>
          </div>
        </div>

        {/* Donate Button */}
        <Button
          onClick={handleDonate}
          disabled={!amount || parseInt(amount) < 1 || isLoading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold text-lg"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              جاري التحضير...
            </>
          ) : (
            'ساهم الآن'
          )}
        </Button>

        <p className="text-sm text-purple-700 mt-4">
          💚 كل مساهمة تُقدّر مهما كان حجمها
        </p>
      </div>
    </Card>
  );
}
