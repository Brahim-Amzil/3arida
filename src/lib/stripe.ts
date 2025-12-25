import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      console.warn(
        'Stripe publishable key not found. Stripe functionality will be disabled.'
      );
      return Promise.resolve(null);
    }

    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// Pricing tiers configuration
export const PRICING_TIERS = {
  free: {
    name: 'Free',
    maxSignatures: 2500,
    price: 0,
    currency: 'MAD',
    features: [
      'Up to 2,500 signatures',
      'Basic petition creation',
      'Social sharing',
      'Email notifications',
    ],
  },
  starter: {
    name: 'Starter',
    maxSignatures: 5000,
    price: 49,
    currency: 'MAD',
    features: [
      'Up to 5,000 signatures',
      'QR code generation',
      'Enhanced social sharing',
      'Priority support',
    ],
  },
  pro: {
    name: 'Pro',
    maxSignatures: 10000,
    price: 99,
    currency: 'MAD',
    features: [
      'Up to 10,000 signatures',
      'Custom branding',
      'Analytics dashboard',
      'Email campaigns',
    ],
  },
  advanced: {
    name: 'Advanced',
    maxSignatures: 50000,
    price: 199,
    currency: 'MAD',
    features: [
      'Up to 50,000 signatures',
      'Advanced analytics',
      'API access',
      'Dedicated support',
    ],
  },
} as const;

export type PricingTier = keyof typeof PRICING_TIERS;

export const getPricingTier = (signatures: number): PricingTier => {
  if (signatures <= 2500) return 'free';
  if (signatures <= 5000) return 'starter';
  if (signatures <= 10000) return 'pro';
  return 'advanced';
};

export const createPaymentIntent = async (
  amount: number,
  petitionId: string,
  pricingTier: string
) => {
  try {
    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'mad',
        petitionId,
        pricingTier,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};
