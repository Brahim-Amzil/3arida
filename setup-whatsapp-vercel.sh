#!/bin/bash

# Setup WhatsApp Environment Variables on Vercel
# This script adds WhatsApp Business API credentials to your Vercel project

echo "🚀 Setting up WhatsApp credentials on Vercel..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed"
    echo "Install it with: npm i -g vercel"
    exit 1
fi

# Navigate to the app directory
cd "$(dirname "$0")"

echo "📝 Adding WhatsApp environment variables..."
echo ""

# Add WhatsApp Phone Number ID
vercel env add WHATSAPP_PHONE_NUMBER_ID production << EOF
955517827633887
EOF

# Add WhatsApp Access Token
vercel env add WHATSAPP_ACCESS_TOKEN production << EOF
EAAQUvnimSnkBQNiM9JxGU1KLx6agA4lLg0ycpZBYo53BGD9ie1ZCG8u1RrIpb6sfDV1arhxUz1gg6uS95s5EKhrwDI2xkHfRa7q5K8uqLU0h5aYdGAYAsVvuNBSTz8dzg2sF9U3VZAXQM4pgPowZBY8T16mG7Jew7tJ6Re55OZC3KFwz3h4uSHsTkHJPhAfavPXclJjfKfCbqTPBOWIjwnfH5k12I5TcOmCRlqfNStOVYHY5rj3dt9glo9eaOirwGZBZCsyz3AX0f6hqZBZCsRfOR8LgZD
EOF

# Add WhatsApp Verify Token
vercel env add WHATSAPP_VERIFY_TOKEN production << EOF
3arida_webhook_verify_token_2024_secure
EOF

# Add WhatsApp Business Account ID
vercel env add WHATSAPP_BUSINESS_ACCOUNT_ID production << EOF
186877493784901
EOF

echo ""
echo "✅ WhatsApp credentials added to Vercel!"
echo ""
echo "Next steps:"
echo "1. Deploy your app: vercel --prod"
echo "2. Get your deployment URL (e.g., https://3arida-app.vercel.app)"
echo "3. Configure webhook in Meta Dashboard:"
echo "   - Webhook URL: https://your-app.vercel.app/api/whatsapp/webhook"
echo "   - Verify Token: 3arida_webhook_verify_token_2024_secure"
echo "   - Subscribe to: messages"
