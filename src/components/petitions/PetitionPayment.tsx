'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { getStripe, createPaymentIntent } from '@/lib/stripe';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { PetitionFormData } from '@/types/petition';
import {
  calculatePetitionPrice,
  calculatePricingTier,
  formatCurrency,
  PRICING_TIERS,
} from '@/lib/petition-utils';

interface PetitionPaymentProps {
  formData: PetitionFormData;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

// Payment Form Component
function PaymentForm({
  formData,
  price,
  onSuccess,
  onError,
}: {
  formData: PetitionFormData;
  price: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState<string>('');
  const [cardComplete, setCardComplete] = useState(false);
  const { t } = useTranslation();

  const handleCardChange = (event: any) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError('');
    }
    setCardComplete(event.complete);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setCardError('Stripe not loaded yet. Please wait and try again.');
      return;
    }

    if (!cardComplete) {
      setCardError('Please complete your card information.');
      return;
    }

    setProcessing(true);
    setCardError(''); // Clear any previous errors

    try {
      // Create payment intent for petition creation
      const tier = calculatePricingTier(formData.targetSignatures);
      const { clientSecret, paymentIntentId } = await createPaymentIntent(
        price,
        'pending-petition-' + Date.now(), // Temporary ID until petition is created
        tier
      );

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        setCardError(error.message || 'Payment failed');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      } else {
        setCardError('Payment was not successful');
      }
    } catch (err: any) {
      setCardError(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {t('payment.cardInformation')}
        </label>
        <div
          className={`p-4 border rounded-lg transition-colors ${
            cardError
              ? 'border-red-300 bg-red-50'
              : cardComplete
                ? 'border-green-300 bg-green-50'
                : 'border-gray-200 bg-white'
          }`}
        >
          <CardElement
            onChange={handleCardChange}
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
                  color: '#dc2626',
                },
              },
            }}
          />
        </div>

        {/* Inline Error Message */}
        {cardError && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{cardError}</span>
          </div>
        )}

        {/* Success Indicator */}
        {cardComplete && !cardError && (
          <div className="flex items-center space-x-2 text-green-600 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{t('payment.cardValid')}</span>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={
          !stripe || !elements || processing || !cardComplete || !!cardError
        }
        className="w-full"
      >
        {processing ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>{t('payment.processing')}</span>
          </div>
        ) : (
          `${t('form.createPetitionButton')} - ${formatCurrency(price)} MAD`
        )}
      </Button>
    </form>
  );
}

export default function PetitionPayment({
  formData,
  onPaymentSuccess,
  onCancel,
}: PetitionPaymentProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [stripePromise, setStripePromise] = useState<any>(null);

  const price = calculatePetitionPrice(formData.targetSignatures);
  const tier = calculatePricingTier(formData.targetSignatures);
  const tierInfo = PRICING_TIERS[tier];

  // Function to translate features
  const translateFeature = (feature: string): string => {
    const featureMap: Record<string, string> = {
      'Up to 2,500 signatures': t('features.upToSignatures', {
        count: '2,500',
      }),
      'Up to 5,000 signatures': t('features.upToSignatures', {
        count: '5,000',
      }),
      'Up to 10,000 signatures': t('features.upToSignatures', {
        count: '10,000',
      }),
      'Up to 100,000 signatures': t('features.upToSignatures', {
        count: '100,000',
      }),
      'Basic petition page': t('features.basicPetitionPage'),
      'Enhanced petition page': t('features.enhancedPetitionPage'),
      'Premium petition page': t('features.premiumPetitionPage'),
      'Email sharing': t('features.emailSharing'),
      'Social media sharing': t('features.socialMediaSharing'),
      'Advanced sharing': t('features.advancedSharing'),
      'Basic analytics': t('features.basicAnalytics'),
      'Detailed analytics': t('features.detailedAnalytics'),
      'Priority support': t('features.prioritySupport'),
      'Custom branding': t('features.customBranding'),
      'API access': t('features.apiAccess'),
    };

    return featureMap[feature] || feature;
  };

  React.useEffect(() => {
    const initStripe = async () => {
      try {
        const stripe = getStripe();
        if (!stripe) {
          throw new Error('Stripe not configured');
        }
        setStripePromise(stripe);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initStripe();
  }, []);

  const handlePaymentSuccess = (paymentIntentId: string) => {
    onPaymentSuccess(paymentIntentId);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <div>{t('payment.loadingPaymentSystem')}</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stripePromise) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            {t('payment.paymentSystemError')}
            <div className="text-sm mt-2">
              {error || t('payment.paymentNotAvailable')}
            </div>
            <Button onClick={onCancel} className="mt-4" variant="outline">
              {t('payment.goBack')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          💳 {t('payment.completePayment')}
        </CardTitle>
        <p className="text-center text-gray-600">
          {t('payment.payToCreate', {
            signatures: formData.targetSignatures.toLocaleString(),
          })}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">{t('payment.orderSummary')}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t('payment.petitionPlan')}</span>
                <span className="font-medium">{tierInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('payment.signatureGoal')}</span>
                <span>{formData.targetSignatures.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('payment.petitionTitle')}</span>
                <span className="text-sm truncate max-w-48">
                  {formData.title}
                </span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>{t('payment.total')}</span>
                <span className="text-green-600">
                  {formatCurrency(price)} MAD
                </span>
              </div>
            </div>
          </div>

          {/* Features Included */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">
              ✅ {t('payment.whatsIncluded')}
            </h3>
            <ul className="text-sm text-green-700 space-y-1">
              {tierInfo.features.map((feature, index) => (
                <li key={index}>• {translateFeature(feature)}</li>
              ))}
            </ul>
          </div>

          {/* Stripe Payment Form */}
          <Elements stripe={stripePromise}>
            <PaymentForm
              formData={formData}
              price={price}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>

          {/* Test Card Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              🧪 {t('payment.testCard')}
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <div>
                <strong>{t('payment.testCardNumber')}</strong>
              </div>
              <div>
                <strong>{t('payment.testExpiry')}</strong>
              </div>
              <div>
                <strong>{t('payment.testCvc')}</strong>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              {t('payment.secureProcessing')}
            </p>
          </div>

          {/* Back Button */}
          <Button onClick={onCancel} variant="outline" className="w-full">
            {t('payment.backToReview')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
