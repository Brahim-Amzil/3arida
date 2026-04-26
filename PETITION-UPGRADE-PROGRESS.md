# Petition Tier Upgrade System - Implementation Progress

## Completed Tasks ✅

### 1. Infrastructure Setup
- ✅ Created `src/lib/petition-upgrade-utils.ts`
  - Tier filtering function (`filterAvailableTiers`)
  - Price calculation function (`calculateUpgradePrice`)
  - Upgrade calculation utilities
  - Complete tier configuration with correct pricing

### 2. UI Components
- ✅ Created `src/components/petitions/PetitionUpgradeModal.tsx`
  - Modal displays available upgrade tiers
  - Shows tier details (name, price, signature limit, features)
  - Calculates and displays upgrade price
  - Handles tier selection

- ✅ Updated `src/components/petitions/ReportDownloadButton.tsx`
  - Already has upgrade trigger for FREE tier
  - Shows inline error message
  - "يجب الترقية" button calls onUpgrade callback

### 3. Translations
- ✅ Added upgrade translations to `messages/ar.json`
  - Modal translations
  - Tier names
  - Success/error messages

## Remaining Tasks 📋

### Critical Path (Must Complete):

1. **Checkout Flow Integration** (Task 5)
   - Modify `PetitionPayment` component to accept upgrade parameters
   - Update Stripe payment intent creation API
   - Pass upgrade metadata (petition ID, current tier, selected tier)

2. **Beta Coupon Service** (Task 6)
   - Create `src/lib/beta-coupon-service.ts`
   - Auto-apply 100% coupon during beta mode
   - Integrate with Stripe payment intent

3. **Firestore Update Service** (Task 8)
   - Create `src/lib/petition-upgrade-service.ts`
   - Update petition tier and signature limit atomically
   - Handle errors with `failedUpgrades` collection

4. **Webhook Handler** (Task 9)
   - Update Stripe webhook to detect upgrade payments
   - Call PetitionUpgradeService on success
   - Handle Firestore update failures

5. **Feature Enablement** (Task 10)
   - Update UI after upgrade
   - Show success message
   - Enable tier-specific features

### Optional Tasks (Can Skip for MVP):

- Property-based tests (Tasks 1.1, 1.2, 2.2, etc.)
- Signature limit alert component (Task 3.2)
- Manual upgrade button in dashboard (Task 3.5)
- Upgrade history tracking (Task 11)

## Next Steps

### Option 1: Continue Implementation
Ask me to continue with Task 5 (Checkout Flow Integration)

### Option 2: Test Current Progress
1. Import `PetitionUpgradeModal` in your petition page
2. Wire up the `onUpgrade` callback from `ReportDownloadButton`
3. Test the modal display and tier selection

### Option 3: Quick Integration
I can create a minimal working version that:
1. Shows the upgrade modal when clicking "يجب الترقية"
2. Redirects to pricing page with upgrade context
3. Handles payment and updates Firestore

## Current State

**What Works:**
- Tier filtering logic
- Price calculations (FREE→PAID full price, PAID→PAID difference)
- Upgrade modal UI
- Report download button trigger

**What's Missing:**
- Checkout integration
- Payment processing
- Firestore updates
- Success/error handling

## Integration Example

```typescript
// In your petition page component
import { PetitionUpgradeModal } from '@/components/petitions/PetitionUpgradeModal';

const [showUpgradeModal, setShowUpgradeModal] = useState(false);

const handleUpgrade = () => {
  setShowUpgradeModal(true);
};

const handleTierSelect = (selectedTier: PricingTier, upgradePrice: number) => {
  // Redirect to checkout with upgrade params
  router.push(`/checkout?upgrade=true&petitionId=${petition.id}&tier=${selectedTier}&price=${upgradePrice}`);
};

return (
  <>
    <ReportDownloadButton
      petition={petition}
      userId={userId}
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
);
```

Would you like me to:
1. Continue with the remaining tasks?
2. Create a quick integration guide?
3. Focus on a specific part of the system?
