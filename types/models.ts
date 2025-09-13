// Core data models for 3arida Petition Platform

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  verifiedEmail: boolean;
  verifiedPhone: boolean;
  role: 'user' | 'moderator' | 'admin';
  creatorPageId?: string;
  createdAt: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface Petition {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  targetSignatures: number;
  currentSignatures: number;
  status: 'draft' | 'pending' | 'approved' | 'active' | 'paused' | 'archived' | 'rejected' | 'deleted';
  creatorId: string;
  creatorPageId?: string;
  mediaUrls: string[];
  qrCodeUrl?: string;
  hasQrCode: boolean;
  pricingTier:
    | 'free'
    | 'starter'
    | 'growth'
    | 'impact'
    | 'large'
    | 'mass'
    | 'enterprise';
  amountPaid: number;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt?: Date;
  approvedAt?: Date;
  approvedBy?: string;
  pausedAt?: Date;
  pausedBy?: string;
  pauseReason?: string;
  deletedAt?: Date;
  deletedBy?: string;
  deleteReason?: string;
  expiresAt?: Date;
  isPublic: boolean;
  tags: string[];
  location?: {
    country: string;
    city?: string;
    region?: string;
  };
}

export interface CreatorPage {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  profileImageUrl?: string;
  contactEmail?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  petitionCount: number;
  totalSignatures: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
}

export interface Signature {
  id: string;
  petitionId: string;
  signerName: string;
  signerPhone: string;
  signerLocation?: {
    country: string;
    city?: string;
    region?: string;
  };
  verificationMethod: 'phone_otp';
  verifiedAt: Date;
  ipAddress: string;
  userAgent?: string;
  isAnonymous: boolean;
  comment?: string;
  createdAt: Date;
}

export interface Moderator {
  id: string;
  userId: string;
  assignedBy: string;
  permissions: ModeratorPermission[];
  isActive: boolean;
  assignedAt: Date;
  revokedAt?: Date;
  revokedBy?: string;
  notes?: string;
}

export interface ModeratorPermission {
  action:
    | 'approve_petition'
    | 'pause_petition'
    | 'delete_petition'
    | 'manage_users'
    | 'view_analytics';
  granted: boolean;
  grantedAt: Date;
  grantedBy: string;
}

// Pricing and payment related types
export interface PricingTier {
  name: 'free' | 'basic' | 'premium';
  maxSignatures: number;
  price: number; // in MAD
  features: string[];
  description: string;
}

export interface PaymentIntent {
  id: string;
  petitionId: string;
  userId: string;
  amount: number; // in MAD
  currency: 'mad';
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  stripePaymentIntentId: string;
  paymentMethod?: string;
  createdAt: Date;
  completedAt?: Date;
  failureReason?: string;
}

// QR Code related types
export interface QRCodeRequest {
  id: string;
  petitionId: string;
  userId: string;
  status: 'pending' | 'generated' | 'failed';
  qrCodeUrl?: string;
  downloadUrls?: {
    png: string;
    pdf: string;
  };
  paymentIntentId?: string;
  createdAt: Date;
  generatedAt?: Date;
  expiresAt?: Date;
}

// Analytics and statistics types
export interface PetitionAnalytics {
  petitionId: string;
  totalViews: number;
  uniqueViews: number;
  signaturesByDay: { [date: string]: number };
  signaturesByLocation: { [location: string]: number };
  conversionRate: number; // views to signatures
  averageSigningTime: number; // in seconds
  lastUpdated: Date;
}

export interface PlatformStatistics {
  totalPetitions: number;
  totalSignatures: number;
  totalUsers: number;
  activePetitions: number;
  pendingPetitions: number;
  totalRevenue: number; // in MAD
  signaturesToday: number;
  petitionsToday: number;
  lastUpdated: Date;
}

// Validation and utility types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ValidationError[];
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Filter types for petition discovery
export interface PetitionFilters {
  category?: string;
  subcategory?: string;
  status?: Petition['status'][];
  location?: {
    country?: string;
    city?: string;
    region?: string;
  };
  signatureRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  search?: string;
  tags?: string[];
  hasQrCode?: boolean;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type:
    | 'petition_approved'
    | 'petition_rejected'
    | 'petition_paused'
    | 'signature_milestone'
    | 'payment_success'
    | 'payment_failed';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

// Export all types for easy importing
// All interfaces are already exported above
