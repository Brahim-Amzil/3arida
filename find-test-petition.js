/**
 * Find a petition to test with
 * This uses the client-side Firebase SDK
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, limit } = require('firebase/firestore');
const fs = require('fs');

// Read Firebase config from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const firebaseConfig = {};

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_FIREBASE_')) {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('='); // Handle values with = in them
    const configKey = key.replace('NEXT_PUBLIC_FIREBASE_', '').toLowerCase();
    
    // Map to correct Firebase config keys
    const keyMap = {
      'api_key': 'apiKey',
      'auth_domain': 'authDomain',
      'project_id': 'projectId',
      'storage_bucket': 'storageBucket',
      'messaging_sender_id': 'messagingSenderId',
      'app_id': 'appId',
    };
    
    const mappedKey = keyMap[configKey] || configKey;
    firebaseConfig[mappedKey] = value.trim();
  }
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function findTestPetition() {
  console.log('🔍 Finding petition to test with...\n');

  try {
    // Find approved petitions
    const petitionsRef = collection(db, 'petitions');
    const q = query(
      petitionsRef,
      where('status', '==', 'approved'),
      limit(5)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('⚠️  No approved petitions found.');
      console.log('\n💡 You can:');
      console.log('   1. Create a petition at http://localhost:3001/petitions/create');
      console.log('   2. Approve it from admin panel');
      console.log('   3. Then test the Supporters tab');
      return;
    }

    console.log(`✅ Found ${snapshot.size} approved petitions:\n`);

    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. ${data.title}`);
      console.log(`   URL: http://localhost:3001/petitions/${doc.id}`);
      console.log(`   Signatures: ${data.currentSignatures || 0}`);
      console.log(`   Status: ${data.status}`);
      console.log('');
    });

    console.log('🧪 To test the Supporters Discussion feature:');
    console.log('   1. Open one of the URLs above');
    console.log('   2. Click on the "Supporters" tab');
    console.log('   3. Follow the test guide in test-supporters-manual.md');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

findTestPetition();
