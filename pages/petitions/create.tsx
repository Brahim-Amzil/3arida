import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/firebase/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { toast } from 'react-hot-toast';

const CreatePetition = () => {
  const router = useRouter();
  const { user, userDocument } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    customSubcategory: '',
    requiredSignatures: 2500, // Default to free tier
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [showPricingTiers, setShowPricingTiers] = useState(false);

  const categoriesWithSubcategories = {
    'Social Justice': [
      'Racial Equality',
      'Workers Rights',
      'Criminal Justice Reform',
      'Immigration Rights',
      'Other',
    ],
    Environment: [
      'Climate Change',
      'Pollution Control',
      'Wildlife Protection',
      'Renewable Energy',
      'Waste Management',
      'Water Conservation',
      'Other',
    ],
    Politics: [
      'Electoral Reform',
      'Government Transparency',
      'Anti-Corruption',
      'Voting Rights',
      'Political Representation',
      'Public Policy',
      'Other',
    ],
    Education: [
      'School Funding',
      'Curriculum Reform',
      'Student Rights',
      'Teacher Support',
      'Higher Education',
      'Educational Access',
      'Other',
    ],
    Healthcare: [
      'Healthcare Access',
      'Mental Health',
      'Public Health',
      'Medical Research',
      'Healthcare Costs',
      'Patient Rights',
      'Other',
    ],
    'Human Rights': [
      'Freedom of Speech',
      'Religious Freedom',
      'Privacy Rights',
      'Civil Liberties',
      'International Human Rights',
      'Disability Rights',
      'Other',
    ],
    'Animal Rights': [
      'Animal Welfare',
      'Wildlife Conservation',
      'Pet Protection',
      'Farm Animal Rights',
      'Animal Testing',
      'Endangered Species',
      'Other',
    ],
    Technology: [
      'Digital Privacy',
      'Internet Freedom',
      'AI Ethics',
      'Tech Regulation',
      'Digital Rights',
      'Cybersecurity',
      'Other',
    ],
    Other: [
      'Community Issues',
      'Local Government',
      'Public Services',
      'Transportation',
      'Housing',
      'Consumer Rights',
      'Other',
    ],
  };

  const categories = Object.keys(categoriesWithSubcategories);

  // Tiered pricing structure from requirements
  const getPricingTier = (signatures: number) => {
    if (signatures <= 2500) return { tier: 'free', price: 0, label: 'Free' };
    if (signatures <= 5000)
      return { tier: 'starter', price: 49, label: 'Starter - 49 MAD' };
    if (signatures <= 10000)
      return { tier: 'growth', price: 79, label: 'Growth - 79 MAD' };
    if (signatures <= 25000)
      return { tier: 'impact', price: 119, label: 'Impact - 119 MAD' };
    if (signatures <= 50000)
      return { tier: 'large', price: 149, label: 'Large - 149 MAD' };
    if (signatures <= 100000)
      return { tier: 'mass', price: 199, label: 'Mass - 199 MAD' };
    return {
      tier: 'enterprise',
      price: 'Custom',
      label: 'Enterprise - Custom Pricing',
    };
  };

  const currentTier = getPricingTier(formData.requiredSignatures);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== FORM SUBMIT STARTED ===');

    if (!user) {
      console.log('No user found');
      return;
    }

    // Check email verification requirement
    if (!userDocument?.verifiedEmail) {
      console.log('Email not verified');
      toast.error('Please verify your email before creating a petition');
      return;
    }

    // Debug: Log user info
    console.log('User info:', {
      uid: user.uid,
      email: user.email,
      emailVerified: userDocument?.verifiedEmail,
      displayName: user.displayName,
    });

    console.log('Form data:', formData);
    console.log('Current tier:', currentTier);

    setLoading(true);
    console.log('Loading state set to true');

    try {
      // For now, let's use JSON instead of FormData to debug the issue
      const requestData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory:
          formData.subcategory === 'Other'
            ? formData.customSubcategory
            : formData.subcategory,
        requiredSignatures: formData.requiredSignatures,
        tier: currentTier.tier,
        price: currentTier.price.toString(),
      };

      console.log('Request data:', requestData);

      // Get Firebase ID token for authentication
      if (!user) {
        console.log('User check failed in token section');
        toast.error('Please log in to create a petition');
        return;
      }

      console.log('Getting Firebase ID token...');
      const idToken = await user.getIdToken();
      console.log('ID token obtained, length:', idToken.length);

      console.log('Making API request to /api/petitions/create');

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('Request timeout, aborting...');
        controller.abort();
      }, 30000); // 30 second timeout

      const response = await fetch('/api/petitions/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (response.ok) {
        console.log('Response is OK, parsing JSON...');
        const result = await response.json();
        console.log('Result:', result);

        if (typeof currentTier.price === 'number' && currentTier.price === 0) {
          // Free tier - petition created directly
          console.log('Free tier petition created');
          toast.success('Petition created successfully!');
          router.push(`/petitions/${result.data?.id || result.id}`);
        } else {
          // Paid tier - redirect to payment
          console.log('Paid tier petition created, redirecting to payment');
          toast.success(
            'Petition saved as draft. Complete payment to publish.'
          );
          router.push(
            `/payment?petitionId=${result.data?.id || result.id}&amount=${currentTier.price}`
          );
        }
      } else {
        console.log('Response not OK, parsing error...');
        let errorMessage = 'Failed to create petition';
        try {
          const error = await response.json();
          console.log('Full error response:', error);
          errorMessage =
            error.details || error.message || error.error || errorMessage;

          // Log the full error for debugging
          if (error.stack) {
            console.error('Server error stack:', error.stack);
          }
        } catch (parseError) {
          console.log('Failed to parse error response:', parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating petition:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to create petition: ${errorMessage}`);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === 'category') {
      // Reset subcategory when category changes
      setFormData((prev) => ({
        ...prev,
        category: value,
        subcategory: '',
        customSubcategory: '',
      }));
    } else if (name === 'subcategory') {
      // Reset custom subcategory when subcategory changes
      setFormData((prev) => ({
        ...prev,
        subcategory: value,
        customSubcategory: value === 'Other' ? prev.customSubcategory : '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'requiredSignatures' ? parseInt(value) || 2500 : value,
      }));
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
        'video/webm',
      ];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image or video file');
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setMediaFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Create New Petition</h1>

          {!user?.emailVerified && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <p className="text-yellow-800">
                ⚠️ You need to verify your email address before creating a
                petition.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Petition Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                placeholder="Enter a clear, compelling title for your petition"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                placeholder="Explain why this petition matters and what you want to achieve"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium mb-2"
                >
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {formData.category && (
                <div>
                  <label
                    htmlFor="subcategory"
                    className="block text-sm font-medium mb-2"
                  >
                    Subcategory
                  </label>
                  <select
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  >
                    <option value="">Select a subcategory</option>
                    {categoriesWithSubcategories[
                      formData.category as keyof typeof categoriesWithSubcategories
                    ]?.map((subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {formData.subcategory === 'Other' && (
              <div>
                <label
                  htmlFor="customSubcategory"
                  className="block text-sm font-medium mb-2"
                >
                  Custom Subcategory *
                </label>
                <input
                  type="text"
                  id="customSubcategory"
                  name="customSubcategory"
                  value={formData.customSubcategory}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  placeholder="Other"
                />
              </div>
            )}

            <div>
              <label htmlFor="media" className="block text-sm font-medium mb-2">
                Media (Optional)
              </label>
              <input
                type="file"
                id="media"
                ref={fileInputRef}
                onChange={handleMediaChange}
                accept="image/*,video/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload an image or video to make your petition more compelling
                (Max 10MB)
              </p>

              {mediaPreview && (
                <div className="mt-4 relative">
                  {mediaFile?.type.startsWith('image/') ? (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="max-w-xs rounded-md"
                    />
                  ) : (
                    <video
                      src={mediaPreview}
                      controls
                      className="max-w-xs rounded-md"
                    />
                  )}
                  <button
                    type="button"
                    onClick={removeMedia}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="requiredSignatures"
                className="block text-sm font-medium mb-2"
              >
                Target Signatures
              </label>
              <input
                type="number"
                id="requiredSignatures"
                name="requiredSignatures"
                value={formData.requiredSignatures}
                onChange={handleChange}
                min="1"
                max="100000"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md">
              <button
                type="button"
                onClick={() => setShowPricingTiers(!showPricingTiers)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-blue-100 transition-colors"
              >
                <h3 className="font-medium text-blue-900">Pricing Tiers</h3>
                <svg
                  className={`w-5 h-5 text-blue-700 transition-transform ${
                    showPricingTiers ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showPricingTiers && (
                <div className="px-4 pb-4">
                  <div className="space-y-2 text-sm text-blue-700 mb-4">
                    <p>
                      • Up to 2,500 signatures: <strong>Free</strong>
                    </p>
                    <p>
                      • 2,501-5,000 signatures: <strong>49 MAD</strong>
                    </p>
                    <p>
                      • 5,001-10,000 signatures: <strong>79 MAD</strong>
                    </p>
                    <p>
                      • 10,001-25,000 signatures: <strong>119 MAD</strong>
                    </p>
                    <p>
                      • 25,001-50,000 signatures: <strong>149 MAD</strong>
                    </p>
                    <p>
                      • 50,001-100,000 signatures: <strong>199 MAD</strong>
                    </p>
                    <p>
                      • 100,000+ signatures:{' '}
                      <strong>Custom Enterprise Pricing</strong>
                    </p>
                  </div>
                </div>
              )}

              <div className="mx-4 mb-4 bg-white p-4 rounded border-l-4 border-blue-500">
                <p className="font-medium text-blue-900">
                  Selected Tier: {currentTier.label}
                </p>
                {typeof currentTier.price === 'number' &&
                  currentTier.price > 0 && (
                    <p className="text-sm text-blue-700 mt-1">
                      Your petition will be saved as draft until payment is
                      completed.
                    </p>
                  )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || !user?.emailVerified}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading
                  ? 'Creating...'
                  : typeof currentTier.price === 'number' &&
                      currentTier.price === 0
                    ? 'Create Petition'
                    : 'Create & Pay'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CreatePetition;
