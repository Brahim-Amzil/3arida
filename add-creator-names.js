/**
 * Migration script to add creator names to existing petitions
 * Run with: node add-creator-names.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function addCreatorNames() {
  try {
    console.log('🔄 Starting migration to add creator names to petitions...\n');

    // Get all petitions
    const petitionsSnapshot = await db.collection('petitions').get();
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
        const userDoc = await db.collection('users').doc(petition.creatorId).get();
        
        if (!userDoc.exists) {
          console.log(`⚠️  Warning: User ${petition.creatorId} not found for petition ${petitionId}`);
          errors++;
          continue;
        }

        const userData = userDoc.data();
        const creatorName = userData.name || 'Anonymous';

        // Update petition with creator name
        await db.collection('petitions').doc(petitionId).update({
          creatorName: creatorName,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
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

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

addCreatorNames();
