# MVP to Paid Version Migration Guide

**Last Updated:** February 4, 2026  
**Platform:** 3arida.ma - Moroccan Petition Platform

---

## 🎯 Overview

This guide documents how to switch between **FREE MVP** and **FULL PAID** versions of the platform using feature flags. The same codebase and database are used for both versions.

---

## 🚀 Quick Switch (2 Minutes)

### Switch to PAID Version

1. **On Vercel:**
   - Go to Project Settings → Environment Variables
   - Change `NEXT_PUBLIC_MVP_MODE` from `true` to `false`
   - Redeploy (or wait for auto-deploy)

2. **Locally:**
   - Update `.env.local`:
     ```bash
     NEXT_PUBLIC_MVP_MODE=false
     ```
   - Restart dev server: `npm run dev`

3. **Done!** All paid features are now active.

### Switch Back to MVP

1. Change `NEXT_PUBLIC_MVP_MODE` back to `true`
2. Redeploy
3. Done!

---

## 📋 What Changes Between Versions

### MVP Mode (NEXT_PUBLIC_MVP_MODE=true)

| Feature               | Status   | Details                      |
| --------------------- | -------- | ---------------------------- |
| **Navigation**        | Modified | "Influencers" link hidden    |
| **Pricing Page**      | Replaced | Shows MVP pricing (all free) |
| **Payments**          | Disabled | No Stripe/PayPal             |
| **Tier Restrictions** | Disabled | All features free            |
| **Coupons**           | Disabled | No discount system           |
| **Signature Limit**   | 10,000   | Per petition                 |
| **Image Limit**       | 3        | Per petition                 |
| **Upgrade Modals**    | Hidden   | No upsell prompts            |

### Paid Mode (NEXT_PUBLIC_MVP_MODE=false)

| Feature               | Status  | Details                                |
| --------------------- | ------- | -------------------------------------- |
| **Navigation**        | Full    | All links visible                      |
| **Pricing Page**      | Full    | Shows all tiers                        |
| **Payments**          | Enabled | Stripe + PayPal                        |
| **Tier Restrictions** | Enabled | Free/Basic/Premium/Advanced/Enterprise |
| **Coupons**           | Enabled | Influencer discounts                   |
| **Signature Limit**   | Tiered  | 2.5K - 100K based on tier              |
| **Image Limit**       | Tiered  | 1-5 based on tier                      |
| **Upgrade Modals**    | Active  | Upsell to paid tiers                   |

---

## 🗂️ Files Modified for Feature Flags

### Core Feature Flag System

```
src/lib/feature-flags.ts
```

**Purpose:** Central feature flag logic  
**Functions:**

- `isMVPMode()` - Check if MVP mode is active
- `isPaymentsEnabled()` - Check if payments are enabled
- `isTiersEnabled()` - Check if tier restrictions apply
- `isInfluencersEnabled()` - Check if influencer program is active
- `isCouponsEnabled()` - Check if coupon system is active
- `getMVPMaxSignatures()` - Get MVP signature limit (10,000)
- `getMVPMaxImages()` - Get MVP image limit (3)

### Modified Components

#### 1. Header Navigation

```
src/components/layout/Header.tsx
```

**Changes:**

- Import `isInfluencersEnabled()` from feature-flags
- Wrap influencers link in conditional: `{isInfluencersEnabled() && <Link>}`
- Applied to both desktop and mobile navigation

**Code:**

```typescript
{isInfluencersEnabled() && (
  <Link href="/influencers">
    <span className="text-lg">🌟</span>
    {t('nav.influencers')}
  </Link>
)}
```

#### 2. Pricing Page

```
src/app/pricing/page.tsx
src/app/pricing/mvp-page.tsx (NEW)
```

**Changes:**

- Import `isMVPMode()` from feature-flags
- Conditionally render MVP or paid pricing page
- MVP page shows all features as free
- Paid page shows full tier system

**Code:**

