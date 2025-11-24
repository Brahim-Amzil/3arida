#!/bin/bash

# Add RESEND_API_KEY to Vercel
# This will prompt you to enter the key value

echo "Adding RESEND_API_KEY to Vercel..."
echo ""
echo "The key from .env.local is: re_MctoV8fB_FJoiZyaVt7sD4RmnrAx8mJ46"
echo ""
echo "Adding to production environment..."

# Add to production
echo "re_MctoV8fB_FJoiZyaVt7sD4RmnrAx8mJ46" | vercel env add RESEND_API_KEY production

echo ""
echo "Adding to preview environment..."

# Add to preview
echo "re_MctoV8fB_FJoiZyaVt7sD4RmnrAx8mJ46" | vercel env add RESEND_API_KEY preview

echo ""
echo "Adding to development environment..."

# Add to development
echo "re_MctoV8fB_FJoiZyaVt7sD4RmnrAx8mJ46" | vercel env add RESEND_API_KEY development

echo ""
echo "✅ RESEND_API_KEY added to all environments"
echo ""
echo "Now redeploy the project:"
echo "vercel --prod"
