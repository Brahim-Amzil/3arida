const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('🔧 Firebase Config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey,
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function debugPetitions() {
  try {
    console.log('\n📋 Checking all petitions...');
    const petitionsRef = collection(db, 'petitions');
    const allPetitionsSnapshot = await getDocs(petitionsRef);
    
    console.log(`Total petitions in database: ${allPetitionsSnapshot.size}`);
    
    if (allPetitionsSnapshot.size > 0) {
      console.log('\n📝 All petitions:');
      allPetitionsSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`- ID: ${doc.id}`);
        console.log(`  Title: ${data.title}`);
        console.log(`  Status: ${data.status}`);
        console.log(`  Creator: ${data.creatorId}`);
        console.log(`  Created: ${data.createdAt?.toDate()}`);
        console.log('');
      });
    }

    console.log('\n✅ Checking approved petitions...');
    const approvedQuery = query(petitionsRef, where('status', '==', 'approved'));
    const approvedSnapshot = await getDocs(approvedQuery);
    
    console.log(`Approved petitions: ${approvedSnapshot.size}`);
    
    if (approvedSnapshot.size > 0) {
      console.log('\n📝 Approved petitions:');
      approvedSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`- ID: ${doc.id}`);
        console.log(`  Title: ${data.title}`);
        console.log(`  Status: ${data.status}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugPetitions();