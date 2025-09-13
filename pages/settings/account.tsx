import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { Loading } from '@/components/shared';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { createRecaptchaVerifier, verifyPhoneForSigning, verifyOTPForSigning, AuthService } from '@/lib/firebase/auth';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { RecaptchaVerifier } from 'firebase/auth';
import { resendVerificationEmail } from '@/lib/email-verification';

const Account = () => {
  const { user, userDocument, loading } = useAuth();
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [confirmationTimestamp, setConfirmationTimestamp] = useState<number | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [phoneError, setPhoneError] = useState<string>('');
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState<string>('');

  // Initialize reCAPTCHA when phone verification modal opens
  useEffect(() => {
    if (isVerifyingPhone && verificationStep === 'phone' && !recaptchaVerifier) {
      const initRecaptcha = async () => {
        try {
          const verifier = createRecaptchaVerifier('recaptcha-container-verify');
          setRecaptchaVerifier(verifier);
          setIsRecaptchaReady(true);
        } catch (error) {
          console.error('Error initializing reCAPTCHA:', error);
          setIsRecaptchaReady(false);
        }
      };
      
      // Small delay to ensure DOM element is rendered
      setTimeout(initRecaptcha, 100);
    }
    
    // Cleanup when modal closes
    if (!isVerifyingPhone && recaptchaVerifier) {
      recaptchaVerifier.clear();
      setRecaptchaVerifier(null);
      setIsRecaptchaReady(false);
    }
  }, [isVerifyingPhone, verificationStep, recaptchaVerifier]);

  const validatePhoneNumber = (phone: string): boolean => {
    // Clear error first
    setPhoneError('');
    
    if (!phone.trim()) {
      return true; // Allow empty for now
    }
    
    // International phone number format: +[country code][number]
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    
    if (!phoneRegex.test(phone)) {
      setPhoneError('Invalid phone number format. Please use international format like +1234567890 or +212612345678');
      return false;
    }
    
    return true;
  };

  const handleVerifyEmail = async () => {
    if (!user?.uid || !user?.email || isResendingEmail) return;

    try {
      setIsResendingEmail(true);
      setEmailMessage('');
      
      const result = await resendVerificationEmail(user.uid, user.email);
      
      if (result.success) {
        setEmailMessage('Verification email sent! Please check your inbox.');
      } else {
        setEmailMessage(result.message || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      setEmailMessage('Failed to send verification email');
    } finally {
      setIsResendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please log in to access your account settings.</p>
      </div>
    );
  }

  return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
              Account Settings
            </h3>
            
            {/* Success Message */}
            {showSuccessMessage && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Phone number verified successfully!
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => setShowSuccessMessage(false)}
                      className="bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                    >
                      <span className="sr-only">Dismiss</span>
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-8">
              {/* Name Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <div className="text-lg font-semibold text-gray-900">{userDocument?.name || user.displayName || 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {userDocument?.role || 'user'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
                    <div className="text-sm text-gray-600">
                      {userDocument?.createdAt ? new Date(userDocument.createdAt).toLocaleDateString() : 'Not available'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="text-lg font-semibold text-gray-900">{user.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Verification Status</label>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        userDocument?.verifiedEmail ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {userDocument?.verifiedEmail ? 'Verified' : 'Not Verified'}
                      </span>
                      {(!userDocument || !userDocument.verifiedEmail) && (
                        <button 
                          onClick={handleVerifyEmail}
                          disabled={isResendingEmail}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isResendingEmail ? 'Sending...' : 'Verify Email'}
                        </button>
                      )}
                    </div>
                    {emailMessage && (
                      <div className={`mt-3 p-3 rounded-md text-sm ${
                        emailMessage.includes('sent') || emailMessage.includes('success') 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {emailMessage}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    {!userDocument?.phone && !isEditingPhone ? (
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-semibold text-gray-500">Not provided</span>
                        <button
                          onClick={() => setIsEditingPhone(true)}
                          className="inline-flex items-center px-3 py-1 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          Add Phone
                        </button>
                      </div>
                    ) : !userDocument?.phone && isEditingPhone ? (
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 max-w-xs">
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => {
                              const value = e.target.value;
                              setPhoneNumber(value);
                              validatePhoneNumber(value);
                            }}
                            placeholder="+1234567890 or +212612345678"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white dark:text-white dark:bg-gray-800 dark:border-gray-600 ${
                              phoneError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                            }`}
                          />
                          {phoneError && (
                            <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                          )}
                        </div>
                        <button
                          onClick={async () => {
                            if (!phoneNumber.trim()) {
                              setPhoneError('Phone number is required');
                              return;
                            }
                            
                            if (!validatePhoneNumber(phoneNumber.trim())) {
                              return; // Validation error already set
                            }
                            
                            if (user) {
                              setIsSaving(true);
                              try {
                                console.log('Attempting to save phone number:', phoneNumber.trim());
                                console.log('User ID:', user.uid);
                                
                                const userRef = doc(db, 'users', user.uid);
                                await setDoc(userRef, {
                                  phone: phoneNumber.trim(),
                                  verifiedPhone: false, // Reset verification when phone number changes
                                  updatedAt: new Date()
                                }, { merge: true });
                                
                                console.log('Phone number saved successfully to Firestore');
                                setIsEditingPhone(false);
                                setPhoneNumber('');
                                setPhoneError('');
                                
                                // Force immediate UI update by refreshing user data
                                window.location.reload();
                              } catch (error) {
                                console.error('Error updating phone:', error);
                                if ((error as Error).message.includes('Invalid phone number format')) {
                                  setPhoneError('Invalid phone number format. Please use international format like +1234567890 or +212612345678');
                                } else {
                                  setPhoneError('Failed to save phone number: ' + (error as Error).message);
                                }
                              } finally {
                                setIsSaving(false);
                              }
                            }
                          }}
                          disabled={!phoneNumber.trim() || isSaving}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingPhone(false);
                            setPhoneNumber('');
                            setPhoneError('');
                          }}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : userDocument?.phone && isEditingPhone ? (
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 max-w-xs">
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => {
                              const value = e.target.value;
                              setPhoneNumber(value);
                              validatePhoneNumber(value);
                            }}
                            placeholder="+1234567890 or +212612345678"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white dark:text-white dark:bg-gray-800 dark:border-gray-600 ${
                              phoneError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                            }`}
                          />
                          {phoneError && (
                            <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                          )}
                        </div>
                        <button
                          onClick={async () => {
                            if (!phoneNumber.trim()) {
                              setPhoneError('Phone number is required');
                              return;
                            }
                            
                            if (!validatePhoneNumber(phoneNumber.trim())) {
                              return; // Validation error already set
                            }
                            
                            if (user) {
                              setIsSaving(true);
                              try {
                                console.log('Attempting to update phone number:', phoneNumber.trim());
                                console.log('User ID:', user.uid);
                                
                                const userRef = doc(db, 'users', user.uid);
                                await setDoc(userRef, {
                                  phone: phoneNumber.trim(),
                                  updatedAt: new Date()
                                }, { merge: true });
                                
                                console.log('Phone number updated successfully to Firestore');
                                setIsEditingPhone(false);
                                setPhoneError('');
                                
                                // Force immediate UI update by refreshing user data
                                window.location.reload();
                              } catch (error) {
                                console.error('Error updating phone:', error);
                                if ((error as Error).message.includes('Invalid phone number format')) {
                                  setPhoneError('Invalid phone number format. Please use international format like +1234567890 or +212612345678');
                                } else {
                                  setPhoneError('Failed to update phone number: ' + (error as Error).message);
                                }
                              } finally {
                                setIsSaving(false);
                              }
                            }
                          }}
                          disabled={!phoneNumber.trim() || isSaving}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingPhone(false);
                            setPhoneNumber('');
                            setPhoneError('');
                          }}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-semibold text-gray-900">{userDocument?.phone}</span>
                        <button
                          onClick={() => {
                            setPhoneNumber(userDocument?.phone || '');
                            setIsEditingPhone(true);
                          }}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Verification Status</label>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        userDocument?.verifiedPhone ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {userDocument?.verifiedPhone ? 'Verified' : 'Not Verified'}
                      </span>
                      {!userDocument?.verifiedPhone && userDocument?.phone && (
                        <button
                          onClick={() => setIsVerifyingPhone(true)}
                          className="inline-flex items-center px-3 py-1 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          Verify Phone
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phone Verification Modal */}
        {isVerifyingPhone && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {verificationStep === 'phone' ? 'Verify Phone Number' : 'Enter Verification Code'}
                </h3>
                
                {verificationStep === 'phone' ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-3">
                        We'll send a verification code to: <strong>{userDocument?.phone}</strong>
                      </p>
                      <div id="recaptcha-container-verify"></div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setIsVerifyingPhone(false);
                          setVerificationStep('phone');
                          if (recaptchaVerifier) {
                            recaptchaVerifier.clear();
                          }
                          setRecaptchaVerifier(null);
                          setIsRecaptchaReady(false);
                        }}
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          if (!userDocument?.phone || !recaptchaVerifier) return;
                          
                          setIsSaving(true);
                          try {
                            const result = await verifyPhoneForSigning(userDocument.phone, recaptchaVerifier);
                            setConfirmationResult(result);
                            setConfirmationTimestamp(Date.now());
                            setVerificationStep('otp');
                          } catch (error: any) {
                            console.error('Error sending OTP:', error);
                            let errorMessage = 'Failed to send verification code. Please try again.';
                            
                            if (error.code === 'auth/invalid-phone-number') {
                              errorMessage = 'Invalid phone number format. Please check your phone number.';
                            } else if (error.code === 'auth/too-many-requests') {
                              errorMessage = 'Too many requests. Please wait before trying again.';
                            } else if (error.message && error.message.includes('Invalid phone number format')) {
                              errorMessage = error.message;
                            } else if (error.code === 'auth/captcha-check-failed') {
                              errorMessage = 'reCAPTCHA verification failed. Please try again.';
                            }
                            
                            alert(errorMessage);
                          } finally {
                            setIsSaving(false);
                          }
                        }}
                        disabled={isSaving || !isRecaptchaReady}
                        className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? 'Sending...' : 'Send Code'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter the 6-digit code sent to {userDocument?.phone}
                      </label>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white dark:text-white dark:bg-gray-800 dark:border-gray-600"
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setVerificationStep('phone')}
                        disabled={isSaving}
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        Back
                      </button>
                      <button
                        onClick={async () => {
                          if (!otpCode.trim() || !confirmationResult || !user) {
                             console.log('Validation failed:', { otpCode: otpCode.trim(), confirmationResult: !!confirmationResult, user: !!user });
                             return;
                           }
                           
                           // Check if confirmation result is expired (10 minutes)
                           if (confirmationTimestamp && Date.now() - confirmationTimestamp > 10 * 60 * 1000) {
                             alert('Verification session has expired. Please request a new code.');
                             setVerificationStep('phone');
                             setConfirmationResult(null);
                             setConfirmationTimestamp(null);
                             return;
                           }
                           
                           console.log('Starting OTP verification:', { otpCode, confirmationResultExists: !!confirmationResult, sessionAge: confirmationTimestamp ? Date.now() - confirmationTimestamp : 'unknown' });
                          setIsSaving(true);
                          try {
                            const result = await verifyOTPForSigning(confirmationResult, otpCode);
                            console.log('OTP verification successful:', result);
                            
                            try {
                              // Update user's verification status in Firestore
                              const userRef = doc(db, 'users', user.uid);
                              await updateDoc(userRef, {
                                verifiedPhone: true,
                                phone: userDocument?.phone, // Ensure phone number is saved
                                updatedAt: new Date()
                              });
                              console.log('Firestore update successful');

                              // Sign out from the temporary phone verification session
                              // This allows the AuthContext to detect the Firestore changes
                              await firebaseSignOut(auth);
                              console.log('Signed out from temporary phone session');
                            } catch (firestoreError) {
                              console.warn('Firestore update failed, but phone verification succeeded:', firestoreError);
                              // Don't throw here - verification was successful
                              // Still sign out to clean up the session
                              try {
                                await firebaseSignOut(auth);
                              } catch (signOutError) {
                                console.warn('Failed to sign out after verification:', signOutError);
                              }
                            }
                            
                            // Reset states
                            setIsVerifyingPhone(false);
                            setVerificationStep('phone');
                            setOtpCode('');
                            setConfirmationResult(null);
                            setConfirmationTimestamp(null);
                            if (recaptchaVerifier) {
                              recaptchaVerifier.clear();
                            }
                            setRecaptchaVerifier(null);
                            setIsRecaptchaReady(false);
                            
                            setShowSuccessMessage(true);
                            // Auto-hide success message after 5 seconds
                            setTimeout(() => setShowSuccessMessage(false), 5000);
                          } catch (error: any) {
                            console.error('Error verifying OTP:', error);
                            
                            let errorMessage = 'Invalid verification code. Please try again.';
                            
                            if (error.code === 'auth/invalid-verification-code') {
                              errorMessage = 'The verification code is invalid. Please check and try again.';
                            } else if (error.code === 'auth/code-expired') {
                              errorMessage = 'The verification code has expired. Please request a new code.';
                            } else if (error.code === 'auth/too-many-requests') {
                              errorMessage = 'Too many attempts. Please wait before trying again.';
                            } else if (error.code === 'auth/session-expired') {
                              errorMessage = 'Verification session expired. Please start over.';
                            } else if (error.message) {
                              errorMessage = error.message;
                            }
                            
                            alert(errorMessage);
                          } finally {
                            setIsSaving(false);
                          }
                        }}
                        disabled={isSaving || otpCode.length !== 6}
                        className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? 'Verifying...' : 'Verify'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default Account;
