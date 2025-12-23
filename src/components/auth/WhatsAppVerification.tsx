'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface WhatsAppVerificationProps {
  onVerified: (phoneNumber: string) => void;
  onCancel: () => void;
}

export default function WhatsAppVerification({
  onVerified,
  onCancel,
}: WhatsAppVerificationProps) {
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

    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    const cleanPhone = phoneNumber.replace(/\s/g, '');

    if (!phoneRegex.test(cleanPhone)) {
      setError('Invalid phone number. Must start with + and country code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📱 Sending WhatsApp verification to:', cleanPhone);

      const response = await fetch('/api/whatsapp/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: cleanPhone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      console.log('✅ WhatsApp message sent');
      setStep('code');
    } catch (err: any) {
      console.error('❌ Error sending WhatsApp:', err);
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim() || verificationCode.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔍 Verifying code...');

      const response = await fetch('/api/whatsapp/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      console.log('✅ Phone verified!');
      onVerified(phoneNumber);
    } catch (err: any) {
      console.error('❌ Verification error:', err);
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">WhatsApp Verification</h3>

        {step === 'phone' ? (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Enter your phone number to receive a verification code via
              WhatsApp
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+34612345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                dir="ltr"
              />
              <p className="text-xs text-gray-500 mt-1">
                Include country code (e.g., +34 for Spain, +212 for Morocco)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleSendCode}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Sending...' : 'Send Code via WhatsApp'}
              </Button>
              <Button variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Enter the 6-digit code sent to your WhatsApp:{' '}
              <strong>{phoneNumber}</strong>
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(e.target.value.replace(/\D/g, ''))
                }
                placeholder="123456"
                maxLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500"
                dir="ltr"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleVerifyCode}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStep('phone');
                  setError('');
                  setVerificationCode('');
                }}
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
