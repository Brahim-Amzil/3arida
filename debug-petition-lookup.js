/**
 * Debug script to test petition lookup
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');

// Firebase config (you'll need to replace with your actual config)
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

async function debugPetitionLookup() {
  try {
    console.log('🔍 Debugging petition lookup...\n');

    // 1. Check if the malformed ID exists as a document
    const malformedId = '--dUxECoIo';
    console.log(`1. Checking if "${malformedId}" exists as document ID...`);
    
    try {
      const docRef = doc(db, 'petitions', malformedId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log('✅ Document exists with malformed ID!');
        console.log('Data:', docSnap.data());
      } else {
        console.log('❌ No document with this ID');
      }
    } catch (error) {
      console.log('❌ Error checking document:', error.message);
    }

    // 2. Check if it exists as a reference code
    console.log(`\n2. Checking if "${malformedId}" exists as reference code...`);
    
    try {
      const { query, where } = await import('firebase/firestore');
      const q = query(
        collection(db, 'petitions'),
        where('referenceCode', '==', malformedId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        console.log('✅ Found petition with this reference code!');
        querySnapshot.forEach((doc) => {
          console.log('Document ID:', doc.id);
          console.log('Data:', doc.data());
        });
      } else {
        console.log('❌ No petition with this reference code');
      }
    } catch (error) {
      console.log('❌ Error checking reference code:', error.message);
    }

    // 3. List first 5 petitions to see their structure
    console.log('\n3. Listing first 5 petitions...');
    
    try {
      const petitionsRef = collection(db, 'petitions');
      const snapshot = await getDocs(petitionsRef);
      
      let count = 0;
      snapshot.forEach((doc) => {
        if (count < 5) {
          console.log(`\nPetition ${count + 1}:`);
          console.log('ID:', doc.id);
          const data = doc.data();
          console.log('Title:', data.title);
          console.log('Reference Code:', data.referenceCode);
          console.log('Status:', data.status);
          count++;
        }
      });
      
      console.log(`\nTotal petitions in database: ${snapshot.size}`);
    } catch (error) {
      console.log('❌ Error listing petitions:', error.message);
    }

  } catch (error) {
    console.error('❌ Debug script failed:', error);
  }
}

// Run the debug
debugPetitionLookup();