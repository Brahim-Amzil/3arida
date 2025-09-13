import React, { useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { getUserVerificationStatus, resendVerificationEmail } from '@/lib/email-verification';
import { Loading } from '@/components/shared';

const TestEmailVerification = () => {
  const { user, userDocument, loading, refreshUserDocument } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log('Test:', message);
  };

  const runVerificationTest = async () => {
    if (!user) {
      addResult('❌ No user logged in');
      return;
    }

    setIsRunning(true);
    setTestResults([]);

    try {
      addResult('🔍 Starting email verification test...');
      addResult(`👤 User ID: ${user.uid}`);
      addResult(`📧 User Email: ${user.email}`);
      
      // Check current userDocument state
      addResult(`📄 Current userDocument.verifiedEmail: ${userDocument?.verifiedEmail}`);
      
      // Check verification status from Firestore
      const status = await getUserVerificationStatus(user.uid);
      addResult(`🔍 Firestore verification status: ${status.isVerified}`);
      addResult(`📧 Firestore email: ${status.email}`);
      
      // Refresh user document
      addResult('🔄 Refreshing user document...');
      await refreshUserDocument();
      addResult('✅ User document refreshed');
      
      // Check if there's a mismatch
      if (userDocument?.verifiedEmail !== status.isVerified) {
        addResult(`⚠️ MISMATCH: userDocument.verifiedEmail (${userDocument?.verifiedEmail}) !== Firestore status (${status.isVerified})`);
      } else {
        addResult('✅ userDocument and Firestore status match');
      }
      
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const sendTestEmail = async () => {
    if (!user?.email) {
      addResult('❌ No user email available');
      return;
    }

    setIsRunning(true);
    try {
      addResult('📤 Sending verification email...');
      const result = await resendVerificationEmail(user.uid, user.email);
      if (result.success) {
        addResult('✅ Verification email sent successfully');
      } else {
        addResult(`❌ Failed to send email: ${result.message}`);
      }
    } catch (error) {
      addResult(`❌ Error sending email: ${error}`);
    } finally {
      setIsRunning(false);
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
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Email Verification Test</h1>
          <p className="text-gray-600">Please log in to test email verification.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Email Verification Test</h1>
        
        {/* Current Status */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-3">Current Status</h2>
          <div className="space-y-2 text-sm">
            <div><strong>User ID:</strong> {user.uid}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>userDocument.verifiedEmail:</strong> {String(userDocument?.verifiedEmail)}</div>
            <div><strong>userDocument exists:</strong> {String(!!userDocument)}</div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={runVerificationTest}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Running...' : 'Run Verification Test'}
          </button>
          
          <button
            onClick={sendTestEmail}
            disabled={isRunning}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Sending...' : 'Send Test Email'}
          </button>
          
          <button
            onClick={() => setTestResults([])}
            disabled={isRunning}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear Results
          </button>
        </div>

        {/* Test Results */}
        <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
          <h3 className="text-white font-bold mb-2">Test Results:</h3>
          {testResults.length === 0 ? (
            <div className="text-gray-500">No test results yet. Click "Run Verification Test" to start.</div>
          ) : (
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index}>{result}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestEmailVerification;