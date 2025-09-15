import {
  moroccanPhoneSchema,
  emailSchema,
  passwordSchema,
  nameSchema,
  petitionTitleSchema,
  petitionDescriptionSchema,
  userRegistrationSchema,
  petitionCreationSchema,
  containsProfanity,
  containsSpam,
  sanitizeInput,
} from '../validation';

describe('Validation Library', () => {
  describe('moroccanPhoneSchema', () => {
    it('should validate correct Moroccan phone numbers', () => {
      const validNumbers = [
        '+212612345678',
        '+212523456789',
        '+212661234567',
        '0612345678',
        '0523456789',
      ];

      validNumbers.forEach((number) => {
        expect(() => moroccanPhoneSchema.parse(number)).not.toThrow();
      });
    });

    it('should reject invalid phone numbers', () => {
      const invalidNumbers = [
        '123456789', // Too short
        '+33612345678', // Wrong country code
        '+212812345678', // Invalid operator code
        'not-a-number',
        '',
      ];

      invalidNumbers.forEach((number) => {
        expect(() => moroccanPhoneSchema.parse(number)).toThrow();
      });
    });
  });

  describe('emailSchema', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.email@domain.co.ma',
        'user+tag@example.org',
      ];

      validEmails.forEach((email) => {
        expect(() => emailSchema.parse(email)).not.toThrow();
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        '',
        'a'.repeat(255) + '@domain.com', // Too long
      ];

      invalidEmails.forEach((email) => {
        expect(() => emailSchema.parse(email)).toThrow();
      });
    });
  });

  describe('passwordSchema', () => {
    it('should validate strong passwords', () => {
      const validPasswords = [
        'Password123',
        'MySecure1Pass',
        'Complex9Password',
      ];

      validPasswords.forEach((password) => {
        expect(() => passwordSchema.parse(password)).not.toThrow();
      });
    });

    it('should reject weak passwords', () => {
      const invalidPasswords = [
        'weak', // Too short
        'password', // No uppercase or number
        'PASSWORD123', // No lowercase
        'Password', // No number
        '12345678', // No letters
      ];

      invalidPasswords.forEach((password) => {
        expect(() => passwordSchema.parse(password)).toThrow();
      });
    });
  });

  describe('nameSchema', () => {
    it('should validate correct names', () => {
      const validNames = [
        'John Doe',
        'Ahmed Ben Ali',
        'Marie-Claire',
        "O'Connor",
        'محمد الأمين', // Arabic name
      ];

      validNames.forEach((name) => {
        expect(() => nameSchema.parse(name)).not.toThrow();
      });
    });

    it('should reject invalid names', () => {
      const invalidNames = [
        'A', // Too short
        'John123', // Contains numbers
        'John@Doe', // Contains special characters
        '', // Empty
        'a'.repeat(101), // Too long
      ];

      invalidNames.forEach((name) => {
        expect(() => nameSchema.parse(name)).toThrow();
      });
    });
  });

  describe('petitionTitleSchema', () => {
    it('should validate good petition titles', () => {
      const validTitles = [
        'Stop Climate Change Now',
        'Improve Public Transportation in Casablanca',
        'Save Our Local Park from Development',
      ];

      validTitles.forEach((title) => {
        expect(() => petitionTitleSchema.parse(title)).not.toThrow();
      });
    });

    it('should reject invalid petition titles', () => {
      const invalidTitles = [
        'Short', // Too short
        'a'.repeat(201), // Too long
        'Title with <script>alert("xss")</script>', // Contains HTML
        '', // Empty
      ];

      invalidTitles.forEach((title) => {
        expect(() => petitionTitleSchema.parse(title)).toThrow();
      });
    });
  });

  describe('petitionDescriptionSchema', () => {
    it('should validate good petition descriptions', () => {
      const validDescription =
        'This is a detailed petition description that explains the issue and why people should sign it. It provides context and background information about the problem we are trying to solve.';

      expect(() =>
        petitionDescriptionSchema.parse(validDescription)
      ).not.toThrow();
    });

    it('should reject invalid descriptions', () => {
      const invalidDescriptions = [
        'Too short', // Too short
        'a'.repeat(5001), // Too long
        'Description with <script>alert("xss")</script>', // Contains HTML
        '', // Empty
      ];

      invalidDescriptions.forEach((description) => {
        expect(() => petitionDescriptionSchema.parse(description)).toThrow();
      });
    });
  });

  describe('userRegistrationSchema', () => {
    it('should validate complete registration data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123',
      };

      expect(() => userRegistrationSchema.parse(validData)).not.toThrow();
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
        confirmPassword: 'DifferentPass123',
      };

      expect(() => userRegistrationSchema.parse(invalidData)).toThrow();
    });
  });

  describe('petitionCreationSchema', () => {
    it('should validate complete petition data', () => {
      const validData = {
        title: 'Save Our Environment',
        description:
          'This petition is about protecting our environment from pollution and climate change. We need immediate action to preserve our planet for future generations.',
        category: 'Environment',
        targetSignatures: 1000,
      };

      expect(() => petitionCreationSchema.parse(validData)).not.toThrow();
    });

    it('should reject incomplete petition data', () => {
      const invalidData = {
        title: 'Short', // Too short
        description: 'Too short description',
        category: '',
        targetSignatures: 5, // Too low
      };

      expect(() => petitionCreationSchema.parse(invalidData)).toThrow();
    });
  });

  describe('containsProfanity', () => {
    it('should detect profanity in text', () => {
      expect(containsProfanity('This is spam content')).toBe(true);
      expect(containsProfanity('This is a scam')).toBe(true);
      expect(containsProfanity('Clean content here')).toBe(false);
    });
  });

  describe('containsSpam', () => {
    it('should detect spam patterns', () => {
      expect(containsSpam('Visit https://spam-site.com')).toBe(true);
      expect(containsSpam('Call 1234567890123')).toBe(true);
      expect(containsSpam('AAAAAAAAAA')).toBe(true);
      expect(containsSpam('Normal content')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize dangerous input', () => {
      expect(sanitizeInput('  <script>alert("xss")</script>  ')).toBe(
        'scriptalert("xss")/script'
      );
      expect(sanitizeInput('Normal   text   with   spaces')).toBe(
        'Normal text with spaces'
      );
      expect(sanitizeInput('Text with {dangerous} [characters]')).toBe(
        'Text with dangerous characters'
      );
    });
  });
});
