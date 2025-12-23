#!/bin/bash

echo "➕ Adding 24 UNIQUE environment variables to Vercel (Production only)"
echo "📝 After this, you'll manually check Preview and Development boxes in Vercel UI"
echo ""

# Load values from .env.local
source .env.local

echo "1/24 Adding NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY..."
echo "pk_test_xxxxx" | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production

echo "2/24 Adding SMTP_HOST..."
echo "smtp.hostinger.com" | vercel env add SMTP_HOST production

echo "3/24 Adding SMTP_PORT..."
echo "465" | vercel env add SMTP_PORT production

echo "4/24 Adding SMTP_USER..."
echo "contact@3arida.ma" | vercel env add SMTP_USER production

echo "5/24 Skipping SMTP_PASSWORD (add manually with real password)..."

echo "6/24 Adding CONTACT_EMAIL..."
echo "3aridapp@gmail.com" | vercel env add CONTACT_EMAIL production

echo "7/24 Adding RESEND_FROM_EMAIL..."
echo "contact@3arida.ma" | vercel env add RESEND_FROM_EMAIL production

echo "8/24 Adding NEXT_PUBLIC_FIREBASE_API_KEY..."
echo "$NEXT_PUBLIC_FIREBASE_API_KEY" | vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production

echo "9/24 Adding NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN..."
echo "$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" | vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production

echo "10/24 Adding NEXT_PUBLIC_FIREBASE_PROJECT_ID..."
echo "$NEXT_PUBLIC_FIREBASE_PROJECT_ID" | vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production

echo "11/24 Adding NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET..."
echo "$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" | vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production

echo "12/24 Adding NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID..."
echo "$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" | vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production

echo "13/24 Adding NEXT_PUBLIC_FIREBASE_APP_ID..."
echo "$NEXT_PUBLIC_FIREBASE_APP_ID" | vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production

echo "14/24 Adding NEXT_PUBLIC_APP_URL..."
echo "$NEXT_PUBLIC_APP_URL" | vercel env add NEXT_PUBLIC_APP_URL production

echo "15/24 Adding NEXT_PUBLIC_APP_NAME..."
echo "$NEXT_PUBLIC_APP_NAME" | vercel env add NEXT_PUBLIC_APP_NAME production

echo "16/24 Adding RESEND_API_KEY..."
echo "$RESEND_API_KEY" | vercel env add RESEND_API_KEY production

echo "17/24 Adding FROM_EMAIL..."
echo "$FROM_EMAIL" | vercel env add FROM_EMAIL production

echo "18/24 Adding WHATSAPP_PHONE_NUMBER_ID..."
echo "$WHATSAPP_PHONE_NUMBER_ID" | vercel env add WHATSAPP_PHONE_NUMBER_ID production

echo "19/24 Adding WHATSAPP_ACCESS_TOKEN..."
echo "$WHATSAPP_ACCESS_TOKEN" | vercel env add WHATSAPP_ACCESS_TOKEN production

echo "20/24 Adding WHATSAPP_VERIFY_TOKEN..."
echo "$WHATSAPP_VERIFY_TOKEN" | vercel env add WHATSAPP_VERIFY_TOKEN production

echo "21/24 Adding WHATSAPP_BUSINESS_ACCOUNT_ID..."
echo "$WHATSAPP_BUSINESS_ACCOUNT_ID" | vercel env add WHATSAPP_BUSINESS_ACCOUNT_ID production

echo "22/24 Adding FIREBASE_PROJECT_ID..."
echo "$FIREBASE_PROJECT_ID" | vercel env add FIREBASE_PROJECT_ID production

echo "23/24 Adding FIREBASE_CLIENT_EMAIL..."
echo "$FIREBASE_CLIENT_EMAIL" | vercel env add FIREBASE_CLIENT_EMAIL production

echo "24/24 Adding FIREBASE_PRIVATE_KEY..."
echo "$FIREBASE_PRIVATE_KEY" | vercel env add FIREBASE_PRIVATE_KEY production

echo ""
echo "✅ Added 23 unique variables to Production environment"
echo "📝 Now go to Vercel UI and for EACH variable:"
echo "   1. Click Edit"
echo "   2. Check Preview and Development boxes"
echo "   3. Save"
echo "⚠️  Don't forget to add SMTP_PASSWORD manually"