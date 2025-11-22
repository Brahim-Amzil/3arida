/**
 * Get the first user ID from Firestore
 */

require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, limit, query } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getUserId() {
  try {
    const usersQuery = query(collection(db, 'users'), limit(1));
    const snapshot = await getDocs(usersQuery);
    
    if (snapshot.empty) {
      console.log('No users found');
      process.exit(1);
    }
    
    const userId = snapshot.docs[0].id;
    const userData = snapshot.docs[0].data();
    
    console.log(userId);
    console.error(`Using user: ${userData.name || userData.email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

getUserId();
