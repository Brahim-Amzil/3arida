'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from './AuthProvider';
import {
  createVerificationCode,
  generateWhatsAppLink,
} from '@/lib/whatsapp-verification';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface WhatsAppPhoneVerificationProps {
  onVerified: (phoneNumber: string) => void;
  onCancel: () => void;
}

export default function WhatsAppPhoneVerification({
  onVerified,
  onCancel,
}: WhatsAppPhoneVerificationProps) {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'waiting'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');

  // Listen for verification status changes
  useEffect(() => {
    if (!user || !verificationCode) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      const data = doc.data();
      if (data?.phoneVerified) {
        console.log('✅ Phone verified via WhatsApp!');
        onVerified(phoneNumber);
      }
    });

    return () => unsubscribe();
  }, [user, verificationCode, phoneNumber, onVerified]);

  const handleSendWhatsApp = async () => {
    if (!phoneNumber.trim()) {
      setError('الرجاء إدخال رقم هاتف صحيح');
      return;
    }

    if (!user) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanPhone = phoneNumber.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      setError('رقم الهاتف غير صحيح. يجب أن يبدأ بـ + ورمز الدولة');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📱 Creating verification code for:', cleanPhone);

      // Create verification code in Firestore
      const code = await createVerificationCode(user.uid, cleanPhone);
      setVerificationCode(code);

      // Generate WhatsApp deep link
      const link = generateWhatsAppLink(code);
      setWhatsappLink(link);

      // Open WhatsApp automatically
      window.open(link, '_blank');

      setStep('waiting');
      console.log('✅ WhatsApp link generated:', link);
    } catch (err: any) {
      console.error('❌ Error creating verification:', err);
      setError('فشل إنشاء رمز التحقق. يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  const handleResendWhatsApp = () => {
    if (whatsappLink) {
      window.open(whatsappLink, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-6 h-6 text-green-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <h3 className="text-lg font-semibold">التحقق عبر واتساب</h3>
        </div>

        {/* Trust Message */}
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-green-900 mb-1">
                تحقق مجاني وسريع عبر واتساب
              </p>
              <p className="text-green-700">
                لا حاجة لرموز SMS. فقط أرسل رسالة واتساب وسيتم التحقق تلقائياً.
              </p>
            </div>
          </div>
        </div>

        {step === 'phone' ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              أدخل رقم هاتفك وسنفتح واتساب تلقائياً مع رسالة التحقق.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الهاتف (واتساب)
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
                مثال: +212612345678 (يجب أن يكون لديك واتساب على هذا الرقم)
              </p>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-3">
              <Button
                onClick={handleSendWhatsApp}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading ? 'جاري التحضير...' : 'فتح واتساب'}
              </Button>
              <Button variant="outline" onClick={onCancel} disabled={loading}>
                إلغاء
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-green-600 animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <h4 className="font-semibold text-lg mb-2">
                في انتظار التحقق...
              </h4>
              <p className="text-gray-600 mb-4">
                أرسل الرسالة في واتساب وسيتم التحقق تلقائياً
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                <p className="text-sm font-mono text-gray-700">
                  رمز التحقق:{' '}
                  <span className="font-bold text-green-600">
                    {verificationCode}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">الخطوات:</p>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>افتح واتساب (يجب أن يكون مفتوحاً تلقائياً)</li>
                <li>اضغط على "إرسال" للرسالة المعدة مسبقاً</li>
                <li>ارجع إلى هذه الصفحة - سيتم التحقق تلقائياً</li>
              </ol>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-3">
              <Button
                onClick={handleResendWhatsApp}
                variant="outline"
                className="flex-1"
              >
                إعادة فتح واتساب
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStep('phone');
                  setVerificationCode('');
                  setWhatsappLink('');
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
