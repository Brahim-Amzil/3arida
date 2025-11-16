// Production environment validation utilities
import React from 'react';

interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  config: Record<string, any>;
}

interface EnvRequirement {
  key: string;
  required: boolean;
  validator?: (value: string) => boolean;
  description: string;
  example?: string;
}

class EnvironmentValidator {
  private requirements: EnvRequirement[] = [
    // App Configuration
    {
      key: 'NEXT_PUBLIC_APP_URL',
      required: true,
      validator: (value) => value.startsWith('https://'),
      description: 'Production app URL',
      example: 'https://3arida.ma',
    },
    {
      key: 'NEXT_PUBLIC_APP_NAME',
      required: true,
      description: 'Application name',
      example: '3arida',
    },

    // Firebase Configuration
    {
      key: 'NEXT_PUBLIC_FIREBASE_API_KEY',
      required: true,
      validator: (value) => value.length > 20,
      description: 'Firebase API key',
    },
    {
      key: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      required: true,
      validator: (value) => value.includes('.firebaseapp.com'),
      description: 'Firebase Auth domain',
      example: 'your-project.firebaseapp.com',
    },
    {
      key: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      required: true,
      description: 'Firebase project ID',
    },
    {
      key: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      required: true,
      validator: (value) => value.includes('.appspot.com'),
      description: 'Firebase Storage bucket',
      example: 'your-project.appspot.com',
    },
    {
      key: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      required: true,
      validator: (value) => /^\d+$/.test(value),
      description: 'Firebase messaging sender ID',
    },
    {
      key: 'NEXT_PUBLIC_FIREBASE_APP_ID',
      required: true,
      validator: (value) => value.startsWith('1:'),
      description: 'Firebase app ID',
    },

    // Stripe Configuration
    {
      key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      required: true,
      validator: (value) =>
        value.startsWith('pk_live_') || value.startsWith('pk_test_'),
      description: 'Stripe publishable key (should be pk_live_ for production)',
    },
    {
      key: 'STRIPE_SECRET_KEY',
      required: false, // Client-side validation can't check server-side vars
      description: 'Stripe secret key (server-side only)',
    },

    // Optional Configuration
    {
      key: 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
      required: false,
      validator: (value) => value.startsWith('G-'),
      description: 'Google Analytics measurement ID',
      example: 'G-XXXXXXXXXX',
    },
    {
      key: 'NEXT_PUBLIC_SENTRY_DSN',
      required: false,
      validator: (value) => value.startsWith('https://'),
      description: 'Sentry DSN for error tracking',
    },
  ];

  // Validate all environment variables
  validate(): EnvValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const config: Record<string, any> = {};

    // Check each requirement
    this.requirements.forEach((req) => {
      const value = process.env[req.key];

      if (req.required && !value) {
        errors.push(`Missing required environment variable: ${req.key}`);
        errors.push(`  Description: ${req.description}`);
        if (req.example) {
          errors.push(`  Example: ${req.example}`);
        }
        return;
      }

      if (value) {
        // Validate format if validator provided
        if (req.validator && !req.validator(value)) {
          errors.push(`Invalid format for ${req.key}: ${req.description}`);
          if (req.example) {
            errors.push(`  Expected format like: ${req.example}`);
          }
        }

        // Store sanitized config (don't expose secrets)
        if (req.key.includes('SECRET') || req.key.includes('PRIVATE')) {
          config[req.key] = '***HIDDEN***';
        } else {
          config[req.key] = value;
        }
      } else if (!req.required) {
        warnings.push(`Optional environment variable not set: ${req.key}`);
        warnings.push(`  Description: ${req.description}`);
      }
    });

