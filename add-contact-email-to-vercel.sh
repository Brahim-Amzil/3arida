#!/bin/bash

echo "Adding CONTACT_EMAIL environment variable to Vercel..."
echo ""

cd 3arida-app

# Add for all environments
echo "Enter the contact email address (e.g., your verified email):"
read CONTACT_EMAIL

vercel env add CONTACT_EMAIL production <<< "$CONTACT_EMAIL"
vercel env add CONTACT_EMAIL preview <<< "$CONTACT_EMAIL"
vercel env add CONTACT_EMAIL development <<< "$CONTACT_EMAIL"

echo ""
echo "✅ CONTACT_EMAIL added to all environments"
echo ""
echo "Now triggering a new deployment..."
vercel --prod

echo ""
echo "Done! The contact form should now work."
