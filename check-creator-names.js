// Quick script to check creator names in petitions
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkCreatorNames() {
  console.log('🔍 Checking creator names in petitions...\n');
  
  const petitionsSnapshot = await db.collection('petitions').limit(10).get();
  
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