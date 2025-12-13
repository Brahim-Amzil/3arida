#!/bin/bash

# Quick Phone Auth Test Script
# This script helps you quickly test phone auth with different configurations

echo "🔍 Phone Auth Quick Test"
echo "========================"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found!"
    exit 1
fi

echo "📋 Current Configuration:"
echo "------------------------"
echo "Project ID: $(grep NEXT_PUBLIC_FIREBASE_PROJECT_ID .env.local | cut -d '=' -f2)"
echo "Auth Domain: $(grep NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN .env.local | cut -d '=' -f2)"
echo ""

# Check if custom reCAPTCHA is enabled
if grep -q "^NEXT_PUBLIC_RECAPTCHA_SITE_KEY=" .env.local; then
    echo "⚠️  Custom reCAPTCHA: ENABLED"
    echo "   Site Key: $(grep NEXT_PUBLIC_RECAPTCHA_SITE_KEY .env.local | cut -d '=' -f2)"
    echo ""
    echo "💡 Recommendation: Try disabling custom reCAPTCHA first"
    echo "   This is the most common cause of phone auth issues"
    echo ""
    read -p "   Disable custom reCAPTCHA now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Backup .env.local
        cp .env.local .env.local.backup
        echo "   ✅ Backed up to .env.local.backup"
        
        # Comment out reCAPTCHA keys
        sed -i.tmp 's/^NEXT_PUBLIC_RECAPTCHA_SITE_KEY=/#NEXT_PUBLIC_RECAPTCHA_SITE_KEY=/' .env.local
        sed -i.tmp 's/^RECAPTCHA_SECRET_KEY=/#RECAPTCHA_SECRET_KEY=/' .env.local
        rm .env.local.tmp 2>/dev/null
        
        echo "   ✅ Custom reCAPTCHA disabled"
        echo ""
    fi
else
    echo "✅ Custom reCAPTCHA: DISABLED (using Firebase default)"
    echo ""
fi

echo "🚀 Starting Test..."
echo "------------------------"
echo ""
echo "1. Starting dev server..."
echo "2. Open: http://localhost:3000/test-phone-simple"
echo "3. Enter your phone number with country code"
echo "4. Watch the debug logs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start dev server
npm run dev
