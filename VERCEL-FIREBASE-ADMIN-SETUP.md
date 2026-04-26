# Vercel Firebase Admin SDK Setup

**Issue:** Appeals system works locally but fails on Vercel deployment with 500 errors.

**Root Cause:** Firebase Admin SDK requires service account credentials which aren't configured on Vercel.

---

## Quick Fix: Add Service Account to Vercel

### Step 1: Get Your Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `arida-c5faf`
3. Click the gear icon ⚙️ → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file

### Step 2: Prepare the Key for Vercel

The JSON file looks like this:

```json
{
  "type": "service_account",
  "project_id": "arida-c5faf",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-...@arida-c5faf.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

**Important:** You need to convert this to a single-line string for Vercel.

### Step 3: Convert to Single Line

Use this command to convert the JSON to a single line:

```bash
cat path/to/your-service-account.json | jq -c
```

Or manually: Remove all newlines and extra spaces, keeping it as one line.

### Step 4: Add to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `3arida-app` or `3arida26`
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `FIREBASE_SERVICE_ACCOUNT_KEY`
   - **Value:** Paste the single-line JSON string
   - **Environment:** Select all (Production, Preview, Development)
5. Click **Save**

#### Option B: Via Vercel CLI

```bash
# Make sure you're in the project directory
cd /path/to/3arida-app

# Add the environment variable
vercel env add FIREBASE_SERVICE_ACCOUNT_KEY production

# Paste the single-line JSON when prompted
# Press Enter

# Also add for preview and development
vercel env add FIREBASE_SERVICE_ACCOUNT_KEY preview
vercel env add FIREBASE_SERVICE_ACCOUNT_KEY development
```

### Step 5: Redeploy

After adding the environment variable, trigger a new deployment:

#### Option A: Push to Git (Easiest)

```bash
git commit --allow-empty -m "trigger redeploy with service account"
git push origin main
```

#### Option B: Via Vercel Dashboard

1. Go to your project in Vercel
2. Go to **Deployments** tab
3. Click the three dots ⋯ on the latest deployment
4. Click **Redeploy**

---

## Verification

After redeployment, test these features:

1. **Create Appeal** - Should work ✅
2. **View Appeals List** - Should work ✅
3. **View Appeal Details** - Should work ✅
4. **Admin Appeals Dashboard** - Should work ✅

---

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit the service account JSON to git**
   - Already in `.gitignore`
   - Keep it secure

2. **Rotate keys periodically**
   - Generate new keys every 90 days
   - Delete old keys from Firebase Console

3. **Limit permissions**
   - Service account has full Firebase access
   - Consider creating a custom service account with limited permissions

---

## Alternative: Use Client SDK Only (Current Workaround)

If you don't want to set up Admin SDK, the current code already creates appeals using client SDK:

**Pros:**

- ✅ No service account needed
- ✅ Works with Firestore security rules
- ✅ Appeals creation works

**Cons:**

- ❌ Can't fetch appeals via API (needs Admin SDK)
- ❌ Admin dashboard can't load appeals
- ❌ Appeal details page fails

**To use client SDK only**, you would need to:

1. Update all appeals API routes to use client SDK
2. Fetch appeals directly from components using client SDK
3. Remove API route dependencies

---

## Recommended Solution

**Use Admin SDK with service account** - This is the proper production setup and will make everything work correctly.

1. Add `FIREBASE_SERVICE_ACCOUNT_KEY` to Vercel (5 minutes)
2. Redeploy (2 minutes)
3. Test (2 minutes)

**Total time:** ~10 minutes

---

## Troubleshooting

### Error: "Failed to parse service account"

- Make sure the JSON is valid
- Check that it's a single line with no extra spaces
- Verify all quotes are properly escaped

### Error: "Permission denied"

- Service account might not have correct permissions
- Go to Firebase Console → IAM & Admin
- Ensure service account has "Firebase Admin SDK Administrator Service Agent" role

### Still not working?

- Check Vercel deployment logs
- Look for Firebase Admin initialization errors
- Verify environment variable is set correctly

---

**Status:** Waiting for service account setup  
**Priority:** High (blocks appeals system on production)  
**Estimated Fix Time:** 10 minutes
