'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PhoneVerificationProps {
  onVerified: (phoneNumber: string) => void;
  onCancel: () => void;
}

export default function PhoneVerification({
  onVerified,
  onCancel,
}: PhoneVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Mock phone verification for now
      // In production, this would integrate with Firebase Auth phone verification
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep('code');
    } catch (err) {
      setError('Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Mock code verification
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, accept any 6-digit code
      if (verificationCode.length === 6) {
        onVerified(phoneNumber);
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      setError('Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">
          Phone Verification Required
        </h3>

        {step === 'phone' ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              Please enter your phone number to sign this petition.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+212 6XX XXX XXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex space-x-3">
              <Button
                onClick={handleSendCode}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Sending...' : 'Send Code'}
              </Button>
              <Button variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              Enter the 6-digit code sent to {phoneNumber}
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-lg tracking-widest"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex space-x-3">
              <Button
                onClick={handleVerifyCode}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep('phone')}
                disabled={loading}
              >
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
