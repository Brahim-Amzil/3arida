'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QRCodeDisplay from './QRCodeDisplay';
import { Petition } from '@/types/petition';
import { generateAndStorePetitionQR } from '@/lib/qr-service';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTranslation } from '@/hooks/useTranslation';
import { getStripe, createPaymentIntent } from '@/lib/stripe';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

interface QRUpgradeProps {
  petition: Petition;
  onUpgradeComplete?: (qrCodeUrl: string) => void;
  onCancel?: () => void;
}

// Payment Form Component
function PaymentForm({
  petition,
  onSuccess,
  onError,
  amount,
}: {
  petition: Petition;
  onSuccess: () => void;
  onError: (error: string) => void;
  amount: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent
      const { clientSecret } = await createPaymentIntent(
        amount,
        petition.id,
        'starter' // QR upgrade is starter tier
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
        throw new Error(error.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess();
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (err: any) {
      onError(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-200 rounded-lg">
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
            },
          }}
        />
      </div>

      <Button type="submit" disabled={!stripe || processing} className="w-full">
        {processing ? t('common.loading') : `Pay ${amount} MAD`}
      </Button>
    </form>
  );
}

export default function QRUpgradeWithStripe({
  petition,
  onUpgradeComplete,
  onCancel,
}: QRUpgradeProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<
    'preview' | 'payment' | 'processing' | 'complete'
  >('preview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const upgradePrice = 10; // 10 MAD for QR upgrade
  const stripePromise = getStripe();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handlePaymentSuccess = async () => {
    try {
      setLoading(true);
      setError('');
      setStep('processing');

      // Generate and store the QR code
      const generatedQrUrl = await generateAndStorePetitionQR(petition.id, {
        size: 512,
        branded: true,
        updatePetition: true,
      });

      setQrCodeUrl(generatedQrUrl);
      setStep('complete');

      if (onUpgradeComplete) {
        onUpgradeComplete(generatedQrUrl);
      }
    } catch (err: any) {
      console.error('QR upgrade error:', err);
      setError(
        err.message || 'Failed to process QR upgrade. Please try again.'
      );
      setStep('payment');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {step === 'preview' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">QR Code Preview</CardTitle>
            <p className="text-center text-gray-600">
              See how your petition QR code will look
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              {/* QR Code Preview */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <QRCodeDisplay petition={petition} size={256} branded={true} />
              </div>

              {/* Upgrade Benefits */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">
                  QR Code Upgrade Benefits
                </h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>✓ High-resolution QR code (512x512px)</li>
                  <li>✓ Custom branding with your petition info</li>
                  <li>✓ Downloadable for print materials</li>
                  <li>✓ Permanent storage and access</li>
                </ul>
              </div>

              {/* Pricing */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-900">
                      {upgradePrice} MAD
                    </div>
                    <div className="text-sm text-blue-700">
                      One-time payment
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleProceedToPayment} className="flex-1">
                  Upgrade for {upgradePrice} MAD
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'payment' && stripePromise && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Payment Details</CardTitle>
            <p className="text-center text-gray-600">
              Complete your QR code upgrade payment
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">QR Code Upgrade</span>
                  <span className="font-bold">{upgradePrice} MAD</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Stripe Elements */}
              <Elements stripe={stripePromise}>
                <PaymentForm
                  petition={petition}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  amount={upgradePrice}
                />
              </Elements>

              {/* Security Notice */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Secure payment processed by Stripe
                </p>
              </div>

              {/* Back Button */}
              <Button
                onClick={() => setStep('preview')}
                variant="outline"
                className="w-full"
              >
                Back to Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'processing' && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-gray-600">
              Please wait while we process your payment and generate your QR
              code...
            </p>
          </CardContent>
        </Card>
      )}

      {step === 'complete' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-green-600">
              ✓ Upgrade Complete!
            </CardTitle>
            <p className="text-center text-gray-600">
              Your QR code has been generated and is ready for download
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              {/* Success QR Code */}
              {qrCodeUrl && (
                <div className="bg-gray-50 p-8 rounded-lg">
                  <QRCodeDisplay
                    petition={petition}
                    size={256}
                    branded={true}
                  />
                </div>
              )}

              {/* Success Message */}
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700">
                  Your QR code is now available for download and sharing. You
                  can access it anytime from your petition dashboard.
                </p>
              </div>

              {/* Close Button */}
              <Button onClick={handleCancel} className="w-full">
                Done
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
