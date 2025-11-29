# Firebase Unauthorized Domain Fix

## Error

```
FirebaseError: Firebase: Error (auth/unauthorized-domain)
```

This means your Vercel deployment domain is not authorized in Firebase.

## Quick Fix

### Step 1: Add Vercel Domain to Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **arida-c5faf**
3. Go to **Authentication** > **Settings** > **Authorized domains**
4. Click **Add domain**
5. Add these domains:

```
3arida-pdsy9vb6a-brahims-projects-e03ddca5.vercel.app
3arida-cey1negn9-brahims-projects-e03ddca5.vercel.app
```

6. Also add the wildcard for all preview deployments:

```
*.vercel.app
```

### Step 2: Wait 1-2 Minutes

Firebase needs a moment to propagate the changes.

### Step 3: Test Login

1. Hard refresh your browser (Cmd+Shift+R / Ctrl+Shift+R)
2. Try Google login again

## Alternative: Use Custom Domain

If you have a custom domain (like 3arida.ma):

1. Add it to Vercel: Project Settings > Domains
2. Add it to Firebase authorized domains
3. Update `NEXT_PUBLIC_APP_URL` environment variable

## Manifest 401 Issue

The manifest.json 401 error is likely due to Vercel's authentication middleware.

### Fix: Update middleware.ts

The middleware might be blocking public files. Check if `/manifest.json` is excluded.

## Complete Checklist

- [ ] Add Vercel domain to Firebase authorized domains
- [ ] Add `*.vercel.app` wildcard to Firebase
- [ ] Wait 1-2 minutes for propagation
- [ ] Hard refresh browser
- [ ] Test Google login
- [ ] Check manifest.json loads (visit /manifest.json directly)

## If Still Not Working

### Check Firebase Console

1. Authentication > Settings > Authorized domains
2. Verify your domain is listed
3. Make sure there are no typos

### Check Vercel Domain

```bash
# Get your current Vercel domain
vercel ls
```

### Check Browser Console

Look for the exact domain in the error message and add that specific one.

## Common Mistakes

❌ **Wrong domain format:**

- Don't include `https://`
- Don't include trailing `/`
- Just the domain: `your-app.vercel.app`

✅ **Correct format:**

```
3arida-pdsy9vb6a-brahims-projects-e03ddca5.vercel.app
```

## Wildcard Domains

For preview deployments, add:

```
*.vercel.app
```

This covers all your preview URLs automatically.
