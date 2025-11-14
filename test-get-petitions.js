// Test script to directly test getPetitions function
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, orderBy, limit, getDocs } = require('firebase/firestore');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testGetPetitions() {
  try {
    // Initialize Firebase
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
    
    console.log('✅ Firebase initialized');

    // Test 1: Get all petitions
    console.log('\n🔍 Test 1: Getting all petitions...');
    const allQuery = query(collection(db, 'petitions'));
    const allSnapshot = await getDocs(allQuery);
    console.log(`Found ${allSnapshot.size} total petitions`);

    // Test 2: Get approved petitions only
    console.log('\n🔍 Test 2: Getting approved petitions...');
    const approvedQuery = query(
      collection(db, 'petitions'),
      where('status', '==', 'approved')
    );
    const approvedSnapshot = await getDocs(approvedQuery);
    console.log(`Found ${approvedSnapshot.size} approved petitions`);

    // Test 3: Get approved petitions with sorting (like the app does)
    console.log('\n🔍 Test 3: Getting approved petitions with sorting...');
    const sortedQuery = query(
      collection(db, 'petitions'),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc'),
      limit(3)
    );
    const sortedSnapshot = await getDocs(sortedQuery);
    console.log(`Found ${sortedSnapshot.size} sorted approved petitions`);

    // Show details of the sorted petitions
    sortedSnapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`  ${index + 1}. ${data.title} (status: ${data.status})`);
    });

    // Test 4: Try the exact query the app uses for featured petitions
    console.log('\n🔍 Test 4: Testing featured petitions query (by signatures)...');
    try {
      const featuredQuery = query(
        collection(db, 'petitions'),
        where('status', '==', 'approved'),
        orderBy('currentSignatures', 'desc'),
        limit(3)
      );
      const featuredSnapshot = await getDocs(featuredQuery);
      console.log(`Found ${featuredSnapshot.size} featured petitions`);
      
      featuredSnapshot.forEach((doc, index) => {
        const data = doc.data();
        console.log(`  ${index + 1}. ${data.title} (signatures: ${data.currentSignatures || 0})`);
      });
    } catch (err) {
      console.error('❌ Error with featured query:', err.message);
      console.log('This might be due to missing index for currentSignatures field');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGetPetitions();