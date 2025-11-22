/**
 * Migration Script: Add Reference Codes to Existing Petitions (Client SDK Version)
 * 
 * This script uses Firebase Client SDK instead of Admin SDK,
 * so it works with your existing Firebase configuration.
 * 
 * Usage: node migrate-reference-codes-client.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc, query, where, limit } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase with client SDK
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

// Reference code generation functions
function generateReferenceCode() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  let code = '';
  // 2 random letters
  code += letters.charAt(Math.floor(Math.random() * letters.length));
  code += letters.charAt(Math.floor(Math.random() * letters.length));
  // 4 random numbers
  for (let i = 0; i < 4; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return code;
}

async function isReferenceCodeUnique(code, existingCodes) {
  return !existingCodes.has(code);
}

async function generateUniqueReferenceCode(existingCodes) {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const code = generateReferenceCode();
    const isUnique = await isReferenceCodeUnique(code, existingCodes);
    
    if (isUnique) {
      existingCodes.add(code);
      return code;
    }
    
    attempts++;
  }

  // Fallback: add timestamp digits if all attempts fail
  const timestamp = Date.now().toString().slice(-4);
  const fallbackCode = `ZZ${timestamp}`;
  existingCodes.add(fallbackCode);
  return fallbackCode;
}

async function migratePetitionReferenceCodes() {
  console.log('🚀 Starting reference code migration...\n');

  try {
    // Get all petitions
    const petitionsRef = collection(db, 'petitions');
    const snapshot = await getDocs(petitionsRef);

    if (snapshot.empty) {
      console.log('❌ No petitions found in database.');
      return;
    }

    console.log(`📊 Found ${snapshot.size} total petitions\n`);

    // Collect existing reference codes
    const existingCodes = new Set();
    const petitionsNeedingCodes = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.referenceCode) {
        existingCodes.add(data.referenceCode);
      } else {
        petitionsNeedingCodes.push({
          id: docSnap.id,
          title: data.title,
          ref: doc(db, 'petitions', docSnap.id),
        });
      }
    });

    console.log(`✅ ${existingCodes.size} petitions already have reference codes`);
    console.log(`⏳ ${petitionsNeedingCodes.length} petitions need reference codes\n`);

    if (petitionsNeedingCodes.length === 0) {
      console.log('🎉 All petitions already have reference codes! Nothing to do.');
      return;
    }

    // Generate and assign codes
    console.log('🔄 Generating reference codes...\n');
    
    let successCount = 0;
    let errorCount = 0;

    for (const petition of petitionsNeedingCodes) {
      try {
        const referenceCode = await generateUniqueReferenceCode(existingCodes);
        
        await updateDoc(petition.ref, {
          referenceCode,
          updatedAt: new Date(),
        });

        console.log(`✅ ${referenceCode} → "${petition.title.substring(0, 50)}${petition.title.length > 50 ? '...' : ''}"`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed for petition ${petition.id}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📈 Migration Summary:');
    console.log('='.repeat(60));
    console.log(`✅ Successfully updated: ${successCount} petitions`);
    console.log(`❌ Failed: ${errorCount} petitions`);
    console.log(`📊 Total processed: ${petitionsNeedingCodes.length} petitions`);
    console.log(`🎯 Unique codes generated: ${successCount}`);
    console.log('='.repeat(60));

    if (successCount > 0) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('💡 All petitions now have unique reference codes.');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration
migratePetitionReferenceCodes()
  .then(() => {
    console.log('\n✨ Script finished. Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
