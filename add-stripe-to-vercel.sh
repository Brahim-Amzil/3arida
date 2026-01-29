#!/bin/bash

# Add Stripe API Keys to Vercel - TEMPLATE
# Replace YOUR_PUBLISHABLE_KEY and YOUR_SECRET_KEY with your actual Stripe keys

echo "🔐 Adding Stripe API Keys to Vercel..."
echo ""
echo "⚠️  IMPORTANT: Edit this script first!"
echo "Replace YOUR_PUBLISHABLE_KEY and YOUR_SECRET_KEY with your actual keys"
echo ""
read -p "Have you updated the keys in this script? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Please edit the script first and replace the placeholder keys"
    exit 1
fi

# Publishable Key (Public - available in browser)
echo "📝 Adding NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY..."
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production <<EOF
YOUR_PUBLISHABLE_KEY
EOF

vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY preview <<EOF
YOUR_PUBLISHABLE_KEY
EOF

vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY development <<EOF
YOUR_PUBLISHABLE_KEY
EOF

echo ""
echo "🔒 Adding STRIPE_SECRET_KEY..."
vercel env add STRIPE_SECRET_KEY production <<EOF
YOUR_SECRET_KEY
EOF

vercel env add STRIPE_SECRET_KEY preview <<EOF
YOUR_SECRET_KEY
EOF

vercel env add STRIPE_SECRET_KEY development <<EOF
YOUR_SECRET_KEY
EOF

echo ""
echo "✅ Stripe keys added to Vercel!"
echo ""
echo "📋 Next steps:"
echo "1. Run: vercel env ls (to verify keys are added)"
echo "2. Deploy: git push origin main (or vercel --prod)"
echo "3. Test payment on production"
echo "4. Setup webhooks after deployment"
echo ""
