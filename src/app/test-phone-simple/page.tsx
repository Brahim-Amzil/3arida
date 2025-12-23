'use client';

/**
 * Simple Phone Verification Test Page
 *
 * This page mimics Firebase's demo exactly to help diagnose
 * why their demo works but our app doesn't.
 *
 * Test at: http://localhost:3000/test-phone-simple
 */

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function TestPhoneSimple() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    addLog('🔄 Component mounted, initializing reCAPTCHA...');

    const initRecaptcha = () => {
      try {
        // Clear existing
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = undefined;
        }

        addLog('🔐 Creating RecaptchaVerifier...');

        // Create invisible reCAPTCHA (like Firebase demo)
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          'recaptcha-container',
          {
            size: 'invisible',
            callback: () => {
              addLog('✅ reCAPTCHA solved');
            },
            'expired-callback': () => {
              addLog('⚠️ reCAPTCHA expired');
            },
          }
        );

        // Render
        window.recaptchaVerifier
          .render()
          .then((widgetId) => {
            addLog(
              `✅ reCAPTCHA rendered successfully (widget ID: ${widgetId})`
            );
          })
          .catch((err) => {
            addLog(`❌ reCAPTCHA render failed: ${err.message}`);
            setError(`reCAPTCHA error: ${err.message}`);
          });
      } catch (err: any) {
        addLog(`❌ reCAPTCHA init failed: ${err.message}`);
        setError(`Initialization error: ${err.message}`);
      }
    };

    const timer = setTimeout(initRecaptcha, 500);

    return () => {
      clearTimeout(timer);
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    };
  }, []);

  const handleSendCode = async () => {
    setError('');
    setSuccess('');

    // Validate phone number
    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone.startsWith('+')) {
      setError('Phone number must start with + and country code');
      return;
    }

    if (!window.recaptchaVerifier) {
      setError('reCAPTCHA not initialized. Please refresh the page.');
      return;
    }

    setLoading(true);
    addLog(`📱 Sending SMS to: ${cleanPhone}`);

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        cleanPhone,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmationResult;
      addLog('✅ SMS sent successfully!');
      setSuccess('SMS sent! Check your phone.');
      setStep('code');
    } catch (err: any) {
      addLog(`❌ Send SMS failed: ${err.code} - ${err.message}`);
      setError(`Error: ${err.code} - ${err.message}`);

      // Log detailed error info
      console.error('Full error object:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setError('');
    setSuccess('');

    if (!code || code.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    if (!window.confirmationResult) {
      setError('No confirmation result. Please request a new code.');
      return;
    }

    setLoading(true);
    addLog(`🔍 Verifying code: ${code}`);

    try {
      const result = await window.confirmationResult.confirm(code);
      addLog(`✅ Verification successful! User ID: ${result.user.uid}`);
      setSuccess(`Success! Phone verified: ${result.user.phoneNumber}`);

      // Sign out (we only need verification)
      await auth.signOut();
      addLog('🚪 Signed out');
    } catch (err: any) {
      addLog(`❌ Verification failed: ${err.code} - ${err.message}`);
      setError(`Error: ${err.code} - ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-2">
            Simple Phone Verification Test
          </h1>
          <p className="text-gray-600 mb-6">
            This page mimics Firebase's demo to help diagnose issues
          </p>

          {/* Phone Input */}
          {step === 'phone' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number (with country code)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+34612345678"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  dir="ltr"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Example: +34 for Spain, +212 for Morocco, +1 for US
                </p>
              </div>

              <button
                onClick={handleSendCode}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </div>
          )}

          {/* Code Input */}
          {step === 'code' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-4 py-2 border rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500"
                  dir="ltr"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleVerifyCode}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
                <button
                  onClick={() => {
                    setStep('phone');
                    setCode('');
                    setError('');
                    setSuccess('');
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Invisible reCAPTCHA container */}
          <div id="recaptcha-container"></div>
        </div>

        {/* Debug Logs */}
        <div className="mt-6 bg-gray-900 rounded-lg p-4">
          <h2 className="text-white font-mono text-sm mb-2">Debug Logs:</h2>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="text-green-400 font-mono text-xs">
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            Comparison with Firebase Demo
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              ✅ Firebase demo works:{' '}
              <a
                href="https://fir-ui-demo-84a6c.firebaseapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                https://fir-ui-demo-84a6c.firebaseapp.com/
              </a>
            </p>
            <p>❌ Your app doesn't work (yet)</p>
            <p className="mt-3 font-medium">Check these:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Is localhost authorized in Firebase Console?</li>
              <li>Is Phone provider enabled?</li>
              <li>Is reCAPTCHA configured correctly?</li>
              <li>Check browser console for errors</li>
              <li>Check network tab for failed requests</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
