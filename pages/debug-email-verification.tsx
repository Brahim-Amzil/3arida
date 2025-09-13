import { useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { resendVerificationEmail, getUserVerificationStatus } from '@/lib/email-verification';

function DebugEmailVerification() {
  const { user, userDocument, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<any>(null);

  const collectDebugInfo = async () => {
    if (!user) return;

    const info: any = {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified
      },
      userDocument: userDocument ? {
        id: userDocument.id,
        email: userDocument.email,
        verifiedEmail: userDocument.verifiedEmail,
        name: userDocument.name
      } : null,
      timestamp: new Date().toISOString()
    };

    // Also check verification status
    try {
      const status = await getUserVerificationStatus(user.uid);
      info.verificationStatus = status;
    } catch (error: any) {
      info.verificationStatusError = error.message;
    }

    setDebugInfo(info);
  };

  const testSendEmail = async () => {
    if (!user?.uid || !user?.email) return;

    setIsTestingEmail(true);
    try {
      console.log('Testing email send with:', { uid: user.uid, email: user.email });
      const result = await resendVerificationEmail(user.uid, user.email);
      console.log('Email send result:', result);
      setEmailResult(result);
    } catch (error: any) {
      console.error('Email send error:', error);
      setEmailResult({ success: false, message: error.message });
    } finally {
      setIsTestingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Email Verification Debug</h1>
        
        <div className="space-y-6">
          <div className="bg-white p-4 rounded border">
            <h2 className="font-semibold mb-2">Current Auth State</h2>
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? 'Logged in' : 'Not logged in'}</p>
            {user && (
              <>
                <p><strong>User ID:</strong> {user.uid}</p>
                <p><strong>Email:</strong> {user.email || 'No email'}</p>
                <p><strong>Email Verified (Firebase):</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
                <p><strong>Display Name:</strong> {user.displayName || 'No name'}</p>
              </>
            )}
            <p><strong>User Document:</strong> {userDocument ? 'Exists' : 'Does not exist'}</p>
            {userDocument && (
              <>
                <p><strong>Document Email:</strong> {userDocument.email || 'No email'}</p>
                <p><strong>Document Verified:</strong> {userDocument.verifiedEmail ? 'Yes' : 'No'}</p>
              </>
            )}
          </div>

          <button
            onClick={collectDebugInfo}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Collect Debug Info
          </button>

          {debugInfo && (
            <div className="bg-white p-4 rounded border">
              <h2 className="font-semibold mb-2">Debug Information</h2>
              <pre className="text-sm overflow-auto bg-gray-100 p-3 rounded">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}

          <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
            <h2 className="font-semibold mb-2">Test Email Sending</h2>
            <button
              onClick={testSendEmail}
              disabled={isTestingEmail || !user?.uid || !user?.email}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isTestingEmail ? 'Sending...' : 'Test Send Email'}
            </button>
            
            {emailResult && (
              <div className="mt-4">
                <h3 className="font-medium">Email Send Result:</h3>
                <pre className="text-sm bg-white p-3 rounded border">
                  {JSON.stringify(emailResult, null, 2)}
                </pre>
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Note:</strong> This will attempt to send a verification email using the same process as the "Verify Email" button.</p>
              <p>Check the console for additional error details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom layout that bypasses AppShell redirects
DebugEmailVerification.getLayout = function getLayout(page: React.ReactElement) {
  return page;
};

export default DebugEmailVerification;