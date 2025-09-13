import { useState } from 'react';
import { toast } from 'react-hot-toast';

const TestFirestore = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testFirestore = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-firestore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);

      if (response.ok) {
        toast.success('Firestore test successful!');
      } else {
        toast.error('Firestore test failed');
      }
    } catch (error) {
      console.error('Test error:', error);
      toast.error('Test failed');
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
        <h1 className="text-3xl font-bold mb-6">Test Firestore Connection</h1>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            This test checks if we can write to Firestore database.
          </p>

          <button
            onClick={testFirestore}
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test Firestore'}
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

export default TestFirestore;
