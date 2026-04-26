/**
 * Test Script for Supporters Discussion Feature
 * 
 * This script tests the new PetitionSupporters component
 * Run with: node test-supporters-discussion.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function testSupportersDiscussion() {
  console.log('🧪 Testing Supporters Discussion Feature\n');
  console.log('=' .repeat(60));

  try {
    // Test 1: Find a petition with data
    console.log('\n📋 Test 1: Finding petition with comments and signatures...');
    
    const petitionsSnapshot = await db
      .collection('petitions')
      .where('status', '==', 'approved')
      .limit(1)
      .get();

    if (petitionsSnapshot.empty) {
      console.log('⚠️  No approved petitions found. Creating test data...');
      await createTestData();
      return;
    }

    const petition = petitionsSnapshot.docs[0];
    const petitionId = petition.id;
    const petitionData = petition.data();

    console.log(`✅ Found petition: ${petitionData.title}`);
    console.log(`   ID: ${petitionId}`);
    console.log(`   Signatures: ${petitionData.currentSignatures || 0}`);

    // Test 2: Check comments
    console.log('\n💬 Test 2: Checking comments...');
    const commentsSnapshot = await db
      .collection('comments')
      .where('petitionId', '==', petitionId)
      .get();

    console.log(`✅ Found ${commentsSnapshot.size} comments`);
    
    if (commentsSnapshot.size > 0) {
      const sampleComment = commentsSnapshot.docs[0].data();
      console.log(`   Sample: "${sampleComment.content.substring(0, 50)}..."`);
      console.log(`   Author: ${sampleComment.authorName}`);
      console.log(`   Likes: ${sampleComment.likes || 0}`);
    }

    // Test 3: Check signatures
    console.log('\n✍️  Test 3: Checking signatures...');
    const signaturesSnapshot = await db
      .collection('signatures')
      .where('petitionId', '==', petitionId)
      .get();

    console.log(`✅ Found ${signaturesSnapshot.size} signatures`);
    
    if (signaturesSnapshot.size > 0) {
      const sampleSignature = signaturesSnapshot.docs[0].data();
      console.log(`   Sample: ${sampleSignature.signerName || sampleSignature.name}`);
      console.log(`   Location: ${sampleSignature.signerLocation?.country || 'N/A'}`);
      console.log(`   Has comment: ${sampleSignature.comment ? 'Yes' : 'No'}`);
    }

    // Test 4: Check signatures with comments
    console.log('\n💭 Test 4: Checking signatures with comments...');
    const signaturesWithComments = signaturesSnapshot.docs.filter(
      doc => doc.data().comment && doc.data().comment.trim() !== ''
    );

    console.log(`✅ Found ${signaturesWithComments.length} signatures with comments`);
    
    if (signaturesWithComments.length > 0) {
      const sample = signaturesWithComments[0].data();
      console.log(`   Sample: "${sample.comment.substring(0, 50)}..."`);
    }

    // Test 5: Data structure validation
    console.log('\n🔍 Test 5: Validating data structures...');
    
    let validationErrors = [];

    // Check comment structure
    commentsSnapshot.docs.forEach((doc, index) => {
      const comment = doc.data();
      if (!comment.petitionId) validationErrors.push(`Comment ${index}: Missing petitionId`);
      if (!comment.authorId) validationErrors.push(`Comment ${index}: Missing authorId`);
      if (!comment.authorName) validationErrors.push(`Comment ${index}: Missing authorName`);
      if (!comment.content) validationErrors.push(`Comment ${index}: Missing content`);
      if (!comment.createdAt) validationErrors.push(`Comment ${index}: Missing createdAt`);
    });

    // Check signature structure
    signaturesSnapshot.docs.forEach((doc, index) => {
      const signature = doc.data();
      if (!signature.petitionId) validationErrors.push(`Signature ${index}: Missing petitionId`);
      if (!signature.signerName && !signature.name) {
        validationErrors.push(`Signature ${index}: Missing signerName/name`);
      }
    });

    if (validationErrors.length === 0) {
      console.log('✅ All data structures are valid');
    } else {
      console.log('⚠️  Found validation issues:');
      validationErrors.forEach(error => console.log(`   - ${error}`));
    }

    // Test 6: Component requirements check
    console.log('\n⚙️  Test 6: Checking component requirements...');
    
    const requirements = {
      'Comments with likes field': commentsSnapshot.docs.every(doc => 
        doc.data().hasOwnProperty('likes')
      ),
      'Comments with likedBy field': commentsSnapshot.docs.every(doc => 
        doc.data().hasOwnProperty('likedBy')
      ),
      'Signatures with createdAt': signaturesSnapshot.docs.every(doc => 
        doc.data().createdAt || doc.data().verifiedAt
      ),
    };

    Object.entries(requirements).forEach(([req, passed]) => {
      console.log(`   ${passed ? '✅' : '⚠️ '} ${req}`);
    });

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`Petition ID: ${petitionId}`);
    console.log(`Total Comments: ${commentsSnapshot.size}`);
    console.log(`Total Signatures: ${signaturesSnapshot.size}`);
    console.log(`Signatures with Comments: ${signaturesWithComments.length}`);
    console.log(`Total Items in "All" View: ${commentsSnapshot.size + signaturesWithComments.length}`);
    console.log(`Validation Errors: ${validationErrors.length}`);
    
    console.log('\n🌐 Test the feature at:');
    console.log(`   http://localhost:3001/petitions/${petitionId}`);
    console.log(`   Click on the "Supporters" tab`);
    
    console.log('\n✅ Testing complete!');

  } catch (error) {
    console.error('❌ Error during testing:', error);
    throw error;
  }
}

async function createTestData() {
  console.log('\n🔧 Creating test data...');
  
  try {
    // Create a test petition
    const petitionRef = await db.collection('petitions').add({
      title: 'Test Petition for Supporters Discussion',
      description: 'This is a test petition to verify the Supporters Discussion feature.',
      category: 'Testing',
      status: 'approved',
      currentSignatures: 0,
      targetSignatures: 100,
      creatorId: 'test-user-id',
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      viewCount: 0,
      shareCount: 0,
    });

    console.log(`✅ Created test petition: ${petitionRef.id}`);

    // Create test comments
    const comments = [
      {
        petitionId: petitionRef.id,
        authorId: 'user-1',
        authorName: 'Test User 1',
        content: 'This is a great initiative! I fully support this.',
        createdAt: admin.firestore.Timestamp.now(),
        isAnonymous: false,
        likes: 5,
        likedBy: ['user-2', 'user-3', 'user-4', 'user-5', 'user-6'],
      },
      {
        petitionId: petitionRef.id,
        authorId: 'user-2',
        authorName: 'Anonymous',
        content: 'I prefer to stay anonymous but this is important.',
        createdAt: admin.firestore.Timestamp.now(),
        isAnonymous: true,
        likes: 2,
        likedBy: ['user-1', 'user-3'],
      },
    ];

    for (const comment of comments) {
      await db.collection('comments').add(comment);
    }

    console.log(`✅ Created ${comments.length} test comments`);

    // Create test signatures
    const signatures = [
      {
        petitionId: petitionRef.id,
        userId: 'user-3',
        signerName: 'Test Signer 1',
        signerPhone: '+212600000001',
        signerLocation: { city: 'Casablanca', country: 'Morocco' },
        comment: 'Happy to support this important cause!',
        createdAt: admin.firestore.Timestamp.now(),
        verifiedAt: admin.firestore.Timestamp.now(),
      },
      {
        petitionId: petitionRef.id,
        userId: 'user-4',
        signerName: 'Test Signer 2',
        signerPhone: '+212600000002',
        signerLocation: { city: 'Rabat', country: 'Morocco' },
        createdAt: admin.firestore.Timestamp.now(),
        verifiedAt: admin.firestore.Timestamp.now(),
      },
    ];

    for (const signature of signatures) {
      await db.collection('signatures').add(signature);
    }

    console.log(`✅ Created ${signatures.length} test signatures`);

    // Update petition signature count
    await petitionRef.update({
      currentSignatures: signatures.length,
    });

    console.log('\n✅ Test data created successfully!');
    console.log(`\n🌐 Test at: http://localhost:3001/petitions/${petitionRef.id}`);

  } catch (error) {
    console.error('❌ Error creating test data:', error);
    throw error;
  }
}

// Run the tests
testSupportersDiscussion()
  .then(() => {
    console.log('\n✨ All tests completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Tests failed:', error);
    process.exit(1);
  });
