// Generate a specific coupon
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

async function generateCoupon() {
  const couponData = {
    code: 'INFL15-04D',
    discount: 15,
    type: 'influencer',
    createdBy: 'admin',
    createdFor: null,
    createdAt: admin.firestore.Timestamp.now(),
    expiresAt: admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    ),
    maxUses: 5,
    usedCount: 0,
    usedBy: [],
    status: 'active',
    metadata: {},
  };

  await db.collection('coupons').add(couponData);
  console.log('✅ Coupon created:', couponData.code);
}

generateCoupon();
