# ✅ Petition Tier Upgrade System - READY TO TEST

## What's Been Implemented

### 1. Core Services ✅
- `src/lib/petition-upgrade-utils.ts` - Tier filtering & price calculations
- `src/lib/beta-coupon-service.ts` - Auto 100% discount during beta
- `src/lib/petition-upgrade-service.ts` - Firestore updates & error handling

### 2. UI Components ✅
- `src/components/petitions/PetitionUpgradeModal.tsx` - Upgrade tier selection modal
- `src/components/petitions/ReportSection.tsx` - **UPDATED** with modal integration
- `src/components/petitions/ReportDownloadButton.tsx` - Already has upgrade trigger

### 3. API Routes ✅
- `src/app/api/petitions/upgrade/route.ts` - Creates payment intent for upgrades
- `src/app/api/stripe/webhook/route.ts` - **UPDATED** to handle upgrade payments

### 4. Configuration ✅
- `.env.local` - Has `NEXT_PUBLIC_BETA_MODE=true`
- `messages/ar.json` - Has all upgrade translations

## How to Test

### Test 1: FREE → PAID Upgrade (Beta Mode)

1. **Create a FREE petition** or use an existing one
2. **Go to the petition page** where `ReportSection` is displayed
3. **Click "تحميل التقرير" (Download Report)** button
4. **You should see** the inline error: "تحميل التقارير غير متاح للعرائض المجانية"
5. **Click "يجب الترقية" (Upgrade Required)** button
6. **Modal opens** showing 4 paid tiers:
   - ستارتر (STARTER) - 69 درهم - 10,000 توقيع
   - برو (PRO) - 129 درهم - 30,000 توقيع
   - متقدم (ADVANCED) - 229 درهم - 75,000 توقيع
   - إنتربرايز (ENTERPRISE) - 369 درهم - 100,000 توقيع
7. **Select a tier** (e.g., STARTER)
8. **Click "متابعة إلى الدفع"**
9. **Since beta mode is ON**, you should see alert: "تمت الترقية بنجاح! (وضع البيتا - مجاني)"
10. **Page refreshes** and petition tier is updated
11. **Verify in Firestore**:
    - `petition.pricingTier` = 'basic' (STARTER)
    - `petition.signatureLimit` = 10000
    - `petition.upgradeHistory` has new entry
12. **Try downloading report again** - should work now!

### Test 2: PAID → PAID Upgrade

1. **Use a petition with STARTER tier** (10K limit)
2. **Click upgrade** (you'll need to add an upgrade button or reach signature limit)
3. **Modal shows** only higher tiers: PRO, ADVANCED, ENTERPRISE
4. **Select PRO** - should show "60 درهم" (129 - 69 difference)
5. **Complete upgrade** - tier updates to 'premium', limit to 30000

### Test 3: Check Beta Coupon Logging

1. **After any upgrade**, check Firestore collection `couponLogs`
2. **Should see entry** with:
   - `couponCode`: "BETA100"
   - `discountAmount`: original price
   - `originalAmount`: original price
   - `upgradeType`: "free-to-paid" or "paid-to-paid"

### Test 4: Failed Upgrade Handling

1. **Temporarily break Firestore** (e.g., wrong permissions)
2. **Attempt upgrade**
3. **Payment succeeds** but Firestore update fails
4. **Check `failedUpgrades` collection** - should have entry with:
   - `petitionId`
   - `paymentIntentId`
   - `targetTier`
   - `error` message
   - `resolved`: false

## Where to Find the Upgrade UI

The upgrade system is integrated in **`ReportSection`** component, which is used in:

1. **Petition dashboard** (if you have one)
2. **Petition detail page** (if ReportSection is imported there)
3. **Admin petition view** (if ReportSection is used)

To add it to any page:

```typescript
import { ReportSection } from '@/components/petitions/ReportSection';

// In your component:
<ReportSection petition={petition} userId={user.uid} />
```

## Troubleshooting

### Modal doesn't open
- Check browser console for errors
- Verify `PetitionUpgradeModal` is imported correctly
- Check that `onUpgrade` callback is wired up

### "Cannot find module" errors
- Restart your dev server: `npm run dev`
- Clear Next.js cache: `rm -rf .next`

### Upgrade doesn't update Firestore
- Check webhook logs in terminal
- Verify Stripe webhook is configured correctly
- Check `failedUpgrades` collection for errors
- Verify Firebase Admin SDK is initialized

### Beta coupon not applied
- Verify `NEXT_PUBLIC_BETA_MODE=true` in `.env.local`
- Restart dev server after changing env vars
- Check payment intent metadata in Stripe dashboard

## Production Checklist

Before going live:

1. ✅ Test all upgrade scenarios (FREE→PAID, PAID→PAID)
2. ✅ Test with beta mode ON (free upgrades)
3. ✅ Test with beta mode OFF (paid upgrades)
4. ✅ Verify Firestore updates work
5. ✅ Verify webhook handles upgrades
6. ✅ Check coupon logging works
7. ✅ Test failed upgrade handling
8. ✅ Update Firestore security rules for new collections
9. ✅ Set `NEXT_PUBLIC_BETA_MODE=false` when ready to charge
10. ✅ Monitor `failedUpgrades` collection regularly

## Database Collections

### New Collections:
- `couponLogs` - Tracks all coupon applications
- `failedUpgrades` - Tracks failed Firestore updates after successful payment

### Updated Fields in `petitions`:
- `lastUpgradeAt` - Timestamp of last upgrade
- `lastUpgradePaymentId` - Stripe payment intent ID
- `upgradeHistory` - Array of upgrade history entries

## Support

If you encounter issues:

1. Check browser console for errors
2. Check terminal for webhook logs
3. Check Firestore `failedUpgrades` collection
4. Check Stripe dashboard for payment intent metadata

The system is fully integrated and ready to test! 🚀
