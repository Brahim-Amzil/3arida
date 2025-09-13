import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/firebase/AuthContext';
import { createRecaptchaVerifier } from '../../lib/firebase/auth';
import { RecaptchaVerifier } from 'firebase/auth';

interface PhoneVerificationProps {
  onVerificationSuccess: (phoneNumber: string) => void;
  onVerificationError: (error: string) => void;
  buttonText?: string;
  placeholder?: string;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  onVerificationSuccess,
  onVerificationError,
  buttonText = 'Verify Phone',
  placeholder = 'Enter your phone number',
}) => {
  const { verifyPhoneForSigning, verifyOTPForSigning } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    // Initialize reCAPTCHA when component mounts
    if (typeof window !== 'undefined') {
      try {
        const verifier = createRecaptchaVerifier('recaptcha-container');
        setRecaptchaVerifier(verifier);
      } catch (error) {
        console.error('Failed to initialize reCAPTCHA:', error);
        onVerificationError('Failed to initialize reCAPTCHA. Please refresh the page.');
      }
    }

    return () => {
      // Cleanup reCAPTCHA
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch (error) {
          console.error('Error clearing reCAPTCHA:', error);
        }
      }
    };
  }, []);

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      onVerificationError('Please enter a valid phone number');
      return;
    }

    if (!recaptchaVerifier) {
      onVerificationError('reCAPTCHA not ready. Please refresh the page.');
      return;
    }

    setLoading(true);
    
    try {
      const result = await verifyPhoneForSigning(phoneNumber, recaptchaVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (error: any) {
      console.error('Phone verification error:', error);
      onVerificationError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode.trim()) {
      onVerificationError('Please enter the OTP code');
      return;
    }

    if (!confirmationResult) {
      onVerificationError('No confirmation result available');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOTPForSigning(confirmationResult, otpCode);
      if (result.verified) {
        onVerificationSuccess(result.phoneNumber);
      } else {
        onVerificationError('Phone verification failed');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      onVerificationError(error.message || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters except +
    const cleaned = value.replace(/[^\d+]/g, '');

    // If it already starts with +, return as is
    if (cleaned.startsWith('+')) {
      return cleaned;
    }

    // If it starts with 0, assume it's a local Moroccan number
    if (cleaned.startsWith('0')) {
      return `+212${cleaned.slice(1)}`;
    }

    // If it's a short number without country code, assume Morocco
    if (cleaned.length <= 9) {
      return `+212${cleaned}`;
    }

    // For longer numbers, add + prefix
    return `+${cleaned}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  if (step === 'phone') {
    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Format: +212612345678 (international format)
          </p>
        </div>

        <div id="recaptcha-container"></div>

        <button
          onClick={handleSendOTP}
          disabled={loading || !phoneNumber.trim()}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
          Enter OTP Code
        </label>
        <input
          type="text"
          id="otp"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          placeholder="Enter 6-digit code"
          maxLength={6}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        />
        <p className="mt-1 text-xs text-gray-500">OTP sent to {phoneNumber}</p>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => setStep('phone')}
          disabled={loading}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleVerifyOTP}
          disabled={loading || !otpCode.trim()}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : buttonText}
        </button>
      </div>
    </div>
  );
};

export default PhoneVerification;
