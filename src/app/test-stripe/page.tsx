'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStripe, createPaymentIntent } from '@/lib/stripe';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Test Payment Form Component
function TestPaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setMessage('❌ Stripe not loaded yet. Please wait and try again.');
      return;
    }

    setProcessing(true);
    setMessage('');

    try {
      // Create payment intent for 10 MAD
      const { clientSecret } = await createPaymentIntent(
        10, // 10 MAD
        'test-petition-123',
        'starter'
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
        setMessage('✅ Payment successful! Payment ID: ' + paymentIntent.id);
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (err: any) {
      setMessage('❌ Payment failed: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessing(false);
    }
  };

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
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
          onChange={handleCardChange}
        />
      </div>

      {/* Debug Info */}
      <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded">
        <div>🔧 Debug Info:</div>
        <div>Stripe loaded: {stripe ? '✅ Yes' : '❌ No'}</div>
        <div>Elements loaded: {elements ? '✅ Yes' : '❌ No'}</div>
        <div>Card complete: {cardComplete ? '✅ Yes' : '❌ No'}</div>
        <div>Processing: {processing ? '⏳ Yes' : '✅ No'}</div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || !elements || processing}
        className="w-full"
      >
        {processing ? 'Processing...' : 'Pay 10 MAD'}
      </Button>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes('✅')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}

export default function TestStripePage() {
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const initStripe = async () => {
      try {
        const stripe = getStripe();
        if (!stripe) {
          throw new Error('Stripe publishable key not found');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div>Loading Stripe...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !stripePromise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              ❌ Stripe Configuration Error
              <div className="text-sm mt-2">
                {error || 'Stripe not configured properly'}
              </div>
              <div className="text-xs mt-2 text-gray-500">
                Check your NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              🧪 Stripe Payment Test
            </CardTitle>
            <p className="text-center text-gray-600">
              Test Stripe integration with a 10 MAD payment
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Test Card Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  🧪 Test Card Numbers
                </h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>
                    <strong>Success:</strong> 4242 4242 4242 4242
                  </div>
                  <div>
                    <strong>Decline:</strong> 4000 0000 0000 0002
                  </div>
                  <div>
                    <strong>Expiry:</strong> Any future date (e.g., 12/25)
                  </div>
                  <div>
                    <strong>CVC:</strong> Any 3 digits (e.g., 123)
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <Elements stripe={stripePromise}>
                <TestPaymentForm />
              </Elements>

              {/* Security Notice */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  🔒 This is a test environment. No real money will be charged.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
