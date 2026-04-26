/**
 * Create BETA100 Coupon (Client-side)
 * 
 * Creates a 100% discount coupon for Beta Founder launch.
 * Run this in browser console while logged in as admin.
 * 
 * Usage: 
 * 1. Go to your app in browser
 * 2. Open console (F12)
 * 3. Copy and paste this entire script
 * 4. Press Enter
 */

(async function createBetaCoupon() {
  try {
    console.log('🎉 Creating BETA100 coupon...');

    // Import Firebase
    const { getFirestore, doc, setDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    
    // Get Firestore instance (assumes Firebase is already initialized)
    const db = getFirestore();

    const couponData = {
      code: 'BETA100',
      discount: 100,
      type: 'percentage',
      active: true,
      usageLimit: null, // Unlimited uses during beta
      usedCount: 0,
      usedBy: [], // Track who used it
      description: 'Beta Founder - 100% Free Launch',
      descriptionAr: 'عرض المؤسسين - إطلاق مجاني 100%',
      createdAt: serverTimestamp(),
      expiresAt: null, // No expiration during beta
      minPurchaseAmount: 0, // No minimum
      maxDiscountAmount: null, // No maximum (100% off everything)
      applicableToTiers: ['free', 'basic', 'premium', 'advanced', 'enterprise'], // All tiers
      autoApply: true, // Auto-apply during beta
    };

    // Add to Firestore
    await setDoc(doc(db, 'coupons', 'BETA100'), couponData);

    console.log('✅ BETA100 coupon created successfully!');
    console.log('📊 Coupon details:');
    console.log('   - Code: BETA100');
    console.log('   - Discount: 100%');
    console.log('   - Usage: Unlimited');
    console.log('   - Auto-apply: Yes');
    console.log('   - Expires: Never (during beta)');
    console.log('');
    console.log('🚀 Ready for Beta Founder launch!');
  } catch (error) {
    console.error('❌ Error creating coupon:', error);
    console.error('Make sure you are logged in as admin and Firebase is initialized');
  }
})();