```typescript
export default function PricingPage() {
  if (isMVPMode()) {
    return <MVPPricingPage />;
  }
  // ... render paid pricing
}
```

---

## 🔧 Environment Variables

### MVP Configuration (.env.mvp.example)

```bash
# Master switch - enables MVP mode
NEXT_PUBLIC_MVP_MODE=true

# These are auto-disabled in MVP mode
NEXT_PUBLIC_ENABLE_PAYMENTS=false
NEXT_PUBLIC_ENABLE_TIERS=false
NEXT_PUBLIC_SHOW_PRICING_PAGE=false
NEXT_PUBLIC_ENABLE_COUPONS=false

# Influencers can work in MVP (no coupons though)
NEXT_PUBLIC_ENABLE_INFLUENCERS=true

# Firebase config (same for both)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# ... etc

# Payment keys NOT needed in MVP
# STRIPE_SECRET_KEY=not_needed
# PAYPAL_CLIENT_ID=not_needed
```

### Paid Configuration (.env.paid.example)

```bash
# Master switch - disables MVP mode
NEXT_PUBLIC_MVP_MODE=false

# All features enabled
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_ENABLE_TIERS=true
NEXT_PUBLIC_SHOW_PRICING_PAGE=true
NEXT_PUBLIC_ENABLE_INFLUENCERS=true
NEXT_PUBLIC_ENABLE_COUPONS=true

# Firebase config (same for both)
NEXT_PUBLIC_FIREBASE_API_KEY=...
# ... etc

# Payment keys REQUIRED in paid mode
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

---

## 💾 Database Compatibility

### Petitions Collection

**MVP Petitions:**

```javascript
{
  id: "petition123",
  title: "My Petition",
  pricingTier: "free",  // All MVP petitions are "free"
  targetSignatures: 10000,  // MVP max
  paymentStatus: null,  // No payment in MVP
  // ... other fields
}
```

**Paid Petitions:**

```javascript
{
  id: "petition456",
  title: "My Paid Petition",
  pricingTier: "premium",  // Can be free/basic/premium/advanced/enterprise
  targetSignatures: 30000,
  paymentStatus: "paid",
  amountPaid: 129,
  paymentId: "pi_xxx",
  // ... other fields
}
```

### Migration Notes

✅ **No migration needed!** Both petition types coexist in the same database.

- MVP petitions have `pricingTier: "free"`
- When switching to paid, old petitions continue working
- New petitions can be any tier
- All signatures, comments, updates preserved

---

## 🎨 UI/UX Changes

### Hidden in MVP Mode

1. **Influencers Link** - Removed from header navigation
2. **Upgrade Modals** - No upsell prompts
3. **Tier Badges** - No "Starter", "Pro", etc. labels
4. **Payment Forms** - Stripe/PayPal components hidden
5. **Coupon Input** - Discount code field hidden
6. **Pricing Tiers** - Replaced with simple "Free Beta" page

### Modified in MVP Mode

1. **Pricing Page** - Shows "Free Beta" instead of tiers
2. **Petition Creation** - No payment step
3. **Dashboard** - No tier-based restrictions
4. **Admin Panel** - No coupon management

---

## 🧪 Testing Both Versions

### Local Testing

**Terminal 1 - MVP Version:**

```bash
# Create .env.local with MVP config
cp .env.mvp.example .env.local
npm run dev
# Visit http://localhost:3000
```

**Terminal 2 - Paid Version:**

```bash
# Create .env.paid.local
cp .env.paid.example .env.paid.local
# Edit package.json to add:
# "dev:paid": "next dev -p 3001"
npm run dev:paid
# Visit http://localhost:3001
```

### Vercel Testing

**Option 1: Two Deployments**

- Main branch → MVP mode (production)
- Paid branch → Paid mode (preview)

**Option 2: Environment-Based**

- Production → MVP mode
- Preview → Paid mode (for testing)

---

## 📊 Feature Flag Reference

### Available Functions

```typescript
import {
  isMVPMode,
  isPaymentsEnabled,
  isTiersEnabled,
  shouldShowPricingPage,
  isInfluencersEnabled,
  isCouponsEnabled,
  getMVPMaxSignatures,
  getMVPMaxImages,
  isFeatureLocked,
  getDisplayMode,
  getMVPBannerMessage,
  logFeatureFlags,
} from '@/lib/feature-flags';
```

### Usage Examples

```typescript
// Hide payment button in MVP
{isPaymentsEnabled() && (
  <StripePayment />
)}

