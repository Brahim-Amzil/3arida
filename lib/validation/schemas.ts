import { z } from 'zod';

// Base validation schemas
const phoneRegex = /^\+[1-9]\d{1,14}$/; // E.164 format - international phone numbers
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// User validation schema
export const userSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(
      /^[a-zA-Z\s\u0600-\u06FF]+$/,
      'Name can only contain letters and spaces'
    ),
  email: z
    .string()
    .regex(emailRegex, 'Invalid email format')
    .max(255, 'Email must not exceed 255 characters'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number format').optional(),
  role: z.enum(['user', 'moderator', 'admin']).default('user'),
  isActive: z.boolean().default(true),
});

export const userUpdateSchema = userSchema.partial().omit({ email: true });

// Petition validation schema
export const petitionSchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must not exceed 200 characters')
    .regex(/^[^<>{}]+$/, 'Title contains invalid characters'),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must not exceed 50 characters'),
  subcategory: z
    .string()
    .max(50, 'Subcategory must not exceed 50 characters')
    .optional(),
  targetSignatures: z
    .number()
    .int('Target signatures must be a whole number')
    .min(10, 'Target signatures must be at least 10')
    .max(1000000, 'Target signatures cannot exceed 1,000,000'),
  pricingTier: z
    .enum([
      'free',
      'starter',
      'growth',
      'impact',
      'large',
      'mass',
      'enterprise',
    ])
    .default('free'),
  mediaUrls: z
    .array(z.string().url('Invalid media URL'))
    .max(5, 'Maximum 5 media files allowed')
    .default([]),
  tags: z
    .array(z.string().max(30, 'Tag must not exceed 30 characters'))
    .max(10, 'Maximum 10 tags allowed')
    .default([]),
  location: z
    .object({
      country: z.string().min(2, 'Country is required').max(100),
      city: z.string().max(100).optional(),
      region: z.string().max(100).optional(),
    })
    .optional(),
  isPublic: z.boolean().default(true),
});

export const petitionUpdateSchema = petitionSchema
  .partial()
  .omit({ targetSignatures: true, pricingTier: true });

// Signature validation schema
export const signatureSchema = z.object({
  petitionId: z.string().min(1, 'Petition ID is required'),
  signerName: z
    .string()
    .min(2, 'Signer name must be at least 2 characters')
    .max(100, 'Signer name must not exceed 100 characters')
    .regex(
      /^[a-zA-Z\s\u0600-\u06FF\-]+$/,
      'Name can only contain letters, spaces, and hyphens'
    ),
  signerPhone: z.string().regex(phoneRegex, 'Invalid phone number format'),
  signerLocation: z
    .object({
      country: z.string().min(2, 'Country is required').max(100),
      city: z.string().max(100).optional(),
      region: z.string().max(100).optional(),
    })
    .optional(),
  verificationMethod: z.literal('phone_otp'),
  ipAddress: z.string().ip('Invalid IP address'),
  userAgent: z.string().max(500).optional(),
  isAnonymous: z.boolean().default(false),
  comment: z
    .string()
    .max(500, 'Comment must not exceed 500 characters')
    .optional(),
});

// Creator page validation schema
export const creatorPageSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(100, 'Display name must not exceed 100 characters'),
  bio: z.string().max(1000, 'Bio must not exceed 1000 characters').optional(),
  profileImageUrl: z.string().url('Invalid profile image URL').optional(),
  contactEmail: z.string().regex(emailRegex, 'Invalid email format').optional(),
  socialLinks: z
    .object({
      website: z.string().url('Invalid website URL').optional(),
      facebook: z.string().url('Invalid Facebook URL').optional(),
      twitter: z.string().url('Invalid Twitter URL').optional(),
      instagram: z.string().url('Invalid Instagram URL').optional(),
    })
    .optional(),
  isActive: z.boolean().default(true),
});

export const creatorPageUpdateSchema = creatorPageSchema
  .partial()
  .omit({ userId: true });

// Moderator validation schema
export const moderatorSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  assignedBy: z.string().min(1, 'Assigned by is required'),
  permissions: z.array(
    z.object({
      action: z.enum([
        'approve_petition',
        'pause_petition',
        'delete_petition',
        'manage_users',
        'view_analytics',
      ]),
      granted: z.boolean(),
      grantedAt: z.date(),
      grantedBy: z.string().min(1, 'Granted by is required'),
    })
  ),
  isActive: z.boolean().default(true),
  notes: z.string().max(500, 'Notes must not exceed 500 characters').optional(),
});

// Payment intent validation schema
export const paymentIntentSchema = z.object({
  petitionId: z.string().min(1, 'Petition ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(10000, 'Amount cannot exceed 10,000 MAD'),
  currency: z.literal('mad'),
  paymentMethod: z.string().optional(),
});

// QR code request validation schema
export const qrCodeRequestSchema = z.object({
  petitionId: z.string().min(1, 'Petition ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  paymentIntentId: z.string().optional(),
});

// Notification validation schema
export const notificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  type: z.enum([
    'petition_approved',
    'petition_rejected',
    'petition_paused',
    'signature_milestone',
    'payment_success',
    'payment_failed',
  ]),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must not exceed 100 characters'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(500, 'Message must not exceed 500 characters'),
  data: z.any().optional(),
  isRead: z.boolean().default(false),
});

// Pagination validation schema
export const paginationSchema = z.object({
  page: z.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Petition filters validation schema
export const petitionFiltersSchema = z.object({
  category: z.string().optional(),
  subcategory: z.string().optional(),
  status: z
    .array(z.enum(['draft', 'pending', 'approved', 'paused', 'deleted']))
    .optional(),
  location: z
    .object({
      country: z.string().optional(),
      city: z.string().optional(),
      region: z.string().optional(),
    })
    .optional(),
  signatureRange: z
    .object({
      min: z.number().int().min(0).optional(),
      max: z.number().int().min(0).optional(),
    })
    .optional(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  search: z
    .string()
    .max(100, 'Search term must not exceed 100 characters')
    .optional(),
  tags: z.array(z.string()).optional(),
  hasQrCode: z.boolean().optional(),
});

// File upload validation schema
export const fileUploadSchema = z.object({
  file: z.object({
    name: z.string().min(1, 'File name is required'),
    size: z.number().max(10485760, 'File size cannot exceed 10MB'), // 10MB
    type: z.enum(
      [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'video/mp4',
        'video/webm',
      ],
      { errorMap: () => ({ message: 'Unsupported file type' }) }
    ),
  }),
  petitionId: z.string().min(1, 'Petition ID is required'),
});

// Phone verification schema
export const phoneVerificationSchema = z.object({
  phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number format'),
  code: z
    .string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only digits'),
});

// Email verification schema
export const emailVerificationSchema = z.object({
  email: z.string().regex(emailRegex, 'Invalid email format'),
  code: z
    .string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only digits'),
});

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().regex(emailRegex, 'Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters'),
    email: z.string().regex(emailRegex, 'Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must not exceed 128 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// All schemas are already exported individually above
