const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function checkPetitions() {
  try {
    console.log('\n📋 Checking petitions in database...\n');

    const petitionsSnapshot = await db.collection('petitions')
      .limit(10)
      .get();

    if (petitionsSnapshot.empty) {
      console.log('❌ No petitions found in database');
      return;
    }

    console.log(`✅ Found ${petitionsSnapshot.size} petitions:\n`);

    petitionsSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('---');
      console.log('ID:', doc.id);
      console.log('Title:', data.title);
      console.log('Reference Code:', data.referenceCode || '❌ MISSING');
      console.log('Status:', data.status);
      console.log('Signatures:', data.currentSignatures || 0);
    });

    console.log('\n---\n');

    // Check if any petitions are missing reference codes
    const missingRefCodes = await db.collection('petitions')
      .where('referenceCode', '==', null)
      .get();

    if (!missingRefCodes.empty) {
      console.log(`⚠️  ${missingRefCodes.size} petitions are missing reference codes!`);
      console.log('Run the migration script to fix this.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkPetitions();
