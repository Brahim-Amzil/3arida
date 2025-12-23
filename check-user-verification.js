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

async function checkUserVerification() {
  try {
    // Get your user ID from command line or use a specific one
    const userId = process.argv[2];
    
    if (!userId) {
      console.log('Usage: node check-user-verification.js <userId>');
      console.log('\nTo find your user ID:');
      console.log('1. Go to Firebase Console > Authentication');
      console.log('2. Find your email and copy the User UID');
      return;
    }

    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      console.log('❌ User not found');
      return;
    }

    const userData = userDoc.data();
    console.log('\n📋 User Verification Status:');
    console.log('================================');
    console.log('Name:', userData.name);
    console.log('Email:', userData.email);
    console.log('Phone:', userData.phone || 'Not set');
    console.log('Email Verified:', userData.verifiedEmail ? '✅' : '❌');
    console.log('Phone Verified:', userData.verifiedPhone ? '✅' : '❌');
    console.log('Role:', userData.role);
    console.log('Active:', userData.isActive);
    console.log('\n');

    // If phone not verified, let's fix it
    if (!userData.verifiedPhone && userData.phone) {
      console.log('🔧 Phone number exists but not marked as verified');
      console.log('Would you like to mark it as verified? (This is a manual fix)');
      console.log('\nRun this command to fix:');
      console.log(`node fix-phone-verification.js ${userId}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkUserVerification();
