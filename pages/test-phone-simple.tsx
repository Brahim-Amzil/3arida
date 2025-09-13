import React, { useState } from 'react';
import { PhoneVerification } from '../components/auth';
import { AuthProvider } from '../lib/firebase/AuthContext';

const TestPhoneSimple: React.FC = () => {
  const [verificationResult, setVerificationResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerificationSuccess = (phoneNumber: string) => {
    setVerificationResult(`Phone verified successfully: ${phoneNumber}`);
    setError(null);
  };

  const handleVerificationError = (errorMessage: string) => {
    setError(errorMessage);
    setVerificationResult(null);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Test Phone Verification
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Simple phone verification test
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <PhoneVerification
              onVerificationSuccess={handleVerificationSuccess}
              onVerificationError={handleVerificationError}
              buttonText="Verify Phone"
              placeholder="Enter your phone number (+212612345678)"
            />

            {verificationResult && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{verificationResult}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Instructions:</h3>
              <ol className="text-xs text-blue-700 space-y-1">
                <li>1. Enter your phone number in international format (+212612345678)</li>
                <li>2. Complete the reCAPTCHA challenge</li>
                <li>3. Click "Send OTP" to receive verification code</li>
                <li>4. Enter the 6-digit code you receive via SMS</li>
                <li>5. Click "Verify Phone" to complete verification</li>
              </ol>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Domain Issue Fix:</h3>
              <p className="text-xs text-yellow-700">
                If you see "auth/invalid-app-credential" error, add <code>localhost:3001</code> to Firebase Console → Authentication → Settings → Authorized domains
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
};

export default TestPhoneSimple;