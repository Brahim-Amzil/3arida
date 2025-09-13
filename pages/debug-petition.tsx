import { useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';

export default function DebugPetition() {
  const { user, userDocument, loading } = useAuth();
  const [result, setResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const testPetitionCreation = async () => {
    if (!user) {
      setResult({ error: 'User not authenticated' });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await user.getIdToken();

      const response = await fetch('/api/petitions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: 'Test Petition for Environmental Protection',
          description:
            'This is a test petition to verify that our petition creation system is working correctly. We are testing the full flow from frontend to backend to Firebase.',
          category: 'Environment',
          subcategory: 'Climate Change',
          targetSignatures: 1000,
          tags: ['test', 'environment', 'climate'],
          location: {
            country: 'Morocco',
            city: 'Casablanca',
          },
          isPublic: true,
        }),
      });

      const data = await response.json();
      setResult({ status: response.status, data });
    } catch (error: any) {
      setResult({ error: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading authentication...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Petition Creation</h1>

      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-bold">Authentication Status:</h2>
          <p>User: {user ? '✅ Authenticated' : '❌ Not authenticated'}</p>
          <p>Email: {user?.email || 'N/A'}</p>
          <p>Email Verified: {user?.emailVerified ? '✅ Yes' : '❌ No'}</p>
          <p>User Document: {userDocument ? '✅ Loaded' : '❌ Not loaded'}</p>
        </div>

        {user && (
          <button
            onClick={testPetitionCreation}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting
              ? 'Creating Test Petition...'
              : 'Test Petition Creation'}
          </button>
        )}

        {!user && (
          <div className="p-4 bg-yellow-100 rounded">
            <p>Please log in first to test petition creation.</p>
            <a href="/auth/login" className="text-blue-500 underline">
              Go to Login
            </a>
          </div>
        )}

        {result && (
          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-bold">Result:</h2>
            <pre className="mt-2 text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
