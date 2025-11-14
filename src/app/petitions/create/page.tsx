'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { createPetition, getCategories } from '@/lib/petitions';
import { Category, PetitionFormData } from '@/types/petition';
import {
  validatePetitionData,
  calculatePetitionPrice,
  calculatePricingTier,
  formatCurrency,
  PRICING_TIERS,
} from '@/lib/petition-utils';
import {
  uploadImage,
  validateImageFile,
  generateImagePath,
  deleteImage,
} from '@/lib/storage';

// Subcategories for each main category
const SUBCATEGORIES: Record<string, string[]> = {
  Environment: [
    'Climate Change',
    'Pollution',
    'Wildlife Protection',
    'Renewable Energy',
    'Water Conservation',
    'Waste Management',
  ],
  'Social Justice': [
    'Human Rights',
    'Gender Equality',
    'Racial Justice',
    'LGBTQ+ Rights',
    'Disability Rights',
    'Workers Rights',
  ],
  Politics: [
    'Government Reform',
    'Electoral Reform',
    'Transparency',
    'Anti-Corruption',
    'Local Government',
    'Policy Change',
  ],
  Education: [
    'School Funding',
    'Higher Education',
    'Student Rights',
    'Teacher Support',
    'Educational Access',
    'Curriculum Reform',
  ],
  Healthcare: [
    'Healthcare Access',
    'Mental Health',
    'Public Health',
    'Healthcare Reform',
    'Medical Research',
    'Patient Rights',
  ],
  Economy: [
    'Employment',
    'Small Business',
    'Economic Policy',
    'Consumer Rights',
    'Housing',
    'Taxation',
  ],
  Infrastructure: [
    'Transportation',
    'Public Works',
    'Urban Planning',
    'Internet Access',
    'Public Safety',
    'Utilities',
  ],
  Culture: [
    'Arts Funding',
    'Cultural Heritage',
    'Language Rights',
    'Religious Freedom',
    'Community Events',
    'Cultural Education',
  ],
};

