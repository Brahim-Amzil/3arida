# Setting Up 3arida.vercel.app

## Quick Setup Guide

### Step 1: Add Domain in Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **3arida-app**
3. Click **Settings** > **Domains**
4. Click **Add** button
5. Enter: `3arida.vercel.app`
6. Click **Add**

Vercel will automatically configure this domain for you.

### Step 2: Verify Firebase Authorization

You already added `3arida.vercel.app` to Firebase - great! ✅

To double-check:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **arida-c5faf**
3. **Authentication** > **Settings** > **Authorized domains**
4. Confirm `3arida.vercel.app` is in the list

### Step 3: Update Environment Variable

```bash
cd 3arida-app

# Remove old URL
vercel env rm NEXT_PUBLIC_APP_URL production

# Add new URL
vercel env add NEXT_PUBLIC_APP_URL production
# When prompted, enter: https://3arida.vercel.app
```

### Step 4: Deploy

```bash
vercel --prod --force
```

## Or Use the Automated Script

```bash
cd 3arida-app
./setup-vercel-subdomain.sh
```

## After Setup

Your app will be available at:

- **Staging/Testing:** https://3arida.vercel.app
- **Production (later):** https://3arida.ma

### Benefits of This Setup

✅ **Clean URL:** `3arida.vercel.app` instead of random hashes
✅ **Stable:** Domain doesn't change with each deployment
✅ **One Firebase domain:** No need to add multiple URLs
✅ **Private testing:** Not indexed by search engines yet
✅ **Easy transition:** When ready, just point 3arida.ma to Vercel

## Testing Checklist

After deployment:

- [ ] Visit https://3arida.vercel.app
- [ ] Check homepage loads
- [ ] Test Google login
- [ ] Test email/password login
- [ ] Create a test petition
- [ ] Sign a petition
- [ ] Check manifest.json: https://3arida.vercel.app/manifest.json
- [ ] Check privacy page: https://3arida.vercel.app/privacy

## When Ready for Production

When you're ready to go live with 3arida.ma:

### Option A: Point Domain to Vercel (Recommended)

1. In Vercel Dashboard, add `3arida.ma` as a domain
2. Update your DNS records at your registrar
3. Add `3arida.ma` to Firebase authorized domains
4. Update `NEXT_PUBLIC_APP_URL` to `https://3arida.ma`
5. Deploy

### Option B: Redirect (Not Recommended)

You mentioned "forwarding" 3arida.ma to 3arida.vercel.app. This works but:

- ❌ Users see `3arida.vercel.app` in their browser
- ❌ Not good for branding
- ❌ Not good for SEO

Instead, use Option A to keep `3arida.ma` in the URL bar.

## Current Status

- ✅ Firebase has `3arida.vercel.app` authorized
- ⏳ Need to add domain in Vercel Dashboard
- ⏳ Need to update environment variable
- ⏳ Need to deploy

## Next Steps

1. Add `3arida.vercel.app` in Vercel Dashboard (Settings > Domains)
2. Run the setup script or follow manual steps above
3. Test everything on https://3arida.vercel.app
4. When satisfied, switch to 3arida.ma for production
