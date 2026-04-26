# BETA100 Coupon Setup Guide

**Date:** February 4, 2026  
**Purpose:** Auto-apply 100% discount for Beta Founder launch

---

## ✅ What's Been Done

### 1. Auto-Apply Logic Added

**File:** `src/app/petitions/create/page.tsx`

**What it does:**

- Automatically applies BETA100 coupon when petition creation page loads
- Runs once on component mount
- Fails silently if coupon doesn't exist (won't break the app)
- Sets discount to 100% automatically

**Code added:**

```typescript
useEffect(() => {
  const autoApplyBetaCoupon = async () => {
    const response = await fetch('/api/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code: 'BETA100' }),
    });

    if (response.ok && data.valid) {
      setCouponDiscount(100);
      setCouponCode('BETA100');
    }
  };

  autoApplyBetaCoupon();
}, []);
```

### 2. Coupon Creation Scripts

**Created 2 scripts:**

1. **`create-beta-coupon.js`** - Node.js script (requires serviceAccountKey.json)
2. **`create-beta-coupon-client.js`** - Browser console script (easier!)

---

## 🚀 How to Create the BETA100 Coupon

### Method 1: Browser Console (EASIEST)

1. **Go to your app:** http://localhost:3001
2. **Login as admin**
3. **Open browser console:** Press F12
4. **Copy the entire content** of `create-beta-coupon-client.js`
5. **Paste in console** and press Enter
6. **Done!** You should see: ✅ BETA100 coupon created successfully!

### Method 2: Node.js Script

```bash
node create-beta-coupon.js
```

**Requirements:**

- `serviceAccountKey.json` in root directory
- Firebase Admin SDK installed

---

## 📊 Coupon Details

```javascript
{
  code: "BETA100",
  discount: 100,              // 100% off
  type: "percentage",
  active: true,
  usageLimit: null,           // Unlimited uses
  usedCount: 0,
  usedBy: [],
  description: "Beta Founder - 100% Free Launch",
  descriptionAr: "عرض المؤسسين - إطلاق مجاني 100%",
  createdAt: [timestamp],
  expiresAt: null,            // Never expires during beta
  minPurchaseAmount: 0,
  maxDiscountAmount: null,
  applicableToTiers: ["free", "basic", "premium", "advanced", "enterprise"],
  autoApply: true
}
```

---

## 🎯 How It Works

### User Flow

1. **User visits petition creation page**

   ```
   → Page loads
   → useEffect runs
   → Fetches /api/coupons/validate with code "BETA100"
   → If valid, sets couponDiscount to 100
   → Coupon is now applied!
   ```

2. **User selects a tier** (e.g., Professional - 229 DH)

   ```
   → Sees price: 229 DH
   → Coupon applied: -229 DH (100%)
   → Total: 0 DH
   ```

3. **User reaches payment step**
   ```
   → Price calculation:
     Base price: 229 DH
     Discount: -229 DH (BETA100)
     Final: 0 DH
   → No payment required!
   → Petition created with "premium" tier
   ```

### Price Calculation

The existing coupon logic already handles this:

```typescript
const price = calculatePetitionPrice(targetSignatures);
const discountAmount = (price * couponDiscount) / 100;
const finalPrice = price - discountAmount;

// With BETA100:
// price = 229 DH
// couponDiscount = 100
// discountAmount = 229 DH
// finalPrice = 0 DH ✅
```

---

## ✅ Verification Checklist

### After Creating Coupon

- [ ] Coupon exists in Firestore `coupons/BETA100`
- [ ] `discount` field = 100
- [ ] `active` field = true
- [ ] `autoApply` field = true

### Testing the Flow

1. **Open petition creation page**
   - [ ] Check browser console for: "✅ BETA100 coupon auto-applied!"
2. **Select a paid tier** (e.g., Professional)
   - [ ] See original price (229 DH)
   - [ ] See discount applied (-229 DH)
   - [ ] See total: 0 DH

3. **Create petition**
   - [ ] No payment required
   - [ ] Petition created successfully
   - [ ] Petition has correct tier (premium)

---

## 🔍 Debugging

### If Coupon Doesn't Auto-Apply

**Check browser console:**

```javascript
// Should see:
🎉 Auto-applying BETA100 coupon for Beta Founder launch...
✅ BETA100 coupon auto-applied! Discount: 100 %

// If you see error:
ℹ️ BETA100 coupon not available or expired
// → Coupon doesn't exist in Firestore
```

**Verify coupon exists:**

1. Go to Firebase Console
2. Navigate to Firestore Database
3. Check `coupons` collection
4. Look for document with ID `BETA100`

**Manually test coupon API:**

```javascript
// In browser console:
fetch('/api/coupons/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code: 'BETA100' }),
})
  .then((r) => r.json())
  .then(console.log);

// Should return:
// { valid: true, discount: 100, ... }
```

---

## 🎨 UI Display

### Review Step

The review step should show:

```
┌─────────────────────────────────────┐
│ Pricing Information                 │
├─────────────────────────────────────┤
│ Professional Plan: 229 DH           │
│ Beta Founder Discount: -229 DH      │
│ ─────────────────────────────────   │
│ Total: 0 DH (FREE!)                 │
│                                     │
│ 🎉 Beta Founder - All features free│
└─────────────────────────────────────┘
```

---

## 🚫 Disabling the Coupon (Post-Beta)

### When Beta Ends

**Option 1: Deactivate**

```javascript
// In Firestore, update coupons/BETA100:
{
  active: false;
}
```

**Option 2: Delete**

```javascript
// Delete the document entirely
```

**Option 3: Set Expiration**

```javascript
// Update coupons/BETA100:
{
  expiresAt: Timestamp.fromDate(new Date('2026-12-31'));
}
```

### Remove Auto-Apply

**File:** `src/app/petitions/create/page.tsx`

**Comment out or remove:**

```typescript
// useEffect(() => {
//   const autoApplyBetaCoupon = async () => {
//     ...
//   };
//   autoApplyBetaCoupon();
// }, []);
```

---

## 📝 Notes

### Why This Works

1. **Existing coupon system** already validates and applies discounts
2. **Auto-apply just pre-fills** the coupon code on page load
3. **No payment logic changes** needed - 0 DH = no payment
4. **Tier is still recorded** - user gets premium features

### Benefits

✅ **No code changes** to payment flow  
✅ **Easy to enable/disable** (just activate/deactivate coupon)  
✅ **Tracks usage** (usedBy array)  
✅ **Transparent** (users see the discount)  
✅ **Value anchoring** (see 229 DH → 0 DH)

---

## 🎯 Summary

**To activate Beta Founder launch:**

1. ✅ Create BETA100 coupon (use browser console script)
2. ✅ Auto-apply logic already added to petition creation
3. ✅ Test the flow
4. ✅ Deploy!

**Current Status:**

- ✅ Auto-apply code: DONE
- ⏳ Coupon creation: PENDING (run script)
- ⏳ Testing: PENDING

**Next:** Run the browser console script to create the coupon!
