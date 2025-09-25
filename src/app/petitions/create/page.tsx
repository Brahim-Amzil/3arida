'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/Header';
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
    title: '',
    description: '',
    category: '',
    subcategory: '',
    targetSignatures: 1000,
    mediaUrls: [],
    location: {
      country: 'Morocco',
      city: '',
    },
  });

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

  const handleLocationChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      // For now, create a local URL for preview
      // In production, you would upload to Firebase Storage
      const imageUrl = URL.createObjectURL(file);

      setFormData((prev) => ({
        ...prev,
        mediaUrls: [imageUrl],
      }));

      // TODO: Implement actual Firebase Storage upload
      console.log('Image selected:', file.name);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      mediaUrls: [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to create a petition');
      return;
    }

    // Validate form data
    const validationErrors = validatePetitionData(formData);
    if (validationErrors.length > 0) {
      setError(validationErrors.map((e) => e.message).join(', '));
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Create petition
      const petition = await createPetition(
        formData,
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

  // Calculate pricing info
  const price = calculatePetitionPrice(formData.targetSignatures);
  const tier = calculatePricingTier(formData.targetSignatures);
  const tierInfo = PRICING_TIERS[tier];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
    <div className="min-h-screen bg-gray-50">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Petition Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Petition Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange('title', e.target.value)
                      }
                      placeholder="What change do you want to see?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.title.length}/200 characters
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange('description', e.target.value)
                      }
                      placeholder="Explain why this petition matters and what you hope to achieve..."
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      maxLength={5000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.description.length}/5000 characters
                    </p>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Petition Image (Optional)
                    </label>
                    <div className="space-y-4">
                      {formData.mediaUrls.length > 0 ? (
                        <div className="relative">
                          <Image
                            src={formData.mediaUrls[0]}
                            alt="Petition image"
                            width={400}
                            height={200}
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
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                            disabled={uploadingImage}
                          />
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <svg
                              className="w-12 h-12 text-gray-400 mb-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="text-sm text-gray-600">
                              {uploadingImage
                                ? 'Uploading...'
                                : 'Click to upload an image'}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              PNG, JPG up to 5MB
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

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
                        // Reset subcategory when category changes
                        handleInputChange('subcategory', '');
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subcategory - Only show if category is selected */}
                  {formData.category && SUBCATEGORIES[formData.category] && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subcategory (Optional)
                      </label>
                      <select
                        value={formData.subcategory || ''}
                        onChange={(e) =>
                          handleInputChange('subcategory', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">
                          Select a subcategory (optional)
                        </option>
                        {SUBCATEGORIES[formData.category].map((subcategory) => (
                          <option key={subcategory} value={subcategory}>
                            {subcategory}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        value={formData.location?.country || 'Morocco'}
                        onChange={(e) =>
                          handleLocationChange('country', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="Morocco">Morocco</option>
                        <option value="Algeria">Algeria</option>
                        <option value="Tunisia">Tunisia</option>
                        <option value="Egypt">Egypt</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.location?.city || ''}
                        onChange={(e) =>
                          handleLocationChange('city', e.target.value)
                        }
                        placeholder="e.g. Casablanca, Rabat, Marrakech"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Target Signatures */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Signature Goal *
                    </label>
                    <select
                      value={formData.targetSignatures}
                      onChange={(e) =>
                        handleInputChange(
                          'targetSignatures',
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value={100}>100 signatures (Free)</option>
                      <option value={500}>500 signatures (Free)</option>
                      <option value={1000}>1,000 signatures (Free)</option>
                      <option value={2500}>2,500 signatures (Free)</option>
                      <option value={3000}>
                        3,000 signatures ({formatCurrency(49)})
                      </option>
                      <option value={5000}>
                        5,000 signatures ({formatCurrency(49)})
                      </option>
                      <option value={7500}>
                        7,500 signatures ({formatCurrency(79)})
                      </option>
                      <option value={10000}>
                        10,000 signatures ({formatCurrency(79)})
                      </option>
                      <option value={25000}>
                        25,000 signatures ({formatCurrency(119)})
                      </option>
                      <option value={50000}>
                        50,000 signatures ({formatCurrency(149)})
                      </option>
                      <option value={100000}>
                        100,000 signatures ({formatCurrency(199)})
                      </option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location (Optional)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={formData.location?.country || ''}
                        onChange={(e) =>
                          handleLocationChange('country', e.target.value)
                        }
                        placeholder="Country"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={formData.location?.city || ''}
                        onChange={(e) =>
                          handleLocationChange('city', e.target.value)
                        }
                        placeholder="City"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading} className="flex-1">
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Info */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing Information</CardTitle>
              </CardHeader>
              <CardContent>
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
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tips for Success</CardTitle>
              </CardHeader>
              <CardContent>
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
                      Explain why this issue matters and what change you want to
                      see
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Choose a realistic signature goal to start with</span>
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
                      Share your petition with friends and family to get initial
                      support
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
