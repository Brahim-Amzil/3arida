import type { Petition, PricingTier } from '../../types/models';

// Pricing tiers configuration
export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'free',
    maxSignatures: 2500,
    price: 0,
    features: [
      'Up to 2,500 signatures',
      'Basic petition creation',
      'Email notifications',
      'Public petition listing',
    ],
    description: 'Perfect for local community initiatives',
  },
  {
    name: 'basic',
    maxSignatures: 10000,
    price: 79,
    features: [
      'Up to 10,000 signatures',
      'All free features',
      'QR code generation',
      'Basic analytics',
      'Priority listing',
    ],
    description: 'Great for regional campaigns',
  },
  {
    name: 'premium',
    maxSignatures: 100000,
    price: 199,
    features: [
      'Up to 100,000 signatures',
      'All basic features',
      'Advanced analytics',
      'Custom branding',
      'Priority support',
      'Export capabilities',
    ],
    description: 'Ideal for national movements',
  },
];

// QR Code upgrade price
export const QR_CODE_PRICE = 10; // MAD

// Petition categories
export const PETITION_CATEGORIES = [
  'Environment',
  'Social Justice',
  'Politics',
  'Education',
  'Healthcare',
  'Technology',
  'Human Rights',
  'Animal Rights',
  'Community',
  'Economic Policy',
  'Infrastructure',
  'Culture',
  'Sports',
  'Other',
] as const;

// Petition status display names
export const PETITION_STATUS_LABELS = {
  draft: 'Draft',
  pending: 'Pending Review',
  approved: 'Active',
  paused: 'Paused',
  deleted: 'Deleted',
} as const;

// Petition status colors for UI
export const PETITION_STATUS_COLORS = {
  draft: 'gray',
  pending: 'yellow',
  approved: 'green',
  paused: 'orange',
  deleted: 'red',
} as const;

/**
 * Calculate the appropriate pricing tier based on target signatures
 */
export function calculatePricingTier(targetSignatures: number): {
  tier: PricingTier;
  price: number;
} {
  if (targetSignatures <= 2500) {
    return { tier: PRICING_TIERS[0], price: 0 };
  } else if (targetSignatures <= 5000) {
    return { tier: PRICING_TIERS[1], price: 49 };
  } else if (targetSignatures <= 10000) {
    return { tier: PRICING_TIERS[1], price: 79 };
  } else if (targetSignatures <= 25000) {
    return { tier: PRICING_TIERS[2], price: 119 };
  } else if (targetSignatures <= 50000) {
    return { tier: PRICING_TIERS[2], price: 149 };
  } else if (targetSignatures <= 100000) {
    return { tier: PRICING_TIERS[2], price: 199 };
  } else {
    return { tier: PRICING_TIERS[2], price: 299 }; // Enterprise pricing
  }
}

/**
 * Calculate petition progress percentage
 */
export function calculateProgress(
  currentSignatures: number,
  targetSignatures: number
): number {
  if (targetSignatures === 0) return 0;
  return Math.min((currentSignatures / targetSignatures) * 100, 100);
}

/**
 * Format signature count for display
 */
export function formatSignatureCount(count: number): string {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return `${(count / 1000).toFixed(1)}K`;
  } else {
    return `${(count / 1000000).toFixed(1)}M`;
  }
}

/**
 * Get time remaining until petition expires (if applicable)
 */
export function getTimeRemaining(expiresAt?: Date): {
  days: number;
  hours: number;
  minutes: number;
  expired: boolean;
} | null {
  if (!expiresAt) return null;

  const now = new Date();
  const timeDiff = expiresAt.getTime() - now.getTime();

  if (timeDiff <= 0) {
    return { days: 0, hours: 0, minutes: 0, expired: true };
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, expired: false };
}

/**
 * Check if petition can be signed
 */
