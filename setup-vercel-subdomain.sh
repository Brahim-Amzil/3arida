#!/bin/bash

# Script to set up 3arida.vercel.app as the main domain

echo "🚀 Setting up 3arida.vercel.app as your staging domain"
echo ""

cd "$(dirname "$0")"

echo "Step 1: Add domain in Vercel Dashboard"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Select your project: 3arida-app"
echo "3. Go to: Settings > Domains"
echo "4. Click 'Add' button"
echo "5. Enter: 3arida.vercel.app"
echo "6. Click 'Add'"
echo ""
read -p "Press Enter when you've added the domain in Vercel Dashboard..."

echo ""
echo "Step 2: Update environment variable"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Remove old APP_URL
echo "Removing old NEXT_PUBLIC_APP_URL..."
vercel env rm NEXT_PUBLIC_APP_URL production 2>/dev/null || true

# Add new APP_URL
echo "Adding new NEXT_PUBLIC_APP_URL..."
echo "https://3arida.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL production

echo ""
echo "Step 3: Verify Firebase has the domain"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Make sure Firebase has this domain authorized:"
echo "  ✅ 3arida.vercel.app"
echo ""
echo "Firebase Console:"
echo "  https://console.firebase.google.com/"
echo "  > Authentication > Settings > Authorized domains"
echo ""
read -p "Press Enter when you've confirmed Firebase has 3arida.vercel.app..."

echo ""
echo "Step 4: Deploy to production"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
vercel --prod --force

echo ""
echo "✅ Setup complete!"
echo ""
echo "Your app should now be available at:"
echo "  https://3arida.vercel.app"
echo ""
echo "Test checklist:"
echo "  □ Visit https://3arida.vercel.app"
echo "  □ Check manifest.json loads"
echo "  □ Try Google login"
echo "  □ Test creating a petition"
echo ""
