// Test Firebase connection from Node.js
const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

async function testFirestore() {
  try {
    console.log('🔥 Testing Firestore connection...\n');

    // Try to query coupons collection
    console.log('📡 Querying coupons collection...');
    const snapshot = await db.collection('coupons')
      .where('code', '==', 'TEST123')
      .get();

    console.log('✅ Query successful!');
    console.log('Found documents:', snapshot.size);

    if (snapshot.empty) {
      console.log('\n✅ Firestore is working! (No documents found, which is expected)');
    } else {
      console.log('\n✅ Firestore is working! Found documents:');
      snapshot.forEach(doc => {
        console.log('  -', doc.id, doc.data());
      });
    }
  } catch (error) {
    console.error('❌ Firestore error:', error.message);
    console.error('Error code:', error.code);
  }
}

testFirestore();
