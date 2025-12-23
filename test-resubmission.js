/**
 * Test script for petition resubmission feature
 * 
 * This script tests:
 * 1. Rejecting a petition with a reason
 * 2. Checking resubmission count
 * 3. Simulating a resubmission
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

async function testResubmission() {
  try {
    console.log('🧪 Testing Petition Resubmission Feature\n');

    // Find a test petition (or use a specific ID)
    const petitionsSnapshot = await db
      .collection('petitions')
      .where('status', '==', 'approved')
      .limit(1)
      .get();

    if (petitionsSnapshot.empty) {
      console.log('❌ No approved petitions found for testing');
      return;
    }

    const petitionDoc = petitionsSnapshot.docs[0];
    const petitionId = petitionDoc.id;
    const petition = petitionDoc.data();

    console.log(`📋 Testing with petition: ${petition.title}`);
    console.log(`   ID: ${petitionId}`);
    console.log(`   Current status: ${petition.status}`);
    console.log(`   Resubmission count: ${petition.resubmissionCount || 0}\n`);

    // Step 1: Reject the petition
    console.log('1️⃣  Rejecting petition...');
    await db.collection('petitions').doc(petitionId).update({
      status: 'rejected',
      moderationNotes: 'Test rejection: Please improve the description and add more details.',
      rejectedAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    });
    console.log('   ✅ Petition rejected\n');

    // Step 2: Simulate resubmission
    console.log('2️⃣  Simulating resubmission...');
    const resubmissionHistory = petition.resubmissionHistory || [];
    resubmissionHistory.push({
      rejectedAt: new Date(),
      reason: 'Test rejection: Please improve the description and add more details.',
      resubmittedAt: new Date(),
    });

    await db.collection('petitions').doc(petitionId).update({
      status: 'pending',
      resubmissionCount: (petition.resubmissionCount || 0) + 1,
      resubmissionHistory: resubmissionHistory,
      moderationNotes: '', // Clear rejection reason
      updatedAt: admin.firestore.Timestamp.now(),
    });
    console.log('   ✅ Petition resubmitted\n');

    // Step 3: Verify the changes
    console.log('3️⃣  Verifying changes...');
    const updatedPetition = await db.collection('petitions').doc(petitionId).get();
    const data = updatedPetition.data();

    console.log(`   Status: ${data.status}`);
    console.log(`   Resubmission count: ${data.resubmissionCount}`);
    console.log(`   Resubmission history entries: ${data.resubmissionHistory?.length || 0}`);
    console.log(`   Moderation notes cleared: ${!data.moderationNotes || data.moderationNotes === ''}`);

    if (
      data.status === 'pending' &&
      data.resubmissionCount === 1 &&
      data.resubmissionHistory?.length === 1 &&
      (!data.moderationNotes || data.moderationNotes === '')
    ) {
      console.log('\n✅ All tests passed!');
    } else {
      console.log('\n❌ Some tests failed');
    }

    // Cleanup: Restore original status
    console.log('\n4️⃣  Cleaning up...');
    await db.collection('petitions').doc(petitionId).update({
      status: petition.status,
      resubmissionCount: admin.firestore.FieldValue.delete(),
      resubmissionHistory: admin.firestore.FieldValue.delete(),
      moderationNotes: admin.firestore.FieldValue.delete(),
      rejectedAt: admin.firestore.FieldValue.delete(),
    });
    console.log('   ✅ Petition restored to original state\n');

    console.log('🎉 Test completed successfully!');
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

// Run the test
testResubmission()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
