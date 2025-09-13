import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/firebase/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { toast } from 'react-hot-toast';

const PaymentPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { petitionId, amount } = router.query;
  const [loading, setLoading] = useState(false);
  const [petition, setPetition] = useState<any>(null);

  useEffect(() => {
    if (petitionId) {
      fetchPetition();
    }
  }, [petitionId]);

  const fetchPetition = async () => {
    try {
      const response = await fetch(`/api/petitions/${petitionId}`);
      if (response.ok) {
        const data = await response.json();
        setPetition(data);
      }
    } catch (error) {
      console.error('Error fetching petition:', error);
    }
  };

  const handlePayment = async () => {
    if (!petitionId || !amount) return;

    setLoading(true);
    try {
      // This would integrate with Stripe
      // For now, just show a placeholder
      toast.success('Payment functionality will be implemented in Task 5!');

      // Redirect back to petition (in real implementation, this would happen after successful payment)
      setTimeout(() => {
        router.push(`/petitions/${petitionId}`);
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!petitionId || !amount) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">
          Invalid Payment Request
        </h1>
        <button
          onClick={() => router.push('/petitions')}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Back to Petitions
        </button>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Complete Your Payment</h1>

          {petition && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Petition: {petition.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {petition.description?.substring(0, 200)}...
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-md mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Payment Details</h3>
            <p className="text-2xl font-bold text-blue-900">{amount} MAD</p>
            <p className="text-sm text-blue-700 mt-2">
              This payment will activate your petition and allow it to collect
              signatures.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-6">
            <p className="text-yellow-800">
              <strong>Note:</strong> Payment integration (Stripe) will be
              implemented in Task 5. This is a placeholder for the payment flow.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
            >
              {loading ? 'Processing...' : `Pay ${amount} MAD`}
            </button>
            <button
              onClick={() => router.push('/petitions')}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p>
              Your petition has been saved as a draft. Complete payment to
              publish it and start collecting signatures.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PaymentPage;
