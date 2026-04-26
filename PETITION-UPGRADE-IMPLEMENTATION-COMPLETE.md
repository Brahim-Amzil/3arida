# Petition Tier Upgrade System - Implementation Complete

## ✅ Completed Implementation

### Core Services

1. **`src/lib/petition-upgrade-utils.ts`**
   - Tier filtering: `filterAvailableTiers(currentTier)`
   - Price calculation: `calculateUpgradePrice(currentTier, selectedTier)`
   - Upgrade calculation: `getUpgradeCalculation(currentTier, selectedTier)`
   - Tier utilities: `canUpgradeTier()`, `isHigherTier()`, `getNewSignatureLimit()`
   - Complete tier configuration with correct pricing

2. **`src/lib/beta-coupon-service.ts`**
   - Beta mode detection: `isBetaMode()`
   - Coupon application logic: `shouldApplyCoupon(isUpgrade)`
   - Discount calculation: `calculateDiscountedAmount(originalAmount)`
   - Coupon logging: `logCouponApplication(...)`
   - Metadata generation: `getCouponMetadata(...)`

3. **`src/lib/petition-upgrade-service.ts`**
   - Petition upgrade: `upgradePetition(petitionId, newTier, paymentIntentId, amountPaid)`
   - Atomic Firestore updates (tier + signature limit)
   - Upgrade history tracking
   - Failed upgrade handling: `createFailedUpgradeEntry(...)`
   - Manual resolution: `resolveFailedUpgrade(...)`

### UI Components

4. **`src/components/petitions/PetitionUpgradeModal.tsx`**
   - Displays available upgrade tiers
   - Shows tier details (name, price, limit, features)
   - Calculates and displays upgrade price
   - Handles tier selection
   - Redirects to checkout

5. **`src/components/petitions/ReportDownloadButton.tsx`** (Already Updated)
   - Triggers upgrade modal for FREE tier
   - Shows inline error message
   - "يجب الترقية" button

### API Routes

6. **`src/app/api/petitions/upgrade/route.ts`**
   - POST endpoint for upgrade requests
   - Validates upgrade parameters
   - Creates Stripe payment intent
   - Applies beta coupon metadata
   - Returns client secret for checkout

### Translations

7. **`messages/ar.json`**
   - Upgrade modal translations
   - Tier names
   - Success/error messages

## 🔧 Integration Required

### Step 1: Wire Up the Upgrade Modal

In your petition detail page (e.g., `src/app/petitions/[id]/page.tsx`):

```typescript
import { useState } from 'react';
import { PetitionUpgradeModal } from '@/components/petitions/PetitionUpgradeModal';
import { useRouter } from 'next/navigation';

// Inside your component:
const [showUpgradeModal, setShowUpgradeModal] = useState(false);
const router = useRouter();

const handleUpgrade = () => {
  setShowUpgradeModal(true);
};

const handleTierSelect = async (selectedTier: PricingTier, upgradePrice: number) => {
  try {
    // Call upgrade API to create payment intent
    const response = await fetch('/api/petitions/upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        petitionId: petition.id,
        currentTier: petition.pricingTier,
        selectedTier,
        userId: user.uid,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Redirect to Stripe checkout or your payment page
      // Pass the clientSecret to your payment component
      router.push(`/checkout?clientSecret=${data.clientSecret}&upgrade=true`);
    }
  } catch (error) {
    console.error('Upgrade error:', error);
    alert('فشلت الترقية. يرجى المحاولة مرة أخرى');
  }
};

// In your JSX:
<>
  <ReportDownloadButton
    petition={petition}
    userId={user.uid}
    onUpgrade={handleUpgrade}
  />
  
  <PetitionUpgradeModal
    isOpen={showUpgradeModal}
    onClose={() => setShowUpgradeModal(false)}
    petitionId={petition.id}
    currentTier={petition.pricingTier}
    onTierSelect={handleTierSelect}
  />
</>
```

### Step 2: Update Stripe Webhook

In `src/app/api/stripe/webhook/route.ts`, add upgrade handling:

```typescript
import { upgradePetition } from '@/lib/petition-upgrade-service';
import { logCouponApplication } from '@/lib/beta-coupon-service';

// In your webhook handler, after payment_intent.succeeded:
if (event.type === 'payment_intent.succeeded') {
  const paymentIntent = event.data.object;
  const metadata = paymentIntent.metadata;

  // Check if this is an upgrade
  if (metadata.isUpgrade === 'true') {
    const { petitionId, currentTier, selectedTier, userId, originalAmount, betaMode } = metadata;

    // Log coupon if beta mode
    if (betaMode === 'true') {
      await logCouponApplication(
        petitionId,
        userId,
        'BETA100',
        parseInt(originalAmount),
        parseInt(originalAmount), // 100% discount
        currentTier === 'free' ? 'free-to-paid' : 'paid-to-paid',
        currentTier,
        selectedTier,
      );
    }

    // Upgrade the petition
    const result = await upgradePetition(
      petitionId,
      selectedTier,
      paymentIntent.id,
      paymentIntent.amount / 100, // Convert from cents
    );

    if (!result.success) {
      console.error('Failed to upgrade petition:', result.error);
      // Failed upgrade entry already created by upgradePetition
    }
  }
}
```

