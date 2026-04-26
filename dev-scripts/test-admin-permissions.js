// Test script to check if current user has admin permissions
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

require('dotenv').config({ path: '.env.local' });

// Firebase config from environment variables
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
const auth = getAuth(app);

async function testAdminPermissions() {
  console.log('🔍 Testing admin permissions...\n');
  
  // Check if user is authenticated
  const user = auth.currentUser;
  if (!user) {
    console.log('❌ No user is currently authenticated');
    console.log('💡 You need to be logged in through the web app first');
    process.exit(1);
  }
  
  console.log(`✅ Authenticated as: ${user.email}`);
  console.log(`   User ID: ${user.uid}\n`);
  
  // Get user profile to check role
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.log('❌ User profile not found in database');
      process.exit(1);
    }
    
    const userData = userDoc.data();
    console.log(`👤 User Profile:`);
    console.log(`   Name: ${userData.name || 'N/A'}`);
    console.log(`   Role: ${userData.role || 'N/A'}`);
    console.log(`   Active: ${userData.active || false}\n`);
    
    // Check if user has admin role
    const isAdmin = userData.role === 'admin' || userData.role === 'master_admin';
    
    if (isAdmin) {
      console.log('✅ User has admin permissions');
      console.log('💡 The migration should work from the web interface');
    } else {
      console.log('❌ User does NOT have admin permissions');
      console.log('💡 You need to be logged in as an admin to run the migration');
    }
    
  } catch (error) {
    console.error('❌ Error checking user profile:', error.message);
  }
  
  process.exit(0);
}

// Check current auth state
auth.onAuthStateChanged((user) => {
  if (user) {
    testAdminPermissions();
  } else {
    console.log('❌ No user is currently authenticated');
    console.log('💡 Please log in through the web app first at http://localhost:3003');
    process.exit(1);
  }
});

// Wait a moment for auth state to be determined
setTimeout(() => {
  if (!auth.currentUser) {
    console.log('❌ No user is currently authenticated');
    console.log('💡 Please log in through the web app first at http://localhost:3003');
    process.exit(1);
  }
}, 2000);