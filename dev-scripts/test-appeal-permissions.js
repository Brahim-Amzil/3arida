// Test script to check appeal creation permissions
// Run with: node test-appeal-permissions.js

const admin = require('firebase-admin');

// Initialize Firebase Admin
try {
  admin.initializeApp({
    projectId: 'arida-c5faf',
  });
} catch (error) {
  console.log('Admin already initialized');
}

const db = admin.firestore();

async function testAppealPermissions() {
  try {
    // Get a paused or rejected petition
    const petitionsSnapshot = await db
      .collection('petitions')
      .where('status', 'in', ['paused', 'rejected'])
      .limit(1)
      .get();

    if (petitionsSnapshot.empty) {
      console.log('No paused or rejected petitions found');
      return;
    }

    const petition = petitionsSnapshot.docs[0];
    const petitionData = petition.data();

    console.log('\n=== Petition Info ===');
    console.log('ID:', petition.id);
    console.log('Title:', petitionData.title);
    console.log('Status:', petitionData.status);
    console.log('Creator ID:', petitionData.creatorId);
    console.log('Creator Name:', petitionData.creatorName);

    // Check if there are any existing appeals
    const appealsSnapshot = await db
      .collection('appeals')
      .where('petitionId', '==', petition.id)
      .get();

    console.log('\n=== Existing Appeals ===');
    console.log('Count:', appealsSnapshot.size);
    
    appealsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log('\nAppeal ID:', doc.id);
      console.log('Status:', data.status);
      console.log('Creator ID:', data.creatorId);
      console.log('Created:', data.createdAt?.toDate());
    });

    // Try to create a test appeal
    console.log('\n=== Testing Appeal Creation ===');
    const testAppealData = {
      petitionId: petition.id,
      petitionTitle: petitionData.title,
      creatorId: petitionData.creatorId,
      creatorName: petitionData.creatorName || 'Test User',
      creatorEmail: 'test@example.com',
      status: 'pending',
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: petitionData.creatorId,
          senderName: petitionData.creatorName || 'Test User',
          senderRole: 'creator',
          content: 'Test appeal message',
          createdAt: admin.firestore.Timestamp.now(),
          isInternal: false,
        },
      ],
      statusHistory: [
        {
          status: 'pending',
          changedBy: petitionData.creatorId,
          changedAt: admin.firestore.Timestamp.now(),
        },
      ],
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    };

    console.log('Test appeal data:', JSON.stringify(testAppealData, null, 2));
    console.log('\nNote: This would be created with Admin SDK (bypasses rules)');
    console.log('The actual issue is with client SDK + Firestore rules');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

testAppealPermissions();
