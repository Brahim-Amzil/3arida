'use client';

import { useState, useEffect, useRef } from 'react';
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

export default function PhoneVerification({
  onVerified,
  onCancel,
}: PhoneVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Initialize reCAPTCHA when component mounts
  useEffect(() => {
    const initRecaptcha = () => {
      try {
        // Wait for DOM to be ready
        const container = document.getElementById('recaptcha-container');
        if (!container) {
          console.warn('reCAPTCHA container not found, retrying...');
          setTimeout(initRecaptcha, 100);
          return;
        }

        if (!recaptchaVerifierRef.current) {
          console.log('🔐 Initializing reCAPTCHA verifier...');
          recaptchaVerifierRef.current = new RecaptchaVerifier(
            auth,
            'recaptcha-container',
            {
              size: 'invisible',
              callback: () => {
                console.log('✅ reCAPTCHA solved');
              },
              'expired-callback': () => {
                console.log('⚠️ reCAPTCHA expired');
                setError('انتهت صلاحية التحقق. يرجى المحاولة مرة أخرى');
              },
            }
          );
          console.log('✅ reCAPTCHA verifier initialized');
        }
      } catch (error) {
        console.error('❌ Error initializing reCAPTCHA:', error);
        setError('خطأ في تهيئة التحقق. يرجى إعادة تحميل الصفحة');
      }
    };

    // Delay initialization slightly to ensure DOM is ready
    const timer = setTimeout(initRecaptcha, 100);

    return () => {
      clearTimeout(timer);
      // Cleanup reCAPTCHA on unmount
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (error) {
          console.error('Error clearing reCAPTCHA:', error);
        }
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      setError('الرجاء إدخال رقم هاتف صحيح');
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanPhone = phoneNumber.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      setError('رقم الهاتف غير صحيح. يجب أن يبدأ بـ + ورمز الدولة');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!recaptchaVerifierRef.current) {
        throw new Error('reCAPTCHA not initialized');
      }

      console.log('📱 Sending SMS to:', cleanPhone);

      // Send SMS verification code via Firebase
      const confirmation = await signInWithPhoneNumber(
        auth,
        cleanPhone,
        recaptchaVerifierRef.current
      );

      setConfirmationResult(confirmation);
      setStep('code');
      console.log('✅ SMS sent successfully');
    } catch (err: any) {
      console.error('❌ Error sending SMS:', err);

      // Handle specific Firebase errors
      if (err.code === 'auth/invalid-phone-number') {
        setError('رقم الهاتف غير صحيح');
      } else if (err.code === 'auth/too-many-requests') {
        setError('تم تجاوز عدد المحاولات. يرجى المحاولة لاحقًا');
      } else if (err.code === 'auth/quota-exceeded') {
        setError('تم تجاوز حد الرسائل اليومي');
      } else if (err.code === 'auth/invalid-app-credential') {
        setError('خطأ في إعدادات التحقق. يرجى التواصل مع الدعم الفني');
      } else {
        setError('فشل إرسال رمز التحقق. يرجى المحاولة مرة أخرى');
      }

      // Reset reCAPTCHA on error
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
          recaptchaVerifierRef.current = null;
        } catch (resetError) {
          console.error('Error clearing reCAPTCHA:', resetError);
        }
      }

      // Reinitialize with visible reCAPTCHA as fallback
      try {
        const container = document.getElementById('recaptcha-container');
        if (container) {
          container.innerHTML = ''; // Clear container
          recaptchaVerifierRef.current = new RecaptchaVerifier(
            auth,
            'recaptcha-container',
            {
              size: 'normal', // Use visible reCAPTCHA as fallback
              callback: () => {
                console.log('✅ reCAPTCHA solved (visible mode)');
              },
            }
          );
          recaptchaVerifierRef.current.render();
        }
      } catch (resetError) {
        console.error('Error reinitializing reCAPTCHA:', resetError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('الرجاء إدخال رمز التحقق');
      return;
    }

    if (!confirmationResult) {
      setError('خطأ في التحقق. يرجى إعادة إرسال الرمز');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔍 Verifying code:', verificationCode);

      // Verify the SMS code
      await confirmationResult.confirm(verificationCode);

      console.log('✅ Phone number verified successfully');
      onVerified(phoneNumber);
    } catch (err: any) {
      console.error('❌ Error verifying code:', err);

      if (err.code === 'auth/invalid-verification-code') {
        setError('رمز التحقق غير صحيح');
      } else if (err.code === 'auth/code-expired') {
        setError('انتهت صلاحية الرمز. يرجى إعادة إرسال الرمز');
      } else {
        setError('فشل التحقق من الرمز. يرجى المحاولة مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <h3 className="text-lg font-semibold">التحقق من رقم الهاتف مطلوب</h3>
        </div>

        {/* Trust Message */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">
                نحن نقدر الشفافية و المصداقية
              </p>
              <p className="text-blue-700">
                فقط الأشخاص الموثَّقون يمكنهم نشر العرائض. هذا الرمز مطلوب مرة
                واحدة فقط، وبعدها يمكنك إنشاء عدد غير محدود من العرائض والتوقيع
                على أي عريضة بنقرة واحدة.{' '}
              </p>
            </div>
          </div>
        </div>

        {/* reCAPTCHA container (invisible) */}
        <div id="recaptcha-container"></div>

        {step === 'phone' ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              الرجاء إدخال رقم هاتفك للتوقيع على هذه العريضة.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الهاتف
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+212 6XX XXX XXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                dir="ltr"
              />
              <p className="text-xs text-gray-500 mt-1">
                مثال: +212612345678 أو +34613658220
              </p>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-3">
              <Button
                onClick={handleSendCode}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'جاري الإرسال...' : 'إرسال الرمز'}
              </Button>
              <Button variant="outline" onClick={onCancel} disabled={loading}>
                إلغاء
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              أدخل الرمز المكون من 6 أرقام المرسل إلى {phoneNumber}
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رمز التحقق
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setVerificationCode(value);
                }}
                placeholder="123456"
                maxLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-lg tracking-widest"
                dir="ltr"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-3">
              <Button
                onClick={handleVerifyCode}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'جاري التحقق...' : 'تحقق'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStep('phone');
                  setVerificationCode('');
                  setError('');
                  setConfirmationResult(null);
                }}
                disabled={loading}
              >
                رجوع
              </Button>
            </div>

            <button
              onClick={handleSendCode}
              disabled={loading}
              className="w-full text-sm text-green-600 hover:text-green-700 underline"
            >
              إعادة إرسال الرمز
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
