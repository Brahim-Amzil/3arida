#!/bin/bash

echo "🔧 Updating Vercel environment variables to include Production environment..."

# Get list of all environment variables
echo "📋 Getting current environment variables..."

# Essential variables that MUST be in Production
ESSENTIAL_VARS=(
    "FIREBASE_PROJECT_ID"
    "FIREBASE_CLIENT_EMAIL" 
    "FIREBASE_PRIVATE_KEY"
    "NEXT_PUBLIC_FIREBASE_API_KEY"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    "NEXT_PUBLIC_FIREBASE_APP_ID"
    "NEXT_PUBLIC_APP_URL"
    "NEXT_PUBLIC_APP_NAME"
    "RESEND_API_KEY"
    "FROM_EMAIL"
    "WHATSAPP_PHONE_NUMBER_ID"
    "WHATSAPP_ACCESS_TOKEN"
    "WHATSAPP_VERIFY_TOKEN"
    "WHATSAPP_BUSINESS_ACCOUNT_ID"
)

echo "⚠️  IMPORTANT: This script will remove and re-add variables to ensure they're set for ALL environments (Production, Preview, Development)."
echo "📝 Variables to update: ${ESSENTIAL_VARS[@]}"
echo ""
read -p "Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

# Load values from .env.local
source .env.local

echo "🔄 Updating variables..."

for var in "${ESSENTIAL_VARS[@]}"; do
    echo "Processing $var..."
    
    # Get the value from environment
    value="${!var}"
    
    if [ -n "$value" ]; then
        echo "  ✅ Found value for $var"
        
        # Remove existing variable from all environments (if it exists)
        vercel env rm "$var" production --yes 2>/dev/null || true
        vercel env rm "$var" preview --yes 2>/dev/null || true
        vercel env rm "$var" development --yes 2>/dev/null || true
        
        # Add it back for ALL environments
        echo "$value" | vercel env add "$var" production
        echo "$value" | vercel env add "$var" preview  
        echo "$value" | vercel env add "$var" development
        
        echo "  ✅ Updated $var for Production, Preview, and Development"
    else
        echo "  ⚠️  No value found for $var in .env.local"
    fi
    echo ""
done

echo "✅ All essential variables have been updated for Production, Preview, and Development!"
echo "🚀 Now run: vercel --prod"