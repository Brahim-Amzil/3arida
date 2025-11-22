#!/bin/bash

# Deploy to Firebase Main Hosting
# This overwrites the current production site

echo "🚀 Deploying to MAIN Firebase Hosting..."
echo "⚠️  This will overwrite: https://arida-c5faf.web.app"
echo ""

# Step 1: Build Next.js
echo "📦 Building Next.js app..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "✅ Build complete"

# Step 2: Deploy Functions (with Node 20)
echo "🔧 Building and deploying Functions..."
cd functions
npm run build:functions
cd ..

firebase deploy --only functions --force

# Step 3: Deploy to main hosting
echo "🔥 Deploying to main hosting..."
firebase deploy --only hosting --force

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ ========================================="
  echo "✅  DEPLOYMENT SUCCESSFUL!"
  echo "✅ ========================================="
  echo ""
  echo "🌐 Main URL: https://arida-c5faf.web.app"
  echo "🌐 Staging URL: https://arida-c5faf--staging-lr0evmge.web.app"
  echo ""
else
  echo "❌ Deployment failed!"
  exit 1
fi
