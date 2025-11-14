// Test script to verify demo mode and database connection
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Environment Variables:');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'SET' : 'NOT SET');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);

// Test isDemoMode logic
function testIsDemoMode() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  
  const isDemo = !apiKey || 
                 apiKey === 'your-api-key' || 
                 !projectId || 
                 projectId === 'your-project-id';
  
  console.log('🎭 isDemoMode result:', isDemo);
  return isDemo;
}

// Test Firebase initialization
function testFirebaseInit() {
  try {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    console.log('🔧 Firebase Config:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      hasApiKey: !!firebaseConfig.apiKey
    });

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase initialized successfully');
    console.log('🔥 Database available:', !!db);
    
    return { app, db };
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
    return null;
  }
}

// Run tests
console.log('=== Testing Demo Mode and Firebase ===');
testIsDemoMode();
testFirebaseInit();