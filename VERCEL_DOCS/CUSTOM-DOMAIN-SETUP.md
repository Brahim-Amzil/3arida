# Custom Domain Setup Guide

## Why Use a Custom Domain?

Instead of adding each Vercel preview URL to Firebase (which is tedious), use a custom domain. This way:

- ✅ One domain to add to Firebase
- ✅ Professional appearance
- ✅ No need to update Firebase for each deployment
- ✅ Better for SEO and branding

## Option 1: Use Your Own Domain (3arida.ma)

### Step 1: Add Domain to Vercel

1. Go to Vercel Dashboard
2. Select your project: **3arida-app**
3. Go to **Settings** > **Domains**
4. Click **Add**
5. Enter your domain: `3arida.ma`
6. Also add: `www.3arida.ma`

### Step 2: Update DNS Records

Vercel will show you DNS records to add. Go to your domain registrar and add:

**For apex domain (3arida.ma):**

```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Add Domain to Firebase

1. Go to Firebase Console
2. Authentication > Settings > Authorized domains
3. Add: `3arida.ma`
4. Add: `www.3arida.ma`

### Step 4: Update Environment Variables

```bash
cd 3arida-app

# Update the app URL
vercel env rm NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_APP_URL production
# Enter: https://3arida.ma

# Redeploy
vercel --prod
```

## Option 2: Use Vercel's Free Subdomain

If you don't have a custom domain yet, you can use Vercel's subdomain:

### Step 1: Set a Custom Vercel Subdomain

1. Go to Vercel Dashboard
2. Select your project
3. Settings > Domains
4. Add: `3arida.vercel.app` (or any available name)

### Step 2: Add to Firebase

1. Firebase Console > Authentication > Settings
2. Add domain: `3arida.vercel.app`

### Step 3: Update Environment Variables

```bash
vercel env rm NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_APP_URL production
# Enter: https://3arida.vercel.app

vercel --prod
```

## Option 3: Keep Using Preview URLs (Not Recommended)

If you want to keep using the auto-generated URLs:

### Get Your Current Deployment URLs

```bash
cd 3arida-app
./get-vercel-domains.sh
```

This will list all your deployment URLs. Add each one to Firebase manually.

### Add to Firebase

For each URL shown:

1. Go to Firebase Console
2. Authentication > Settings > Authorized domains
3. Click "Add domain"
4. Paste the domain (without https://)

Example domains to add:

```
3arida-bok2bebfn-brahims-projects-e03ddca5.vercel.app
3arida-pdsy9vb6a-brahims-projects-e03ddca5.vercel.app
3arida-cey1negn9-brahims-projects-e03ddca5.vercel.app
```

## Recommended: Custom Domain

For production, I strongly recommend Option 1 (custom domain):

**Benefits:**

- Professional: `3arida.ma` vs `3arida-xyz123.vercel.app`
- Stable: Domain doesn't change with each deployment
- Simple: One domain in Firebase, not dozens
- SEO: Better for search engines
- Trust: Users trust custom domains more

**Cost:**

- Domain registration: ~$10-15/year
- Vercel hosting: Free (for your usage level)

## Current Status

Right now you have:

- ✅ `3arida-bok2bebfn-brahims-projects-e03ddca5.vercel.app` added to Firebase
- ❌ No custom domain set up

**Next steps:**

1. Test login on current URL (should work now)
2. Decide on custom domain strategy
3. Set up custom domain (recommended)
4. Update Firebase and environment variables

## Testing

After setting up your domain:

```bash
# Test the domain
curl -I https://your-domain.com

# Test manifest
curl -I https://your-domain.com/manifest.json

# Test login
# Visit https://your-domain.com and try Google login
```

## Need Help?

If you need help with:

- Domain registration: Use Namecheap, Google Domains, or Cloudflare
- DNS setup: Your domain registrar has guides
- Vercel domain setup: https://vercel.com/docs/concepts/projects/domains