// Show different limits
const maxImages = isMVPMode()
  ? getMVPMaxImages()  // 3 in MVP
  : getMaxImages(tier);  // 1-5 based on tier

// Check if feature is locked
if (isFeatureLocked('appeals', tier)) {
  return <UpgradeModal />;
}

// Debug current config
useEffect(() => {
  logFeatureFlags();
}, []);
```

---

## 🚨 Important Notes

### DO NOT Delete Code

❌ **Never delete paid feature code!** It's just hidden, not removed.

The feature flag approach means:

- All code stays in the codebase
- Features are conditionally rendered
- Easy to switch back and forth
- No risk of losing functionality

### Database Safety

✅ **Same database for both versions**

- MVP petitions: `pricingTier: "free"`
- Paid petitions: `pricingTier: "basic"/"premium"/etc.`
- Both types coexist peacefully
- No data loss when switching

### Payment Keys

⚠️ **In MVP mode, payment keys are optional**

- Stripe/PayPal keys not needed
- Payment routes won't be called
- No risk of accidental charges

---

## 📞 Rollback Plan

### If Something Goes Wrong

1. **Immediate Rollback:**

   ```bash
   # On Vercel
   NEXT_PUBLIC_MVP_MODE=true
   # Redeploy
   ```

2. **Check Logs:**

   ```bash
   # In browser console
   logFeatureFlags();
   ```

3. **Verify Database:**
   - All petitions should still exist
   - Check `pricingTier` field
   - Verify signatures intact

---

## ✅ Pre-Launch Checklist

### Before Switching to Paid

- [ ] Test payment flows (Stripe + PayPal)
- [ ] Verify all tier restrictions work
- [ ] Test coupon system
- [ ] Check upgrade modals display correctly
- [ ] Verify pricing page shows all tiers
- [ ] Test influencer program
- [ ] Confirm old MVP petitions still work
- [ ] Check admin panel for paid features

### Before Switching to MVP

- [ ] Verify influencers link hidden
- [ ] Check MVP pricing page displays
- [ ] Confirm no payment prompts
- [ ] Test petition creation (no payment step)
- [ ] Verify 10K signature limit
- [ ] Check 3 image limit
- [ ] Confirm all features free

---

## 📚 Additional Resources

### Related Documentation

- `src/lib/feature-flags.ts` - Feature flag implementation
- `.env.mvp.example` - MVP environment template
- `.env.paid.example` - Paid environment template
- `PROJECT-STATUS-FEB-2026.md` - Current platform status
- `PENDING-FEATURES.md` - Future features

### Support

- **Technical Issues:** Check feature flag logs
- **Database Issues:** All data preserved, no migration needed
- **Payment Issues:** Only in paid mode, MVP unaffected

---

## 🎯 Summary

**Switching is simple:**

1. Change one environment variable
2. Redeploy
3. Done!

**Data is safe:**

- Same database for both versions
- No migration needed
- All petitions preserved

**Code is preserved:**

- Nothing deleted
- Just conditionally hidden
- Easy to switch back

**This approach gives you:**

- ✅ Risk-free MVP launch
- ✅ Easy switch to paid version
- ✅ No data loss
- ✅ Flexible testing
- ✅ Gradual feature rollout

---

**Status:** 🟢 READY FOR MVP LAUNCH  
**Next Step:** Set `NEXT_PUBLIC_MVP_MODE=true` and deploy!
