const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function testPetitionData() {
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('Fetching petition data...');
    const petitionsRef = collection(db, 'petitions');
    const q = query(petitionsRef, where('status', '==', 'approved'));
    const querySnapshot = await getDocs(q);

    console.log(`Found ${querySnapshot.size} approved petitions`);
    
    querySnapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`\n--- Petition ${index + 1} (ID: ${doc.id}) ---`);
      console.log('Title:', data.title);
      console.log('Title type:', typeof data.title);
      console.log('Description:', data.description?.substring(0, 100) + '...');
      console.log('Category:', data.category);
      console.log('Status:', data.status);
      console.log('Current Signatures:', data.currentSignatures);
      console.log('Target Signatures:', data.targetSignatures);
      console.log('Created At:', data.createdAt);
      console.log('Raw data keys:', Object.keys(data));
    });

  } catch (error) {
    console.error('Error testing petition data:', error);
  }
}

testPetitionData();