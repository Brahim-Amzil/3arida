'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';

interface PhoneVerificationProps {
  onVerified: (phoneNumber: string) => void;
  onCancel: () => void;
}

// Extend Window interface
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
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
  const [recaptchaInitialized, setRecaptchaInitialized] = useState(false);

  useEffect(() => {
    // Initialize reCAPTCHA when component mounts
    // Using the EXACT same approach as Firebase demo
    const initializeRecaptcha = () => {
      try {
        // Clear any existing verifier
        if (window.recaptchaVerifier) {
          try {
            window.recaptchaVerifier.clear();
          } catch (e) {
            console.log('Clearing old verifier');
          }
          window.recaptchaVerifier = undefined;
        }

        console.log('🔐 Initializing reCAPTCHA verifier...');

        // Ensure auth is initialized
        if (!auth) {
          console.error('❌ Auth object is undefined');
          setError('Firebase authentication not initialized');
          return;
        }

        // CRITICAL FIX: Use invisible reCAPTCHA like Firebase demo
        // This avoids domain/configuration issues with visible reCAPTCHA
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          'recaptcha-container',
          {
            size: 'invisible',
            callback: () => {
              console.log('✅ reCAPTCHA solved automatically');
              setRecaptchaInitialized(true);
            },
            'expired-callback': () => {
              console.log('⚠️ reCAPTCHA expired');
              setRecaptchaInitialized(false);
              setError('Verification expired. Please try again.');
            },
          }
        );

        // Render the reCAPTCHA
        window.recaptchaVerifier
          .render()
          .then((widgetId) => {
            console.log('✅ reCAPTCHA rendered with widget ID:', widgetId);
            setRecaptchaInitialized(true);
          })
          .catch((error) => {
            console.error('❌ reCAPTCHA render error:', error);
            console.error('Error details:', {
              code: error.code,
              message: error.message,
              stack: error.stack,
            });
            setError(
              'Failed to initialize reCAPTCHA. Please check console for details.'
            );
          });
      } catch (error: any) {
        console.error('❌ reCAPTCHA initialization error:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          stack: error.stack,
        });
        setError('Failed to initialize verification. Please refresh the page.');
      }
    };

    // Delay initialization to ensure DOM is ready
    const timer = setTimeout(initializeRecaptcha, 500);

    return () => {
      clearTimeout(timer);
      // Cleanup on unmount
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          console.log('Cleanup: verifier already cleared');
        }
        window.recaptchaVerifier = undefined;
      }
    };
  }, []);

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a valid phone number');
      return;
    }

    // Validate phone number format (E.164)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    const cleanPhone = phoneNumber.replace(/\s/g, '');

    if (!phoneRegex.test(cleanPhone)) {
      setError(
        'Invalid phone number. Must start with + and country code (e.g., +34612345678)'
      );
      return;
    }

    if (!window.recaptchaVerifier) {
      setError('Verification not ready. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📱 Sending verification code to:', cleanPhone);

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        cleanPhone,
        window.recaptchaVerifier
      );

      console.log('✅ SMS sent successfully');
      window.confirmationResult = confirmationResult;
      setStep('code');
    } catch (err: any) {
      console.error('❌ Error sending SMS:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);

      // Handle specific error codes
      if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later');
      } else if (err.code === 'auth/quota-exceeded') {
        setError('SMS quota exceeded. Please contact support');
      } else if (err.code === 'auth/captcha-check-failed') {
        setError('reCAPTCHA verification failed. Please try again');
      } else if (err.code === 'auth/invalid-app-credential') {
        setError('Invalid app configuration. Please contact support');
      } else if (err.code === 'auth/internal-error') {
        setError(
          'Server error. Please check Firebase console logs for details'
        );
      } else {
        setError(`Error: ${err.message || err.code}`);
      }

      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {}
        window.recaptchaVerifier = undefined;
        setRecaptchaInitialized(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim() || verificationCode.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    if (!window.confirmationResult) {
      setError('Verification session expired. Please request a new code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔍 Verifying code...');
      const result = await window.confirmationResult.confirm(verificationCode);
      console.log('✅ Phone verified successfully!', result.user.uid);

      // Sign out immediately - we only need verification, not authentication
      await auth.signOut();

      onVerified(phoneNumber);
    } catch (err: any) {
      console.error('❌ Verification error:', err);

      if (err.code === 'auth/invalid-verification-code') {
        setError('Invalid verification code');
      } else if (err.code === 'auth/code-expired') {
        setError('Code expired. Please request a new one');
      } else {
        setError('Verification failed. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Phone Verification</h3>

        {step === 'phone' ? (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Enter your phone number to receive a verification code
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

            {/* Invisible reCAPTCHA container */}
            <div id="recaptcha-container"></div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleSendCode}
                disabled={loading || !recaptchaInitialized}
                className="flex-1"
              >
                {loading ? 'Sending...' : 'Send Code'}
              </Button>
              <Button variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            </div>

            {!recaptchaInitialized && !error && (
              <p className="text-xs text-gray-500 text-center">
                Initializing verification...
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              Enter the 6-digit code sent to <strong>{phoneNumber}</strong>
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
