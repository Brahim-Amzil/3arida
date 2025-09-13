import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { getUserVerificationStatus, resendVerificationEmail } from '@/lib/email-verification';

interface EmailVerificationBannerProps {
  className?: string;
}

const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({ className = '' }) => {
  const { user, userDocument, refreshUserDocument } = useAuth();
  const [isVerified, setIsVerified] = useState<boolean>(true); // Default to true to avoid flash
  const [userEmail, setUserEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [message, setMessage] = useState<string>('');
  const [isDismissed, setIsDismissed] = useState(false);

  // Check verification status when user or userDocument changes
  useEffect(() => {
    if (user?.uid) {
      // If userDocument exists, use it; if null or verifiedEmail is false, show banner
      if (userDocument && userDocument.verifiedEmail) {
        setIsVerified(true);
        setUserEmail(userDocument.email || user.email || '');
      } else {
        // Either no userDocument or not verified - show banner and check status
        setIsVerified(false);
        setUserEmail(user.email || userDocument?.email || '');
        if (!userDocument) {
          // No user document exists, definitely need verification
          checkVerificationStatus();
        }
      }
    }
  }, [user, userDocument]);

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Check if user's email is verified
  const checkVerificationStatus = async () => {
    if (!user?.uid) return;

    try {
      const status = await getUserVerificationStatus(user.uid);
      setIsVerified(status.isVerified);
      setUserEmail(status.email || user.email || '');
    } catch (error) {
      console.error('Error checking verification status:', error);
      // Default to showing banner if we can't check status
      setIsVerified(false);
      setUserEmail(user.email || '');
    }
  };

  // Resend verification email
  const handleResendEmail = async () => {
    if (!user?.uid || !userEmail || resendCooldown > 0) return;

    try {
      setIsResending(true);
      setMessage('');
      
      const result = await resendVerificationEmail(user.uid, userEmail);
      
      if (result.success) {
        setMessage('Verification email sent! Please check your inbox.');
        setResendCooldown(60); // 60 second cooldown
      } else {
        setMessage(result.message || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Error resending email:', error);
      setMessage('Failed to send verification email');
    } finally {
      setIsResending(false);
    }
  };

  // Don't show banner if user is verified, not logged in, or dismissed
  if (!user || isVerified || isDismissed) {
    return null;
  }

  return (
    <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Email Verification Required
              </h3>
              <div className="mt-1 text-sm text-yellow-700">
                <p>
                  Please verify your email address ({userEmail}) to access all features.
                </p>
                {message && (
                  <p className="mt-1 font-medium">
                    {message}
                  </p>
                )}
              </div>
              <div className="mt-3 flex items-center space-x-3">
                <button
                  onClick={handleResendEmail}
                  disabled={isResending || resendCooldown > 0}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isResending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-yellow-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    'Resend Email'
                  )}
                </button>
                <button
                  onClick={async () => {
                    console.log('Manually refreshing user document...');
                    await refreshUserDocument();
                    checkVerificationStatus();
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                >
                  Refresh Status
                </button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => setIsDismissed(true)}
                className="inline-flex text-yellow-400 hover:text-yellow-600 focus:outline-none focus:text-yellow-600 transition-colors"
                aria-label="Dismiss"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;