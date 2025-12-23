#!/bin/bash

echo "➕ Adding all 24 environment variables to Vercel..."
echo "🔧 Each variable will be added to Production, Preview, AND Development"
echo ""

# Load values from .env.local
source .env.local

# Add variables one by one to all environments
echo "1/24 Adding NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY..."
echo "pk_test_xxxxx" | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
echo "pk_test_xxxxx" | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY preview
echo "pk_test_xxxxx" | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY development

echo "2/24 Adding SMTP_HOST..."
echo "smtp.hostinger.com" | vercel env add SMTP_HOST production
echo "smtp.hostinger.com" | vercel env add SMTP_HOST preview
echo "smtp.hostinger.com" | vercel env add SMTP_HOST development

echo "3/24 Adding SMTP_PORT..."
echo "465" | vercel env add SMTP_PORT production
echo "465" | vercel env add SMTP_PORT preview
echo "465" | vercel env add SMTP_PORT development

echo "4/24 Adding SMTP_USER..."
echo "contact@3arida.ma" | vercel env add SMTP_USER production
echo "contact@3arida.ma" | vercel env add SMTP_USER preview
echo "contact@3arida.ma" | vercel env add SMTP_USER development

echo "5/24 Adding SMTP_PASSWORD..."
echo "⚠️  SMTP_PASSWORD needs your real Hostinger password - skipping for security"
echo "   Please add this manually with your real password"

echo "6/24 Adding CONTACT_EMAIL..."
echo "3aridapp@gmail.com" | vercel env add CONTACT_EMAIL production
echo "3aridapp@gmail.com" | vercel env add CONTACT_EMAIL preview
echo "3aridapp@gmail.com" | vercel env add CONTACT_EMAIL development

echo "7/24 Adding RESEND_FROM_EMAIL..."
echo "contact@3arida.ma" | vercel env add RESEND_FROM_EMAIL production
echo "contact@3arida.ma" | vercel env add RESEND_FROM_EMAIL preview
echo "contact@3arida.ma" | vercel env add RESEND_FROM_EMAIL development

echo "8/24 Adding NEXT_PUBLIC_FIREBASE_API_KEY..."
echo "$NEXT_PUBLIC_FIREBASE_API_KEY" | vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
echo "$NEXT_PUBLIC_FIREBASE_API_KEY" | vercel env add NEXT_PUBLIC_FIREBASE_API_KEY preview
echo "$NEXT_PUBLIC_FIREBASE_API_KEY" | vercel env add NEXT_PUBLIC_FIREBASE_API_KEY development

echo "9/24 Adding NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN..."
echo "$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" | vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
echo "$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" | vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN preview
echo "$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" | vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN development

echo "10/24 Adding NEXT_PUBLIC_FIREBASE_PROJECT_ID..."
echo "$NEXT_PUBLIC_FIREBASE_PROJECT_ID" | vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
echo "$NEXT_PUBLIC_FIREBASE_PROJECT_ID" | vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID preview
echo "$NEXT_PUBLIC_FIREBASE_PROJECT_ID" | vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID development

echo "11/24 Adding NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET..."
echo "$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" | vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
echo "$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" | vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET preview
echo "$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" | vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET development

echo "12/24 Adding NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID..."
echo "$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" | vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
echo "$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" | vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID preview
echo "$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" | vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID development

echo "13/24 Adding NEXT_PUBLIC_FIREBASE_APP_ID..."
echo "$NEXT_PUBLIC_FIREBASE_APP_ID" | vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
echo "$NEXT_PUBLIC_FIREBASE_APP_ID" | vercel env add NEXT_PUBLIC_FIREBASE_APP_ID preview
echo "$NEXT_PUBLIC_FIREBASE_APP_ID" | vercel env add NEXT_PUBLIC_FIREBASE_APP_ID development

echo "14/24 Adding NEXT_PUBLIC_APP_URL..."
echo "$NEXT_PUBLIC_APP_URL" | vercel env add NEXT_PUBLIC_APP_URL production
echo "$NEXT_PUBLIC_APP_URL" | vercel env add NEXT_PUBLIC_APP_URL preview
echo "$NEXT_PUBLIC_APP_URL" | vercel env add NEXT_PUBLIC_APP_URL development

