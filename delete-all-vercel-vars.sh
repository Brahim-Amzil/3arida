#!/bin/bash

echo "🗑️  Deleting ALL Vercel environment variables..."

# List of all 24 unique variable names
VARS=(
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    "SMTP_HOST"
    "SMTP_PORT"
    "SMTP_USER"
    "SMTP_PASSWORD"
    "CONTACT_EMAIL"
    "RESEND_FROM_EMAIL"
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
    "FIREBASE_PROJECT_ID"
    "FIREBASE_CLIENT_EMAIL"
    "FIREBASE_PRIVATE_KEY"
)

# Environments to delete from
ENVS=("production" "preview" "development")

echo "📊 Will delete ${#VARS[@]} variables from ${#ENVS[@]} environments = $((${#VARS[@]} * ${#ENVS[@]})) total deletions"
echo ""

for var in "${VARS[@]}"; do
    echo "🗑️  Deleting $var from all environments..."
    
    for env in "${ENVS[@]}"; do
        echo "  - Removing from $env..."
        vercel env rm "$var" "$env" --yes 2>/dev/null || echo "    (not found in $env)"
    done
    
    echo ""
done

echo "✅ All environment variables deleted!"
echo "📝 Now you can manually add the 24 variables from VERCEL-UNIQUE-VARS.txt"
echo "🔧 Remember to check Production, Preview, AND Development for each variable"