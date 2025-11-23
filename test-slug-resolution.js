const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function testSlugResolution() {
  try {
    console.log('🔍 Testing slug resolution...\n');

    // Get a few petitions to test with
    const petitionsSnapshot = await db
      .collection('petitions')
      .where('status', '==', 'approved')
      .limit(3)
      .get();

    if (petitionsSnapshot.empty) {
      console.log('❌ No approved petitions found');
      return;
    }

    petitionsSnapshot.forEach((doc) => {
      const petition = doc.data();
      const petitionId = doc.id;

      // Generate slug like the frontend does
      const title = petition.title || 'untitled';
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const idSuffix = petitionId.slice(-8);
      const fullSlug = `${slug}-${idSuffix}`;

      console.log('📄 Petition:', petition.title);
      console.log('   ID:', petitionId);
      console.log('   Reference Code:', petition.referenceCode || 'N/A');
      console.log('   Generated Slug:', fullSlug);
      console.log('   ID Suffix:', idSuffix);
      console.log('   URL:', `/petitions/${fullSlug}`);
      console.log('');
    });

    console.log('✅ Test complete');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

testSlugResolution();
