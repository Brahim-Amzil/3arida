#!/bin/bash

# Script to get all your Vercel deployment URLs
# Use this to know which domains to add to Firebase

echo "🔍 Getting your Vercel deployment URLs..."
echo ""

cd "$(dirname "$0")"

# Get production URL
echo "📍 Production URL:"
vercel ls --prod 2>/dev/null | grep "https://" | head -1 || echo "No production deployment found"

echo ""
echo "📍 Recent Preview URLs:"
vercel ls 2>/dev/null | grep "https://" | head -5 || echo "No preview deployments found"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Domains to add to Firebase:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Extract just the domain part
vercel ls 2>/dev/null | grep -o "https://[^/]*" | sed 's/https:\/\///' | sort -u | head -10

echo ""
echo "💡 Tip: Copy these domains and add them to:"
echo "   Firebase Console > Authentication > Settings > Authorized domains"
echo ""
