'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { PetitionFormData } from '@/types/petition';
import {
  calculatePetitionPrice,
  calculatePricingTier,
  formatCurrency,
  PRICING_TIERS,
} from '@/lib/petition-utils';

interface PayPalPaymentProps {
  formData: PetitionFormData;
  onPaymentSuccess: (orderId: string, captureId: string) => void;
  onCancel: () => void;
}

export default function PayPalPayment({
  formData,
  onPaymentSuccess,
  onCancel,
}: PayPalPaymentProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const price = calculatePetitionPrice(formData.targetSignatures);
  const tier = calculatePricingTier(formData.targetSignatures);
  const tierInfo = PRICING_TIERS[tier];

  // Calculate USD equivalent (1 USD = 10 MAD)
  const usdAmount = (price / 10).toFixed(2);

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  // Debug: Log PayPal configuration
  console.log('🔍 PayPal Configuration Check:');
  console.log('Client ID exists:', !!paypalClientId);
  console.log('Client ID length:', paypalClientId?.length);
  console.log('Client ID:', paypalClientId);
  console.log('Environment:', process.env.NODE_ENV);

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

  if (!paypalClientId) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            {t('payment.paymentSystemError')}
            <div className="text-sm mt-2">
              {t('payment.paymentNotAvailable')}
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
                  {formatCurrency(price)} {t('common.moroccanDirham')}
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

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-red-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Currency Disclosure Notice */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">
              💱 {t('payment.paymentInfo')}
            </h3>
            <div className="text-sm text-yellow-800 space-y-2">
              <p className="font-medium">
                {t('payment.currencyDisclosure', {
                  mad: price,
                  usd: usdAmount,
                })}
              </p>
              <p className="text-xs">{t('payment.currencyNote')}</p>
            </div>
          </div>

          {/* PayPal Buttons */}
          <div className="space-y-4">
            {/* Terms Agreement Checkbox */}
            <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (e.target.checked) {
                      setTermsError(false);
                    }
                  }}
                  className={`mt-1 h-4 w-4 text-green-600 focus:ring-green-500 rounded ${
                    termsError
                      ? 'border-red-500 ring-2 ring-red-500'
                      : 'border-gray-300'
                  }`}
                />
                <span
                  className={`text-sm ${termsError ? 'text-red-600' : 'text-gray-700'}`}
                >
                  {t('payment.agreeToTerms')}{' '}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 underline"
                  >
                    {t('payment.termsOfService')}
                  </a>{' '}
                  {t('payment.andAcknowledge')}{' '}
                  <span className="font-semibold">
                    {t('payment.noRefundPolicy')}
                  </span>
                </span>
              </label>
              {termsError && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t('payment.mustAgreeToTerms')}
                </p>
              )}
            </div>

            <PayPalScriptProvider
              options={{
                clientId: paypalClientId,
                intent: 'capture',
                components: 'buttons',
              }}
            >
              <PayPalButtons
                style={{
                  layout: 'vertical',
                  color: 'gold',
                  shape: 'rect',
                  label: 'paypal',
                }}
                disabled={processing}
                createOrder={async () => {
                  try {
                    // Check if terms are agreed
                    if (!agreedToTerms) {
                      setTermsError(true);
                      throw new Error(t('payment.mustAgreeToTerms'));
                    }

                    setProcessing(true);
                    setError('');
                    setTermsError(false);

                    // Create order via API
                    const response = await fetch('/api/paypal/create-order', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        amount: price,
                        currency: 'MAD', // Send MAD, API will convert to USD
                        petitionId: 'pending-' + Date.now(),
                        pricingTier: tier,
                      }),
                    });

                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(
                        errorData.error || 'Failed to create order',
                      );
                    }

                    const data = await response.json();
                    return data.orderId;
                  } catch (err: any) {
                    setError(err.message || 'Failed to create PayPal order');
                    throw err;
                  } finally {
                    setProcessing(false);
                  }
                }}
                onApprove={async (data) => {
                  try {
                    setProcessing(true);
                    setError('');

                    // Capture the payment
                    const response = await fetch('/api/paypal/capture-order', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        orderId: data.orderID,
                      }),
                    });

                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(
                        errorData.error || 'Failed to capture payment',
                      );
                    }

                    const captureData = await response.json();

                    // Call success callback
                    onPaymentSuccess(
                      captureData.orderId,
                      captureData.captureId,
                    );
                  } catch (err: any) {
                    setError(err.message || 'Failed to process payment');
                    console.error('Payment capture error:', err);
                  } finally {
                    setProcessing(false);
                  }
                }}
                onError={(err) => {
                  console.error('PayPal error:', err);
                  setError('Payment failed. Please try again.');
                  setProcessing(false);
                }}
                onCancel={() => {
                  setError('Payment was cancelled');
                  setProcessing(false);
                }}
              />
            </PayPalScriptProvider>

            {processing && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">
                  {t('payment.processing')}
                </p>
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              ℹ️ {t('payment.paymentInfo')}
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• {t('payment.paypalSupportsCards')}</li>
              <li>• {t('payment.paypalSupportsAccount')}</li>
              <li>• {t('payment.securePayment')}</li>
            </ul>
          </div>

          {/* No Refunds Policy */}
          <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
            <p className="text-xs text-gray-700">⚠️ {t('payment.noRefunds')}</p>
          </div>

          {/* Security Notice */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              {t('payment.secureProcessing')}
            </p>
          </div>

          {/* Back Button */}
          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full"
            disabled={processing}
          >
            {t('payment.backToReview')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
