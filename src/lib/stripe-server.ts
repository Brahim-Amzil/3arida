import Stripe from 'stripe';

const STRIPE_API_VERSION = '2025-12-15.clover' as const;

let stripeClient: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    stripeClient = new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION });
  }
  return stripeClient;
}

/** Stripe sends a receipt to this address when set (use for paid petitions/upgrades, not tips). */
export function withStripeReceiptEmail(customerEmail?: string) {
  const email = typeof customerEmail === 'string' ? customerEmail.trim() : '';
  return email ? { receipt_email: email } : {};
}
