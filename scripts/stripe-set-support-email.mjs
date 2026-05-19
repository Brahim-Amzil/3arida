#!/usr/bin/env node
/**
 * One-time: set Stripe receipt "contact us" email to platform support.
 * Run: STRIPE_SECRET_KEY=sk_live_... node scripts/stripe-set-support-email.mjs
 */
import Stripe from 'stripe';

const supportEmail = process.env.STRIPE_SUPPORT_EMAIL || 'support@3arida.org';
const supportUrl =
  process.env.STRIPE_SUPPORT_URL || 'https://3arida.org/contact';
const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  console.error('Missing STRIPE_SECRET_KEY');
  process.exit(1);
}

const stripe = new Stripe(secretKey);

async function main() {
  const account = await stripe.accounts.retrieve();
  const updated = await stripe.accounts.update(account.id, {
    business_profile: {
      support_email: supportEmail,
      support_url: supportUrl,
    },
  });

  console.log('Stripe account:', account.id);
  console.log(
    'Support email on receipts:',
    updated.business_profile?.support_email || '(unchanged)',
  );
  console.log('Support URL:', updated.business_profile?.support_url);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
