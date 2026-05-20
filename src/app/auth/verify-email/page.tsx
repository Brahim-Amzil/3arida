'use client';

import React, { useCallback, useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { applyActionCode } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import Header from '@/components/layout/HeaderWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { auth, db } from '@/lib/firebase';
import {
  requestVerificationEmailByAddress,
  sendVerificationEmail as resendVerificationEmail,
} from '@/lib/auth';

function VerifyEmailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<string | null>(null);
  const [actionCode, setActionCode] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [isPendingRegistration, setIsPendingRegistration] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMode(searchParams?.get('mode'));
    setActionCode(searchParams?.get('oobCode'));
    setPendingEmail(searchParams?.get('email'));
    setIsPendingRegistration(searchParams?.get('pending') === '1');
  }, [searchParams]);

  const handleEmailVerification = useCallback(
    async (code: string) => {
      try {
        setLoading(true);
        setError('');

        await applyActionCode(auth, code);

        const currentUser = auth.currentUser;
        if (currentUser) {
          await currentUser.reload();
          await updateDoc(doc(db, 'users', currentUser.uid), {
            verifiedEmail: true,
            updatedAt: new Date(),
          });

          try {
            const { sendWelcomeEmail } = await import('@/lib/email-notifications');
            await sendWelcomeEmail(
              currentUser.displayName || 'مستخدم',
              currentUser.email || '',
            );
          } catch (welcomeError) {
            console.warn('Welcome email after verify failed:', welcomeError);
          }

          setSuccess(
            'تم تأكيد بريدك الإلكتروني! يمكنك الآن إنشاء العرائض والتوقيع عليها.',
          );
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } else {
          setSuccess(
            'تم تأكيد بريدك الإلكتروني! سجّل الدخول الآن لاستخدام المنصة.',
          );
          setTimeout(() => {
            router.push('/auth/login?verified=1');
          }, 3000);
        }
      } catch (err: any) {
        console.error('Email verification error:', err);
        setError(
          'رابط التأكيد غير صالح أو منتهي الصلاحية. أعد إرسال رسالة التأكيد.',
        );
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  // Handle email verification link
  useEffect(() => {
    if (mounted && mode === 'verifyEmail' && actionCode) {
      void handleEmailVerification(actionCode);
    }
  }, [mounted, mode, actionCode, handleEmailVerification]);

  const sendVerificationEmail = async () => {
    const emailForResend = user?.email || pendingEmail;
    if (!emailForResend) {
      setError('سجّل الدخول أولاً أو أكمل التسجيل لإعادة إرسال رسالة التأكيد.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (user && !user.emailVerified) {
        await resendVerificationEmail(user);
      } else if (!user && pendingEmail) {
        await requestVerificationEmailByAddress(pendingEmail);
      } else {
        await requestVerificationEmailByAddress(emailForResend);
      }

      setVerificationSent(true);
      setSuccess('تم إرسال رسالة التأكيد من contact@3arida.org — راجع بريدك.');
    } catch (err: any) {
      console.error('Send verification error:', err);
      setError(err.message || 'تعذر إرسال رسالة التأكيد.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  // If handling verification link
  if (mode === 'verifyEmail' && actionCode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {loading
                    ? 'Verifying Email...'
                    : success
                      ? 'Email Verified!'
                      : 'Verification Failed'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-3 text-gray-600">
                      Verifying your email...
                    </span>
                  </div>
                )}

                {success && (
                  <div className="py-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
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
                    <p className="text-green-600 mb-4">{success}</p>
                    <p className="text-sm text-gray-600">
                      Redirecting to dashboard...
                    </p>
                  </div>
                )}

                {error && (
                  <div className="py-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button asChild>
                      <Link href="/auth/login">Back to Login</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Regular verification page
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">تأكيد البريد الإلكتروني</CardTitle>
            </CardHeader>
            <CardContent>
              {!user ? (
                <div className="text-center" dir="rtl">
                  <p className="text-gray-700 mb-4">
                    {isPendingRegistration
                      ? `تم إرسال رسالة تأكيد إلى ${pendingEmail || 'بريدك'}. افتح الرابط في البريد ثم سجّل الدخول.`
                      : 'أدخل بريدك لإعادة إرسال رسالة التأكيد أو سجّل الدخول.'}
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4 text-sm text-amber-900">
                    بدون تأكيد البريد لا يمكنك إنشاء عريضة أو التوقيع على العرائض.
                  </div>
                  {success && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                      <p className="text-green-600 text-sm">{success}</p>
                    </div>
                  )}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}
                  <div className="space-y-3">
                    {pendingEmail && (
                      <Button
                        onClick={sendVerificationEmail}
                        disabled={loading || verificationSent}
                        className="w-full"
                      >
                        {loading
                          ? 'جاري الإرسال...'
                          : verificationSent
                            ? 'تم الإرسال'
                            : 'إعادة إرسال رسالة التأكيد'}
                      </Button>
                    )}
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/auth/login">تسجيل الدخول</Link>
                    </Button>
                  </div>
                </div>
              ) : user.emailVerified ? (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    تم التأكيد مسبقاً
                  </h3>
                  <p className="text-gray-600 mb-4">
                    بريدك الإلكتروني مؤكد. يمكنك استخدام المنصة بالكامل.
                  </p>
                  <Button asChild>
                    <Link href="/dashboard">لوحة التحكم</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center" dir="rtl">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    راجع بريدك الإلكتروني
                  </h3>
                  <p className="text-gray-600 mb-4">
                    يجب تأكيد: <strong>{user.email}</strong>
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 text-sm text-amber-900">
                    بدون التأكيد لا يمكنك إنشاء عريضة أو التوقيع على العرائض.
                  </div>

                  {success && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                      <p className="text-green-600 text-sm">{success}</p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <Button
                      onClick={sendVerificationEmail}
                      disabled={loading || verificationSent}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : verificationSent ? (
                        'Verification Email Sent'
                      ) : (
                        'إعادة إرسال رسالة التأكيد'
                      )}
                    </Button>

                    <div className="text-sm text-gray-500 text-right">
                      <p>لم تصلك الرسالة؟</p>
                      <ul className="mt-2 space-y-1">
                        <li>• تحقق من مجلد الرسائل غير المرغوب فيها (خصوصاً Gmail)</li>
                        <li>• الرسالة تُرسل من contact@3arida.org</li>
                        <li>• انتظر دقائق ثم أعد الإرسال</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}
