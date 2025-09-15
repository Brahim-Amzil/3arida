'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QRCodeDisplay from './QRCodeDisplay';
import { Petition } from '@/types/petition';
import { generateAndStorePetitionQR } from '@/lib/qr-service';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface QRUpgradeProps {
  petition: Petition;
  onUpgradeComplete?: (qrCodeUrl: string) => void;
  onCancel?: () => void;
}

export default function QRUpgrade({
  petition,
  onUpgradeComplete,
  onCancel,
}: QRUpgradeProps) {
  const [step, setStep] = useState<
    'preview' | 'payment' | 'processing' | 'complete'
  >('preview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const handlePreviewQR = () => {
    setStep('preview');
  };

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');
      setStep('processing');

      // In a real implementation, this would integrate with Stripe
      // For now, we'll simulate the payment process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate and store the QR code
      const generatedQrUrl = await generateAndStorePetitionQR(petition.id, {
        size: 512,
        branded: true,
        updatePetition: true,
      });

      // Update petition with QR upgrade status
      await updateDoc(doc(db, 'petitions', petition.id), {
        hasQrUpgrade: true,
        qrUpgradePaidAt: new Date(),
        updatedAt: new Date(),
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

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
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
                <QRCodeDisplay
                  petition={petition}
                  size={200}
                  branded={true}
                  downloadable={false}
                  shareable={false}
                />
              </div>

              {/* Features */}
              <div className="text-left space-y-4">
                <h3 className="font-semibold text-gray-900">
                  QR Code Features:
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    High-resolution QR code (512x512px)
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    3arida branding for professional look
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Download in PNG format
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Analytics tracking for scans
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Perfect for printing on flyers and posters
                  </li>
                </ul>
              </div>

              {/* Pricing */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    10 MAD
                  </div>
                  <div className="text-sm text-green-700">One-time payment</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleProceedToPayment} className="flex-1">
                  Upgrade for 10 MAD
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'payment' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Complete Payment</CardTitle>
            <p className="text-center text-gray-600">
              Pay 10 MAD to get your premium QR code
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">QR Code Upgrade</span>
                    <span className="font-medium">10.00 MAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">0.00 MAD</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>10.00 MAD</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Payment Method
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      defaultChecked
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <svg
                        className="w-6 h-6 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x="2"
                          y="6"
                          width="20"
                          height="12"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M2 10h20"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                      Credit/Debit Card
                    </div>
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('preview')}
                  disabled={loading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Pay 10 MAD'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'processing' && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Processing Payment
              </h3>
              <p className="text-gray-600">
                Please wait while we process your payment and generate your QR
                code...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'complete' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-green-600">
              QR Code Ready!
            </CardTitle>
            <p className="text-center text-gray-600">
              Your premium QR code has been generated successfully
            </p>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* QR Code Display */}
              {qrCodeUrl && (
                <div className="bg-gray-50 p-8 rounded-lg">
                  <QRCodeDisplay
                    petition={{ ...petition, qrCodeUrl, hasQrCode: true }}
                    size={200}
                    branded={true}
                    downloadable={true}
                    shareable={true}
                  />
                </div>
              )}

              {/* Success Message */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">
                  Payment Successful!
                </h3>
                <p className="text-sm text-gray-600">
                  Your QR code is now available for download and sharing. You
                  can access it anytime from your petition dashboard.
                </p>
              </div>

              {/* Receipt Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h4 className="font-medium text-blue-900 mb-2">
                  Receipt Details
                </h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div className="flex justify-between">
                    <span>Item:</span>
                    <span>QR Code Upgrade</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>10.00 MAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
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
