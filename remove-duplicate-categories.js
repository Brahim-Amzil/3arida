/**
 * Script to remove duplicate categories from Firestore
 * Keeps the first occurrence of each category name
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');

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

async function removeDuplicateCategories() {
  try {
    console.log('🔍 Fetching all categories...');
    
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    console.log(`📊 Found ${categoriesSnapshot.size} categories`);

    const seenNames = new Set();
    const duplicates = [];
    const kept = [];

    categoriesSnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const name = data.name;

      if (seenNames.has(name)) {
        // This is a duplicate
        duplicates.push({
          id: docSnapshot.id,
          name: name,
        });
      } else {
        // First occurrence, keep it
        seenNames.add(name);
        kept.push({
          id: docSnapshot.id,
          name: name,
        });
      }
    });

    console.log(`\n✅ Keeping ${kept.length} unique categories:`);
    kept.forEach((cat) => console.log(`  - ${cat.name} (${cat.id})`));

    console.log(`\n❌ Found ${duplicates.length} duplicates to remove:`);
    duplicates.forEach((cat) => console.log(`  - ${cat.name} (${cat.id})`));

    if (duplicates.length === 0) {
      console.log('\n✨ No duplicates found! Database is clean.');
      return;
    }

    console.log('\n🗑️  Removing duplicates...');
    for (const duplicate of duplicates) {
      await deleteDoc(doc(db, 'categories', duplicate.id));
      console.log(`  ✓ Deleted ${duplicate.name} (${duplicate.id})`);
    }

    console.log('\n✨ Cleanup complete!');
    console.log(`📈 Removed: ${duplicates.length} duplicate categories`);
    console.log(`✓ Kept: ${kept.length} unique categories`);

  } catch (error) {
    console.error('❌ Error removing duplicate categories:', error);
    throw error;
  }
}

// Run the script
removeDuplicateCategories()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
