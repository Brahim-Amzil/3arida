#!/bin/bash

echo "Installing Stripe dependencies..."

# Install Stripe packages
npm install stripe @stripe/stripe-js @stripe/react-stripe-js

echo "✅ Stripe packages installed successfully!"

echo ""
echo "Next steps to enable Stripe payments:"
echo ""
echo "1. Get your Stripe test keys from: https://dashboard.stripe.com/test/apikeys"
echo ""
echo "2. Add these to your .env.local file:"
echo "   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_..."
echo "   STRIPE_SECRET_KEY=sk_test_..."
echo "   STRIPE_WEBHOOK_SECRET=whsec_... (after setting up webhook)"
echo ""
echo "3. Set up webhook endpoint in Stripe Dashboard:"
echo "   - URL: http://localhost:3001/api/stripe/webhook"
echo "   - Events: payment_intent.succeeded, payment_intent.payment_failed"
echo ""
echo "4. Replace QRUpgrade component with QRUpgradeWithStripe in your code"
echo ""
echo "5. Test with Stripe test card: 4242 4242 4242 4242"