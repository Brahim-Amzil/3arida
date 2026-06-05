'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';
import PasswordInput from '@/components/auth/PasswordInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import {
  completePasswordReset,
  verifyPasswordResetCodeForEmail,
} from '@/lib/auth';

function ResetPasswordPageContent() {
  const searchParams = useSearchParams();
  const { t, locale } = useTranslation();
  const isRTL = locale === 'ar';

  const [oobCode, setOobCode] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const oobCodeFromUrl = searchParams?.get('oobCode');
  const modeFromUrl = searchParams?.get('mode');

  useEffect(() => {
    setOobCode(oobCodeFromUrl);

    if (!oobCodeFromUrl || (modeFromUrl && modeFromUrl !== 'resetPassword')) {
      setVerifying(false);
      setError(t('auth.resetPassword.invalidLink'));
      return;
    }

    let cancelled = false;

    async function verifyCode() {
      try {
        setVerifying(true);
        setError('');
        const accountEmail =
          await verifyPasswordResetCodeForEmail(oobCodeFromUrl);
        if (!cancelled) {
          setEmail(accountEmail);
        }
      } catch (err: any) {
        console.error('Reset link verification error:', err);
        if (!cancelled) {
          setError(err.message || t('auth.resetPassword.invalidLink'));
        }
      } finally {
        if (!cancelled) {
          setVerifying(false);
        }
      }
    }

    void verifyCode();

    return () => {
      cancelled = true;
    };
    // Verify once per URL — do not depend on `t` (recreated every render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oobCodeFromUrl, modeFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oobCode) {
      setError(t('auth.resetPassword.invalidLink'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.resetPassword.minLength'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.resetPassword.mismatch'));
      return;
    }

    try {
      setLoading(true);
      setError('');
      await completePasswordReset(oobCode, password);
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || t('auth.resetPassword.invalidLink'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Header />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link
              href="/"
              className="flex items-center justify-center space-x-2 mb-6"
            >
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">#</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {locale === 'ar' ? 'عريضة' : '3arida'}
              </span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('auth.resetPassword.title')}
            </h2>
            <p className="text-gray-600">{t('auth.resetPassword.subtitle')}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('auth.resetPassword.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              {verifying ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {t('auth.resetPassword.verifying')}
                  </p>
                </div>
              ) : success ? (
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
                    {t('auth.resetPassword.successTitle')}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t('auth.resetPassword.successMessage')}
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/auth/login">
                      {t('auth.resetPassword.goToLogin')}
                    </Link>
                  </Button>
                </div>
              ) : error && !email ? (
                <div className="text-center">
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/forgot-password">
                      {t('auth.forgotPassword.sendLink')}
                    </Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {email && (
                    <p className="text-sm text-gray-600">
                      {t('auth.resetPassword.forEmail')}{' '}
                      <strong className="text-gray-900">{email}</strong>
                    </p>
                  )}

                  <PasswordInput
                    id="new-password"
                    label={t('auth.resetPassword.newPassword')}
                    value={password}
                    onChange={setPassword}
                    placeholder={t('auth.resetPassword.newPassword')}
                    disabled={loading}
                    minLength={6}
                    showLabel={t('auth.showPassword')}
                    hideLabel={t('auth.hidePassword')}
                  />

                  <PasswordInput
                    id="confirm-password"
                    label={t('auth.resetPassword.confirmPassword')}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder={t('auth.resetPassword.confirmPassword')}
                    disabled={loading}
                    minLength={6}
                    showLabel={t('auth.showPassword')}
                    hideLabel={t('auth.hidePassword')}
                  />

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white me-2" />
                        {t('auth.resetPassword.saving')}
                      </>
                    ) : (
                      t('auth.resetPassword.submit')
                    )}
                  </Button>

                  <div className="text-center">
                    <Link
                      href="/auth/login"
                      className="text-sm text-green-600 hover:text-green-500"
                    >
                      {t('auth.forgotPassword.backToLogin')}
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
        </div>
      }
    >
      <ResetPasswordPageContent />
    </Suspense>
  );
}
