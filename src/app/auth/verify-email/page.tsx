'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { sendEmailVerification, applyActionCode } from 'firebase/auth';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { auth } from '@/lib/firebase';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [verificationSent, setVerificationSent] = useState(false);

  const mode = searchParams?.get('mode');
  const actionCode = searchParams?.get('oobCode');

  // Handle email verification link
  useEffect(() => {
    if (mode === 'verifyEmail' && actionCode) {
      handleEmailVerification(actionCode);
    }
  }, [mode, actionCode]);

  const handleEmailVerification = async (code: string) => {
    try {
      setLoading(true);
      setError('');

      await applyActionCode(auth, code);
      setSuccess(
        'Email verified successfully! You can now access all features.'
      );

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (err: any) {
      console.error('Email verification error:', err);
      setError(
        'Invalid or expired verification link. Please request a new one.'
      );
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    if (!user) {
      setError('Please sign in to send verification email.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await sendEmailVerification(user);
      setVerificationSent(true);
      setSuccess('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      console.error('Send verification error:', err);
      setError('Failed to send verification email. Please try again.');
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
              <CardTitle className="text-center">Verify Your Email</CardTitle>
            </CardHeader>
            <CardContent>
              {!user ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Please sign in to verify your email address.
                  </p>
                  <Button asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
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
                    Email Already Verified
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your email address has been verified successfully.
                  </p>
                  <Button asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center">
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
                    Check Your Email
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We need to verify your email address:{' '}
                    <strong>{user.email}</strong>
                  </p>

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
                        'Send Verification Email'
                      )}
                    </Button>

                    <div className="text-sm text-gray-500">
                      <p>Didn't receive the email?</p>
                      <ul className="mt-2 space-y-1">
                        <li>• Check your spam/junk folder</li>
                        <li>• Make sure {user.email} is correct</li>
                        <li>• Wait a few minutes and try again</li>
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/dashboard">Continue to Dashboard</Link>
                      </Button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Some features may be limited until email is verified
                      </p>
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
