import { z } from 'zod';

// Moroccan phone number validation
export const moroccanPhoneSchema = z
  .string()
  .min(9, 'Phone number must be at least 9 digits')
  .max(13, 'Phone number must be at most 13 digits')
  .regex(
    /^(\+212|0)[5-7][0-9]{8}$/,
    'Please enter a valid Moroccan phone number'
  );

// Email validation
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(254, 'Email must be at most 254 characters');

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  );

// Name validation
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be at most 100 characters')
  .regex(
    /^[a-zA-ZÀ-ÿ\u0600-\u06FF\s'-]+$/,
    'Name can only contain letters, spaces, hyphens, and apostrophes'
  );

// Petition title validation
export const petitionTitleSchema = z
  .string()
  .min(10, 'Title must be at least 10 characters')
  .max(200, 'Title must be at most 200 characters')
  .regex(/^[^<>{}[\]\\\/]*$/, 'Title contains invalid characters');

// Petition description validation
export const petitionDescriptionSchema = z
  .string()
  .min(50, 'Description must be at least 50 characters')
  .max(5000, 'Description must be at most 5000 characters')
  .regex(/^[^<>{}[\]\\]*$/, 'Description contains invalid characters');

// Category validation
export const categorySchema = z
  .string()
  .min(2, 'Category must be selected')
  .max(50, 'Category name is too long');

// Target signatures validation
export const targetSignaturesSchema = z
  .number()
  .min(10, 'Target must be at least 10 signatures')
  .max(10000000, 'Target cannot exceed 10 million signatures')
  .int('Target must be a whole number');

// Comment validation
export const commentSchema = z
  .string()
  .min(1, 'Comment cannot be empty')
  .max(1000, 'Comment must be at most 1000 characters')
  .regex(/^[^<>{}[\]\\]*$/, 'Comment contains invalid characters');

// User registration schema
export const userRegistrationSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// User login schema
export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Petition creation schema
export const petitionCreationSchema = z.object({
  title: petitionTitleSchema,
  description: petitionDescriptionSchema,
  category: categorySchema,
  subcategory: z.string().max(50, 'Subcategory name is too long').optional(),
  targetSignatures: targetSignaturesSchema,
  location: z
    .object({
      country: z.string().min(2, 'Country is required'),
      city: z.string().max(100, 'City name is too long').optional(),
      region: z.string().max(100, 'Region name is too long').optional(),
    })
    .optional(),
});

// Petition signing schema
export const petitionSigningSchema = z.object({
  signerName: nameSchema,
  signerPhone: moroccanPhoneSchema,
  signerLocation: z
    .object({
      country: z.string().min(2, 'Country is required'),
      city: z.string().max(100, 'City name is too long').optional(),
    })
    .optional(),
  comment: commentSchema.optional(),
  isAnonymous: z.boolean().optional(),
});

// Comment creation schema
export const commentCreationSchema = z.object({
  content: commentSchema,
  isAnonymous: z.boolean().optional(),
});

// Password reset schema
export const passwordResetSchema = z.object({
  email: emailSchema,
});

// Profile update schema
export const profileUpdateSchema = z.object({
  name: nameSchema,
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  twitter: z.string().max(100, 'Twitter handle is too long').optional(),
  facebook: z.string().max(100, 'Facebook profile is too long').optional(),
});

// Content moderation utilities
export const containsProfanity = (text: string): boolean => {
  const profanityWords = [
    // Add profanity words in Arabic, French, and English
    // This is a basic list - in production, use a comprehensive profanity filter
    'spam',
    'scam',
    'fake',
    'fraud',
    // Add more words as needed
  ];

  const lowerText = text.toLowerCase();
  return profanityWords.some((word) => lowerText.includes(word));
};

export const containsSpam = (text: string): boolean => {
  const spamPatterns = [
    /https?:\/\/[^\s]+/gi, // URLs (limit in descriptions)
    /\b\d{10,}\b/g, // Long numbers (potential phone numbers)
    /(.)\1{4,}/g, // Repeated characters
    /[A-Z]{5,}/g, // All caps words
  ];

  return spamPatterns.some((pattern) => pattern.test(text));
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>{}[\]\\]/g, '') // Remove potentially dangerous characters
    .replace(/\s+/g, ' '); // Normalize whitespace
};

// Rate limiting utilities
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, number[]>();

  return (identifier: string): boolean => {
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];

    // Remove old requests outside the window
    const validRequests = userRequests.filter((time) => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }

    validRequests.push(now);
    requests.set(identifier, validRequests);

    return true; // Request allowed
  };
};

// Create rate limiters for different actions
export const petitionCreationLimiter = createRateLimiter(3, 60 * 60 * 1000); // 3 petitions per hour
export const petitionSigningLimiter = createRateLimiter(10, 60 * 60 * 1000); // 10 signatures per hour
export const commentLimiter = createRateLimiter(20, 60 * 60 * 1000); // 20 comments per hour

// IP address validation
export const isValidIP = (ip: string): boolean => {
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

// File validation
export const validateImageFile = (
  file: File
): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, and WebP images are allowed',
    };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be smaller than 5MB' };
  }

  return { valid: true };
};

// URL validation
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validation error formatter
export const formatValidationErrors = (
  errors: z.ZodError
): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};

  errors.errors.forEach((error) => {
    const path = error.path.join('.');
    formattedErrors[path] = error.message;
  });

  return formattedErrors;
};

// Safe HTML content validation
export const isSafeHTML = (html: string): boolean => {
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(html));
};

// Export validation functions
export { z, type ZodError } from 'zod';
