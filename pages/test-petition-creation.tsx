import { useState } from 'react';
import { toast } from 'react-hot-toast';

const TestPetitionCreation = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testPetitionCreation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/petitions/create-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);

      if (response.ok) {
        toast.success('Test petition creation successful!');
      } else {
        toast.error('Test petition creation failed');
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
        <h1 className="text-3xl font-bold mb-6">Test Petition Creation</h1>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            This test bypasses authentication to check if the core petition
            creation logic works.
          </p>

          <button
            onClick={testPetitionCreation}
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test Petition Creation'}
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

export default TestPetitionCreation;
