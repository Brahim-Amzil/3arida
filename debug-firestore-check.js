// Quick debug script to check Firestore
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./arida-c5faf-firebase-adminsdk-3a8x6-1e924b6e47.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkFirestore() {
  try {
    console.log('Checking Firestore users collection...');
    
    const usersSnapshot = await db.collection('users').limit(5).get();
    console.log(`Found ${usersSnapshot.size} user documents`);
    
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`User ${doc.id}:`, {
        email: data.email,
        verifiedEmail: data.verifiedEmail,
        name: data.name,
        createdAt: data.createdAt
      });
    });
    
    console.log('\nChecking email verification tokens...');
    const tokensSnapshot = await db.collection('emailVerificationTokens').limit(5).get();
    console.log(`Found ${tokensSnapshot.size} verification tokens`);
    
    tokensSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`Token ${doc.id}:`, {
        userId: data.userId,
        email: data.email,
        isUsed: data.isUsed,
        expiresAt: data.expiresAt
      });
    });
    
  } catch (error) {
    console.error('Error checking Firestore:', error);
  }
}

checkFirestore();