# MVP ↔️ Paid Version - Quick Reference Card

## 🚀 Switch to Paid Version (2 Minutes)

```bash
# On Vercel
NEXT_PUBLIC_MVP_MODE=false

# Redeploy → Done!
```

## 🔙 Switch Back to MVP

```bash
# On Vercel
NEXT_PUBLIC_MVP_MODE=true

# Redeploy → Done!
```

---

## 📊 What's Different?

| Feature              | MVP Mode     | Paid Mode          |
| -------------------- | ------------ | ------------------ |
| **Influencers Link** | ❌ Hidden    | ✅ Visible         |
| **Pricing Page**     | 🆓 Free Beta | 💰 Full Tiers      |
| **Payments**         | ❌ Disabled  | ✅ Stripe + PayPal |
| **Signature Limit**  | 10,000       | 2.5K - 100K        |
| **Image Limit**      | 3            | 1 - 5              |
| **Coupons**          | ❌ Disabled  | ✅ Enabled         |
| **Upgrade Modals**   | ❌ Hidden    | ✅ Active          |

---

## 📁 Modified Files

### Core System

- `src/lib/feature-flags.ts` - Feature flag logic

### Components

- `src/components/layout/Header.tsx` - Hide influencers link
- `src/app/pricing/page.tsx` - Conditional pricing
- `src/app/pricing/mvp-page.tsx` - MVP pricing page

### Config

- `.env.mvp.example` - MVP environment template
- `.env.paid.example` - Paid environment template

---

## 💾 Database

**No migration needed!**

- MVP petitions: `pricingTier: "free"`
- Paid petitions: `pricingTier: "basic"/"premium"/etc.`
- Both coexist in same database
- All data preserved when switching

---

## 🧪 Test Locally

```bash
# MVP Version
cp .env.mvp.example .env.local
npm run dev

# Paid Version
cp .env.paid.example .env.local
npm run dev
```

---

## 🔍 Debug

```typescript
// In browser console
import { logFeatureFlags } from '@/lib/feature-flags';
logFeatureFlags();
```

---

## ⚠️ Important

- ✅ Never delete paid feature code
- ✅ Same database for both versions
- ✅ Payment keys optional in MVP
- ✅ Easy to switch back and forth

---

## 📚 Full Documentation

See `MVP-TO-PAID-MIGRATION-GUIDE.md` for complete details.
