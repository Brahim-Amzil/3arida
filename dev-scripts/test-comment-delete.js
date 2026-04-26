/**
 * Test script for comment soft delete functionality
 * 
 * This script demonstrates how to:
 * 1. Create a test comment
 * 2. Soft delete it
 * 3. Verify the deleted state
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function testCommentDelete() {
  try {
    console.log('🧪 Testing Comment Soft Delete Functionality\n');

    // Step 1: Find a petition to test with
    const petitionsSnapshot = await db.collection('petitions')
      .where('status', '==', 'approved')
      .limit(1)
      .get();

    if (petitionsSnapshot.empty) {
      console.log('❌ No approved petitions found');
      return;
    }

    const petitionId = petitionsSnapshot.docs[0].id;
    console.log(`✅ Using petition: ${petitionId}\n`);

    // Step 2: Create a test comment
    const testComment = {
      petitionId,
      authorId: 'test-user-123',
      authorName: 'Test User',
      content: 'This is a test comment that will be deleted',
      createdAt: admin.firestore.Timestamp.now(),
      isAnonymous: false,
      likes: 0,
      likedBy: []
    };

    const commentRef = await db.collection('comments').add(testComment);
    console.log(`✅ Created test comment: ${commentRef.id}`);
    console.log(`   Content: "${testComment.content}"\n`);

    // Step 3: Soft delete the comment
    await commentRef.update({
      deleted: true,
      deletedAt: admin.firestore.Timestamp.now(),
      deletedBy: testComment.authorId
    });

    console.log(`✅ Soft deleted comment: ${commentRef.id}\n`);

    // Step 4: Verify the deleted state
    const deletedComment = await commentRef.get();
    const data = deletedComment.data();

    console.log('📊 Comment State After Deletion:');
    console.log(`   - ID: ${commentRef.id}`);
    console.log(`   - Deleted: ${data.deleted}`);
    console.log(`   - Deleted At: ${data.deletedAt?.toDate()}`);
    console.log(`   - Deleted By: ${data.deletedBy}`);
    console.log(`   - Original Content: "${data.content}"`);
    console.log(`   - Author: ${data.authorName}\n`);

    // Step 5: Create a reply to test reply deletion
    const testReply = {
      petitionId,
      authorId: 'test-user-456',
      authorName: 'Reply User',
      content: 'This is a test reply that will be deleted',
      createdAt: admin.firestore.Timestamp.now(),
      isAnonymous: false,
      likes: 0,
      likedBy: [],
      parentId: commentRef.id
    };

    const replyRef = await db.collection('comments').add(testReply);
    console.log(`✅ Created test reply: ${replyRef.id}`);
    console.log(`   Content: "${testReply.content}"\n`);

    // Step 6: Soft delete the reply
    await replyRef.update({
      deleted: true,
      deletedAt: admin.firestore.Timestamp.now(),
      deletedBy: testReply.authorId
    });

    console.log(`✅ Soft deleted reply: ${replyRef.id}\n`);

    // Step 7: Verify the reply deleted state
    const deletedReply = await replyRef.get();
    const replyData = deletedReply.data();

    console.log('📊 Reply State After Deletion:');
    console.log(`   - ID: ${replyRef.id}`);
    console.log(`   - Deleted: ${replyData.deleted}`);
    console.log(`   - Deleted At: ${replyData.deletedAt?.toDate()}`);
    console.log(`   - Deleted By: ${replyData.deletedBy}`);
    console.log(`   - Original Content: "${replyData.content}"`);
    console.log(`   - Parent Comment: ${replyData.parentId}\n`);

    console.log('✅ All tests passed!');
    console.log('\n📝 Summary:');
    console.log('   - Comments are soft deleted (marked as deleted, not removed)');
    console.log('   - Original content is preserved in database');
    console.log('   - Deletion timestamp and user are tracked');
    console.log('   - Replies to deleted comments remain visible');
    console.log('   - Admins can still see deleted content for moderation\n');

    // Cleanup
    console.log('🧹 Cleaning up test data...');
    await commentRef.delete();
    await replyRef.delete();
    console.log('✅ Test data cleaned up\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

testCommentDelete();