    // Production-specific validations
    if (process.env.NODE_ENV === 'production') {
      this.validateProductionConfig(errors, warnings);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      config,
    };
  }

  // Production-specific validations
  private validateProductionConfig(errors: string[], warnings: string[]) {
    // Check for production Stripe keys
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (stripeKey && stripeKey.startsWith('pk_test_')) {
      warnings.push('Using Stripe test key in production environment');
    }

    // Check for HTTPS
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (appUrl && !appUrl.startsWith('https://')) {
      errors.push('Production app URL must use HTTPS');
    }

    // Check for analytics
    if (!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
      warnings.push(
        'Google Analytics not configured - recommended for production'
      );
    }

    // Check for error tracking
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      warnings.push(
        'Error tracking (Sentry) not configured - recommended for production'
      );
    }

    // Check for security headers
    if (!process.env.NEXTAUTH_SECRET) {
      warnings.push(
        'NEXTAUTH_SECRET not set - required for secure authentication'
      );
    }
  }

  // Generate environment template
  generateTemplate(): string {
    const template = this.requirements
      .map((req) => {
        const comment = `# ${req.description}${
          req.required ? ' (REQUIRED)' : ' (OPTIONAL)'
        }`;
        const example = req.example ? ` # Example: ${req.example}` : '';
        const value = req.required ? 'your_value_here' : '';

        return `${comment}\n${req.key}=${value}${example}`;
      })
      .join('\n\n');

    return `# 3arida Petition Platform - Environment Configuration
# Copy this file to .env.production.local and fill in your values

${template}

# Additional Production Settings
NODE_ENV=production
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
NEXT_PUBLIC_RATE_LIMIT_ENABLED=true
NEXT_PUBLIC_CONTENT_MODERATION_ENABLED=true`;
  }

  // Check Firebase project configuration
  async validateFirebaseProject(): Promise<{
    isValid: boolean;
    errors: string[];
    projectInfo?: any;
  }> {
    const errors: string[] = [];

    try {
      // Try to initialize Firebase and check basic connectivity
      const { initializeApp, getApps } = await import('firebase/app');
      const { getAuth } = await import('firebase/auth');
      const { getFirestore } = await import('firebase/firestore');
      const { getStorage } = await import('firebase/storage');

      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      };

      // Initialize Firebase if not already initialized
      let app;
      if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApps()[0];
      }

      // Test services
      const auth = getAuth(app);
      const db = getFirestore(app);
      const storage = getStorage(app);

      if (!auth) errors.push('Firebase Auth initialization failed');
      if (!db) errors.push('Firestore initialization failed');
      if (!storage) errors.push('Firebase Storage initialization failed');

      return {
        isValid: errors.length === 0,
        errors,
        projectInfo: {
          projectId: firebaseConfig.projectId,
          authDomain: firebaseConfig.authDomain,
          storageBucket: firebaseConfig.storageBucket,
        },
      };
    } catch (error) {
      errors.push(
        `Firebase initialization error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
      return {
        isValid: false,
        errors,
      };
    }
  }

  // Validate Stripe configuration
  validateStripeConfig(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      errors.push('Stripe publishable key not configured');
      return { isValid: false, errors, warnings };
    }

    // Check key format
    if (!publishableKey.startsWith('pk_')) {
      errors.push('Invalid Stripe publishable key format');
    }

    // Check environment
    if (process.env.NODE_ENV === 'production') {
      if (publishableKey.startsWith('pk_test_')) {
        warnings.push(
          'Using Stripe test key in production - payments will not be processed'
        );
      } else if (!publishableKey.startsWith('pk_live_')) {
        errors.push(
          'Production environment requires Stripe live keys (pk_live_...)'
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

// Export singleton
export const envValidator = new EnvironmentValidator();

// Validation hook for React components
export function useEnvironmentValidation() {
  const [validation, setValidation] =
    React.useState<EnvValidationResult | null>(null);

  React.useEffect(() => {
    const result = envValidator.validate();
    setValidation(result);

    // Log validation results in development
    if (process.env.NODE_ENV === 'development') {
      if (result.errors.length > 0) {
        console.group('❌ Environment Validation Errors');
        result.errors.forEach((error) => console.error(error));
        console.groupEnd();
      }

      if (result.warnings.length > 0) {
        console.group('⚠️ Environment Validation Warnings');
        result.warnings.forEach((warning) => console.warn(warning));
        console.groupEnd();
      }

      if (result.isValid) {
        console.log('✅ Environment validation passed');
      }
    }
  }, []);

  return validation;
}

// Startup validation function
export async function validateEnvironmentOnStartup(): Promise<boolean> {
  console.log('🔍 Validating environment configuration...');

  const validation = envValidator.validate();

  if (!validation.isValid) {
    console.error('❌ Environment validation failed:');
    validation.errors.forEach((error) => console.error(`  ${error}`));

    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid environment configuration for production');
    }

    return false;
  }

  if (validation.warnings.length > 0) {
    console.warn('⚠️ Environment validation warnings:');
    validation.warnings.forEach((warning) => console.warn(`  ${warning}`));
  }

  // Validate Firebase project
  try {
    const firebaseValidation = await envValidator.validateFirebaseProject();
    if (!firebaseValidation.isValid) {
      console.error('❌ Firebase validation failed:');
      firebaseValidation.errors.forEach((error) => console.error(`  ${error}`));
      return false;
    }
  } catch (error) {
    console.error('❌ Firebase validation error:', error);
    return false;
  }

  // Validate Stripe
  const stripeValidation = envValidator.validateStripeConfig();
  if (!stripeValidation.isValid) {
    console.error('❌ Stripe validation failed:');
    stripeValidation.errors.forEach((error) => console.error(`  ${error}`));
    return false;
  }

  if (stripeValidation.warnings.length > 0) {
    stripeValidation.warnings.forEach((warning) =>
      console.warn(`  ${warning}`)
    );
  }

  console.log('✅ Environment validation completed successfully');
  return true;
}

// Generate .env template file
export function generateEnvTemplate(): string {
  return envValidator.generateTemplate();
}
