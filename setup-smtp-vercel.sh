#!/bin/bash

echo "🔧 Setting up Hostinger SMTP credentials in Vercel..."
echo ""
echo "You'll need the password for contact@3arida.ma"
echo ""

# Add SMTP_HOST
echo "Adding SMTP_HOST..."
echo "smtp.hostinger.com" | vercel env add SMTP_HOST production
echo "smtp.hostinger.com" | vercel env add SMTP_HOST preview
echo "smtp.hostinger.com" | vercel env add SMTP_HOST development

# Add SMTP_PORT
echo ""
echo "Adding SMTP_PORT..."
echo "465" | vercel env add SMTP_PORT production
echo "465" | vercel env add SMTP_PORT preview
echo "465" | vercel env add SMTP_PORT development

# Add SMTP_USER
echo ""
echo "Adding SMTP_USER..."
echo "contact@3arida.ma" | vercel env add SMTP_USER production
echo "contact@3arida.ma" | vercel env add SMTP_USER preview
echo "contact@3arida.ma" | vercel env add SMTP_USER development

# Add SMTP_PASSWORD (interactive)
echo ""
echo "Adding SMTP_PASSWORD..."
echo "⚠️  You'll need to enter the password for contact@3arida.ma"
echo ""
vercel env add SMTP_PASSWORD production
vercel env add SMTP_PASSWORD preview
vercel env add SMTP_PASSWORD development

echo ""
echo "✅ SMTP credentials added to Vercel!"
echo ""
echo "Next steps:"
echo "1. Redeploy: vercel --prod"
echo "2. Test the contact form on your live site"
echo ""
