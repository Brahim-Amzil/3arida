/**
 * Script to fix isActive status for existing users
 * This ensures all users have isActive: true by default
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function fixUserActiveStatus() {
  try {
    console.log('🔍 Fetching all users...');
    
    const usersSnapshot = await db.collection('users').get();
    console.log(`📊 Found ${usersSnapshot.size} users`);

    let updatedCount = 0;
    let alreadyActiveCount = 0;
    const batch = db.batch();
    let batchCount = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      // Check if isActive field is missing or false
      if (userData.isActive === undefined || userData.isActive === null) {
        console.log(`✅ Setting isActive=true for user: ${userData.email || userDoc.id}`);
        batch.update(userDoc.ref, {
          isActive: true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        updatedCount++;
        batchCount++;

        // Commit batch every 500 operations (Firestore limit)
        if (batchCount >= 500) {
          await batch.commit();
          console.log(`💾 Committed batch of ${batchCount} updates`);
          batchCount = 0;
        }
      } else if (userData.isActive === true) {
        alreadyActiveCount++;
      } else {
        console.log(`⚠️  User ${userData.email || userDoc.id} is explicitly inactive`);
      }
    }

    // Commit remaining updates
    if (batchCount > 0) {
      await batch.commit();
      console.log(`💾 Committed final batch of ${batchCount} updates`);
    }

    console.log('\n✨ Migration complete!');
    console.log(`📈 Updated: ${updatedCount} users`);
    console.log(`✓ Already active: ${alreadyActiveCount} users`);
    console.log(`📊 Total: ${usersSnapshot.size} users`);

  } catch (error) {
    console.error('❌ Error fixing user active status:', error);
    throw error;
  }
}

// Run the script
fixUserActiveStatus()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
