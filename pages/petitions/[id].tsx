import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/firebase/AuthContext';
import { toast } from 'react-hot-toast';
import { Petition, Signature } from '@/types/models';

const PetitionDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [petition, setPetition] = useState<Petition | null>(null);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showSignForm, setShowSignForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPetition();
      fetchSignatures();
    }
  }, [id, user]); // Add user as dependency

  const fetchPetition = async () => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Add authentication header if user is logged in
      if (user) {
        const idToken = await user.getIdToken();
        headers.Authorization = `Bearer ${idToken}`;
      }
      
      const response = await fetch(`/api/petitions/${id}`, {
        headers,
      });
      
      if (response.ok) {
        const data = await response.json();
        setPetition(data.data?.petition || data);
      } else {
        const errorData = await response.json();
        console.error('Failed to load petition:', errorData);
        toast.error(errorData.error || 'Failed to load petition');
      }
    } catch (error) {
      console.error('Error fetching petition:', error);
      toast.error('Failed to load petition');
    } finally {
      setLoading(false);
    }
  };

  const fetchSignatures = async () => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Add authentication header if user is logged in
      if (user) {
        const idToken = await user.getIdToken();
        headers.Authorization = `Bearer ${idToken}`;
      }
      
      const response = await fetch(`/api/petitions/${id}/signatures`, {
        headers,
      });
      
      if (response.ok) {
        const data = await response.json();
        setSignatures(data.data || data);
      }
    } catch (error) {
      console.error('Error fetching signatures:', error);
    }
  };

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !petition) return;

    setSigning(true);
    try {
      if (!user) {
        toast.error('Please log in to sign this petition');
        return;
      }

      const idToken = await user.getIdToken();

      const response = await fetch('/api/petitions/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          petitionId: petition.id,
          phoneNumber,
        }),
      });

      if (response.ok) {
        toast.success('Petition signed successfully!');
        setShowSignForm(false);
        setPhoneNumber('');
        fetchSignatures(); // Refresh signatures
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to sign petition');
      }
    } catch (error) {
      console.error('Error signing petition:', error);
      toast.error('Failed to sign petition');
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!petition) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">Petition not found</h1>
        <button
          onClick={() => router.push('/petitions')}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Petitions
        </button>
      </div>
    );
  }

  const signatureCount = signatures.length;
  const progressPercentage =
    petition.targetSignatures > 0
      ? Math.min((signatureCount / petition.targetSignatures) * 100, 100)
      : 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">{petition.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {petition.category}
            </span>
            {petition.subcategory && (
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                {petition.subcategory}
              </span>
            )}
            <span
              className={`px-2 py-1 rounded text-white ${
                petition.status === 'approved'
                  ? 'bg-green-500'
                  : petition.status === 'pending'
                    ? 'bg-yellow-500'
                    : petition.status === 'paused'
                      ? 'bg-orange-500'
                      : 'bg-gray-500'
              }`}
            >
              {petition.status}
            </span>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">
                {signatureCount} signatures
              </span>
              <span className="text-gray-600">
                Goal: {petition.targetSignatures}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="prose max-w-none mb-8">
          <h2 className="text-xl font-semibold mb-3">About this petition</h2>
          <p className="whitespace-pre-wrap text-gray-700">
            {petition.description}
          </p>
        </div>

        {petition.status === 'approved' && user && (
          <div className="border-t pt-6">
            {!showSignForm ? (
              <button
                onClick={() => setShowSignForm(true)}
                className="w-full md:w-auto bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Sign this petition
              </button>
            ) : (
              <form onSubmit={handleSign} className="space-y-4">
                <h3 className="text-lg font-semibold">Sign this petition</h3>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium mb-2"
                  >
                    Phone Number (for verification) *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+212 6XX XXX XXX"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={signing}
                    className="bg-green-500 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
                  >
                    {signing ? 'Signing...' : 'Sign Petition'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSignForm(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {petition.status !== 'approved' && (
          <div className="border-t pt-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-yellow-800">
                This petition is currently {petition.status} and cannot be
                signed at this time.
              </p>
            </div>
          </div>
        )}

        <div className="border-t pt-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">Recent Signatures</h3>
          {signatures.length > 0 ? (
            <div className="space-y-2">
              {signatures.slice(0, 10).map((signature, index) => (
                <div
                  key={signature.id}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {signature.signerName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-medium">
                      {signature.signerName || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(signature.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {signatures.length > 10 && (
                <p className="text-sm text-gray-600 text-center pt-2">
                  And {signatures.length - 10} more signatures...
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-600">
              No signatures yet. Be the first to sign!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetitionDetail;
