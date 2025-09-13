import { useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { toast } from 'react-hot-toast';

const DebugAuth = () => {
  const { user, userDocument } = useAuth();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    setLoading(true);
    try {
      const idToken = await user.getIdToken();
      console.log('ID Token:', idToken.substring(0, 50) + '...');

      const response = await fetch('/api/debug/auth', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await response.json();
      setResult(data);

      if (response.ok) {
        toast.success('Authentication test successful!');
      } else {
        toast.error('Authentication test failed');
      }
    } catch (error) {
      console.error('Auth test error:', error);
      toast.error('Authentication test failed');
      setResult({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Authentication Debug</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Current User State</h2>
          {user ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Email Verified:</strong>{' '}
                {userDocument?.verifiedEmail ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Display Name:</strong> {user.displayName || 'Not set'}
              </p>
              <p>
                <strong>UID:</strong> {user.uid}
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p>No user logged in</p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <button
            onClick={testAuth}
            disabled={loading || !user}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test Authentication'}
          </button>
        </div>

        {result && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Test Result</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugAuth;
