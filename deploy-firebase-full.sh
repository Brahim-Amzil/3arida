#!/bin/bash

# Full Firebase Deployment with Next.js SSR
# This deploys Next.js app with Firebase Functions for server-side rendering

echo "🚀 Starting full Firebase deployment with SSR..."

# Step 1: Build Next.js app
echo "📦 Building Next.js app..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Next.js build failed!"
  exit 1
fi

echo "✅ Next.js build complete"

# Step 2: Build Firebase Functions
echo "🔧 Building Firebase Functions..."
cd functions
npm run build:functions

if [ $? -ne 0 ]; then
  echo "❌ Functions build failed!"
  exit 1
fi

cd ..
echo "✅ Functions build complete"

# Step 3: Deploy to Firebase (staging channel)
echo "🔥 Deploying to Firebase..."
firebase deploy --only functions
firebase hosting:channel:deploy staging --expires 30d

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ ========================================="
  echo "✅  DEPLOYMENT SUCCESSFUL!"
  echo "✅ ========================================="
  echo ""
  echo "🌐 Your app is live with full SSR support!"
  echo "📍 Staging URL: Check the output above"
  echo ""
  echo "Features enabled:"
  echo "  ✓ Server-side rendering"
  echo "  ✓ Dynamic routes (/petitions/[id])"
  echo "  ✓ API routes"
  echo "  ✓ Firebase integration"
  echo ""
else
  echo "❌ Deployment failed!"
  exit 1
fi
