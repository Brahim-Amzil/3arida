/**
 * Test script to check appeals in Firestore
 */

require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(
      process.env.FIREBASE_CLIENT_EMAIL || ''
    )}`,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function testAppeals() {
  try {
    console.log('🔍 Fetching all appeals from Firestore...\n');

    const appealsSnapshot = await db.collection('appeals').get();

    console.log(`📊 Total appeals found: ${appealsSnapshot.size}\n`);

    if (appealsSnapshot.empty) {
      console.log('❌ No appeals found in Firestore');
      return;
    }

    appealsSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('---');
      console.log(`Appeal ID: ${doc.id}`);
      console.log(`Petition: ${data.petitionTitle}`);
      console.log(`Creator ID: ${data.creatorId}`);
      console.log(`Creator Name: ${data.creatorName}`);
      console.log(`Status: ${data.status}`);
      console.log(`Messages: ${data.messages?.length || 0}`);
      console.log(`Created: ${data.createdAt?.toDate?.() || data.createdAt}`);
      console.log('');
    });

    // Test fetching for a specific user
    console.log('\n🔍 Testing user-specific query...\n');
    
    const firstAppeal = appealsSnapshot.docs[0];
    const creatorId = firstAppeal.data().creatorId;
    
    console.log(`Querying appeals for creator: ${creatorId}`);
    
    const userAppealsSnapshot = await db
      .collection('appeals')
      .where('creatorId', '==', creatorId)
      .get();
    
    console.log(`Found ${userAppealsSnapshot.size} appeals for this user`);

  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Stack:', error.stack);
  } finally {
    process.exit(0);
  }
}

testAppeals();
