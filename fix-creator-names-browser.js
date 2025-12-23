/**
 * Browser console script to fix creator names
 * 
 * Instructions:
 * 1. Go to http://localhost:3001 and login as admin
 * 2. Open browser console (F12)
 * 3. Copy and paste this entire script
 * 4. Press Enter to run
 */

async function fixCreatorNames() {
  console.log('🔄 Starting migration to add creator names to petitions...\n');

  try {
    // Import Firebase functions
    const { collection, getDocs, doc, updateDoc, getDoc } = await import('firebase/firestore');
    const { db } = await import('/src/lib/firebase.js');

    // Get all petitions
    const petitionsSnapshot = await getDocs(collection(db, 'petitions'));
    console.log(`📊 Found ${petitionsSnapshot.size} petitions to process\n`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const petitionDoc of petitionsSnapshot.docs) {
      const petition = petitionDoc.data();
      const petitionId = petitionDoc.id;

      // Skip if already has creator name and it's not Anonymous
      if (petition.creatorName && petition.creatorName !== 'Anonymous') {
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
        const creatorName = userData.name || userData.displayName || 'Anonymous';

        // Update petition with creator name
        await updateDoc(doc(db, 'petitions', petitionId), {
          creatorName: creatorName,
          updatedAt: new Date(),
        });

        console.log(`✅ Updated petition ${petitionId} with creator name: ${creatorName}`);
        updated++;

        // Add small delay to avoid overwhelming Firestore
        await new Promise(resolve => setTimeout(resolve, 200));
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
    console.log('\n✨ Migration complete! Refresh the page to see updated creator names.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration
fixCreatorNames();