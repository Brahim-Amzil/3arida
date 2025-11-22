#!/bin/bash

# Deploy Next.js with SSR to Firebase
# This script properly integrates Next.js with Firebase Functions

set -e  # Exit on error

echo "🚀 Deploying Next.js with SSR to Firebase..."
echo ""

# Step 1: Build Next.js app
echo "📦 Step 1/4: Building Next.js app..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Next.js build failed!"
  exit 1
fi

echo "✅ Next.js build complete"
echo ""

# Step 2: Copy Next.js build to functions
echo "📋 Step 2/4: Copying Next.js build to functions directory..."
cd functions

# Clean previous builds
rm -rf .next public next.config.js

# Copy Next.js build
cp -r ../.next .next
cp -r ../public public  
cp ../next.config.js next.config.js

echo "✅ Files copied successfully"
echo ""

# Step 3: Build TypeScript functions
echo "🔧 Step 3/4: Building Firebase Functions..."
npm run build:functions

if [ $? -ne 0 ]; then
  echo "❌ Functions build failed!"
  exit 1
fi

cd ..
echo "✅ Functions build complete"
echo ""

# Step 4: Deploy to Firebase
echo "🔥 Step 4/4: Deploying to Firebase..."
firebase deploy --only functions,hosting

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ ========================================="
  echo "✅  DEPLOYMENT SUCCESSFUL!"
  echo "✅ ========================================="
  echo ""
  echo "🌐 Your app is live with full SSR support!"
  echo "📍 Main URL: https://arida-c5faf.web.app"
  echo ""
  echo "Features enabled:"
  echo "  ✓ Server-side rendering"
  echo "  ✓ Dynamic routes (/petitions/[id])"
  echo "  ✓ API routes"
  echo "  ✓ Firebase integration"
  echo "  ✓ All latest changes deployed"
  echo ""
else
  echo "❌ Deployment failed!"
  exit 1
fi
