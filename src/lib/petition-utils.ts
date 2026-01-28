import {
  Petition,
  PetitionFormData,
  PricingTier,
  PricingTierConfig,
} from '../types/petition';

// Pricing configuration for Morocco (MAD)
// Note: Use getTierName() and getTierFeatures() with translation hook for localized content
export const PRICING_TIERS: Record<PricingTier, PricingTierConfig> = {
  free: {
    name: 'Free',
    nameKey: 'pricing.tierName.free', // Translation key
    maxSignatures: 2500,
    price: 0,
    features: [
      'Up to 2,500 signatures',
      'Basic petition page',
      'Email sharing',
    ],
    featureKeys: [
      'pricing.tierFeature.upTo2500',
      'pricing.tierFeature.basicPetitionPage',
      'pricing.tierFeature.emailSharing',
    ],
  },
  basic: {
    name: 'Starter',
    nameKey: 'pricing.tierName.starter',
    maxSignatures: 10000,
    price: 69,
    features: [
      'Up to 10,000 signatures',
      'Enhanced petition page',
      'Social media sharing',
      'Basic analytics',
    ],
    featureKeys: [
      'pricing.tierFeature.upTo10000',
      'pricing.tierFeature.enhancedPetitionPage',
      'pricing.tierFeature.socialMediaSharing',
      'pricing.tierFeature.basicAnalytics',
    ],
  },
  premium: {
    name: 'Pro',
    nameKey: 'pricing.tierName.pro',
    maxSignatures: 30000,
    price: 129,
    features: [
      'Up to 30,000 signatures',
      'Premium petition page',
      'Advanced sharing',
      'Detailed analytics',
      'Priority support',
    ],
    featureKeys: [
      'pricing.tierFeature.upTo30000',
      'pricing.tierFeature.premiumPetitionPage',
      'pricing.tierFeature.advancedSharing',
      'pricing.tierFeature.detailedAnalytics',
      'pricing.tierFeature.prioritySupport',
    ],
  },
  advanced: {
    name: 'Advanced',
    nameKey: 'pricing.tierName.advanced',
    maxSignatures: 75000,
    price: 229,
    features: [
      'Up to 75,000 signatures',
      'Advanced analytics',
      'Export signees data',
      'Featured listing',
      'Email support',
    ],
    featureKeys: [
      'pricing.tierFeature.upTo75000',
      'pricing.tierFeature.advancedAnalytics',
      'pricing.tierFeature.exportSigneesData',
      'pricing.tierFeature.featuredListing',
      'pricing.tierFeature.emailSupport',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    nameKey: 'pricing.tierName.enterprise',
    maxSignatures: 100000,
    price: 369,
    features: [
      'Up to 100,000 signatures',
      'Custom branding',
      'API access',
      'Advanced analytics',
      'Dedicated support',
    ],
    featureKeys: [
      'pricing.tierFeature.upTo100000',
      'pricing.tierFeature.customBranding',
      'pricing.tierFeature.apiAccess',
      'pricing.tierFeature.advancedAnalytics',
      'pricing.tierFeature.dedicatedSupport',
    ],
  },
};

// QR Code upgrade price (MAD)
export const QR_CODE_PRICE = 10;

// Default categories for petitions
export const DEFAULT_CATEGORIES = [
  {
    name: 'Environment',
    description: 'Environmental protection and sustainability',
    icon: '🌱',
    color: 'green',
    isActive: true,
  },
  {
    name: 'Social Justice',
    description: 'Human rights and social equality',
    icon: '⚖️',
    color: 'blue',
    isActive: true,
  },
  {
    name: 'Politics',
    description: 'Political reform and governance',
    icon: '🏛️',
    color: 'purple',
    isActive: true,
  },
  {
    name: 'Education',
    description: 'Educational reform and access',
    icon: '📚',
    color: 'orange',
    isActive: true,
  },
  {
    name: 'Healthcare',
    description: 'Healthcare access and reform',
    icon: '🏥',
    color: 'red',
    isActive: true,
  },
  {
    name: 'Economy',
    description: 'Economic policy and employment',
    icon: '💼',
    color: 'yellow',
    isActive: true,
  },
  {
    name: 'Infrastructure',
    description: 'Public infrastructure and transportation',
    icon: '🚧',
    color: 'gray',
    isActive: true,
  },
  {
    name: 'Culture',
    description: 'Cultural preservation and arts',
    icon: '🎭',
    color: 'pink',
    isActive: true,
  },
];

// Validation functions
export interface ValidationError {
  field: string;
  message: string;
}

export const validatePetitionData = (
  data: PetitionFormData,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Title validation
  if (!data.title || data.title.trim().length < 10) {
    errors.push({
      field: 'title',
      message: 'Title must be at least 10 characters long',
    });
  }
  if (data.title && data.title.length > 200) {
    errors.push({
      field: 'title',
      message: 'Title must not exceed 200 characters',
    });
  }

  // Description validation
  if (!data.description || data.description.trim().length < 50) {
    errors.push({
      field: 'description',
      message: 'Description must be at least 50 characters long',
    });
  }
  if (data.description && data.description.length > 5000) {
    errors.push({
      field: 'description',
      message: 'Description must not exceed 5000 characters',
    });
  }

  // Category validation
  if (!data.category) {
    errors.push({
      field: 'category',
      message: 'Please select a category',
    });
  }

  // Target signatures validation
  if (!data.targetSignatures || data.targetSignatures < 100) {
    errors.push({
      field: 'targetSignatures',
      message: 'Target signatures must be at least 100',
    });
  }
  if (data.targetSignatures > 100000) {
    errors.push({
      field: 'targetSignatures',
      message: 'Target signatures cannot exceed 100,000',
    });
  }

  return errors;
};

// Calculate progress percentage
export const calculateProgress = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.min((current / target) * 100, 100);
};

