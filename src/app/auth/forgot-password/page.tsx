'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { resetPassword } from '@/lib/auth';

export default function ForgotPasswordPage() {
  const { t, locale } = useTranslation();
  const isRTL = locale === 'ar';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError(t('auth.forgotPassword.enterEmail'));
      return;
    }

    try {
      setLoading(true);
      setError('');

      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      const message = err.message || '';
      if (
        message.includes('Too many requests') ||
        message.includes('طلبات كثيرة')
      ) {
        setError(t('auth.forgotPassword.rateLimited'));
      } else {
        setError(message || t('auth.forgotPassword.sendLink'));
      }
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
              {t('auth.forgotPassword.title')}
            </h2>
            <p className="text-gray-600">{t('auth.forgotPassword.subtitle')}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('auth.forgotPassword.cardTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              {success ? (
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
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('auth.forgotPassword.checkEmail')}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t('auth.forgotPassword.sentTo')}{' '}
                    <strong>{email}</strong>
                  </p>
                  <div className="space-y-4">
                    <Button asChild className="w-full">
                      <Link href="/auth/login">
                        {t('auth.forgotPassword.backToLogin')}
                      </Link>
                    </Button>
                    <div className="text-sm text-gray-500">
                      <p>{t('auth.forgotPassword.noEmail')}</p>
                      <ul className="mt-2 space-y-1">
                        <li>• {t('auth.forgotPassword.checkSpam')}</li>
                        <li>• {t('auth.forgotPassword.verifyEmail')}</li>
                        <li>• {t('auth.forgotPassword.wait')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('auth.email')}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('auth.email')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white me-2" />
                        {t('auth.forgotPassword.sending')}
                      </>
                    ) : (
                      t('auth.forgotPassword.sendLink')
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      {t('auth.forgotPassword.rememberPassword')}{' '}
                      <Link
                        href="/auth/login"
                        className="font-medium text-green-600 hover:text-green-500"
                      >
                        {t('auth.forgotPassword.signIn')}
                      </Link>
                    </p>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              {t('auth.forgotPassword.needHelp')}{' '}
              <Link
                href="/contact"
                className="text-green-600 hover:text-green-500 underline"
              >
                {t('auth.forgotPassword.contact')}
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