export function canSignPetition(petition: Petition): {
  canSign: boolean;
  reason?: string;
} {
  if (petition.status !== 'approved') {
    return { canSign: false, reason: 'Petition is not active' };
  }

  if (petition.currentSignatures >= petition.targetSignatures) {
    return { canSign: false, reason: 'Petition has reached its target' };
  }

  if (petition.expiresAt && new Date() > petition.expiresAt) {
    return { canSign: false, reason: 'Petition has expired' };
  }

  return { canSign: true };
}

/**
 * Check if petition can be edited
 */
export function canEditPetition(
  petition: Petition,
  userId: string,
  userRole: string
): {
  canEdit: boolean;
  reason?: string;
} {
  // Admins and moderators can always edit
  if (userRole === 'admin' || userRole === 'moderator') {
    return { canEdit: true };
  }

  // Creators can only edit their own petitions
  if (petition.creatorId !== userId) {
    return { canEdit: false, reason: 'Not the petition creator' };
  }

  // Creators can only edit draft petitions
  if (petition.status !== 'draft') {
    return { canEdit: false, reason: 'Can only edit draft petitions' };
  }

  return { canEdit: true };
}

/**
 * Generate petition URL slug from title
 */
export function generatePetitionSlug(title: string, id: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .substring(0, 50); // Limit length

  return `${slug}-${id.substring(0, 8)}`;
}

/**
 * Validate petition media files
 */
export function validateMediaFiles(files: File[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const maxFiles = 5;
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm',
  ];

  if (files.length > maxFiles) {
    errors.push(`Maximum ${maxFiles} files allowed`);
  }

  files.forEach((file, index) => {
    if (file.size > maxFileSize) {
      errors.push(`File ${index + 1}: Size exceeds 10MB limit`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(`File ${index + 1}: Unsupported file type`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get petition sharing URL
 */
export function getPetitionSharingUrl(
  petitionId: string,
  baseUrl: string
): string {
  return `${baseUrl}/petition/${petitionId}`;
}

/**
 * Generate petition QR code data
 */
export function generateQRCodeData(
  petitionId: string,
  baseUrl: string
): {
  url: string;
  data: string;
} {
  const url = getPetitionSharingUrl(petitionId, baseUrl);
  return {
    url,
    data: url,
  };
}

/**
 * Calculate petition momentum (signatures per day)
 */
export function calculateMomentum(petition: Petition): number {
  const now = new Date();
  const daysSinceCreation = Math.max(
    1,
    Math.floor(
      (now.getTime() - petition.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  return petition.currentSignatures / daysSinceCreation;
}

/**
 * Get petition milestone achievements
 */
export function getMilestones(currentSignatures: number): {
  achieved: number[];
  next?: number;
} {
  const milestones = [
    10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000,
  ];
  const achieved = milestones.filter(
    (milestone) => currentSignatures >= milestone
  );
  const next = milestones.find((milestone) => currentSignatures < milestone);

  return { achieved, next };
}

/**
 * Sort petitions by various criteria
 */
export function sortPetitions(
  petitions: Petition[],
  sortBy:
    | 'newest'
    | 'oldest'
    | 'most_signed'
    | 'least_signed'
    | 'momentum'
    | 'ending_soon'
): Petition[] {
  const sorted = [...petitions];

  switch (sortBy) {
    case 'newest':
      return sorted.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );

    case 'oldest':
      return sorted.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );

    case 'most_signed':
      return sorted.sort((a, b) => b.currentSignatures - a.currentSignatures);

    case 'least_signed':
      return sorted.sort((a, b) => a.currentSignatures - b.currentSignatures);

    case 'momentum':
      return sorted.sort((a, b) => calculateMomentum(b) - calculateMomentum(a));

    case 'ending_soon':
      return sorted.sort((a, b) => {
        if (!a.expiresAt && !b.expiresAt) return 0;
        if (!a.expiresAt) return 1;
        if (!b.expiresAt) return -1;
        return a.expiresAt.getTime() - b.expiresAt.getTime();
      });

    default:
      return sorted;
  }
}
