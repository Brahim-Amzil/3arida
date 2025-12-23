# Deployment Configuration Update

## Changes Made

Fixed the "generateStaticParams() missing" error by removing static export configuration.

### What Changed:

1. **next.config.js**: Disabled `output: 'export'` to allow dynamic rendering
2. **firebase.json**: Updated public directory from `out` to `.next`
3. **Image optimization**: Re-enabled (was disabled for static export)

### Why This Was Needed:

Your app uses dynamic routes (`/petitions/[id]`) that fetch data from Firebase at runtime. Static export (`output: 'export'`) requires all pages to be pre-generated at build time, which doesn't work for dynamic petition data.

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is built for Next.js and handles dynamic rendering automatically:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd 3arida-app
vercel
```

### Option 2: Firebase Hosting + Cloud Functions

For Firebase hosting with dynamic routes, you need Cloud Functions:

```bash
# Install Firebase Functions
npm install -g firebase-tools
firebase init functions

# Deploy
npm run build
firebase deploy
```

Note: This requires additional setup for Next.js server-side rendering on Cloud Functions.

### Option 3: Static Export (Not Recommended)

If you absolutely need static export, you'd have to:

- Pre-generate all petition pages at build time
- Add `generateStaticParams()` to fetch all petition IDs
- Rebuild and redeploy whenever petitions change

This defeats the purpose of a dynamic petition platform.

## Current Status

✅ Development server will now work without errors
✅ Dynamic routes will load properly
⚠️ Need to choose deployment platform (Vercel recommended)

## Next Steps

1. Test locally: `npm run dev`
2. Choose deployment platform
3. Update environment variables for production
4. Deploy!
