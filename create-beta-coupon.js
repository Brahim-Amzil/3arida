/**
 * Create BETA100 Coupon
 * 
 * Creates a 100% discount coupon for Beta Founder launch.
 * Run this once to add the coupon to Firestore.
 * 
 * Usage: node create-beta-coupon.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function createBetaCoupon() {
  try {
    console.log('🎉 Creating BETA100 coupon...');

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
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: null, // No expiration during beta
      minPurchaseAmount: 0, // No minimum
      maxDiscountAmount: null, // No maximum (100% off everything)
      applicableToTiers: ['free', 'basic', 'premium', 'advanced', 'enterprise'], // All tiers
      autoApply: true, // Auto-apply during beta
    };

    // Add to Firestore
    await db.collection('coupons').doc('BETA100').set(couponData);

    console.log('✅ BETA100 coupon created successfully!');
    console.log('📊 Coupon details:');
    console.log('   - Code: BETA100');
    console.log('   - Discount: 100%');
    console.log('   - Usage: Unlimited');
    console.log('   - Auto-apply: Yes');
    console.log('   - Expires: Never (during beta)');
    console.log('');
    console.log('🚀 Ready for Beta Founder launch!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating coupon:', error);
    process.exit(1);
  }
}

createBetaCoupon();
