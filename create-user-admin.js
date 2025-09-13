const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'arida-c5faf'
  });
}

const db = admin.firestore();

async function createUserDocument() {
  try {
    const userData = {
      id: "R4lEGogkyca79pB5Wfu9xFLwxBh1",
      email: "3aridapp@gmail.com",
      name: "3arida App",
      verifiedEmail: true,
      emailVerified: true,
      emailVerifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      role: "user",
      status: "active"
    };

    await db.collection('users').doc(userData.id).set(userData);
    console.log('✅ User document created successfully with Admin SDK!');
    console.log('User data:', userData);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating user document:', error);
    process.exit(1);
  }
}

createUserDocument();