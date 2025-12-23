// Client-side script to check creator names in petitions
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, limit, query } = require('firebase/firestore');

require('dotenv').config({ path: '.env.local' });

// Firebase config from environment variables
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

async function checkCreatorNames() {
  console.log('🔍 Checking creator names in petitions...\n');
  
  const petitionsSnapshot = await getDocs(query(collection(db, 'petitions'), limit(10)));
  
  console.log(`📊 Found ${petitionsSnapshot.size} petitions (showing first 10):\n`);
  
  let anonymousCount = 0;
  let namedCount = 0;
  let missingCount = 0;
  
  petitionsSnapshot.forEach((doc) => {
    const data = doc.data();
    const creatorName = data.creatorName;
    
    if (!creatorName) {
      console.log(`❌ ${doc.id}: NO creatorName field`);
      missingCount++;
    } else if (creatorName === 'Anonymous') {
      console.log(`⚠️  ${doc.id}: creatorName = "Anonymous"`);
      anonymousCount++;
    } else {
      console.log(`✅ ${doc.id}: creatorName = "${creatorName}"`);
      namedCount++;
    }
    
    console.log(`   Title: ${data.title?.substring(0, 50)}...`);
    console.log(`   Creator ID: ${data.creatorId}`);
    console.log('');
  });
  
  console.log('📊 Summary:');
  console.log(`   ✅ Named creators: ${namedCount}`);
  console.log(`   ⚠️  Anonymous: ${anonymousCount}`);
  console.log(`   ❌ Missing creatorName: ${missingCount}`);
  console.log(`   📝 Total checked: ${petitionsSnapshot.size}`);
  
  process.exit(0);
}

checkCreatorNames().catch(console.error);