const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkRecentPetitions() {
  try {
    const petitionsRef = db.collection('petitions');
    const snapshot = await petitionsRef
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();
    
    console.log('\n=== Last 5 Petitions ===\n');
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`Title: ${data.title}`);
      console.log(`Status: ${data.status}`);
      console.log(`Creator: ${data.creatorId}`);
      console.log(`Created: ${data.createdAt?.toDate()}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

checkRecentPetitions();