// Format currency for Morocco (MAD)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get petition status color
export const getPetitionStatusColor = (status: Petition['status']): string => {
  switch (status) {
    case 'draft':
      return 'gray';
    case 'pending':
      return 'yellow';
    case 'approved':
      return 'green';
    case 'paused':
      return 'orange';
    case 'deleted':
      return 'red';
    default:
      return 'gray';
  }
};

// Get petition status label
export const getPetitionStatusLabel = (status: Petition['status']): string => {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'pending':
      return 'Pending Review';
    case 'approved':
      return 'Active';
    case 'paused':
      return 'Paused';
    case 'deleted':
      return 'Deleted';
    default:
      return 'Unknown';
  }
};

// Calculate pricing tier based on target signatures
export const calculatePricingTier = (targetSignatures: number): PricingTier => {
  if (targetSignatures <= PRICING_TIERS.free.maxSignatures) {
    return 'free';
  } else if (targetSignatures <= PRICING_TIERS.basic.maxSignatures) {
    return 'basic';
  } else if (targetSignatures <= PRICING_TIERS.premium.maxSignatures) {
    return 'premium';
  } else if (targetSignatures <= PRICING_TIERS.advanced.maxSignatures) {
    return 'advanced';
  } else {
    return 'enterprise';
  }
};

// Calculate petition price based on target signatures
export const calculatePetitionPrice = (targetSignatures: number): number => {
  const tier = calculatePricingTier(targetSignatures);
  return PRICING_TIERS[tier].price;
};

// Generate petition URL slug
export const generatePetitionSlug = (title: string, id: string): string => {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();

  // Add last 8 characters of ID for uniqueness
  const idSuffix = id.slice(-8);
  return `${slug}-${idSuffix}`;
};

// Get petition URL
export const getPetitionUrl = (petition: Petition): string => {
  // Use petition ID directly instead of slug to avoid issues with non-Latin characters
  return `/petitions/${petition.id}`;
};

// Extract petition ID from slug
export const extractPetitionIdFromSlug = (slug: string): string => {
  if (!slug) return '';

  // The slug format is: "title-words-XXXXXXXX" where XXXXXXXX is the last 8 chars of the ID
  const parts = slug.split('-');
  const idSuffix = parts[parts.length - 1];

  // The ID suffix should be 8 characters long
  if (idSuffix && idSuffix.length >= 8) {
    return idSuffix;
  }

  return '';
};

// Validate Moroccan phone number
export const validateMoroccanPhone = (phone: string): boolean => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // Check various Moroccan phone formats
  const patterns = [
    /^212[5-7]\d{8}$/, // +212 format
    /^0[5-7]\d{8}$/, // 0 prefix format
    /^[5-7]\d{8}$/, // Direct format
  ];

  return patterns.some((pattern) => pattern.test(digits));
};

// Format Moroccan phone number for display
export const formatMoroccanPhoneDisplay = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');

  if (digits.startsWith('212')) {
    const number = digits.substring(3);
    return `+212 ${number.substring(0, 1)} ${number.substring(
      1,
      3,
    )} ${number.substring(3, 5)} ${number.substring(5, 7)} ${number.substring(
      7,
    )}`;
  }

  return phone;
};

// Sanitize petition content
export const sanitizePetitionContent = (content: string): string => {
  return content
    .trim()
    .replace(/[<>{}]/g, '') // Remove potentially dangerous characters
    .replace(/\s+/g, ' '); // Normalize whitespace
};

// Get time remaining for petition (if applicable)
export const getTimeRemaining = (deadline?: Date): string | null => {
  if (!deadline) return null;

  const now = new Date();
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) return 'Expired';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} remaining`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
  } else {
    return 'Less than 1 hour remaining';
  }
};

// Check if user can sign petition
export const canSignPetition = (
  petition: Petition,
  userId?: string,
): boolean => {
  // Must be approved and active
  if (petition.status !== 'approved' || !petition.isActive) {
    return false;
  }

  // Cannot sign own petition
  if (userId && petition.creatorId === userId) {
    return false;
  }

  // Check if target reached
  if (petition.currentSignatures >= petition.targetSignatures) {
    return false;
  }

  return true;
};

// Check if user can edit petition
export const canEditPetition = (
  petition: Petition,
  userId?: string,
): boolean => {
  if (!userId) return false;

  // Must be the creator
  if (petition.creatorId !== userId) return false;

  // Can only edit draft or pending petitions
  return petition.status === 'draft' || petition.status === 'pending';
};

// Generate petition share text
export const generateShareText = (petition: Petition): string => {
  return `Support this petition: ${
    petition.title
  }. Help us reach ${petition.targetSignatures.toLocaleString()} signatures!`;
};

// Calculate petition momentum (signatures per day)
export const calculateMomentum = (petition: Petition): number => {
  const daysSinceCreated = Math.max(
    1,
    Math.floor(
      (Date.now() - petition.createdAt.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );
  return Math.round(petition.currentSignatures / daysSinceCreated);
};
