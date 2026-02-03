// Generate a test coupon in Firestore
const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

async function generateTestCoupon() {
  try {
    console.log('🎟️ Generating test coupon...\n');

    const couponData = {
      code: 'INFL10-TEST',
      discount: 10,
      type: 'influencer',
      createdBy: 'test-script',
      createdFor: null,
      createdAt: admin.firestore.Timestamp.now(),
      expiresAt: admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      ),
      maxUses: 5,
      usedCount: 0,
      usedBy: [],
      status: 'active',
      metadata: {},
    };

    const docRef = await db.collection('coupons').add(couponData);

    console.log('✅ Test coupon created!');
    console.log('ID:', docRef.id);
    console.log('Code:', couponData.code);
    console.log('Discount:', couponData.discount + '%');
    console.log('Max Uses:', couponData.maxUses);
    console.log('Expires:', couponData.expiresAt.toDate().toLocaleDateString());
    console.log('\n💡 Use this code to test: INFL10-TEST');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

generateTestCoupon();
