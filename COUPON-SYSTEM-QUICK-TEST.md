# Quick Test Guide - Coupon System

## How to Test the Complete Flow

### 1. Generate a Test Coupon (Admin)

1. Login as admin
2. Navigate to: **Admin → Coupons**
3. Set discount: **10%**
4. Set max uses: **1**
5. Set expiry: **30 days**
6. Click **"إنشاء كوبون"** (Generate Coupon)
7. Copy the generated code (e.g., `INFLUENCER10-ABC123`)

### 2. Test Coupon at Petition Creation

1. Logout and login as regular user
2. Go to: **Create Petition** (`/petitions/create`)
3. Step 1: Select **"Influencer"** as publisher type
4. Fill in required fields
5. Navigate through steps to **Step 5 (Review)**
6. You should see the coupon input section
7. Enter the coupon code you generated
8. Click **"تطبيق"** (Apply)
9. Verify:
   - ✅ Original price shown with strikethrough
   - ✅ Discount amount displayed
   - ✅ Final price calculated correctly
   - ✅ "Proceed to Payment" button shows discounted price

### 3. Complete Payment with Coupon

1. Click **"Proceed to Payment"**
2. Complete Stripe payment with test card
3. After successful payment, petition should be created
4. Check console logs for: `🎟️ Marking coupon as used`

### 4. Verify Coupon Usage (Admin)

1. Go back to **Admin → Coupons**
2. Find the coupon you used
3. Verify:
   - ✅ Usage count increased: `1 / 1`
   - ✅ Status changed to: **"مستخدم"** (Used)

### 5. Test Coupon Reuse Prevention

1. Try to create another petition as the same user
2. Enter the same coupon code
3. Should show error: **"لقد استخدمت هذا الكوبون من قبل"**

### 6. Test Invalid Coupon

1. Enter a random code like: `INVALID123`
2. Click Apply
3. Should show error: **"كود الكوبون غير صالح"**

---

## Test Coupons to Generate

For comprehensive testing, generate these:

1. **Single-use 10%**: `maxUses: 1, discount: 10`
2. **Multi-use 20%**: `maxUses: 5, discount: 20`
3. **Unlimited 15%**: `maxUses: null, discount: 15`
4. **Expiring soon**: `expiryDays: 1, discount: 30`

---

## Expected Behavior

### ✅ Coupon Shows When:

- Publisher type is **"Influencer"**
- Price is **greater than 0**
- On **Review step (Step 5)**

### ❌ Coupon Hidden When:

- Publisher type is **"Individual"** or **"Organization"**
- Price is **0** (free petition)
- Not on review step

### Validation Checks:

1. ✅ Coupon exists in database
2. ✅ Status is 'active'
3. ✅ Not expired
4. ✅ Usage limit not reached
5. ✅ User hasn't used it before

---

## Troubleshooting

### Coupon not showing?

- Check publisher type is "Influencer"
- Check price > 0 (select higher signature target)
- Check you're on Step 5 (Review)

### Validation failing?

- Check Firestore rules deployed: `firebase deploy --only firestore:rules`
- Check API endpoints are accessible
- Check browser console for errors

### Coupon not marked as used?

- Check payment completed successfully
- Check console logs for coupon usage API call
- Check Firestore `coupons` collection for `usedBy` array

---

## API Endpoints

- **POST** `/api/coupons/validate` - Validate coupon code
- **POST** `/api/coupons/use` - Mark coupon as used

## Admin Pages

- `/admin/coupons` - Coupon management dashboard
- `/admin` - Main admin dashboard

---

**Quick Test Time**: ~5 minutes
**Full Test Time**: ~15 minutes
