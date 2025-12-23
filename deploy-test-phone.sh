#!/bin/bash

# Quick deployment script to test phone auth on production domain

echo "🚀 Deploying to Firebase Hosting to test phone auth..."
echo ""

# Step 1: Build Next.js app
echo "📦 Step 1: Building Next.js app..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 2: Deploy to Firebase Hosting
echo "🌐 Step 2: Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo ""
echo "✅ Deployment successful!"
echo ""
echo "🧪 Test phone auth at:"
echo "   https://arida-c5faf.firebaseapp.com/test-phone-simple"
echo ""
echo "📱 Enter your phone number: +34613658220"
echo ""
