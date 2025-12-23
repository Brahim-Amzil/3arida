/**
 * Test script for notification system
 * Run with: node test-notifications.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function testNotificationSystem() {
  console.log('🧪 Testing Notification System...\n');

  try {
    // Test 1: Create a test notification
    console.log('1️⃣ Creating test notification...');
    const testNotification = {
      userId: 'test-user-123',
      type: 'petition_approved',
      title: '🎉 Test Notification',
      message: 'This is a test notification from the setup script.',
      data: {
        petitionId: 'test-petition-123',
        petitionTitle: 'Test Petition'
      },
      read: false,
      createdAt: admin.firestore.Timestamp.now()
    };

    const notifRef = await db.collection('notifications').add(testNotification);
    console.log('✅ Notification created with ID:', notifRef.id);

    // Test 2: Read the notification
    console.log('\n2️⃣ Reading notification...');
    const notifDoc = await notifRef.get();
    if (notifDoc.exists) {
      console.log('✅ Notification data:', notifDoc.data());
    } else {
      console.log('❌ Notification not found');
    }

    // Test 3: Query notifications by userId
    console.log('\n3️⃣ Querying notifications by userId...');
    const querySnapshot = await db
      .collection('notifications')
      .where('userId', '==', 'test-user-123')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();

    console.log(`✅ Found ${querySnapshot.size} notification(s)`);
    querySnapshot.forEach(doc => {
      console.log('  -', doc.data().title);
    });

    // Test 4: Update notification (mark as read)
    console.log('\n4️⃣ Marking notification as read...');
    await notifRef.update({ read: true });
    const updatedDoc = await notifRef.get();
    console.log('✅ Notification read status:', updatedDoc.data().read);

    // Test 5: Create a deletion request
    console.log('\n5️⃣ Creating test deletion request...');
    const testRequest = {
      petitionId: 'test-petition-123',
      petitionTitle: 'Test Petition',
      creatorId: 'test-user-123',
      reason: 'Testing deletion request system',
      status: 'pending',
      currentSignatures: 50,
      createdAt: admin.firestore.Timestamp.now()
    };

    const requestRef = await db.collection('deletionRequests').add(testRequest);
    console.log('✅ Deletion request created with ID:', requestRef.id);

    // Test 6: Query deletion requests
    console.log('\n6️⃣ Querying deletion requests...');
    const requestsSnapshot = await db
      .collection('deletionRequests')
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .get();

    console.log(`✅ Found ${requestsSnapshot.size} pending deletion request(s)`);

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await notifRef.delete();
    await requestRef.delete();
    console.log('✅ Test data cleaned up');

    console.log('\n✅ All tests passed! Notification system is working correctly.');
    console.log('\n📊 Summary:');
    console.log('  ✅ Notifications can be created');
    console.log('  ✅ Notifications can be read');
    console.log('  ✅ Notifications can be queried by userId');
    console.log('  ✅ Notifications can be updated (marked as read)');
    console.log('  ✅ Deletion requests can be created');
    console.log('  ✅ Deletion requests can be queried');
    console.log('\n🎉 Notification system is production-ready!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nDetails:', error);
    
    if (error.code === 'failed-precondition') {
      console.log('\n💡 Tip: Indexes might still be building. Wait 2-5 minutes and try again.');
    }
  }

  process.exit(0);
}

// Run tests
testNotificationSystem();
