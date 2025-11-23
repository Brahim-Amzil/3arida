#!/bin/bash

# Script to fix Vercel environment variables with newline characters
# This removes and re-adds environment variables to ensure they're clean

echo "🔧 Fixing Vercel Environment Variables"
echo "This will remove and re-add all Firebase environment variables"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm i -g vercel
fi

cd "$(dirname "$0")"

echo "⚠️  This script will:"
echo "1. Remove existing Firebase environment variables"
echo "2. Prompt you to re-add them (without newlines)"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

# List of environment variables to fix
ENV_VARS=(
    "NEXT_PUBLIC_FIREBASE_API_KEY"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    "NEXT_PUBLIC_FIREBASE_APP_ID"
    "NEXT_PUBLIC_APP_URL"
    "NEXT_PUBLIC_APP_NAME"
)

echo ""
echo "📝 Please have your Firebase config ready:"
echo "You can find it in Firebase Console > Project Settings > General"
echo ""
read -p "Press enter when ready..."

for VAR in "${ENV_VARS[@]}"; do
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Setting: $VAR"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Try to remove existing (ignore errors if doesn't exist)
    vercel env rm "$VAR" production 2>/dev/null || true
    
    # Add new value
    echo "Enter value for $VAR:"
    vercel env add "$VAR" production
done

echo ""
echo "✅ Environment variables updated!"
echo ""
echo "🚀 Now deploying with fresh build..."
vercel --prod --force

echo ""
echo "✅ Done! Check your deployment at:"
vercel ls --prod | head -n 2