echo "15/24 Adding NEXT_PUBLIC_APP_NAME..."
echo "$NEXT_PUBLIC_APP_NAME" | vercel env add NEXT_PUBLIC_APP_NAME production
echo "$NEXT_PUBLIC_APP_NAME" | vercel env add NEXT_PUBLIC_APP_NAME preview
echo "$NEXT_PUBLIC_APP_NAME" | vercel env add NEXT_PUBLIC_APP_NAME development

echo "16/24 Adding RESEND_API_KEY..."
echo "$RESEND_API_KEY" | vercel env add RESEND_API_KEY production
echo "$RESEND_API_KEY" | vercel env add RESEND_API_KEY preview
echo "$RESEND_API_KEY" | vercel env add RESEND_API_KEY development

echo "17/24 Adding FROM_EMAIL..."
echo "$FROM_EMAIL" | vercel env add FROM_EMAIL production
echo "$FROM_EMAIL" | vercel env add FROM_EMAIL preview
echo "$FROM_EMAIL" | vercel env add FROM_EMAIL development

echo "18/24 Adding WHATSAPP_PHONE_NUMBER_ID..."
echo "$WHATSAPP_PHONE_NUMBER_ID" | vercel env add WHATSAPP_PHONE_NUMBER_ID production
echo "$WHATSAPP_PHONE_NUMBER_ID" | vercel env add WHATSAPP_PHONE_NUMBER_ID preview
echo "$WHATSAPP_PHONE_NUMBER_ID" | vercel env add WHATSAPP_PHONE_NUMBER_ID development

echo "19/24 Adding WHATSAPP_ACCESS_TOKEN..."
echo "$WHATSAPP_ACCESS_TOKEN" | vercel env add WHATSAPP_ACCESS_TOKEN production
echo "$WHATSAPP_ACCESS_TOKEN" | vercel env add WHATSAPP_ACCESS_TOKEN preview
echo "$WHATSAPP_ACCESS_TOKEN" | vercel env add WHATSAPP_ACCESS_TOKEN development

echo "20/24 Adding WHATSAPP_VERIFY_TOKEN..."
echo "$WHATSAPP_VERIFY_TOKEN" | vercel env add WHATSAPP_VERIFY_TOKEN production
echo "$WHATSAPP_VERIFY_TOKEN" | vercel env add WHATSAPP_VERIFY_TOKEN preview
echo "$WHATSAPP_VERIFY_TOKEN" | vercel env add WHATSAPP_VERIFY_TOKEN development

echo "21/24 Adding WHATSAPP_BUSINESS_ACCOUNT_ID..."
echo "$WHATSAPP_BUSINESS_ACCOUNT_ID" | vercel env add WHATSAPP_BUSINESS_ACCOUNT_ID production
echo "$WHATSAPP_BUSINESS_ACCOUNT_ID" | vercel env add WHATSAPP_BUSINESS_ACCOUNT_ID preview
echo "$WHATSAPP_BUSINESS_ACCOUNT_ID" | vercel env add WHATSAPP_BUSINESS_ACCOUNT_ID development

echo "22/24 Adding FIREBASE_PROJECT_ID (CRITICAL)..."
echo "$FIREBASE_PROJECT_ID" | vercel env add FIREBASE_PROJECT_ID production
echo "$FIREBASE_PROJECT_ID" | vercel env add FIREBASE_PROJECT_ID preview
echo "$FIREBASE_PROJECT_ID" | vercel env add FIREBASE_PROJECT_ID development

echo "23/24 Adding FIREBASE_CLIENT_EMAIL (CRITICAL)..."
echo "$FIREBASE_CLIENT_EMAIL" | vercel env add FIREBASE_CLIENT_EMAIL production
echo "$FIREBASE_CLIENT_EMAIL" | vercel env add FIREBASE_CLIENT_EMAIL preview
echo "$FIREBASE_CLIENT_EMAIL" | vercel env add FIREBASE_CLIENT_EMAIL development

echo "24/24 Adding FIREBASE_PRIVATE_KEY (CRITICAL)..."
echo "$FIREBASE_PRIVATE_KEY" | vercel env add FIREBASE_PRIVATE_KEY production
echo "$FIREBASE_PRIVATE_KEY" | vercel env add FIREBASE_PRIVATE_KEY preview
echo "$FIREBASE_PRIVATE_KEY" | vercel env add FIREBASE_PRIVATE_KEY development

echo ""
echo "✅ Done! Added 23/24 variables to all environments"
echo "⚠️  SMTP_PASSWORD was skipped - please add manually with your real Hostinger password"
echo "🚀 You can now deploy: vercel --prod"