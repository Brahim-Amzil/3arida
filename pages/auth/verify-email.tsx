import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthLayout } from '@/components/layouts';
import { useAuth } from '@/lib/firebase/AuthContext';
import { verifyEmailWithToken, resendVerificationEmail } from '@/lib/email-verification';
import { Loading } from '@/components/shared';
import type { ReactElement } from 'react';

type VerificationState = 'loading' | 'success' | 'error' | 'prompt';

interface VerificationResult {
  success: boolean;
  message: string;
  userId?: string;
}

const VerifyEmail = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [state, setState] = useState<VerificationState>('loading');
  const [message, setMessage] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [userEmail, setUserEmail] = useState<string>('');

  // Extract token from URL parameters
  const token = router.query.token as string;

  // Verify email token on component mount
  useEffect(() => {
    if (token) {
      verifyToken(token);
    } else {
      setState('prompt');
      setMessage('No verification token provided');
    }
  }, [token]);

  // Set user email when user is available
  useEffect(() => {
    if (user?.email) {
      setUserEmail(user.email);
    }
  }, [user]);

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Verify the email token
  const verifyToken = async (verificationToken: string) => {
    try {
      setState('loading');
      const result: VerificationResult = await verifyEmailWithToken(verificationToken);
      
      if (result.success) {
        setState('success');
        setMessage(result.message);
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setState('error');
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      setState('error');
      setMessage('An unexpected error occurred during verification');
    }
  };

  // Resend verification email
  const handleResendEmail = async () => {
    if (!user?.uid || !userEmail || resendCooldown > 0) return;

    try {
      setIsResending(true);
      const result = await resendVerificationEmail(user.uid, userEmail);
      
      if (result.success) {
        setMessage('Verification email sent successfully! Please check your inbox.');
        setResendCooldown(60); // 60 second cooldown
      } else {
        setMessage(result.message || 'Failed to resend verification email');
      }
    } catch (error) {
      console.error('Error resending email:', error);
      setMessage('Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  // Render loading state
  if (state === 'loading') {
    return (
      <div className="text-center">
        <div className="mb-6">
          <Loading />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Verifying Your Email
        </h1>
        <p className="text-gray-600">
          Please wait while we verify your email address...
        </p>
      </div>
    );
  }

  // Render success state
  if (state === 'success') {
    return (
      <div className="text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Email Verified Successfully!
        </h1>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to dashboard in 3 seconds...
        </p>
      </div>
    );
  }

  // Render error state
  if (state === 'error') {
    return (
      <div className="text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Verification Failed
        </h1>
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        {user && userEmail && (
          <div className="space-y-4">
            <button
              onClick={handleResendEmail}
              disabled={isResending || resendCooldown > 0}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isResending ? (
                'Sending...'
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                'Resend Verification Email'
              )}
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    );
  }

  // Render prompt state (no token provided)
  return (
    <div className="text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Email Verification
      </h1>
      <p className="text-gray-600 mb-6">
        Please check your email for a verification link, or request a new one below.
      </p>
      {user && userEmail && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Verification email will be sent to: <strong>{userEmail}</strong>
          </p>
          <button
            onClick={handleResendEmail}
            disabled={isResending || resendCooldown > 0}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isResending ? (
              'Sending...'
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              'Send Verification Email'
            )}
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      )}
      {message && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">{message}</p>
        </div>
      )}
    </div>
  );
};

VerifyEmail.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout heading="confirm-email" description="confirm-email-description">
      {page}
    </AuthLayout>
  );
};



export default VerifyEmail;
