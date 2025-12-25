'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';
// MVP: PhoneVerification import disabled
// import PhoneVerification from '@/components/auth/PhoneVerification';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Using plain textarea for now - rich text editor was causing issues
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
import { useTranslation } from '@/hooks/useTranslation';
import { isAuthenticated } from '@/lib/auth-mock';
import PetitionPayment from '@/components/petitions/PetitionPayment';

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
  const {
    user,
    userProfile,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  // MVP: Phone verification state disabled
  // const [showPhoneVerification, setShowPhoneVerification] = useState(false);
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
    tags: '',
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
  const [showPayment, setShowPayment] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');

  // Accordion state - only one section can be open at a time
  const [openAccordion, setOpenAccordion] = useState<'pricing' | 'tips' | null>(
    null
  );
  const [showPreview, setShowPreview] = useState(false);

  // Auto-fill function for testing
  const autoFillTestData = () => {
    console.log('🤖 Auto-filling test data...');

    setFormData({
      publisherType: 'Individual',
      publisherName: 'أحمد محمد الحسني',
      officialDocument: undefined,
      petitionType: 'Change',
      addressedToType: 'Government',
      addressedToSpecific: 'وزارة التجهيز والنقل واللوجستيك والماء',
      title: 'عريضة لإصلاح البنية التحتية للطرق في حي الأمل',
      description:
        'نحن سكان حي الأمل بمدينة الدار البيضاء نطالب بإصلاح عاجل للبنية التحتية للطرق في منطقتنا. الطرق في حالة سيئة جداً وتحتاج إلى تدخل فوري.\n\nمطالبنا:\n- إصلاح فوري للطرق المتضررة\n- صيانة دورية ومنتظمة\n- تحسين الإنارة العمومية\n- إنشاء أرصفة آمنة للمشاة\n- تركيب علامات المرور اللازمة\n\nهذه المشاكل تؤثر على حياتنا اليومية وتشكل خطراً على سلامة المواطنين، خاصة الأطفال وكبار السن.',
      category: 'Infrastructure',
      subcategory: 'Transportation',
      targetSignatures: 5000, // Changed to trigger payment for testing
      mediaUrls: [],
      youtubeVideoUrl: '',
      tags: 'البنية التحتية, الطرق, النقل, الدار البيضاء, حي الأمل, infrastructure, roads, transportation',
      location: {
        country: 'Morocco',
        city: 'Casablanca',
      },
    });

    setCustomCategory('');
    setCustomSubcategory('');
    setSignatureInputType('slider');
    setCustomSignatures('');

    // Navigate to review step
    setCurrentStep(formSteps.length - 1);

    console.log('✅ Test data filled and navigated to review step');
  };

  // Define form steps
  const formSteps = [
    {
      id: 'publisher',
      title: t('create.publisherInformation'),
      description: t('create.publisherInformationDesc'),
    },
    {
      id: 'petition-details',
      title: t('create.petitionDetails'),
      description: t('create.petitionDetailsDesc'),
    },
    {
      id: 'content',
      title: t('create.contentDescription'),
      description: t('create.contentDescriptionDesc'),
    },
    {
      id: 'media',
      title: t('create.mediaImages'),
      description: t('create.mediaImagesDesc'),
    },
    {
      id: 'location',
      title: t('create.locationTargeting'),
      description: t('create.locationTargetingDesc'),
    },
    {
      id: 'review',
      title: t('create.reviewSubmit'),
      description: t('create.reviewSubmitDesc'),
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

  // DEBUGGING: Monitor step changes
  useEffect(() => {
    console.log('📍 Step changed to:', currentStep);
    if (currentStep === formSteps.length - 1) {
      console.log(
        '🔍 REACHED REVIEW STEP - Monitoring for automatic submission...'
      );

      // Clear any existing manual submission flag
      (window as any).MANUAL_SUBMISSION_ALLOWED = false;

      // Set up a timer to detect automatic submissions
      const timer = setTimeout(() => {
        console.log(
          '⏰ 5 seconds passed on review step - checking for automatic behavior'
        );
      }, 5000);

      return () => {
        clearTimeout(timer);
        console.log('🧹 Cleanup: Review step monitoring stopped');
      };
    }
  }, [currentStep, formSteps.length]);

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

  // MVP: Phone verification handler disabled
  // const handlePhoneVerified = async (phoneNumber: string) => {
  //   if (!user) return;

  //   try {
  //     // Update user profile with verified phone
  //     const { doc, updateDoc } = await import('firebase/firestore');
  //     const { db } = await import('@/lib/firebase');

  //     await updateDoc(doc(db, 'users', user.uid), {
  //       phone: phoneNumber,
  //       verifiedPhone: true,
  //       updatedAt: new Date(),
  //     });

  //     console.log('✅ Phone verified for petition creator');
  //     setShowPhoneVerification(false);
  //     setError('');

  //     // Retry submission after verification
  //     // The form will now pass the phone verification check
  //   } catch (error) {
  //     console.error('Error updating phone verification:', error);
  //     setError('Failed to verify phone. Please try again.');
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // EMERGENCY DEBUGGING - Track ALL submission attempts
    console.log('🚨🚨🚨 FORM SUBMISSION TRIGGERED! 🚨🚨🚨');
    console.log('📍 Current step:', currentStep);
    console.log('📍 Form steps length:', formSteps.length);
    console.log('📍 Event type:', e.type);
    console.log('📍 Event target:', e.target);
    console.log('📍 Event currentTarget:', e.currentTarget);
    console.log('📍 Timestamp:', new Date().toISOString());
    console.log('📍 User agent:', navigator.userAgent);
    console.log('📍 Stack trace:', new Error().stack);

    // BLOCK ALL AUTOMATIC SUBMISSIONS FOR DEBUGGING
    if (!(window as any).MANUAL_SUBMISSION_ALLOWED) {
      console.log('🛑 SUBMISSION BLOCKED - Manual flag not set!');
      alert('DEBUGGING: Form submission blocked. This was likely automatic!');
      return;
    }

    console.log('✅ Manual submission flag detected, proceeding...');

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

    // MVP: PHONE VERIFICATION DISABLED FOR PETITION CREATORS
    // Phone verification is paused for MVP to reduce friction
    // if (!userProfile?.verifiedPhone) {
    //   setError(
    //     'Phone verification required to create petitions. This helps prevent spam and ensures accountability.'
    //   );
    //   setShowPhoneVerification(true);
    //   return;
    // }
    console.log('ℹ️ MVP: Skipping phone verification for petition creation');

    console.log('🔍 Starting validation checks...');
    console.log('📋 Form data:', formData);

    // Additional validation for publisher type
    if (!formData.publisherType) {
      console.log('❌ Validation failed: Missing publisher type');
      setError(t('form.selectPublisherTypeError'));
      return;
    }
    console.log('✅ Publisher type valid:', formData.publisherType);

    // Additional validation for publisher name
    if (!formData.publisherName?.trim()) {
      console.log('❌ Validation failed: Missing publisher name');
      setError(t('form.enterPublisherNameError'));
      return;
    }
    console.log('✅ Publisher name valid:', formData.publisherName);

    // Additional validation for official document (organizations only)
    if (
      formData.publisherType === 'Association, Organization, Institution' &&
      !formData.officialDocument
    ) {
      console.log(
        '❌ Validation failed: Missing official document for organization'
      );
      setError(t('form.uploadDocumentError'));
      return;
    }
    console.log('✅ Official document check passed');

    // Additional validation for custom category
    if (formData.category === 'Other' && !customCategory.trim()) {
      console.log('❌ Validation failed: Missing custom category');
      setError(t('form.specifyCustomCategoryError'));
      return;
    }
    console.log('✅ Category valid:', formData.category);

    // Additional validation for custom subcategory
    if (formData.subcategory === 'Other' && !customSubcategory.trim()) {
      console.log('❌ Validation failed: Missing custom subcategory');
      setError(t('form.specifyCustomSubcategoryError'));
      return;
    }
    console.log('✅ Subcategory valid:', formData.subcategory);

    // Additional validation for petition type
    if (
      formData.petitionType === 'Specific: Addressed to:' &&
      !formData.addressedToType
    ) {
      console.log('❌ Validation failed: Missing addressed to type');
      setError(t('form.selectAddressedToError'));
      return;
    }
    console.log('✅ Petition type valid:', formData.petitionType);

    // Additional validation for addressed to specific
    if (formData.addressedToType && !formData.addressedToSpecific?.trim()) {
      console.log('❌ Validation failed: Missing addressed to specific');
      setError(
        t('form.specifyAddressedToError', {
          type: formData.addressedToType.toLowerCase(),
        })
      );
      return;
    }
    console.log('✅ Addressed to valid:', formData.addressedToSpecific);

    // Additional validation for custom signatures
    if (signatureInputType === 'specific') {
      if (!customSignatures || parseInt(customSignatures) <= 0) {
        console.log('❌ Validation failed: Invalid custom signatures');
        setError(t('form.enterValidSignaturesError'));
        return;
      }
      if (parseInt(customSignatures) > 1000000) {
        console.log('❌ Validation failed: Too many signatures');
        setError(t('form.maxSignaturesError'));
        return;
      }
    }
    console.log('✅ Signatures valid:', formData.targetSignatures);

    // Ensure targetSignatures is set
    if (!formData.targetSignatures || formData.targetSignatures <= 0) {
      console.log('❌ Validation failed: Invalid target signatures');
      setError(t('form.selectTargetSignaturesError'));
      return;
    }
    console.log('✅ Target signatures valid:', formData.targetSignatures);

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
    console.log('🔍 Running validatePetitionData...');
    console.log('📋 Submission data:', submissionData);
    const validationErrors = validatePetitionData(submissionData);
    if (validationErrors.length > 0) {
      console.log('❌ Validation errors found:', validationErrors);
      setError(validationErrors.map((e) => e.message).join(', '));
      return;
    }
    console.log('✅ All validation passed!');

    // Check if payment is required
    const price = calculatePetitionPrice(formData.targetSignatures);
    if (price > 0) {
      console.log('💳 Payment required:', price, 'MAD');
      setShowPayment(true);
      return;
    }

    // Create petition directly if free
    await createPetitionWithPayment(submissionData, null);
  };

  const createPetitionWithPayment = async (
    submissionData: any,
    paymentId: string | null
  ) => {
    try {
      setLoading(true);
      setError('');

      // Create petition
      const petition = await createPetition(
        submissionData,
        user!.uid,
        user!.displayName || user!.email?.split('@')[0] || 'Anonymous'
      );

      // Store petition ID in localStorage for success page
      localStorage.setItem('newPetitionId', petition.id);

      // Redirect to success page
      const price = calculatePetitionPrice(formData.targetSignatures);
      if (price > 0 && paymentId) {
        // Redirect to success page with payment confirmation
        router.push(
          `/petitions/success?payment=true&id=${petition.id}&paymentId=${paymentId}`
        );
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

  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log('✅ Payment successful:', paymentIntentId);
    setPaymentIntentId(paymentIntentId);
    setShowPayment(false);

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

    // Create petition after successful payment
    createPetitionWithPayment(submissionData, paymentIntentId);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  // Step rendering functions
  const renderPublisherStep = () => (
    <div className="space-y-6">
      {/* Publisher Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('form.publishAs')}
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
          <option value="">{t('form.selectPublisherType')}</option>
          <option value="Individual">{t('form.individual')}</option>
          <option value="Association, Organization, Institution">
            {t('form.organization')}
          </option>
        </select>
      </div>

      {/* Publisher Name - Conditional */}
      {formData.publisherType && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formData.publisherType === 'Individual'
              ? t('form.yourName')
              : t('form.organizationName')}{' '}
            *
          </label>
          <input
            type="text"
            required
            value={formData.publisherName || ''}
            onChange={(e) => handleInputChange('publisherName', e.target.value)}
            placeholder={
              formData.publisherType === 'Individual'
                ? t('form.enterFullName')
                : t('form.enterOrganizationName')
            }
            maxLength={100}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            {t('limits.charactersLimit', {
              count: formData.publisherName?.length || 0,
              max: 100,
            })}
          </p>
        </div>
      )}

      {/* Official Document Upload - Conditional */}
      {formData.publisherType === 'Association, Organization, Institution' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('form.officialDocument')}
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
                  alert(t('form.fileSizeError'));
                  e.target.value = '';
                  return;
                }
                handleInputChange('officialDocument', file);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            {t('form.officialDocumentDesc')}
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
          {t('form.petitionType')}
        </label>
        <select
          required
          value={formData.petitionType}
          onChange={(e) => handleInputChange('petitionType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        >
          <option value="">{t('form.selectPetitionType')}</option>
          <option value="Change">{t('form.change')}</option>
          <option value="Support">{t('form.support')}</option>
          <option value="Stop">{t('form.stop')}</option>
          <option value="Start">{t('form.start')}</option>
        </select>
      </div>

      {/* Addressed To Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('form.addressedTo')}
        </label>
        <select
          required
          value={formData.addressedToType}
          onChange={(e) => handleInputChange('addressedToType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        >
          <option value="">{t('form.selectAddressedTo')}</option>
          <option value="Government">{t('form.government')}</option>
          <option value="Company">{t('form.company')}</option>
          <option value="Organization">{t('form.organizationOption')}</option>
          <option value="Individual">{t('form.individualOption')}</option>
          <option value="Community">{t('form.community')}</option>
          <option value="Other">{t('form.other')}</option>
        </select>
      </div>

      {/* Specific Addressee */}
      {formData.addressedToType && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('form.specificName', { type: formData.addressedToType })}
          </label>
          <input
            type="text"
            required
            value={formData.addressedToSpecific}
            onChange={(e) =>
              handleInputChange('addressedToSpecific', e.target.value)
            }
            placeholder={t('form.enterSpecificName', {
              type: formData.addressedToType.toLowerCase(),
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
      )}

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('form.category')}
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
          <option value="">{t('form.selectCategory')}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
          <option value="Other">{t('form.other')}</option>
        </select>
      </div>

      {/* Custom Category */}
      {formData.category === 'Other' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('form.customCategory')}
          </label>
          <input
            type="text"
            required
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder={t('form.enterCustomCategory')}
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
              {t('form.subcategory')}
            </label>
            <select
              required
              value={formData.subcategory}
              onChange={(e) => handleInputChange('subcategory', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              <option value="">{t('form.selectSubcategory')}</option>
              {SUBCATEGORIES[formData.category].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
              <option value="Other">{t('form.other')}</option>
            </select>
          </div>
        )}

      {/* Custom Subcategory */}
      {formData.subcategory === 'Other' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('form.customSubcategory')}
          </label>
          <input
            type="text"
            required
            value={customSubcategory}
            onChange={(e) => setCustomSubcategory(e.target.value)}
            placeholder={t('form.enterCustomSubcategory')}
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
          {t('form.petitionTitle')}
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder={t('form.petitionTitlePlaceholder')}
          maxLength={150}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          {t('limits.charactersLimit', {
            count: formData.title.length,
            max: 150,
          })}
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('form.petitionDescription')}
        </label>

        {/* Formatting Buttons */}
        <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg border">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const textarea = document.querySelector(
                  'textarea[placeholder*="Explain your cause"]'
                ) as HTMLTextAreaElement;
                if (!textarea) return;

                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = formData.description.substring(start, end);

                if (!selectedText) {
                  alert(t('form.selectText'));
                  return;
                }

                const boldText = `**${selectedText}**`;
                const newText =
                  formData.description.substring(0, start) +
                  boldText +
                  formData.description.substring(end);
                handleInputChange('description', newText);

                // Restore focus and cursor position
                setTimeout(() => {
                  textarea.focus();
                  const newCursorPos = start + boldText.length;
                  textarea.setSelectionRange(newCursorPos, newCursorPos);
                }, 0);
              }}
              className="px-4 py-2 text-sm font-bold bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              title={t('form.boldButton')}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => {
                const textarea = document.querySelector(
                  'textarea[placeholder*="Explain your cause"]'
                ) as HTMLTextAreaElement;
                if (!textarea) return;

                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = formData.description.substring(start, end);

                if (!selectedText) {
                  alert(t('form.selectText'));
                  return;
                }

                const underlineText = `__${selectedText}__`;
                const newText =
                  formData.description.substring(0, start) +
                  underlineText +
                  formData.description.substring(end);
                handleInputChange('description', newText);

                // Restore focus and cursor position
                setTimeout(() => {
                  textarea.focus();
                  const newCursorPos = start + underlineText.length;
                  textarea.setSelectionRange(newCursorPos, newCursorPos);
                }, 0);
              }}
              className="px-4 py-2 text-sm underline bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              title={t('form.underlineButton')}
            >
              U
            </button>
          </div>
          <div className="text-sm text-gray-600">{t('form.selectText')}</div>
        </div>

        <textarea
          required
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder={t('form.petitionDescriptionPlaceholder')}
          rows={8}
          maxLength={5000}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        />

        {/* Character count and Preview button */}
        <div className="flex justify-between items-center mt-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {showPreview ? t('form.hidePreview') : t('form.showPreview')}
          </button>
          <p className="text-sm text-gray-500">
            {t('limits.charactersLimit', {
              count: formData.description.length,
              max: 5000,
            })}
          </p>
        </div>

        {/* Preview Section */}
        {showPreview && formData.description && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="text-sm font-medium text-gray-600 mb-3">
              {t('form.preview')}
            </div>
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: formData.description
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **text** → <strong>text</strong>
                  .replace(/__(.*?)__/g, '<u>$1</u>') // __text__ → <u>text</u>
                  .replace(/\n/g, '<br>'), // Line breaks → <br>
              }}
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderMediaStep = () => (
    <div className="space-y-6">
      {/* Petition Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('form.petitionImage')}
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
            {t('form.uploadingImage')}
          </div>
        )}
        <p className="text-sm text-gray-500 mt-1">
          {t('form.petitionImageDesc')}
        </p>
      </div>

      {/* YouTube Video */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('form.addVideo')}
        </label>
        <input
          type="url"
          value={formData.youtubeVideoUrl || ''}
          onChange={(e) => handleInputChange('youtubeVideoUrl', e.target.value)}
          placeholder={t('form.youtubeUrlPlaceholder')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          {t('form.youtubeVideoDesc')}
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
                  {t('form.validYouTubeUrl')}
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
          {t('form.targetSignatures')}
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
            {t('form.slider')}
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
            {t('form.specificNumber')}
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
                {formData.targetSignatures.toLocaleString()}{' '}
                {t('form.signatures')}
              </div>
              <div className="text-sm text-gray-600">
                {tierInfo.name} Plan -{' '}
                {price === 0 ? t('pricing.free') : `${price} MAD`}
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
                placeholder={t('form.enterSignatures')}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                {t('form.enterNumberSignatures')}
              </p>
            </div>

            {/* Current Value Display for Specific Input */}
            {formData.targetSignatures > 0 && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">
                  {formData.targetSignatures.toLocaleString()}{' '}
                  {t('form.signatures')}
                </div>
                <div className="text-sm text-gray-600">
                  {tierInfo.name} Plan -{' '}
                  {price === 0 ? t('pricing.free') : `${price} MAD`}
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-sm text-gray-500 mt-3">
          {t('form.signatureGoalDesc')}
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
                  {price === 0
                    ? t('pricing.free')
                    : `${formatCurrency(price)} MAD`}
                </p>
                {price > 0 && (
                  <p className="text-xs text-blue-600">
                    {t('pricing.oneTimePayment')}
                  </p>
                )}
              </div>
            </div>

            {tierInfo.features && tierInfo.features.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-blue-800 mb-2">
                  {t('pricing.includes')}
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
          {t('form.geographicalScope')}
        </label>
        <select
          required
          value={selectedLocation}
          onChange={handleLocationChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        >
          <option value="">{t('form.selectLocation')}</option>
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
            {t('form.customLocation')}
          </label>
          <input
            type="text"
            required
            value={customLocation}
            onChange={(e) => setCustomLocation(e.target.value)}
            placeholder={t('form.enterCustomLocation')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>
      )}

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('form.tags')}
        </label>
        <input
          type="text"
          value={formData.tags || ''}
          onChange={(e) => handleInputChange('tags', e.target.value)}
          placeholder={t('form.tagsPlaceholder')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        />
        <p className="text-sm text-gray-500 mt-1">{t('form.tagsDesc')}</p>

        {/* Tags Preview */}
        {formData.tags && formData.tags.trim() && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md border">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {t('form.previewTags')}
            </p>
            <div className="flex flex-wrap gap-2">
              {formData.tags
                .split(',')
                .map((tag: string) => tag.trim())
                .filter((tag: string) => tag.length > 0)
                .map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
                  >
                    #{tag}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          {t('review.title')}
        </h3>
        <p className="text-blue-700">{t('review.subtitle')}</p>
      </div>

      {/* Publisher Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">
          {t('review.publisherInfo')}
        </h4>
        <p>
          <strong>{t('review.type')}</strong> {formData.publisherType}
        </p>
        <p>
          <strong>{t('review.name')}</strong> {formData.publisherName}
        </p>
        {formData.officialDocument && (
          <p>
            <strong>{t('review.document')}</strong>{' '}
            {formData.officialDocument.name}
          </p>
        )}
      </div>

      {/* Petition Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">
          {t('review.petitionDetails')}
        </h4>
        <p>
          <strong>{t('review.type')}</strong> {formData.petitionType}
        </p>
        <p>
          <strong>{t('review.addressedTo')}</strong> {formData.addressedToType}{' '}
          - {formData.addressedToSpecific}
        </p>
        <p>
          <strong>{t('review.category')}</strong>{' '}
          {formData.category === 'Other' ? customCategory : formData.category}
        </p>
        {formData.subcategory && (
          <p>
            <strong>{t('review.subcategory')}</strong>{' '}
            {formData.subcategory === 'Other'
              ? customSubcategory
              : formData.subcategory}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">
          {t('review.content')}
        </h4>
        <p>
          <strong>{t('review.petitionTitle')}</strong> {formData.title}
        </p>
        <div className="mt-2">
          <strong>{t('review.description')}</strong>
          <p className="mt-1 text-gray-700">{formData.description}</p>
        </div>
      </div>

      {/* Media */}
      {((formData.mediaUrls && formData.mediaUrls.length > 0) ||
        formData.youtubeVideoUrl) && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">
            {t('review.media')}
          </h4>
          {formData.mediaUrls && formData.mediaUrls.length > 0 && (
            <div className="mb-2">
              <p className="mb-2">{t('review.imageUploaded')}</p>
              <img
                src={formData.mediaUrls[0]}
                alt="Petition preview"
                className="w-full max-w-md h-32 object-cover rounded-lg border"
              />
            </div>
          )}
          {formData.youtubeVideoUrl && <p>{t('review.youtubeAdded')}</p>}
        </div>
      )}

      {/* Location & Targeting */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">
          {t('review.locationTargeting')}
        </h4>
        <p>
          <strong>{t('review.targetSignatures')}</strong>{' '}
          {formData.targetSignatures?.toLocaleString()}
        </p>
        <p>
          <strong>{t('review.location')}</strong>{' '}
          {formData.location?.city
            ? `${formData.location.city}, ${formData.location.country}`
            : formData.location?.country || t('review.notSpecified')}
        </p>
        {formData.tags && formData.tags.trim() && (
          <div>
            <p className="font-semibold text-gray-700 mb-2">
              {t('review.tags')}
            </p>
            <div className="flex flex-wrap gap-2">
              {formData.tags
                .split(',')
                .map((tag: string) => tag.trim())
                .filter((tag: string) => tag.length > 0)
                .map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
                  >
                    #{tag}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Pricing */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-2">
          {t('review.pricingInfo')}
        </h4>
        <p className="text-green-700">
          <strong>{t('review.totalCost')}</strong>{' '}
          {price === 0 ? t('review.free') : `${price} MAD`}
        </p>
        <p className="text-sm text-green-600 mt-1">
          {t('review.tier')} {tier} | {t('review.plan')} {tierInfo.name}
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
      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <PetitionPayment
              formData={formData}
              onPaymentSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </div>
        </div>
      )}

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

      {/* MVP: Phone Verification Modal Disabled */}
      {/* Phone verification is paused for MVP */}
      {/* 
      {showPhoneVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <PhoneVerification
              onVerified={handlePhoneVerified}
              onCancel={() => setShowPhoneVerification(false)}
            />
          </div>
        </div>
      )}
      */}

      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('create.startPetition')}
              </h1>
              <p className="text-lg text-gray-600">
                {t('create.createPetitionDesc')}
              </p>
            </div>

            {/* Test Auto-Fill Button */}
            <Button
              type="button"
              onClick={autoFillTestData}
              variant="outline"
              className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
            >
              {t('create.autoFillTestData')}
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {formSteps[currentStep].title}
              </h2>
              <span className="text-sm text-gray-500">
                {t('create.stepOf', {
                  current: currentStep + 1,
                  total: formSteps.length,
                })}
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
                  // BUT allow Enter key in textareas for line breaks
                  if (
                    e.key === 'Enter' &&
                    currentStep !== formSteps.length - 1 &&
                    e.target instanceof HTMLElement &&
                    e.target.tagName !== 'TEXTAREA'
                  ) {
                    e.preventDefault();
                    console.log(
                      '⚠️ Enter key blocked - not on review step (but allowed in textarea)'
                    );
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
                    {t('form.previous')}
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
                          {t('form.uploadingImageButton')}
                        </>
                      ) : (
                        t('form.next')
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={(e) => {
                        console.log('🔴 BUTTON CLICKED MANUALLY!');
                        console.log('📍 Button type:', e.currentTarget.type);
                        console.log('📍 Form element:', e.currentTarget.form);
                        console.log('📍 Current step:', currentStep);
                        console.log('📍 Loading state:', loading);

                        // Set manual submission flag
                        (window as any).MANUAL_SUBMISSION_ALLOWED = true;
                        console.log('✅ Manual submission flag set!');

                        // Clear the flag after a short delay to catch automatic submissions
                        setTimeout(() => {
                          (window as any).MANUAL_SUBMISSION_ALLOWED = false;
                          console.log('🔒 Manual submission flag cleared');
                        }, 1000);
                      }}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t('form.creatingPetition')}
                        </>
                      ) : price > 0 ? (
                        `Proceed to Payment - ${formatCurrency(price)} MAD`
                      ) : (
                        t('form.createPetitionButton')
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
                    {t('pricing.information')}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-600">
                      {price > 0 ? formatCurrency(price) : t('pricing.free')}
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
                          {price > 0
                            ? formatCurrency(price)
                            : t('pricing.free')}
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
                        <p className="mb-2">{t('pricing.securePayment')}</p>
                        <p>{t('pricing.moroccanDirham')}</p>
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
                    {t('tips.title')}
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
                      <span>{t('tips.clearTitle')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>{t('tips.explainWhy')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>{t('tips.realisticGoal')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>{t('tips.addMedia')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>{t('tips.shareWithFriends')}</span>
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
