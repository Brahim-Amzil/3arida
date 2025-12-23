#!/bin/bash

# Redeploy to Vercel with cache cleared
# This script forces a fresh build without using cached environment variables

echo "🚀 Redeploying to Vercel with fresh build..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm i -g vercel
fi

# Navigate to the app directory
cd "$(dirname "$0")"

echo "📋 Current environment variables in Vercel:"
vercel env ls

echo ""
echo "🔄 Triggering new deployment with --force flag to bypass cache..."
echo ""

# Deploy with force flag to bypass cache
vercel --prod --force

echo ""
echo "✅ Deployment triggered!"
echo ""
echo "📝 Next steps:"
echo "1. Check deployment status at: https://vercel.com/dashboard"
echo "2. If environment variables are still not working, run:"
echo "   vercel env pull .env.production.local"
echo "   to verify they're correctly set"
echo ""
echo "3. You can also manually clear cache in Vercel dashboard:"
echo "   Settings > General > Clear Build Cache"
