import {
  userSchema,
  petitionSchema,
  signatureSchema,
  creatorPageSchema,
  phoneVerificationSchema,
  loginSchema,
  registerSchema,
} from '../schemas';

describe('Validation Schemas', () => {
  describe('userSchema', () => {
    it('should validate a valid user object', () => {
      const validUser = {
        name: 'Ahmed Hassan',
        email: 'ahmed@example.com',
        phone: '+212612345678',
        role: 'user' as const,
        isActive: true,
      };

      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidUser = {
        name: 'Ahmed Hassan',
        email: 'invalid-email',
        role: 'user' as const,
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject name with invalid characters', () => {
      const invalidUser = {
        name: 'Ahmed123',
        email: 'ahmed@example.com',
        role: 'user' as const,
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should accept Arabic names', () => {
      const validUser = {
        name: 'أحمد حسن',
        email: 'ahmed@example.com',
        role: 'user' as const,
      };

      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });
  });

  describe('petitionSchema', () => {
    it('should validate a valid petition object', () => {
      const validPetition = {
        title: 'Save Our Local Park',
        description:
          'This petition is about saving our local park from being demolished. The park has been a cornerstone of our community for decades.',
        category: 'Environment',
        subcategory: 'Parks',
        targetSignatures: 1000,
        pricingTier: 'free' as const,
        mediaUrls: ['https://example.com/image.jpg'],
        tags: ['environment', 'community'],
        location: {
          country: 'Morocco',
          city: 'Casablanca',
        },
        isPublic: true,
      };

      const result = petitionSchema.safeParse(validPetition);
      expect(result.success).toBe(true);
    });

    it('should reject petition with short title', () => {
      const invalidPetition = {
        title: 'Short',
        description:
          'This petition is about saving our local park from being demolished. The park has been a cornerstone of our community for decades.',
        category: 'Environment',
        targetSignatures: 1000,
      };

      const result = petitionSchema.safeParse(invalidPetition);
      expect(result.success).toBe(false);
    });

    it('should reject petition with short description', () => {
      const invalidPetition = {
        title: 'Save Our Local Park',
        description: 'Short description',
        category: 'Environment',
        targetSignatures: 1000,
      };

      const result = petitionSchema.safeParse(invalidPetition);
      expect(result.success).toBe(false);
    });

    it('should reject petition with too many media URLs', () => {
      const invalidPetition = {
        title: 'Save Our Local Park',
        description:
          'This petition is about saving our local park from being demolished. The park has been a cornerstone of our community for decades.',
        category: 'Environment',
        targetSignatures: 1000,
        mediaUrls: [
          'https://example.com/1.jpg',
          'https://example.com/2.jpg',
          'https://example.com/3.jpg',
          'https://example.com/4.jpg',
          'https://example.com/5.jpg',
          'https://example.com/6.jpg', // This exceeds the limit
        ],
      };

      const result = petitionSchema.safeParse(invalidPetition);
      expect(result.success).toBe(false);
    });
  });

  describe('signatureSchema', () => {
    it('should validate a valid signature object', () => {
      const validSignature = {
        petitionId: 'petition123',
        signerName: 'Fatima Al-Zahra',
        signerPhone: '+212612345678',
        signerLocation: {
          country: 'Morocco',
          city: 'Rabat',
        },
        verificationMethod: 'phone_otp' as const,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        isAnonymous: false,
        comment: 'I support this cause',
      };

      const result = signatureSchema.safeParse(validSignature);
      if (!result.success) {
        console.log('Validation errors:', result.error.errors);
      }
      expect(result.success).toBe(true);
    });

    it('should reject signature with invalid phone format', () => {
      const invalidSignature = {
        petitionId: 'petition123',
        signerName: 'Fatima Al-Zahra',
        signerPhone: '123', // Invalid format
        verificationMethod: 'phone_otp' as const,
        ipAddress: '192.168.1.1',
      };

      const result = signatureSchema.safeParse(invalidSignature);
      expect(result.success).toBe(false);
    });

    it('should reject signature with invalid IP address', () => {
      const invalidSignature = {
        petitionId: 'petition123',
        signerName: 'Fatima Al-Zahra',
        signerPhone: '+212612345678',
        verificationMethod: 'phone_otp' as const,
        ipAddress: 'invalid-ip',
      };

      const result = signatureSchema.safeParse(invalidSignature);
      expect(result.success).toBe(false);
    });
  });

  describe('creatorPageSchema', () => {
    it('should validate a valid creator page object', () => {
      const validCreatorPage = {
        userId: 'user123',
        displayName: 'Ahmed Hassan',
        bio: 'Environmental activist and community organizer',
        profileImageUrl: 'https://example.com/profile.jpg',
        contactEmail: 'ahmed@example.com',
        socialLinks: {
          website: 'https://ahmed-hassan.com',
          facebook: 'https://facebook.com/ahmed.hassan',
          twitter: 'https://twitter.com/ahmed_hassan',
        },
        isActive: true,
      };

      const result = creatorPageSchema.safeParse(validCreatorPage);
      expect(result.success).toBe(true);
    });

    it('should reject creator page with invalid URLs', () => {
      const invalidCreatorPage = {
        userId: 'user123',
        displayName: 'Ahmed Hassan',
        socialLinks: {
          website: 'not-a-url',
        },
      };

      const result = creatorPageSchema.safeParse(invalidCreatorPage);
      expect(result.success).toBe(false);
    });
  });

  describe('phoneVerificationSchema', () => {
    it('should validate valid phone verification data', () => {
      const validData = {
        phoneNumber: '+212612345678',
        code: '123456',
      };

      const result = phoneVerificationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid verification code', () => {
      const invalidData = {
        phoneNumber: '+212612345678',
        code: '12345', // Too short
      };

      const result = phoneVerificationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject non-numeric verification code', () => {
      const invalidData = {
        phoneNumber: '+212612345678',
        code: '12345a',
      };

      const result = phoneVerificationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      const validLogin = {
        email: 'user@example.com',
        password: 'password123',
      };

      const result = loginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });

    it('should reject short password', () => {
      const invalidLogin = {
        email: 'user@example.com',
        password: '123',
      };

      const result = loginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('should validate valid registration data', () => {
      const validRegistration = {
        name: 'Ahmed Hassan',
        email: 'ahmed@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      const result = registerSchema.safeParse(validRegistration);
      expect(result.success).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      const invalidRegistration = {
        name: 'Ahmed Hassan',
        email: 'ahmed@example.com',
        password: 'Password123',
        confirmPassword: 'DifferentPassword',
      };

      const result = registerSchema.safeParse(invalidRegistration);
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const invalidRegistration = {
        name: 'Ahmed Hassan',
        email: 'ahmed@example.com',
        password: 'password', // No uppercase or numbers
        confirmPassword: 'password',
      };

      const result = registerSchema.safeParse(invalidRegistration);
      expect(result.success).toBe(false);
    });
  });
});
