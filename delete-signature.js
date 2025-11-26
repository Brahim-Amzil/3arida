const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function deleteSignature(signatureId) {
  try {
    console.log('🗑️  Deleting signature:', signatureId);
    
    // Get signature first to show what we're deleting
    const signatureRef = db.collection('signatures').doc(signatureId);
    const doc = await signatureRef.get();
    
    if (!doc.exists) {
      console.log('❌ Signature not found');
      return;
    }
    
    const data = doc.data();
    console.log('📄 Signature data:', {
      signerName: data.signerName,
      signerPhone: data.signerPhone,
      petitionId: data.petitionId,
      createdAt: data.createdAt?.toDate()
    });
    
    // Delete the signature
    await signatureRef.delete();
    console.log('✅ Signature deleted');
    
    // Decrement petition signature count
    const petitionRef = db.collection('petitions').doc(data.petitionId);
    await petitionRef.update({
      currentSignatures: admin.firestore.FieldValue.increment(-1),
      updatedAt: new Date()
    });
    console.log('✅ Petition signature count decremented');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

const signatureId = process.argv[2];

if (!signatureId) {
  console.log('Usage: node delete-signature.js <signatureId>');
  process.exit(1);
}

deleteSignature(signatureId).then(() => {
  console.log('\n✅ Done');
  process.exit(0);
});
