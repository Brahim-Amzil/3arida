const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkSignatures(petitionId, phoneNumber) {
  try {
    console.log('🔍 Checking signatures for petition:', petitionId);
    console.log('📱 Phone number:', phoneNumber);
    
    // Get all signatures for this petition
    const signaturesRef = db.collection('signatures');
    const query = signaturesRef.where('petitionId', '==', petitionId);
    
    const snapshot = await query.get();
    
    console.log(`\n📊 Total signatures for this petition: ${snapshot.size}`);
    
    if (phoneNumber) {
      // Check for specific phone number
      const phoneQuery = signaturesRef
        .where('petitionId', '==', petitionId)
        .where('signerPhone', '==', phoneNumber);
      
      const phoneSnapshot = await phoneQuery.get();
      
      if (!phoneSnapshot.empty) {
        console.log('\n✅ Found signature(s) with this phone number:');
        phoneSnapshot.forEach(doc => {
          const data = doc.data();
          console.log({
            id: doc.id,
            signerName: data.signerName,
            signerPhone: data.signerPhone,
            createdAt: data.createdAt?.toDate(),
            userId: data.userId
          });
        });
        
        // Ask if user wants to delete
        console.log('\n⚠️  To delete these signatures for testing, run:');
        phoneSnapshot.forEach(doc => {
          console.log(`node delete-signature.js ${doc.id}`);
        });
      } else {
        console.log('\n❌ No signature found with this phone number');
      }
    } else {
      // Show all signatures
      console.log('\n📋 All signatures:');
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log({
          id: doc.id,
          signerName: data.signerName,
          signerPhone: data.signerPhone,
          createdAt: data.createdAt?.toDate(),
          userId: data.userId
        });
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Get petition ID and phone from command line
const petitionId = process.argv[2];
const phoneNumber = process.argv[3];

if (!petitionId) {
  console.log('Usage: node check-signatures.js <petitionId> [phoneNumber]');
  console.log('Example: node check-signatures.js abc123');
  console.log('Example: node check-signatures.js abc123 +212600000000');
  process.exit(1);
}

checkSignatures(petitionId, phoneNumber).then(() => {
  console.log('\n✅ Done');
  process.exit(0);
});
