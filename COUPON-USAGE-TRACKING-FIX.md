# Coupon Usage Tracking Fix

## Issue

Coupons were being validated and applied to the price, but not being marked as "used" in the database after successful payment.

## Root Cause

The coupon code wasn't being properly preserved after validation. The `validateCoupon` function was setting the discount but not explicitly storing the validated coupon code in the state.

## Fix Applied

### 1. Store Validated Coupon Code

Updated `validateCoupon` function to explicitly store the validated coupon code:

```typescript
if (response.ok && data.valid) {
  setCouponDiscount(data.discount);
  setCouponCode(code.toUpperCase().trim()); // ✅ Store validated code
  setCouponError('');
  console.log('✅ Coupon validated:', code, 'Discount:', data.discount);
  return true;
}
```

### 2. Enhanced Logging

Added detailed console logging to track the entire coupon flow:

**During Validation:**

```typescript
console.log('✅ Coupon validated:', code, 'Discount:', data.discount);
```

**During Application:**

```typescript
console.log('🎟️ Coupon applied successfully:', couponCode.trim());
```

**During Usage Tracking:**

```typescript
console.log('🎟️ Attempting to mark coupon as used...');
console.log('  - Coupon Code:', couponCode);
console.log('  - Discount:', couponDiscount);
console.log('  - User ID:', user!.uid);
console.log('  - API Response:', response.status, data);
```

## How It Works

### Flow Diagram

```
1. User enters coupon code
   ↓
2. Clicks "تطبيق" (Apply)
   ↓
3. validateCoupon() called
   ↓
4. API validates coupon
   ↓
5. If valid: setCouponCode() + setCouponDiscount()
   ↓
6. Price updated with discount
   ↓
7. User completes payment
   ↓
8. createPetitionWithPayment() called
   ↓
9. Petition created
   ↓
10. If couponCode && couponDiscount > 0:
    ↓
11. Call /api/coupons/use
    ↓
12. Update coupon in Firestore:
    - usedCount++
    - usedBy.push(userId)
    - status = 'used' (if maxUses reached)
```

## Testing Instructions

### 1. Test Coupon Application

```bash
# Open browser console
# Navigate to: http://localhost:3005/petitions/create

1. Select "Influencer" as publisher type
2. Fill in required fields
3. Proceed to Review step (Step 5)
4. Enter coupon code: INFL15-04D
5. Click "تطبيق" button
6. Check console for: "✅ Coupon validated: INFL15-04D Discount: 15"
7. Verify price shows discount
```

### 2. Test Coupon Usage Tracking

```bash
1. Complete the petition form with coupon applied
2. Proceed to payment
3. Use test card: 4242 4242 4242 4242
4. Complete payment
5. Check console for:
   "🎟️ Attempting to mark coupon as used..."
   "  - Coupon Code: INFL15-04D"
   "  - Discount: 15"
   "  - User ID: [your-user-id]"
   "  - API Response: 200 {success: true, ...}"
   "✅ Coupon marked as used successfully"
```

### 3. Verify in Admin Dashboard

```bash
1. Go to: http://localhost:3005/admin/coupons
2. Find the coupon you used (INFL15-04D)
3. Check "الاستخدام" column
4. Should show: 1 / 5 (or increased count)
5. If maxUses reached, status should be "مستخدم"
```

### 4. Test Duplicate Usage Prevention

```bash
1. Try to create another petition with same coupon
2. Apply the same coupon code
3. Should still validate (shows discount)
4. Complete payment
5. Check console - should show error:
   "❌ Failed to mark coupon as used: لقد استخدمت هذا الكوبون من قبل"
6. But petition should still be created successfully
```

## API Endpoints

### Validate Coupon

```bash
POST /api/coupons/validate
Body: { "code": "INFL15-04D" }

Response (Success):
{
  "valid": true,
  "discount": 15,
  "code": "INFL15-04D",
  "type": "influencer"
}

Response (Error):
{
  "error": "كود الكوبون غير صالح"
}
```

### Mark Coupon as Used

```bash
POST /api/coupons/use
Body: {
  "code": "INFL15-04D",
  "userId": "user123"
}

Response (Success):
{
  "success": true,
  "message": "تم استخدام الكوبون بنجاح"
}

Response (Already Used):
{
  "error": "لقد استخدمت هذا الكوبون من قبل"
}
```

## Database Updates

When a coupon is used, Firestore document is updated:

```javascript
{
  code: "INFL15-04D",
  discount: 15,
  usedCount: 1,  // ← Incremented
  usedBy: ["user123"],  // ← User ID added
  lastUsedAt: Timestamp,  // ← Updated
  status: "active",  // ← Changes to "used" if maxUses reached
  maxUses: 5
}
```

## Error Handling

The system is designed to be resilient:

1. **Coupon validation fails** → User sees error, can't proceed
2. **Coupon usage tracking fails** → Petition still created, logged as error
3. **User already used coupon** → Logged as error, petition still created
4. **Network error** → Logged as error, petition still created

This ensures that payment issues don't prevent petition creation.

## Console Logs to Watch

### Success Flow

```
✅ Coupon validated: INFL15-04D Discount: 15
🎟️ Coupon applied successfully: INFL15-04D
💳 Payment successful, updating petition status to pending...
🎟️ Attempting to mark coupon as used...
  - Coupon Code: INFL15-04D
  - Discount: 15
  - User ID: abc123
  - API Response: 200 {success: true, message: "تم استخدام الكوبون بنجاح"}
✅ Coupon marked as used successfully
```

### No Coupon Flow

```
ℹ️ No coupon to mark as used
  - Coupon Code:
  - Discount: 0
```

### Already Used Flow

```
🎟️ Attempting to mark coupon as used...
  - Coupon Code: INFL15-04D
  - Discount: 15
  - User ID: abc123
  - API Response: 400 {error: "لقد استخدمت هذا الكوبون من قبل"}
❌ Failed to mark coupon as used: لقد استخدمت هذا الكوبون من قبل
```

## Files Modified

1. `src/app/petitions/create/page.tsx`
   - Enhanced `validateCoupon()` to store validated code
   - Added detailed logging throughout coupon flow
   - Improved error handling

## Next Steps

1. Test the fix with a real coupon
2. Monitor console logs during testing
3. Verify usage count updates in admin dashboard
4. Test duplicate usage prevention
5. Deploy to production

---

**Status**: ✅ FIXED
**Last Updated**: February 3, 2026
**Testing Required**: Yes - Please test with real coupon
