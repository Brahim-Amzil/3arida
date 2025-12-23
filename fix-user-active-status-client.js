/**
 * Client-side script to fix isActive status for existing users
 * Run this in the browser console while logged in as admin
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

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

async function fixUserActiveStatus() {
  try {
    console.log('🔍 Fetching all users...');
    
    const usersSnapshot = await getDocs(collection(db, 'users'));
    console.log(`📊 Found ${usersSnapshot.size} users`);

    let updatedCount = 0;
    let alreadyActiveCount = 0;
    let errorCount = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      try {
        // Check if isActive field is missing or false
        if (userData.isActive === undefined || userData.isActive === null) {
          console.log(`✅ Setting isActive=true for user: ${userData.email || userDoc.id}`);
          await updateDoc(doc(db, 'users', userDoc.id), {
            isActive: true,
            updatedAt: new Date(),
          });
          updatedCount++;
        } else if (userData.isActive === true) {
          alreadyActiveCount++;
        } else {
          console.log(`⚠️  User ${userData.email || userDoc.id} is explicitly inactive`);
        }
      } catch (error) {
        console.error(`❌ Error updating user ${userDoc.id}:`, error);
        errorCount++;
      }
    }

    console.log('\n✨ Migration complete!');
    console.log(`📈 Updated: ${updatedCount} users`);
    console.log(`✓ Already active: ${alreadyActiveCount} users`);
    console.log(`❌ Errors: ${errorCount} users`);
    console.log(`📊 Total: ${usersSnapshot.size} users`);

  } catch (error) {
    console.error('❌ Error fixing user active status:', error);
    throw error;
  }
}

// Export for use
export { fixUserActiveStatus };

// Auto-run if called directly
if (typeof window !== 'undefined') {
  window.fixUserActiveStatus = fixUserActiveStatus;
  console.log('💡 Run fixUserActiveStatus() in the console to fix user active status');
}
