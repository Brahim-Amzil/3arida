import { z } from 'zod';
import type { ValidationError, ApiResponse } from '../../types/models';

// Generic validation function
export const validateData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
):
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));
      return { success: false, errors };
    }

    return {
      success: false,
      errors: [
        { field: 'unknown', message: 'Validation failed', code: 'unknown' },
      ],
    };
  }
};

// Async validation function for API routes
export const validateApiData = async <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<ApiResponse<T>> => {
  const result = validateData(schema, data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    errors: result.errors,
    message: 'Validation failed',
  };
};

// Sanitization utilities
export const sanitizeString = (str: string): string => {
  return str
    .trim()
    .replace(/[<>{}]/g, '') // Remove potentially dangerous characters
    .replace(/\s+/g, ' '); // Normalize whitespace
};

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

// Phone number utilities
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Add + if not present and starts with country code
  if (!cleaned.startsWith('+') && cleaned.length > 10) {
    return `+${cleaned}`;
  }

  return cleaned;
};

export const validateMoroccanPhone = (phone: string): boolean => {
  const moroccanPhoneRegex = /^\+212[5-7]\d{8}$/;
  return moroccanPhoneRegex.test(phone);
};

export const validateInternationalPhone = (phone: string): boolean => {
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone) && phone.length <= 16;
};

// Email utilities
export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const isBusinessEmail = (email: string): boolean => {
  const freeEmailProviders = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'icloud.com',
    'protonmail.com',
    'mail.com',
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? !freeEmailProviders.includes(domain) : false;
};

// Content validation utilities
export const containsProfanity = (text: string): boolean => {
  // Basic profanity filter - in production, use a comprehensive library
  const profanityWords = [
    // Add Arabic and French profanity words as needed
    'spam',
    'scam',
    'fake',
    'fraud',
  ];

  const lowerText = text.toLowerCase();
  return profanityWords.some((word) => lowerText.includes(word));
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// File validation utilities
export const validateFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (
  file: File,
  maxSizeInBytes: number
): boolean => {
  return file.size <= maxSizeInBytes;
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Rate limiting utilities
export const createRateLimitKey = (ip: string, action: string): string => {
  return `rate_limit:${action}:${ip}`;
};

export const createUserRateLimitKey = (
  userId: string,
  action: string
): string => {
  return `rate_limit:${action}:user:${userId}`;
};

// Data transformation utilities
export const transformPetitionForPublic = (petition: any) => {
  // Remove sensitive fields when returning petition data to public
  const {
    creatorId,
    stripePaymentIntentId,
    paymentStatus,
    amountPaid,
    deletedBy,
    deleteReason,
    pausedBy,
    pauseReason,
    approvedBy,
    ...publicPetition
  } = petition;

  return publicPetition;
};

export const transformUserForPublic = (user: any) => {
  // Remove sensitive fields when returning user data
  const { email, phone, role, lastLoginAt, ...publicUser } = user;

  return publicUser;
};

// Validation middleware for API routes
export const createValidationMiddleware = <T>(schema: z.ZodSchema<T>) => {
  return (req: any, res: any, next: () => void) => {
    const result = validateData(schema, req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.errors,
      });
    }

    req.validatedData = result.data;
    next();
  };
};

// Custom validation rules
export const customValidations = {
  // Check if petition title is unique for user
  uniquePetitionTitle: async (
    title: string,
    userId: string,
    excludeId?: string
  ) => {
    // This would check against the database
    // Implementation depends on your database service
    return true; // Placeholder
  },

  // Check if user has reached petition creation limit
  petitionCreationLimit: async (userId: string) => {
    // Check user's petition count against their tier limits
    return true; // Placeholder
  },

  // Validate signature eligibility
  signatureEligibility: async (petitionId: string, phone: string) => {
    // Check if phone has already signed this petition
    return true; // Placeholder
  },
};

// Error formatting utilities
export const formatValidationErrors = (errors: ValidationError[]): string => {
  return errors.map((error) => `${error.field}: ${error.message}`).join(', ');
};

export const createValidationError = (
  field: string,
  message: string,
  code: string = 'invalid'
): ValidationError => {
  return { field, message, code };
};

// Export all utilities
