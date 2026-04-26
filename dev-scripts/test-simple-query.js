const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, limit } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function testSimpleQueries() {
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('Testing different query approaches...');
    
    // Test 1: Simple collection reference without any filters
    console.log('\n--- Test 1: Simple collection reference ---');
    try {
      const petitionsRef = collection(db, 'petitions');
      const snapshot = await getDocs(petitionsRef);
      console.log('✅ Simple query successful:', snapshot.size, 'documents');
    } catch (error) {
      console.error('❌ Simple query failed:', error.message);
    }

    // Test 2: Query with limit only
    console.log('\n--- Test 2: Query with limit only ---');
    try {
      const petitionsRef = collection(db, 'petitions');
      const q = query(petitionsRef, limit(5));
      const snapshot = await getDocs(q);
      console.log('✅ Limit query successful:', snapshot.size, 'documents');
    } catch (error) {
      console.error('❌ Limit query failed:', error.message);
    }

    // Test 3: Query with where clause
    console.log('\n--- Test 3: Query with where clause ---');
    try {
      const petitionsRef = collection(db, 'petitions');
      const q = query(petitionsRef, where('status', '==', 'approved'));
      const snapshot = await getDocs(q);
      console.log('✅ Where query successful:', snapshot.size, 'documents');
    } catch (error) {
      console.error('❌ Where query failed:', error.message);
      console.error('Error details:', error);
    }

    // Test 4: Check if collection exists
    console.log('\n--- Test 4: Check collection existence ---');
    try {
      const petitionsRef = collection(db, 'petitions');
      console.log('✅ Collection reference created successfully');
      console.log('Collection path:', petitionsRef.path);
    } catch (error) {
      console.error('❌ Collection reference failed:', error.message);
    }

  } catch (error) {
    console.error('Error in test:', error);
  }
}

testSimpleQueries();