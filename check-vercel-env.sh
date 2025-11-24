#!/bin/bash

# Check if RESEND_API_KEY is set on Vercel
echo "Checking Vercel environment variables..."

# Get the project
vercel env ls

echo ""
echo "To add RESEND_API_KEY to Vercel, run:"
echo "vercel env add RESEND_API_KEY"
echo ""
echo "Or use the Vercel dashboard:"
echo "https://vercel.com/your-team/3arida/settings/environment-variables"
