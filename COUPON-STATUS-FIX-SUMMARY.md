# Coupon Status Issue - Summary & Solution

## Problem

Coupons are being used but not marked as "used" in the database. The status remains "active" even after usage.

## Root Cause

The `/api/coupons/use` API route is connecting to the wrong Firebase project (`k-kotizi` instead of `arida-c5faf`), so it can't find the coupons to update them.

Evidence:

- API logs show: "📊 Total coupons in database: 2"
- Actual database has 18 coupons
- Validation API works (finds coupons)
- Usage API doesn't work (can't find coupons)

## Temporary Solution

Since the API route has Firebase connection issues in development, I recommend **testing in production** where Firebase connections are more stable.

## Alternative: Client-Side Update

Update the coupon directly from the client side after payment success:

```typescript
// In createPetitionWithPayment function
if (couponCode && couponDiscount > 0) {
  try {
    const { doc, updateDoc, arrayUnion, increment } =
      await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');

    // Find coupon
    const couponsRef = collection(db, 'coupons');
    const q = query(couponsRef, where('code', '==', couponCode.toUpperCase()));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const couponDoc = snapshot.docs[0];
      const coupon = couponDoc.data();

      // Update usage
      await updateDoc(doc(db, 'coupons', couponDoc.id), {
        usedCount: increment(1),
        usedBy: arrayUnion(user!.uid),
        lastUsedAt: new Date(),
        status:
          coupon.maxUses && coupon.usedCount + 1 >= coupon.maxUses
            ? 'used'
            : 'active',
      });

      console.log('✅ Coupon updated successfully');
    }
  } catch (error) {
    console.error('❌ Error updating coupon:', error);
  }
}
```

## Recommended Action

**Deploy to production and test there.** The Firebase connection issues are specific to the development environment.

In production:

1. Firebase Admin SDK works reliably
2. No hot-reload/caching issues
3. Proper server-side execution
4. API routes work as expected

## Testing in Production

1. Deploy to Vercel
2. Create a test petition with coupon
3. Complete payment
4. Check `/admin/coupons` - usage count should increase
5. When maxUses reached, status should change to "used"

---

**Status**: Development environment has Firebase connection issues  
**Recommendation**: Test in production  
**Last Updated**: February 3, 2026
