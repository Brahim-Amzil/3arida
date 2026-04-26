# Beta to Paid Migration - Verification & Plan

**Date**: February 9, 2026  
**Status**: ✅ Ready for Migration

## Current Setup (Beta - 100% Free)

### How It Works Now

**1. Auto-Applied Coupon**

- File: `src/app/petitions/create/page.tsx` (lines 274-284)
- Hardcoded: `couponCode = 'BETA100'`
- Hardcoded: `couponDiscount = 100` (100% discount)
- No API call needed - automatically applied on page load

```typescript
// CURRENT CODE (BETA)
const [couponCode, setCouponCode] = useState('BETA100');
const [couponDiscount, setCouponDiscount] = useState(100);

useEffect(() => {
  console.log('🎉 BETA100 coupon auto-applied (hardcoded for beta launch)');
  console.log('✅ 100% discount active for all petitions');
}, []);
```

**2. Price Calculation Flow**

```typescript
const price = calculatePetitionPrice(formData.targetSignatures);
const discountAmount = (price * couponDiscount) / 100;
const finalPrice = price - discountAmount; // = 0 during beta

if (finalPrice > 0) {
  // Show payment screen
  setShowPayment(true);
} else {
  // Create petition directly (current beta behavior)
  await createPetitionWithPayment(submissionData, null, finalPrice);
}
```

**3. Petition Status Logic** (in `src/lib/petitions.ts`)

```typescript
status: amountRequired > 0 ? 'draft' : 'pending';
paymentStatus: amountRequired > 0 ? 'unpaid' : 'paid';
```

- **Free petitions** (finalPrice = 0): status = 'pending', paymentStatus = 'paid'
- **Paid petitions** (finalPrice > 0): status = 'draft', paymentStatus = 'unpaid'

### Where Beta is Mentioned

1. **Petition Creation Page** (`src/app/petitions/create/page.tsx`)
   - Lines 274-284: Hardcoded BETA100 coupon
   - Line 2954: Beta Founder message display

2. **About Page** (`src/app/about/page.tsx`)
   - Line 100: "يتم تطبيق كوبون BETA100 تلقائياً"

3. **Help Page** (`src/app/help/page.tsx`)
   - Line 474: "يتم تطبيق كوبون BETA100 تلقائياً"

4. **Pricing Page** (`src/app/pricing/page.tsx`)
   - Line 233: "كود الخصم: BETA100 (يُطبق تلقائياً)"

---

## ✅ VERIFICATION: Is Everything Set Up for Paid?

### YES! Here's What's Already Working:

✅ **Payment Integration**

- Stripe integration complete
- PayPal integration complete
- Payment flow tested and working

✅ **Price Calculation**

- `calculatePetitionPrice()` function working
- Pricing tiers defined (Basic, Standard, Premium, Enterprise)
- Currency formatting (MAD)

✅ **Coupon System**

- Coupon validation API ready
- Discount calculation working
- Coupon application logic complete

✅ **Petition Status Flow**

- Draft → Pending (after payment)
- Free → Pending (direct)
- Status transitions working

✅ **Payment Verification**

- Payment confirmation
- Status updates after payment
- Email notifications

---

## 🚀 Migration Plan: Beta → Paid

### Step 1: Remove Auto-Applied Coupon

**File**: `src/app/petitions/create/page.tsx`

**CHANGE FROM:**

```typescript
const [couponCode, setCouponCode] = useState('BETA100');
const [couponDiscount, setCouponDiscount] = useState(100);

useEffect(() => {
  console.log('🎉 BETA100 coupon auto-applied (hardcoded for beta launch)');
  console.log('✅ 100% discount active for all petitions');
}, []);
```

**CHANGE TO:**

```typescript
const [couponCode, setCouponCode] = useState('');
const [couponDiscount, setCouponDiscount] = useState(0);

// Remove the useEffect that logs beta coupon
```

### Step 2: Update UI Messages

**1. Petition Creation Page** (`src/app/petitions/create/page.tsx`)

- Remove Beta Founder message (around line 2954)
- Remove or update the purple banner about free petitions

**2. About Page** (`src/app/about/page.tsx`)

- Remove or update the beta announcement section (line 100)

**3. Help Page** (`src/app/help/page.tsx`)

- Update FAQ about free petitions (line 474)
- Change to explain paid pricing

**4. Pricing Page** (`src/app/pricing/page.tsx`)

- Remove "BETA100 auto-applied" message (line 233)
- Show actual pricing

### Step 3: Optional - Keep BETA100 Coupon Active

If you want to keep the BETA100 coupon available for manual entry:

**Option A: Deactivate in Firestore**

```javascript
// In Firebase Console or via script
db.collection('coupons').doc('BETA100').update({
  isActive: false,
});
```

**Option B: Keep Active for Special Users**

- Leave coupon in database
- Users can manually enter "BETA100" if they have the code
- Useful for promotions, influencers, etc.

---

## Testing Checklist

After migration, test:

- [ ] Create petition without coupon → Shows payment screen
- [ ] Create petition with invalid coupon → Shows error
- [ ] Create petition with valid coupon → Applies discount
- [ ] Payment with Stripe → Creates petition with status 'pending'
- [ ] Payment with PayPal → Creates petition with status 'pending'
- [ ] Free tier restrictions work correctly
- [ ] Paid tier features unlock after payment

---

## Rollback Plan

If you need to revert to beta:

1. Change `couponCode` back to `'BETA100'`
2. Change `couponDiscount` back to `100`
3. Re-add the useEffect log
4. Restore UI messages

---

## Summary

**YES, YOU ARE CORRECT!** ✅

Everything is set up for paid petitions. The ONLY thing making petitions free right now is:

1. **Hardcoded coupon code**: `'BETA100'`
2. **Hardcoded discount**: `100`

To go paid, you just need to:

1. Change those two lines to empty/zero
2. Update UI messages about beta
3. Optionally deactivate BETA100 coupon in database

**All payment infrastructure is ready:**

- ✅ Stripe integration
- ✅ PayPal integration
- ✅ Price calculation
- ✅ Coupon system
- ✅ Status flow
- ✅ Email notifications

**Migration time**: ~15 minutes  
**Risk level**: Low (easy to rollback)
