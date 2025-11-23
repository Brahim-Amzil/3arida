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
      setError('الرجاء إدخال رقم هاتف صحيح');
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      setError('رقم الهاتف غير صحيح. يجب أن يبدأ بـ + ورمز الدولة');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Mock phone verification - simulates sending SMS
      // In production, this would integrate with Firebase Auth phone verification
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep('code');

      // Show a helpful message for demo mode
      console.log('📱 DEMO MODE: Any 6-digit code will work for verification');
    } catch (err) {
      setError('فشل إرسال رمز التحقق');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('الرجاء إدخال رمز التحقق');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Mock code verification - accepts any 6-digit code for demo
      await new Promise((resolve) => setTimeout(resolve, 500));

      // For demo purposes, accept any 6-digit code
      if (verificationCode.length === 6) {
        onVerified(phoneNumber);
      } else {
        setError('رمز التحقق غير صحيح. يجب أن يكون 6 أرقام');
      }
    } catch (err) {
      setError('فشل التحقق من الرمز');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">
          التحقق من رقم الهاتف مطلوب
        </h3>

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

            {/* Demo mode notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-xs text-blue-800">
                💡 <strong>وضع التجربة:</strong> أي رمز مكون من 6 أرقام سيعمل
                للتحقق
              </p>
            </div>

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

            {/* Demo mode hint */}
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-xs text-green-800">
                💡 <strong>وضع التجربة:</strong> أدخل أي 6 أرقام (مثال: 123456)
              </p>
            </div>

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
                }}
                disabled={loading}
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
