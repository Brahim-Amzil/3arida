import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { Alert, Loading } from '@/components/shared';
import { useAuth } from '@/lib/firebase/AuthContext';
import { verifyEmailWithToken } from '@/lib/email-verification';
import type { NextPageWithLayout } from 'types';

const VerifyEmailToken: NextPageWithLayout = () => {
  const router = useRouter();
  const { token } = router.query;
  const { user, loading: authLoading, refreshUserDocument } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token && !authLoading) {
      if (!user) {
        // User is not authenticated, redirect to login
        router.push('/auth/firebase-login?message=Please log in to verify your email');
        return;
      }
      verifyToken(token as string);
    }
  }, [token, user, authLoading]);

  const verifyToken = async (verificationToken: string) => {
    try {
      console.log('Starting email verification with token:', verificationToken);
      const result = await verifyEmailWithToken(verificationToken);
      console.log('Verification result:', result);

      if (result.success) {
        setStatus('success');
        setMessage('Email verified successfully! Redirecting to dashboard in 5 seconds...');
        
        // Refresh user document to update verification status
        console.log('Refreshing user document...');
        await refreshUserDocument();
        console.log('User document refreshed');
        
        // Wait additional time to ensure real-time listener has processed the update
        setTimeout(async () => {
          console.log('Performing final refresh before redirect...');
          await refreshUserDocument();
          console.log('Final refresh completed');
        }, 1000);
        
        // Increased timeout to 5 seconds for better visibility and processing
        setTimeout(() => {
          console.log('Redirecting to dashboard...');
          router.push('/dashboard');
        }, 5000);
      } else {
        console.error('Verification failed:', result.message);
        setStatus('error');
        setMessage(result.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Error during verification:', error);
      setStatus('error');
      setMessage('Failed to verify email');
    }
  };



  if (authLoading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8">
          <Loading />
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center p-8">
        <Alert status="error">Invalid verification token</Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Email Verification
          </h2>
          {status === 'success' && (
            <div className="space-y-4">
              <Alert status="success">{message}</Alert>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Please wait while we redirect you...
              </div>
            </div>
          )}
          {status === 'error' && (
            <div className="space-y-4">
              <Alert status="error">{message}</Alert>
              <button
                onClick={() => router.push('/auth/verify-email')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

VerifyEmailToken.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default VerifyEmailToken;
