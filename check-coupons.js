// Check coupons in Firestore
const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

async function checkCoupons() {
  try {
    console.log('🔍 Checking coupons in Firestore...\n');

    const couponsSnapshot = await db.collection('coupons').get();

    if (couponsSnapshot.empty) {
      console.log('❌ No coupons found in database');
      console.log('\n💡 You need to generate a coupon first:');
      console.log('   1. Go to http://localhost:3004/admin/coupons');
      console.log('   2. Click "إنشاء كوبون" (Generate Coupon)');
      console.log('   3. Copy the generated code');
      return;
    }

    console.log(`✅ Found ${couponsSnapshot.size} coupon(s):\n`);

    couponsSnapshot.forEach((doc) => {
      const coupon = doc.data();
      console.log('---');
      console.log('ID:', doc.id);
      console.log('Code:', coupon.code);
      console.log('Discount:', coupon.discount + '%');
      console.log('Status:', coupon.status);
      console.log('Used:', coupon.usedCount, '/', coupon.maxUses || '∞');
      console.log('Created:', coupon.createdAt?.toDate().toLocaleString());
      if (coupon.expiresAt) {
        console.log('Expires:', coupon.expiresAt.toDate().toLocaleString());
      }
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkCoupons();
