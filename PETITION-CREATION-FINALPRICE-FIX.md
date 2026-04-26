# Petition Creation finalPrice Fix

## Issue

When creating a petition, the error `finalPrice is not defined` was thrown, preventing petition creation.

## Root Cause

The `finalPrice` variable was calculated in the `handleSubmit` function but was not passed as a parameter to the `createPetitionWithPayment` function, causing a scope issue.

## Solution

Updated the petition creation flow to properly pass `finalPrice` through the function chain.

### Changes Made

1. **Updated `createPetitionWithPayment` function signature** (line ~1132)
   - Added `finalPrice: number` parameter
   - Now receives: `(submissionData, paymentId, finalPrice)`

2. **Updated call from `handleSubmit`** (line ~1129)
   - Now passes `finalPrice` when creating free petitions (beta coupon)
   - `await createPetitionWithPayment(submissionData, null, finalPrice)`

3. **Updated `handlePaymentSuccess` function** (line ~1234)
   - Added price calculation logic
   - Calculates `finalPrice` after coupon discount
   - Passes `finalPrice` to `createPetitionWithPayment`

## Petition Status Logic (Verified Correct)

The petition status logic in `src/lib/petitions.ts` works as follows:

```typescript
status: amountRequired > 0 ? 'draft' : 'pending';
```

- **Free petitions** (finalPrice = 0, e.g., BETA100 coupon): Created with status `'pending'` ✅
- **Paid petitions** (finalPrice > 0): Created with status `'draft'`, updated to `'pending'` after payment ✅

### Beta Launch Behavior

During beta with BETA100 coupon (100% discount):

- Base price calculated normally
- Discount applied: 100%
- Final price: 0 MAD
- Status: `'pending'` (requires admin approval)
- Payment status: `'paid'` (no payment required)

## Admin Dashboard Verification

The admin dashboard (`src/app/admin/petitions/page.tsx`) correctly:

- Loads ALL petitions from Firestore
- Filters them client-side by status
- Displays count badges for each tab (including pending)
- Shows pending petitions in the "Pending Review" tab

**Note:** Count badges ARE displayed for all tabs including pending.

## User Dashboard Verification

Petitions should appear in the user's dashboard under:

- **"Pending" tab**: Shows petitions with status `'pending'`
- **"All" tab**: Shows all petitions regardless of status

## Files Modified

- `src/app/petitions/create/page.tsx`

## Testing Checklist

- [ ] Create petition with BETA100 coupon (free)
- [ ] Verify petition appears in admin dashboard "Pending" tab with count badge
- [ ] Verify petition appears in user dashboard "Pending" tab
- [ ] Verify petition appears in user dashboard "All" tab
- [ ] Verify no `finalPrice is not defined` error
- [ ] Verify petition does NOT appear in public listings (status is 'pending', not 'approved')
- [ ] Admin approves petition
- [ ] Verify petition appears in public listings after approval

## Status

✅ **FIXED** - Ready for testing

## Next Steps

1. Test petition creation with BETA100 coupon
2. Verify petition appears in admin dashboard pending tab
3. Verify petition appears in user dashboard
4. Admin should approve the petition to make it live
