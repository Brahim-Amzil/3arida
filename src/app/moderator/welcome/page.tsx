'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useTranslation } from '@/hooks/useTranslation';
import Header from '@/components/layout/HeaderWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function ModeratorWelcomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userProfile } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [invitationData, setInvitationData] = useState<any>(null);
  const [accepting, setAccepting] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    // If user is already logged in and is already a moderator, redirect
    if (userProfile?.role === 'moderator' || userProfile?.role === 'admin') {
      router.push('/admin');
      return;
    }

    validateInvitation();
  }, [token, userProfile]);

  const validateInvitation = async () => {
    try {
      const response = await fetch(
        `/api/moderator/validate-invitation?token=${token}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid or expired invitation');
        return;
      }

      setInvitationData(data.invitation);
    } catch (err) {
      console.error('Error validating invitation:', err);
      setError('Failed to validate invitation');
    } finally {
      setLoading(false);
    }
  };

  const acceptInvitation = async () => {
    if (!user || !token) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(`/moderator/welcome?token=${token}`);
      router.push(`/auth/login?returnUrl=${returnUrl}`);
      return;
    }

    try {
      setAccepting(true);

      const response = await fetch('/api/moderator/accept-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          userId: user.uid,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to accept invitation');
        return;
      }

      // Force refresh the user profile to get updated role
      try {
        await fetch('/api/user/refresh-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.uid,
          }),
        });
      } catch (refreshError) {
        console.log('Profile refresh failed, but invitation was accepted');
      }

      // Force a page reload to ensure the AuthProvider picks up the new role
      window.location.href = '/admin';
    } catch (err) {
      console.error('Error accepting invitation:', err);
      setError('Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="py-12 text-center">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('moderator.welcome.invalidInvitation')}
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => router.push('/')} variant="outline">
                {t('moderator.welcome.goToHomepage')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
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
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('moderator.welcome.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('moderator.welcome.subtitle')}
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="space-y-6">
            <br />
            <p className="text-gray-700 text-lg leading-relaxed">
              {t('moderator.welcome.description')}
            </p>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {t('moderator.welcome.responsibilities')}
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>{t('moderator.welcome.reviewPetitions')}</li>
                <li>{t('moderator.welcome.manageUsers')}</li>
                <li>{t('moderator.welcome.maintainQuality')}</li>
                <li>{t('moderator.welcome.handleAppeals')}</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
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
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">
                    {t('moderator.welcome.gettingStarted')}
                  </h4>
                  <p className="text-blue-800 text-sm">
                    {user
                      ? t('moderator.welcome.loggedInReady')
                      : t('moderator.welcome.needToLogin')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Button
                    onClick={acceptInvitation}
                    disabled={accepting}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  >
                    {accepting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('moderator.welcome.accepting')}
                      </>
                    ) : (
                      t('moderator.welcome.getStarted')
                    )}
                  </Button>
                  <Button
                    onClick={() => router.push('/dashboard')}
                    variant="outline"
                  >
                    {t('moderator.welcome.goToDashboard')}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      const returnUrl = encodeURIComponent(
                        `/moderator/welcome?token=${token}`
                      );
                      router.push(`/auth/login?returnUrl=${returnUrl}`);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  >
                    {t('moderator.welcome.signInToAccept')}
                  </Button>
                  <Button
                    onClick={() => {
                      const returnUrl = encodeURIComponent(
                        `/moderator/welcome?token=${token}`
                      );
                      router.push(`/auth/register?returnUrl=${returnUrl}`);
                    }}
                    variant="outline"
                  >
                    {t('moderator.welcome.createAccount')}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>{t('moderator.welcome.supportContact')}</p>
        </div>
      </div>
    </div>
  );
}

export default function ModeratorWelcomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      }
    >
      <ModeratorWelcomeContent />
    </Suspense>
  );
}
