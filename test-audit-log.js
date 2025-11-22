// Test script to verify audit logging works
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp, getDocs } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

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

async function testAuditLog() {
  console.log('🧪 Testing audit log system...\n');

  try {
    // Test 1: Write a test log
    console.log('1️⃣ Writing test audit log...');
    const testLog = {
      timestamp: serverTimestamp(),
      actorId: 'test-moderator-123',
      actorName: 'Test Moderator',
      actorEmail: 'test@example.com',
      actorRole: 'moderator',
      action: 'petition.approved',
      targetType: 'petition',
      targetId: 'test-petition-123',
      targetName: 'Test Petition',
      details: {
        oldValue: 'pending',
        newValue: 'approved',
        reason: 'Test log entry',
      },
    };

    const docRef = await addDoc(collection(db, 'auditLogs'), testLog);
    console.log('✅ Test log written successfully! ID:', docRef.id);

    // Test 2: Read back the logs
    console.log('\n2️⃣ Reading audit logs...');
    const logsSnapshot = await getDocs(collection(db, 'auditLogs'));
    console.log(`✅ Found ${logsSnapshot.size} audit log(s) in database`);

    if (logsSnapshot.size > 0) {
      console.log('\n📋 Audit Logs:');
      logsSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`  - ${data.actorName} performed ${data.action} on ${data.targetName}`);
      });
    }

    console.log('\n✅ Audit logging system is working correctly!');
    console.log('💡 Now try approving/rejecting a petition to see it logged automatically.');
  } catch (error) {
    console.error('\n❌ Error testing audit log:', error);
    console.error('\n🔍 This might be a Firestore rules issue. Check firestore.rules');
  }

  process.exit(0);
}

testAuditLog();
