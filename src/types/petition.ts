// Petition Status Type
export type PetitionStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'paused'
  | 'archived'
  | 'deleted';

// Petition Pricing Tiers
export type PricingTier =
  | 'free'
  | 'basic'
  | 'premium'
  | 'advanced'
  | 'enterprise';

// Core Petition Interface
export interface Petition {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  targetSignatures: number;
  currentSignatures: number;
  status: PetitionStatus;
  creatorId: string;
  creatorName?: string;
  creatorPageId?: string;
  mediaUrls: string[];
  qrCodeUrl?: string;
  hasQrCode: boolean;
  hasQrUpgrade?: boolean;
  qrUpgradePaidAt?: Date;
  pricingTier: PricingTier;
  amountPaid: number;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';

  // Publisher information (from creation form)
  publisherType?: string;
  publisherName?: string;

  // Petition details (from creation form)
  petitionType?: string;
  addressedToType?: string;
  addressedToSpecific?: string;
  referenceCode?: string;

  // Additional content
  youtubeVideoUrl?: string;
  tags?: string;

  // Location targeting
  location?: {
    country: string;
    city?: string;
    region?: string;
  };

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  pausedAt?: Date;
  deletedAt?: Date;

  // Analytics
  viewCount: number;
  shareCount: number;

  // Moderation
  moderatedBy?: string;
  moderationNotes?: string;
  resubmissionCount?: number;
  resubmissionHistory?: Array<{
    rejectedAt: Date;
    reason: string;
    resubmittedAt?: Date;
  }>;

  // Public visibility
  isPublic: boolean;
  isActive: boolean;
}

// Petition Form Data (for creation/editing)
export interface PetitionFormData {
  // Publisher information
  publisherType?: string;
  publisherName?: string;
  officialDocument?: File;

  // Petition details
  petitionType?: string;
  addressedToType?: string;
  addressedToSpecific?: string;

  // Additional content
  youtubeVideoUrl?: string;
  tags?: string;

  // Basic information
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  targetSignatures: number;
  mediaUrls: string[];
  location?: {
    country?: string;
    city?: string;
    region?: string;
  };
}

// Signature Interface
export interface Signature {
  id: string;
  petitionId: string;
  signerName: string;
  signerPhone: string;
  signerLocation?: {
    country: string;
    city?: string;
  };
  verificationMethod: 'phone_otp';
  verifiedAt: Date;
  ipAddress: string;
  userAgent?: string;
  isAnonymous: boolean;
  comment?: string;
  createdAt: Date;
}

// Creator Page Interface
export interface CreatorPage {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  profileImageUrl?: string;
  contactEmail?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  petitionCount: number;
  totalSignatures: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
}

// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photoURL?: string;
  bio?: string;
  verifiedEmail: boolean;
  verifiedPhone: boolean;
  role: 'user' | 'moderator' | 'admin';
  creatorPageId?: string;
  fcmToken?: string; // Firebase Cloud Messaging token for push notifications
  fcmTokenUpdatedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

// Moderator Interface
export interface Moderator {
  id: string;
  userId: string;
  assignedBy: string;
  permissions: {
    approve: boolean;
    pause: boolean;
    delete: boolean;
    statsAccess: boolean;
  };
  createdAt: Date;
}

// Pricing Tiers Configuration
export interface PricingTierConfig {
  name: string;
  nameKey?: string; // Translation key for tier name
  maxSignatures: number;
  price: number; // in MAD
  features: string[];
  featureKeys?: string[]; // Translation keys for features
}

// Filter and Search Types
export interface PetitionFilters {
  category?: string;
  status?: PetitionStatus;
  search?: string;
  location?: string;
  sortBy?: 'recent' | 'popular' | 'signatures' | 'ending_soon';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// Category Interface
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  petitionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Interface
export interface Payment {
  id: string;
  petitionId: string;
  userId: string;
  amount: number;
  currency: 'MAD';
  stripePaymentIntentId: string;
  status: 'pending' | 'completed' | 'failed';
  pricingTier: PricingTier;
  createdAt: Date;
  completedAt?: Date;
}

// QR Code Interface
export interface QRCode {
  id: string;
  petitionId: string;
  url: string;
  downloadUrl: string;
  createdAt: Date;
  downloadCount: number;
}
