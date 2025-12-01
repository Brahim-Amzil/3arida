# reCAPTCHA v3 - Quick Start (5 Minutes)

## ✅ What You Get

- **100% Invisible** - Users never see it
- **Zero Friction** - No clicking, no puzzles
- **90%+ Bot Protection** - Automatic detection
- **FREE** - 1 million requests/month

## 🚀 Setup (3 Steps)

### Step 1: Get Keys (2 minutes)

1. Go to: https://www.google.com/recaptcha/admin/create
2. Fill in:
   - **Label**: `3arida Platform`
   - **Type**: Select **reCAPTCHA v3** ⚠️ (NOT v2!)
   - **Domains**:
     - `localhost`
     - `3arida.ma`
3. Click **Submit**
4. Copy both keys (Site Key + Secret Key)

### Step 2: Add Keys (1 minute)

Open `3arida-app/.env.local` and add:

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RECAPTCHA_SECRET_KEY=6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Test (2 minutes)

```bash
# Check configuration
node test-recaptcha.js

# Start dev server
npm run dev

# Go to any petition and click "Sign Petition"
# Check browser console for: ✅ reCAPTCHA passed with score: 0.9
```

## ✅ Done!

That's it! reCAPTCHA v3 is now protecting your petition signatures.

## 📊 Monitor

View stats at: https://www.google.com/recaptcha/admin

## 🆘 Need Help?

See full guide: [`RECAPTCHA-SETUP.md`](./RECAPTCHA-SETUP.md)
