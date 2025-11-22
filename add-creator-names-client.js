/**
 * Client-side migration script to add creator names to existing petitions
 * Run this in the browser console while logged in as admin
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';

// Your Firebase config (from .env.local)
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

async function addCreatorNames() {
  try {
    console.log('🔄 Starting migration to add creator names to petitions...\n');

    // Get all petitions
    const petitionsSnapshot = await getDocs(collection(db, 'petitions'));
    console.log(`📊 Found ${petitionsSnapshot.size} petitions to process\n`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const petitionDoc of petitionsSnapshot.docs) {
      const petition = petitionDoc.data();
      const petitionId = petitionDoc.id;

      // Skip if already has creator name
      if (petition.creatorName) {
        console.log(`⏭️  Skipping ${petitionId} - already has creator name: ${petition.creatorName}`);
        skipped++;
        continue;
      }

      try {
        // Get creator user document
        const userDocRef = doc(db, 'users', petition.creatorId);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          console.log(`⚠️  Warning: User ${petition.creatorId} not found for petition ${petitionId}`);
          errors++;
          continue;
        }

        const userData = userDoc.data();
        const creatorName = userData.name || 'Anonymous';

        // Update petition with creator name
        await updateDoc(doc(db, 'petitions', petitionId), {
          creatorName: creatorName,
          updatedAt: new Date(),
        });

        console.log(`✅ Updated petition ${petitionId} with creator name: ${creatorName}`);
        updated++;
      } catch (error) {
        console.error(`❌ Error processing petition ${petitionId}:`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📝 Total: ${petitionsSnapshot.size}`);
    console.log('\n✨ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
addCreatorNames();
