// Script to fix petitions with undefined creatorId
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc, query, where } = require('firebase/firestore');

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

async function fixUndefinedCreatorIds() {
  console.log('🔄 Fixing petitions with undefined creatorId...\n');
  
  const petitionsSnapshot = await getDocs(collection(db, 'petitions'));
  
  console.log(`📊 Found ${petitionsSnapshot.size} petitions to check\n`);
  
  let fixed = 0;
  let skipped = 0;
  
  for (const petitionDoc of petitionsSnapshot.docs) {
    const petition = petitionDoc.data();
    const petitionId = petitionDoc.id;
    
    // Check if creatorId is undefined or null
    if (!petition.creatorId) {
      console.log(`🔧 Fixing petition ${petitionId} - setting creatorName to Anonymous`);
      
      try {
        await updateDoc(doc(db, 'petitions', petitionId), {
          creatorName: 'Anonymous',
          updatedAt: new Date(),
        });
        
        console.log(`✅ Fixed petition ${petitionId}`);
        fixed++;
      } catch (error) {
        console.error(`❌ Error fixing petition ${petitionId}:`, error.message);
      }
    } else {
      console.log(`⏭️  Skipping petition ${petitionId} - has valid creatorId: ${petition.creatorId}`);
      skipped++;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`   🔧 Fixed: ${fixed}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   📝 Total: ${petitionsSnapshot.size}`);
  
  process.exit(0);
}

fixUndefinedCreatorIds().catch(console.error);