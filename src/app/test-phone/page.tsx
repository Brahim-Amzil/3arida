'use client';

import { useState } from 'react';
import Header from '@/components/layout/HeaderWrapper';
import PhoneVerification from '@/components/auth/PhoneVerification';
import { Button } from '@/components/ui/button';

export default function TestPhonePage() {
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState<string>('');

  const handlePhoneVerified = (phoneNumber: string) => {
    setVerifiedPhone(phoneNumber);
    setShowPhoneVerification(false);
    console.log('✅ Phone verified:', phoneNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🧪 Phone Verification Test
          </h1>

          <p className="text-gray-600 mb-6">
            This is a test page to quickly test phone verification without going
            through the entire petition creation flow.
          </p>

          {verifiedPhone ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 mr-2"
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
                <span className="text-green-800 font-medium">
                  Phone verified successfully: {verifiedPhone}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800">
                Click the button below to test phone verification
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Button
              onClick={() => setShowPhoneVerification(true)}
              className="w-full"
              disabled={showPhoneVerification}
            >
              {showPhoneVerification
                ? 'Phone Verification Open...'
                : 'Test Phone Verification'}
            </Button>

            {verifiedPhone && (
              <Button
                onClick={() => {
                  setVerifiedPhone('');
                  console.log('🔄 Reset verification status');
                }}
                variant="outline"
                className="w-full"
              >
                Reset & Test Again
              </Button>
            )}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              Test Instructions:
            </h3>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Click "Test Phone Verification"</li>
              <li>2. Enter your phone number (e.g., +34613658220)</li>
              <li>3. Complete reCAPTCHA if shown</li>
              <li>4. Click "Send Code"</li>
              <li>5. Enter the SMS code you receive</li>
              <li>6. Click "Verify"</li>
            </ol>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This test page is only for development.
              Remove it before production deployment.
            </p>
          </div>
        </div>
      </div>

      {/* Phone Verification Modal */}
      {showPhoneVerification && (
        <PhoneVerification
          onVerified={handlePhoneVerified}
          onCancel={() => setShowPhoneVerification(false)}
        />
      )}
    </div>
  );
}