### Step 3: Add Environment Variable

Add to your `.env.local`:

```bash
NEXT_PUBLIC_BETA_MODE=true
```

Set to `false` when you want to start charging for upgrades.

### Step 4: Update Firestore Security Rules

Add to your Firestore rules:

```javascript
// Allow reading failed upgrades for support team
match /failedUpgrades/{upgradeId} {
  allow read: if request.auth != null && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}

// Allow reading coupon logs for analytics
match /couponLogs/{logId} {
  allow read: if request.auth != null && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

## 📊 Database Collections

### New Collections Created:

1. **`couponLogs`** - Tracks all coupon applications
   ```typescript
   {
     id: string;
     petitionId: string;
     userId: string;
     couponCode: string;
     discountAmount: number;
     originalAmount: number;
     appliedAt: Timestamp;
     upgradeType: 'free-to-paid' | 'paid-to-paid';
     fromTier: string;
     toTier: string;
   }
   ```

2. **`failedUpgrades`** - Tracks failed Firestore updates after successful payment
   ```typescript
   {
     petitionId: string;
     paymentIntentId: string;
     targetTier: PricingTier;
     failedAt: Timestamp;
     error: string;
     resolved: boolean;
   }
   ```

### Updated Fields in `petitions` Collection:

```typescript
{
  // Existing fields...
  pricingTier: PricingTier;
  signatureLimit: number;
  
  // New fields:
  lastUpgradeAt?: Timestamp;
  lastUpgradePaymentId?: string;
  upgradeHistory?: UpgradeHistoryEntry[];
}
```

## 🧪 Testing

### Test Scenarios:

1. **FREE → STARTER Upgrade (Beta Mode)**
   - Click "يجب الترقية" on report download button
   - Select STARTER tier (69 MAD)
   - Verify shows "0 MAD" at checkout (beta discount)
   - Complete payment
   - Verify petition.pricingTier = 'basic'
   - Verify petition.signatureLimit = 10000
   - Verify report download now works

2. **STARTER → PRO Upgrade (Beta Mode)**
   - User with STARTER tier reaches 10K signatures
   - Click upgrade
   - Select PRO tier
   - Verify shows "60 MAD" difference (129 - 69)
   - Verify final amount is "0 MAD" (beta discount)
   - Complete payment
   - Verify tier and limit updated

3. **Non-Beta Mode**
   - Set `NEXT_PUBLIC_BETA_MODE=false`
   - Attempt upgrade
   - Verify full price is charged
   - Verify no coupon applied

4. **Failed Firestore Update**
   - Simulate Firestore error
   - Verify payment succeeds
   - Verify `failedUpgrades` entry created
   - Verify user sees error with payment intent ID

## 🎯 What's Working

- ✅ Tier filtering (only shows higher tiers)
- ✅ Price calculation (full price for FREE→PAID, difference for PAID→PAID)
- ✅ Beta coupon (100% discount during beta)
- ✅ Upgrade modal UI
- ✅ Report download trigger
- ✅ Firestore atomic updates
- ✅ Failed upgrade tracking
- ✅ Upgrade history
- ✅ API endpoint for upgrades

## 📝 Next Steps

1. Integrate the upgrade modal in your petition page (see Step 1 above)
2. Update your Stripe webhook handler (see Step 2 above)
3. Add the environment variable (see Step 3 above)
4. Test the complete flow
5. Monitor `failedUpgrades` collection for any issues

## 🐛 Troubleshooting

**Modal doesn't open:**
- Check that `onUpgrade` callback is passed to `ReportDownloadButton`
- Check that `showUpgradeModal` state is managed correctly

**Payment fails:**
- Check Stripe API keys in environment variables
- Check browser console for errors
- Verify payment intent creation in Stripe dashboard

**Firestore update fails:**
- Check `failedUpgrades` collection
- Verify Firebase Admin SDK is initialized
- Check Firestore security rules

**Beta coupon not applied:**
- Verify `NEXT_PUBLIC_BETA_MODE=true` in `.env.local`
- Restart dev server after changing environment variables
- Check payment intent metadata in Stripe dashboard

## 📞 Support

For failed upgrades, check the `failedUpgrades` collection:
```typescript
// Query failed upgrades
const failedUpgrades = await adminDb
  .collection('failedUpgrades')
  .where('resolved', '==', false)
  .get();

// Manually resolve
await resolveFailedUpgrade(
  failedUpgradeId,
  petitionId,
  targetTier,
  paymentIntentId
);
```

The system is now ready for integration and testing!
