import { useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';

export default function TestSimplePetition() {
  const { user, userDocument } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testBasicAPI = async () => {
    try {
      const response = await fetch('/api/test-basic');
      const data = await response.json();
      setResult({ type: 'basic', data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setResult({ type: 'basic', error: errorMessage });
    }
  };

  const testAuthAPI = async () => {
    if (!user) {
      setResult({ type: 'auth', error: 'No user logged in' });
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/debug/auth', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: true }),
      });
      const data = await response.json();
      setResult({ type: 'auth', data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setResult({ type: 'auth', error: errorMessage });
    }
  };

  const testSimplePetition = async () => {
    if (!user) {
      setResult({ type: 'petition', error: 'No user logged in' });
      return;
    }

    setLoading(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/petitions/create-minimal', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Petition Title for Testing',
          description:
            'This is a test petition description that is long enough to meet the minimum requirements for petition creation.',
          category: 'Environment',
          subcategory: 'Climate Change',
          requiredSignatures: 100,
          tier: 'free',
          price: '0',
        }),
      });

      const data = await response.json();
      setResult({ type: 'petition', status: response.status, data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setResult({ type: 'petition', error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">API Testing</h1>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">User Status</h2>
          <p>Logged in: {user ? 'Yes' : 'No'}</p>
          {user && (
            <div>
              <p>Email: {user.email}</p>
              <p>Email Verified: {userDocument?.verifiedEmail ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>

        <div className="space-x-4">
          <button
            onClick={testBasicAPI}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Test Basic API
          </button>

          <button
            onClick={testAuthAPI}
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={!user}
          >
            Test Auth API
          </button>

          <button
            onClick={() => {
              fetch('/api/petitions/create-direct', { method: 'POST' })
                .then((res) => res.json())
                .then((data) => setResult({ type: 'direct-petition', data }))
                .catch((error) =>
                  setResult({ type: 'direct-petition', error: error.message })
                );
            }}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Test Direct Petition
          </button>

          <button
            onClick={testSimplePetition}
            className="bg-red-500 text-white px-4 py-2 rounded"
            disabled={!user || loading}
          >
            {loading ? 'Testing...' : 'Test Simple Petition'}
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold">Result ({result.type}):</h3>
            <pre className="mt-2 text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
