#!/usr/bin/env node

/**
 * Server-side script to add creator names to existing petitions
 * Run with: node fix-creator-names.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  // Try to use service account key if available, otherwise use default credentials
  try {
    const serviceAccount = require('./firebase-service-account.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'arida-c5faf'
    });
  } catch (error) {
    // Fallback to default credentials (works in Firebase Functions or with GOOGLE_APPLICATION_CREDENTIALS)
    admin.initializeApp({
      projectId: 'arida-c5faf'
    });
  }
}

const db = admin.firestore();

async function fixCreatorNames() {
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
      if (petition.creatorName && petition.creatorName !== 'Anonymous') {
        console.log(`⏭️  Skipping ${petitionId} - already has creator name: ${petition.creatorName}`);
        skipped++;
        continue;
      }

      try {
        // Check if creatorId is valid
        if (!petition.creatorId || typeof petition.creatorId !== 'string' || petition.creatorId.trim() === '') {
          console.log(`⚠️  Warning: Petition ${petitionId} has invalid creatorId: ${petition.creatorId}`);
          
          // Update petition with Anonymous creator name
          await db.collection('petitions').doc(petitionId).update({
            creatorName: 'Anonymous',
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          console.log(`✅ Updated petition ${petitionId} with creator name: Anonymous (invalid creatorId)`);
          updated++;
          continue;
        }

        // Get creator user document
        const userDoc = await db.collection('users').doc(petition.creatorId).get();
        
        if (!userDoc.exists) {
          console.log(`⚠️  Warning: User ${petition.creatorId} not found for petition ${petitionId}`);
          
          // Try to get creator name from auth user
          try {
            const userRecord = await admin.auth().getUser(petition.creatorId);
            const creatorName = userRecord.displayName || userRecord.email?.split('@')[0] || 'Anonymous';
            
            // Update petition with creator name from auth
            await db.collection('petitions').doc(petitionId).update({
              creatorName: creatorName,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log(`✅ Updated petition ${petitionId} with auth creator name: ${creatorName}`);
            updated++;
          } catch (authError) {
            console.log(`❌ Could not find auth user for ${petition.creatorId}`);
            errors++;
          }
          continue;
        }

        const userData = userDoc.data();
        const creatorName = userData.name || userData.displayName || 'Anonymous';

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

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
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
fixCreatorNames().then(() => {
  console.log('🎉 Script completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});