#!/bin/bash

# Fix Vercel Base URL for Moderator Invitations
# This script helps set the correct NEXT_PUBLIC_BASE_URL in Vercel

echo "🔧 Fixing Vercel Base URL for Moderator Invitations"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📋 Current Vercel deployments:"
vercel ls

echo ""
echo "🌐 To fix the localhost issue in moderator invitations:"
echo ""
echo "1. Get your production domain from the list above"
echo "2. Run one of these commands with YOUR domain:"
echo ""
echo "   # For .vercel.app domain:"
echo "   vercel env add NEXT_PUBLIC_BASE_URL production"
echo "   # Then enter: https://your-app-name.vercel.app"
echo ""
echo "   # For custom domain:"
echo "   vercel env add NEXT_PUBLIC_BASE_URL production"
echo "   # Then enter: https://your-custom-domain.com"
echo ""
echo "3. Redeploy to apply changes:"
echo "   vercel --prod"
echo ""

# Try to get current domain automatically
echo "🔍 Trying to detect your domain automatically..."
DOMAIN=$(vercel ls --format json 2>/dev/null | jq -r '.[0].url' 2>/dev/null)

if [ "$DOMAIN" != "null" ] && [ "$DOMAIN" != "" ]; then
    echo "✅ Found domain: $DOMAIN"
    echo ""
    echo "🚀 Quick fix command:"
    echo "vercel env add NEXT_PUBLIC_BASE_URL production"
    echo "# Enter this value: https://$DOMAIN"
else
    echo "⚠️  Could not auto-detect domain. Please check 'vercel ls' output above."
fi

echo ""
echo "💡 Alternative: Set environment variable in Vercel Dashboard"
echo "   1. Go to: https://vercel.com/dashboard"
echo "   2. Select your project"
echo "   3. Go to Settings → Environment Variables"
echo "   4. Add: NEXT_PUBLIC_BASE_URL = https://your-domain.com"
echo "   5. Redeploy"