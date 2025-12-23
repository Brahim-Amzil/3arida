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

async function fixPhoneVerification() {
  try {
    const userId = process.argv[2];
    const phoneNumber = process.argv[3];

    if (!userId) {
      console.log('Usage: node fix-phone-verification.js <userId> [phoneNumber]');
      console.log('\nExample: node fix-phone-verification.js abc123 +34613658220');
      console.log('\nTo find your user ID:');
      console.log('1. Go to Firebase Console > Authentication');
      console.log('2. Find your email and copy the User UID');
      return;
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.log('❌ User not found');
      return;
    }

    const userData = userDoc.data();
    console.log('\n📋 Current User Status:');
    console.log('================================');
    console.log('Name:', userData.name);
    console.log('Email:', userData.email);
    console.log('Phone:', userData.phone || 'Not set');
    console.log('Phone Verified:', userData.verifiedPhone ? '✅' : '❌');

    // Update verification status
    const updateData = {
      verifiedPhone: true,
      updatedAt: new Date(),
    };

    if (phoneNumber) {
      updateData.phone = phoneNumber;
    }

    await userRef.update(updateData);

    console.log('\n✅ Phone verification updated successfully!');
    console.log('Phone:', phoneNumber || userData.phone);
    console.log('Verified: ✅ true');
    console.log('\nRefresh your profile page to see the changes.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

fixPhoneVerification();
