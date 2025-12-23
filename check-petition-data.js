// Quick script to check what's in Firestore for the petition
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkPetition() {
  const petitionId = 'aGvAsfzw2u603LwWSzGF'; // The petition ID from the console
  
  const doc = await db.collection('petitions').doc(petitionId).get();
  
  if (doc.exists) {
    const data = doc.data();
    console.log('\n=== PETITION DATA IN FIRESTORE ===\n');
    console.log('Publisher Type:', data.publisherType);
    console.log('Publisher Name:', data.publisherName);
    console.log('Petition Type:', data.petitionType);
    console.log('Addressed To Type:', data.addressedToType);
    console.log('Addressed To Specific:', data.addressedToSpecific);
    console.log('YouTube Video URL:', data.youtubeVideoUrl);
    console.log('Media URLs:', data.mediaUrls);
    console.log('\n=== ALL FIELDS ===\n');
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log('Petition not found!');
  }
  
  process.exit(0);
}

checkPetition().catch(console.error);
