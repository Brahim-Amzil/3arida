/**
 * Check resubmission count for a specific petition
 */

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

async function checkResubmissionCount() {
  try {
    // Get petition ID from command line argument
    const petitionId = process.argv[2];
    
    if (!petitionId) {
      console.log('Usage: node check-resubmission-count.js <petition-id>');
      return;
    }

    console.log(`\n🔍 Checking petition: ${petitionId}\n`);

    const petitionDoc = await db.collection('petitions').doc(petitionId).get();
    
    if (!petitionDoc.exists) {
      console.log('❌ Petition not found');
      return;
    }

    const petition = petitionDoc.data();
    
    console.log('📋 Petition Details:');
    console.log(`   Title: ${petition.title}`);
    console.log(`   Status: ${petition.status}`);
    console.log(`   Resubmission Count: ${petition.resubmissionCount || 0}`);
    console.log(`   Has resubmissionHistory: ${!!petition.resubmissionHistory}`);
    
    if (petition.resubmissionHistory) {
      console.log(`   History entries: ${petition.resubmissionHistory.length}`);
      console.log('\n📜 Resubmission History:');
      petition.resubmissionHistory.forEach((entry, index) => {
        console.log(`\n   Attempt ${index + 1}:`);
        console.log(`     Rejected: ${entry.rejectedAt?.toDate?.() || entry.rejectedAt}`);
        console.log(`     Reason: ${entry.reason}`);
        console.log(`     Resubmitted: ${entry.resubmittedAt?.toDate?.() || entry.resubmittedAt || 'N/A'}`);
      });
    }
    
    console.log('\n');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkResubmissionCount()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
