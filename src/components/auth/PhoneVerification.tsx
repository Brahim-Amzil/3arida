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
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

  // Setup visible reCAPTCHA
  useEffect(() => {
    if (window.recaptchaVerifier) {
      setRecaptchaReady(true);
      return;
    }

    const setupRecaptcha = () => {
      try {
        console.log('🔐 Setting up reCAPTCHA...');

        window.recaptchaVerifier = new RecaptchaVerifier(
          'recaptcha-container',
          {
            size: 'normal',
            callback: () => {
              console.log('✅ reCAPTCHA solved');
              setRecaptchaReady(true);
            },
            'expired-callback': () => {
              console.log('⚠️ reCAPTCHA expired');
              setRecaptchaReady(false);
            },
          },
          auth
        );

        window.recaptchaVerifier.render().then(() => {
          console.log('✅ reCAPTCHA rendered');
        });
      } catch (err) {
        console.error('❌ reCAPTCHA error:', err);
      }
    };

    setTimeout(setupRecaptcha, 300);

    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) { }
        window.recaptchaVerifier = undefined;
      }
    };
  }, []);

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      setError('الرجاء إدخال رقم هاتف صحيح');
      return;
    }

    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    const cleanPhone = phoneNumber.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      setError('رقم الهاتف غير صحيح. يجب أن يبدأ بـ + ورمز الدولة');
      return;
    }

    if (!window.recaptchaVerifier) {
      setError('خطأ في التحقق. يرجى إعادة تحميل الصفحة');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📱 Sending SMS to:', cleanPhone);

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        cleanPhone,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmationResult;
      setStep('code');
      console.log('✅ SMS sent successfully');
    } catch (err: any) {
      console.error('❌ Error sending SMS:', err);

      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
        setRecaptchaReady(false);
      }

      if (err.code === 'auth/invalid-phone-number') {
        setError('رقم الهاتف غير صحيح');
      } else if (err.code === 'auth/too-many-requests') {
        setError('تم تجاوز عدد المحاولات. يرجى المحاولة لاحقًا');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('خدمة SMS غير مفعلة لهذه المنطقة');
      } else {
        setError(`خطأ: ${err.message || err.code}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim() || verificationCode.length !== 6) {
      setError('الرجاء إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }

    if (!window.confirmationResult) {
      setError('خطأ في التحقق. يرجى إعادة إرسال الرمز');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔍 Verifying code...');
      await window.confirmationResult.confirm(verificationCode);
      console.log('✅ Phone verified!');
      onVerified(phoneNumber);
    } catch (err: any) {
      console.error('❌ Verification error:', err);

      if (err.code === 'auth/invalid-verification-code') {
        setError('رمز التحقق غير صحيح');
      } else if (err.code === 'auth/code-expired') {
        setError('انتهت صلاحية الرمز');
      } else {
        setError('فشل التحقق');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">التحقق من رقم الهاتف</h3>

        {step === 'phone' ? (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              أدخل رقم هاتفك لتلقي رمز التحقق
            </p>

            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+34612345678"
              className="w-full px-3 py-2 border rounded-md"
              dir="ltr"
            />

            <div id="recaptcha-container" className="flex justify-center"></div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-3">
              <Button
                id="sign-in-button"
                onClick={handleSendCode}
                disabled={loading || !recaptchaReady}
                className="flex-1"
              >
                {loading ? 'جاري الإرسال...' : 'إرسال الرمز'}
              </Button>
              <Button variant="outline" onClick={onCancel}>
                إلغاء
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              أدخل الرمز المرسل إلى {phoneNumber}
            </p>

            <input
              type="text"
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(e.target.value.replace(/\D/g, ''))
              }
              placeholder="123456"
              maxLength={6}
              className="w-full px-3 py-2 border rounded-md text-center text-xl tracking-widest"
              dir="ltr"
            />

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
                  setError('');
                }}
              >
                رجوع
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