export default function CreatePetitionPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<PetitionFormData>({
    publisherType: '',
    publisherName: '',
    officialDocument: undefined,
    petitionType: '',
    addressedToType: '',
    addressedToSpecific: '',
    title: '',
    description: '',
    category: '',
    subcategory: '',
    targetSignatures: 1000,
    mediaUrls: [],
    youtubeVideoUrl: '',
    location: {
      country: 'Morocco',
      city: '',
    },
  });
  const [customCategory, setCustomCategory] = useState('');
  const [customSubcategory, setCustomSubcategory] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [signatureInputType, setSignatureInputType] = useState<
    'slider' | 'specific'
  >('slider');
  const [customSignatures, setCustomSignatures] = useState('');

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(0);

  // Accordion state - only one section can be open at a time
  const [openAccordion, setOpenAccordion] = useState<'pricing' | 'tips' | null>(
    null
  );

  // Define form steps
  const formSteps = [
    {
      id: 'publisher',
      title: 'Publisher Information',
      description: 'Who is publishing this petition?',
    },
    {
      id: 'petition-details',
      title: 'Petition Details',
      description: 'Basic information about your petition',
    },
    {
      id: 'content',
      title: 'Content & Description',
      description: 'Tell your story and explain your cause',
    },
    {
      id: 'media',
      title: 'Media & Images',
      description: 'Add photos and videos to make your petition engaging',
    },
    {
      id: 'location',
      title: 'Location & Targeting',
      description: 'Set your petition location and signature goal',
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review your petition before publishing',
    },
  ];

  // Location data
  const locations = [
    {
      country: 'Morocco',
      cities: [
        'Agadir',
        'Al Hoceima',
        'Beni Mellal',
        'Berkane',
        'Casablanca',
        'Chefchaouen',
        'El Jadida',
        'Errachidia',
        'Essaouira',
        'Fez',
        'Ifrane',
        'Kenitra',
        'Khenifra',
        'Khouribga',
        'Larache',
        'Marrakech',
        'Meknes',
        'Nador',
        'Ouarzazate',
        'Oujda',
        'Rabat',
        'Safi',
        'Sale',
        'Tangier',
        'Tetouan',
      ],
    },
    {
      country: 'France',
      cities: [
        'Paris',
        'Lyon',
        'Marseille',
        'Toulouse',
        'Nice',
        'Nantes',
        'Strasbourg',
        'Montpellier',
        'Bordeaux',
        'Lille',
      ],
    },
    {
      country: 'Spain',
      cities: [
        'Madrid',
        'Barcelona',
        'Valencia',
        'Seville',
        'Zaragoza',
        'Málaga',
        'Murcia',
        'Palma',
        'Las Palmas',
        'Bilbao',
      ],
    },
    {
      country: 'United States',
      cities: [
        'New York',
        'Los Angeles',
        'Chicago',
        'Houston',
        'Phoenix',
        'Philadelphia',
        'San Antonio',
        'San Diego',
        'Dallas',
        'San Jose',
      ],
    },
    {
      country: 'Canada',
      cities: [
        'Toronto',
        'Montreal',
        'Vancouver',
        'Calgary',
        'Edmonton',
        'Ottawa',
        'Winnipeg',
        'Quebec City',
        'Hamilton',
        'Kitchener',
      ],
    },
    {
      country: 'United Kingdom',
      cities: [
        'London',
        'Birmingham',
        'Manchester',
        'Glasgow',
        'Liverpool',
        'Leeds',
        'Sheffield',
        'Edinburgh',
        'Bristol',
        'Cardiff',
      ],
    },
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/petitions/create');
    }
  }, [authLoading, isAuthenticated, router]);

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading categories:', err);
      // Fallback to default categories if database fails
      const { DEFAULT_CATEGORIES } = await import('@/lib/petition-utils');
      setCategories(
        DEFAULT_CATEGORIES.map((cat, index) => ({
          id: `default-${index}`,
          ...cat,
          petitionCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      );
    }
  };

  const handleInputChange = (field: keyof PetitionFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLocation(value);

    if (value === 'Kingdom of Morocco') {
      setFormData((prev) => ({
        ...prev,
        location: {
          country: 'Morocco',
          city: '',
        },
      }));
    } else if (value === 'Other') {
      // Keep current location structure for Other
    } else {
      // It's a city selection
      setFormData((prev) => ({
        ...prev,
        location: {
          country: 'Morocco',
          city: value,
        },
      }));
    }
  };

  // YouTube helper functions
  const isValidYouTubeUrl = (url: string): boolean => {
    if (!url) return false;
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
  };

  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Step navigation functions
  const nextStep = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < formSteps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('📤 Starting image upload for file:', file.name);
    setUploadingImage(true);
    setError('');

    try {
      // Validate the image file
      console.log('🔍 Validating image file...');
      validateImageFile(file);
      console.log('✅ Image file validation passed');

      // Generate a temporary petition ID for the upload path
      const tempPetitionId = `temp_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const imagePath = generateImagePath(tempPetitionId, file.name);
      console.log('📁 Generated upload path:', imagePath);

      // Upload image to Firebase Storage
      console.log('☁️ Uploading to Firebase Storage...');
      const imageUrl = await uploadImage(file, imagePath);
      console.log('✅ Image uploaded successfully! URL:', imageUrl);

      setFormData((prev) => {
        const updated = {
          ...prev,
          mediaUrls: [imageUrl],
        };
        console.log('✅ Updating formData.mediaUrls to:', [imageUrl]);
        console.log('📊 Full updated formData:', updated);
        return updated;
      });

      console.log('✅ Image upload complete:', file.name);
    } catch (err: any) {
      console.error('❌ Error uploading image:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = async () => {
    // Delete the image from Firebase Storage if it exists
    if (formData.mediaUrls.length > 0) {
      try {
        await deleteImage(formData.mediaUrls[0]);
        console.log('✅ Image deleted from storage');
      } catch (err) {
        console.error('❌ Error deleting image from storage:', err);
        // Continue anyway as the form state should still be updated
      }
    }

    setFormData((prev) => ({
      ...prev,
      mediaUrls: [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if not on the last step (review step)
    if (currentStep !== formSteps.length - 1) {
      console.log(
        '⚠️ Form submission blocked - not on review step. Current step:',
        currentStep
      );
      console.log(
        '⚠️ Please navigate to the Review step and click "Create Petition" button'
      );
      return;
    }

    console.log('✅ Form submission allowed - on review step');

    if (!user) {
      setError('You must be logged in to create a petition');
      return;
    }

    // Additional validation for publisher type
    if (!formData.publisherType) {
      setError('Please select who is publishing this petition');
      return;
    }

    // Additional validation for publisher name
    if (!formData.publisherName?.trim()) {
      setError('Please enter the publisher name');
      return;
    }

    // Additional validation for official document (organizations only)
    if (
      formData.publisherType === 'Association, Organization, Institution' &&
      !formData.officialDocument
    ) {
      setError(
        'Please upload an official document proving your organization/association/institution'
      );
      return;
    }

    // Additional validation for custom category
    if (formData.category === 'Other' && !customCategory.trim()) {
      setError('Please specify a custom category');
      return;
    }

    // Additional validation for custom subcategory
    if (formData.subcategory === 'Other' && !customSubcategory.trim()) {
      setError('Please specify a custom subcategory');
      return;
    }

    // Additional validation for petition type
    if (
      formData.petitionType === 'Specific: Addressed to:' &&
      !formData.addressedToType
    ) {
      setError('Please select who this petition is addressed to');
      return;
    }

    // Additional validation for addressed to specific
    if (formData.addressedToType && !formData.addressedToSpecific?.trim()) {
      setError(`Please specify the ${formData.addressedToType.toLowerCase()}`);
      return;
    }

    // Additional validation for custom signatures
    if (signatureInputType === 'specific') {
      if (!customSignatures || parseInt(customSignatures) <= 0) {
        setError('Please enter a valid number of signatures');
        return;
      }
      if (parseInt(customSignatures) > 1000000) {
        setError('Maximum number of signatures is 1,000,000');
        return;
      }
    }

    // Ensure targetSignatures is set
    if (!formData.targetSignatures || formData.targetSignatures <= 0) {
      setError('Please select or enter a target number of signatures');
      return;
    }

    // Prepare form data with custom category and subcategory if "Other" is selected
    const submissionData = {
      ...formData,
      category:
        formData.category === 'Other'
          ? customCategory.trim()
          : formData.category,
      subcategory:
        formData.subcategory === 'Other'
          ? customSubcategory.trim()
          : formData.subcategory,
    };

    // Validate form data
    const validationErrors = validatePetitionData(submissionData);
    if (validationErrors.length > 0) {
      setError(validationErrors.map((e) => e.message).join(', '));
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Create petition
      const petition = await createPetition(
        submissionData,
        user.uid,
        user.displayName || user.email?.split('@')[0] || 'Anonymous'
      );

      // Store petition ID in localStorage for success page
      localStorage.setItem('newPetitionId', petition.id);

      // Redirect to success page first, then to petition
      const price = calculatePetitionPrice(formData.targetSignatures);
      if (price > 0) {
        // Redirect to payment page
        router.push(`/petitions/success?payment=true&id=${petition.id}`);
      } else {
        // Redirect to success page
        router.push(`/petitions/success?id=${petition.id}`);
      }
    } catch (err: any) {
      console.error('Error creating petition:', err);
      setError(err.message || 'Failed to create petition. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step rendering functions
  const renderPublisherStep = () => (
    <div className="space-y-6">
      {/* Publisher Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Publish a petition as *
        </label>
        <select
          required
          value={formData.publisherType}
          onChange={(e) => {
            handleInputChange('publisherType', e.target.value);
            // Reset publisher name and document when type changes
            if (e.target.value !== formData.publisherType) {
              handleInputChange('publisherName', '');
              handleInputChange('officialDocument', undefined);
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Select publisher type</option>
          <option value="Individual">👤 Individual</option>
          <option value="Association, Organization, Institution">
            🏢 Association, Organization, Institution
          </option>
        </select>
      </div>

      {/* Publisher Name - Conditional */}
      {formData.publisherType && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formData.publisherType === 'Individual'
              ? 'Your Name'
              : 'Organization/Association/Institution Name'}{' '}
            *
          </label>
          <input
            type="text"
            required
            value={formData.publisherName || ''}
            onChange={(e) => handleInputChange('publisherName', e.target.value)}
            placeholder={
              formData.publisherType === 'Individual'
                ? 'Enter your full name'
                : 'Enter organization/association/institution name'
            }
            maxLength={100}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.publisherName?.length || 0}/100 characters
          </p>
        </div>
      )}

      {/* Official Document Upload - Conditional */}
      {formData.publisherType === 'Association, Organization, Institution' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Official Document *
          </label>
          <input
            type="file"
            required
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                  alert('File size must be less than 5MB');
                  e.target.value = '';
                  return;
                }
                handleInputChange('officialDocument', file);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload an official document (PDF, DOC, DOCX, JPG, PNG). Max size:
            5MB
          </p>
        </div>
      )}
    </div>
  );

  const renderPetitionDetailsStep = () => (
    <div className="space-y-6">
      {/* Petition Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Petition Type *
        </label>
        <select
          required
          value={formData.petitionType}
          onChange={(e) => handleInputChange('petitionType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Select petition type</option>
          <option value="Change">
            🔄 Change - Request a change in policy or practice
          </option>
          <option value="Support">
            ✊ Support - Show support for a cause or person
          </option>
          <option value="Stop">🛑 Stop - Stop something from happening</option>
          <option value="Start">
            🚀 Start - Start a new initiative or program
          </option>
        </select>
      </div>

      {/* Addressed To Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Who is this petition addressed to? *
        </label>
        <select
          required
          value={formData.addressedToType}
          onChange={(e) => handleInputChange('addressedToType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Select who this petition is for</option>
          <option value="Government">🏛️ Government Official/Agency</option>
          <option value="Company">🏢 Company/Corporation</option>
          <option value="Organization">🏛️ Organization/Institution</option>
          <option value="Individual">👤 Individual</option>
          <option value="Community">🏘️ Community/Local Authority</option>
          <option value="Other">📝 Other</option>
        </select>
      </div>

      {/* Specific Addressee */}
      {formData.addressedToType && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specific {formData.addressedToType} Name *
          </label>
          <input
            type="text"
            required
            value={formData.addressedToSpecific}
            onChange={(e) =>
              handleInputChange('addressedToSpecific', e.target.value)
            }
            placeholder={`Enter the specific ${formData.addressedToType.toLowerCase()} name`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
      )}

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          required
          value={formData.category}
          onChange={(e) => {
            handleInputChange('category', e.target.value);
            handleInputChange('subcategory', ''); // Reset subcategory when category changes
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Custom Category */}
      {formData.category === 'Other' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Category *
          </label>
          <input
            type="text"
            required
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Enter your custom category"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
      )}

      {/* Subcategory */}
      {formData.category &&
        formData.category !== 'Other' &&
        SUBCATEGORIES[formData.category] && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory *
            </label>
            <select
              required
              value={formData.subcategory}
              onChange={(e) => handleInputChange('subcategory', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select a subcategory</option>
              {SUBCATEGORIES[formData.category].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
        )}

      {/* Custom Subcategory */}
      {formData.subcategory === 'Other' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Subcategory *
          </label>
          <input
            type="text"
            required
            value={customSubcategory}
            onChange={(e) => setCustomSubcategory(e.target.value)}
            placeholder="Enter your custom subcategory"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
      )}
    </div>
  );

  const renderContentStep = () => (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Petition Title *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter a clear, compelling title for your petition"
          maxLength={150}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.title.length}/150 characters
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Petition Description *
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Explain your cause, why it matters, and what change you want to see. Be specific and compelling."
          rows={8}
          maxLength={5000}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.description.length}/5000 characters
        </p>
      </div>
    </div>
  );

  const renderMediaStep = () => (
    <div className="space-y-6">
      {/* Petition Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Petition Image (Optional)
        </label>
        {formData.mediaUrls && formData.mediaUrls.length > 0 && (
          <div className="mb-4 relative">
            <img
              src={formData.mediaUrls[0]}
              alt="Petition preview"
              className="w-full h-48 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploadingImage}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {uploadingImage && (
          <div className="flex items-center mt-2 text-sm text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Uploading image...
          </div>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Upload an image to make your petition more compelling. Max size: 5MB
        </p>
      </div>

      {/* YouTube Video */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Video (Optional)
        </label>
        <input
          type="url"
          value={formData.youtubeVideoUrl || ''}
          onChange={(e) => handleInputChange('youtubeVideoUrl', e.target.value)}
          placeholder="Paste YouTube video URL here"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          Add a YouTube video to help explain your cause (paste the full YouTube
          URL)
        </p>

        {/* YouTube Video Preview */}
        {formData.youtubeVideoUrl && (
          <div className="mt-4">
            {isValidYouTubeUrl(formData.youtubeVideoUrl) ? (
              <div
                className="relative w-full"
                style={{ paddingBottom: '56.25%' }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                    formData.youtubeVideoUrl
                  )}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                ></iframe>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">
                  Please enter a valid YouTube URL (e.g.,
                  https://www.youtube.com/watch?v=VIDEO_ID)
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderLocationStep = () => (
    <div className="space-y-6">
      {/* Target Signatures */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Target Number of Signatures *
        </label>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            type="button"
            onClick={() => setSignatureInputType('slider')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              signatureInputType === 'slider'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Slider
          </button>
          <button
            type="button"
            onClick={() => setSignatureInputType('specific')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              signatureInputType === 'specific'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Specific Number
          </button>
        </div>

        {/* Slider Tab Content */}
        {signatureInputType === 'slider' && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="range"
                min="100"
                max="100000"
                step="100"
                value={formData.targetSignatures}
                onChange={(e) =>
                  handleInputChange(
                    'targetSignatures',
                    parseInt(e.target.value)
                  )
                }
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${
                    ((formData.targetSignatures - 100) / (100000 - 100)) * 100
                  }%, #e5e7eb ${
                    ((formData.targetSignatures - 100) / (100000 - 100)) * 100
                  }%, #e5e7eb 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>100</span>
                <span>25K</span>
                <span>50K</span>
                <span>100K</span>
              </div>
            </div>

            {/* Current Value Display */}
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formData.targetSignatures.toLocaleString()} signatures
              </div>
              <div className="text-sm text-gray-600">
                {tierInfo.name} Plan - {price === 0 ? 'Free' : `${price} MAD`}
              </div>
            </div>
          </div>
        )}

        {/* Specific Number Tab Content */}
        {signatureInputType === 'specific' && (
          <div className="space-y-4">
            <div>
              <input
                type="number"
                min="1"
                max="1000000"
                value={customSignatures}
                onChange={(e) => {
                  const value = e.target.value;
                  setCustomSignatures(value);
                  if (value && parseInt(value) > 0) {
                    handleInputChange('targetSignatures', parseInt(value));
                  }
                }}
                placeholder="Enter number of signatures"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Enter any number between 1 and 1,000,000 signatures
              </p>
            </div>

            {/* Current Value Display for Specific Input */}
            {formData.targetSignatures > 0 && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">
                  {formData.targetSignatures.toLocaleString()} signatures
                </div>
                <div className="text-sm text-gray-600">
                  {tierInfo.name} Plan - {price === 0 ? 'Free' : `${price} MAD`}
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-sm text-gray-500 mt-3">
          Set a signature goal that matches your petition's reach. You can
          always upgrade your plan as your support grows.
        </p>

        {/* Pricing Information */}
        {formData.targetSignatures && (
          <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-blue-900">
                  {tierInfo.name} Plan
                </h4>
                <p className="text-sm text-blue-700">
                  Up to {tierInfo.maxSignatures.toLocaleString()} signatures
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-900">
                  {price === 0 ? 'Free' : `${formatCurrency(price)} MAD`}
                </p>
                {price > 0 && (
                  <p className="text-xs text-blue-600">One-time payment</p>
                )}
              </div>
            </div>

            {tierInfo.features && tierInfo.features.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-blue-800 mb-2">
                  Includes:
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  {tierInfo.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1 h-1 bg-blue-400 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Geographical scope of the petition *
        </label>
        <select
          required
          value={selectedLocation}
          onChange={handleLocationChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Select location</option>
          <option value="Kingdom of Morocco">Kingdom of Morocco</option>
          <option disabled>──────────</option>
          {locations
            .find((loc) => loc.country === 'Morocco')
            ?.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Custom Location */}
      {selectedLocation === 'Other' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Location *
          </label>
          <input
            type="text"
            required
            value={customLocation}
            onChange={(e) => setCustomLocation(e.target.value)}
            placeholder="Enter your custom location"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
      )}

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags (Optional)
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => handleInputChange('tags', e.target.value)}
          placeholder="Enter tags separated by commas (e.g., environment, climate, sustainability)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          Add relevant tags to help people discover your petition
        </p>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Review Your Petition
        </h3>
        <p className="text-blue-700">
          Please review all the information below before submitting your
          petition.
        </p>
      </div>

      {/* Publisher Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">
          Publisher Information
        </h4>
        <p>
          <strong>Type:</strong> {formData.publisherType}
        </p>
        <p>
          <strong>Name:</strong> {formData.publisherName}
        </p>
        {formData.officialDocument && (
          <p>
            <strong>Document:</strong> {formData.officialDocument.name}
          </p>
        )}
      </div>

      {/* Petition Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">Petition Details</h4>
        <p>
          <strong>Type:</strong> {formData.petitionType}
        </p>
        <p>
          <strong>Addressed to:</strong> {formData.addressedToType} -{' '}
          {formData.addressedToSpecific}
        </p>
        <p>
          <strong>Category:</strong>{' '}
          {formData.category === 'Other' ? customCategory : formData.category}
        </p>
        {formData.subcategory && (
          <p>
            <strong>Subcategory:</strong>{' '}
            {formData.subcategory === 'Other'
              ? customSubcategory
              : formData.subcategory}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">Content</h4>
        <p>
          <strong>Title:</strong> {formData.title}
        </p>
        <div className="mt-2">
          <strong>Description:</strong>
          <p className="mt-1 text-gray-700">{formData.description}</p>
        </div>
      </div>

      {/* Media */}
      {((formData.mediaUrls && formData.mediaUrls.length > 0) ||
        formData.youtubeVideoUrl) && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Media</h4>
          {formData.mediaUrls && formData.mediaUrls.length > 0 && (
            <div className="mb-2">
              <p className="mb-2">✅ Image uploaded</p>
              <img
                src={formData.mediaUrls[0]}
                alt="Petition preview"
                className="w-full max-w-md h-32 object-cover rounded-lg border"
              />
            </div>
          )}
          {formData.youtubeVideoUrl && <p>✅ YouTube video added</p>}
        </div>
      )}

      {/* Location & Targeting */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">
          Location & Targeting
        </h4>
        <p>
          <strong>Target Signatures:</strong>{' '}
          {formData.targetSignatures?.toLocaleString()}
        </p>
        <p>
          <strong>Location:</strong>{' '}
          {formData.location?.city
            ? `${formData.location.city}, ${formData.location.country}`
            : formData.location?.country || 'Not specified'}
        </p>
        {formData.tags && (
          <p>
            <strong>Tags:</strong> {formData.tags}
          </p>
        )}
      </div>

      {/* Pricing */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-2">
          Pricing Information
        </h4>
        <p className="text-green-700">
          <strong>Total Cost:</strong> {price === 0 ? 'Free' : `${price} MAD`}
        </p>
        <p className="text-sm text-green-600 mt-1">
          Tier: {tier} | Plan: {tierInfo.name}
        </p>
      </div>
    </div>
  );

  // Calculate pricing info
  const price = calculatePetitionPrice(formData.targetSignatures);
  const tier = calculatePricingTier(formData.targetSignatures);
  const tierInfo = PRICING_TIERS[tier];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        input[type='range']::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Start a Petition
          </h1>
          <p className="text-lg text-gray-600">
            Create a petition to rally support for your cause and make change
            happen
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {formSteps[currentStep].title}
              </h2>
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {formSteps.length}
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              {formSteps[currentStep].description}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{
                  width: `${((currentStep + 1) / formSteps.length) * 100}%`,
                }}
              ></div>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between">
              {formSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center cursor-pointer transition-colors duration-200 ${
                    index <= currentStep ? 'text-green-600' : 'text-gray-400'
                  }`}
                  onClick={() => goToStep(index)}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors duration-200 ${
                      index < currentStep
                        ? 'bg-green-600 border-green-600 text-white'
                        : index === currentStep
                        ? 'border-green-600 text-green-600 bg-white'
                        : 'border-gray-300 text-gray-400 bg-white'
                    }`}
                  >
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  <span className="text-xs mt-1 text-center max-w-16 leading-tight">
                    {step.title.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Form */}
          <Card>
            <CardHeader>
              <CardTitle>Petition Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit}
                onKeyDown={(e) => {
                  // Prevent Enter key from submitting the form unless on review step
                  if (
                    e.key === 'Enter' &&
                    currentStep !== formSteps.length - 1
                  ) {
                    e.preventDefault();
                    console.log('⚠️ Enter key blocked - not on review step');
                  }
                }}
                className="space-y-6"
              >
                {/* Render current step content */}
                {currentStep === 0 && renderPublisherStep()}
                {currentStep === 1 && renderPetitionDetailsStep()}
                {currentStep === 2 && renderContentStep()}
                {currentStep === 3 && renderMediaStep()}
                {currentStep === 4 && renderLocationStep()}
                {currentStep === 5 && renderReviewStep()}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </Button>

                  {currentStep < formSteps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Uploading Image...
                        </>
                      ) : (
                        'Next'
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Petition...
                        </>
                      ) : price > 0 ? (
                        `Create Petition - ${formatCurrency(price)}`
                      ) : (
                        'Create Free Petition'
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Bottom Information Boxes - Accordion Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Pricing Info Accordion */}
            <Card>
              <CardHeader
                className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() =>
                  setOpenAccordion(
                    openAccordion === 'pricing' ? null : 'pricing'
                  )
                }
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    💰 Pricing Information
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-600">
                      {price > 0 ? formatCurrency(price) : 'Free'}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        openAccordion === 'pricing' ? 'rotate-180' : ''
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
                  </div>
                </div>
              </CardHeader>
              {openAccordion === 'pricing' && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-800">
                          {tierInfo.name} Tier
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {price > 0 ? formatCurrency(price) : 'Free'}
                        </span>
                      </div>
                      <p className="text-sm text-green-700 mb-3">
                        Up to {formData.targetSignatures.toLocaleString()}{' '}
                        signatures
                      </p>
                      <ul className="text-sm text-green-700 space-y-1">
                        {tierInfo.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-2 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {price > 0 && (
                      <div className="text-sm text-gray-600">
                        <p className="mb-2">
                          💳 Payment will be processed securely through Stripe
                        </p>
                        <p>🇲🇦 All prices are in Moroccan Dirham (MAD)</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Tips Accordion */}
            <Card>
              <CardHeader
                className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() =>
                  setOpenAccordion(openAccordion === 'tips' ? null : 'tips')
                }
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    💡 Tips for Success
                  </CardTitle>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openAccordion === 'tips' ? 'rotate-180' : ''
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
                </div>
              </CardHeader>
              {openAccordion === 'tips' && (
                <CardContent className="pt-0">
                  <ul className="text-sm text-gray-600 space-y-3">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        Write a clear, compelling title that explains your cause
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        Explain why this issue matters and what change you want
                        to see
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        Choose a realistic signature goal to start with
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        Add photos or videos to make your petition more engaging
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        Share your petition with friends and family to get
                        initial support
                      </span>
                    </li>
                  </ul>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
