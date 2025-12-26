#!/usr/bin/env node

/**
 * Debug User Existence Checker
 * 
 * This script helps debug why the moderator invitation system says
 * a user already exists when they don't appear in Firebase Auth.
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || 'arida-c5faf',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
    console.log('\n🔧 Using environment variables from .env files...');
    
    // Try to load from .env files
    require('dotenv').config({ path: '.env.local' });
    require('dotenv').config({ path: '.env.production' });
    
    if (!process.env.FIREBASE_PROJECT_ID) {
      console.log('⚠️  No Firebase credentials found. This script needs Firebase Admin access.');
      console.log('   Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY');
      process.exit(1);
    }
  }
}

async function debugUserExistence(email) {
  console.log(`🔍 Checking user existence for: ${email}\n`);
  
  const db = admin.firestore();
  const auth = admin.auth();
  
  try {
    // Check Firebase Authentication
    console.log('1️⃣ Checking Firebase Authentication...');
    try {
      const authUser = await auth.getUserByEmail(email);
      console.log(`   ✅ Found in Firebase Auth:`);
      console.log(`      UID: ${authUser.uid}`);
      console.log(`      Email: ${authUser.email}`);
      console.log(`      Created: ${authUser.metadata.creationTime}`);
      console.log(`      Last Sign In: ${authUser.metadata.lastSignInTime || 'Never'}`);
    } catch (authError) {
      if (authError.code === 'auth/user-not-found') {
        console.log(`   ❌ NOT found in Firebase Auth`);
      } else {
        console.log(`   ⚠️  Auth error: ${authError.message}`);
      }
    }
    
    console.log('\n2️⃣ Checking Firestore users collection...');
    const usersSnapshot = await db
      .collection('users')
      .where('email', '==', email)
      .get();
    
    if (usersSnapshot.empty) {
      console.log(`   ❌ NOT found in Firestore users collection`);
    } else {
      console.log(`   ✅ Found ${usersSnapshot.size} document(s) in Firestore users collection:`);
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`      Document ID: ${doc.id}`);
        console.log(`      Email: ${data.email}`);
        console.log(`      Name: ${data.name || 'Not set'}`);
        console.log(`      Role: ${data.role || 'user'}`);
        console.log(`      Active: ${data.isActive !== false ? 'Yes' : 'No'}`);
        console.log(`      Created: ${data.createdAt?.toDate?.() || 'Unknown'}`);
        console.log(`      ---`);
      });
    }
    
    console.log('\n3️⃣ Checking moderator invitations...');
    const invitationsSnapshot = await db
      .collection('moderatorInvitations')
      .where('email', '==', email)
      .get();
    
    if (invitationsSnapshot.empty) {
      console.log(`   ❌ No pending invitations found`);
    } else {
      console.log(`   ✅ Found ${invitationsSnapshot.size} invitation(s):`);
      invitationsSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`      Invitation ID: ${doc.id}`);
        console.log(`      Status: ${data.status}`);
        console.log(`      Invited by: ${data.invitedBy}`);
        console.log(`      Created: ${data.createdAt?.toDate?.()}`);
        console.log(`      Expires: ${data.expiresAt?.toDate?.()}`);
        console.log(`      ---`);
      });
    }
    
    console.log('\n📋 Summary:');
    const inAuth = await auth.getUserByEmail(email).then(() => true).catch(() => false);
    const inFirestore = !usersSnapshot.empty;
    const hasInvitations = !invitationsSnapshot.empty;
    
    console.log(`   Firebase Auth: ${inAuth ? '✅ EXISTS' : '❌ NOT FOUND'}`);
    console.log(`   Firestore users: ${inFirestore ? '✅ EXISTS' : '❌ NOT FOUND'}`);
    console.log(`   Pending invitations: ${hasInvitations ? '✅ EXISTS' : '❌ NOT FOUND'}`);
    
    if (inAuth || inFirestore) {
      console.log('\n🚨 USER ALREADY EXISTS - Cannot send invitation');
      if (inFirestore && !inAuth) {
        console.log('   💡 User exists in Firestore but not in Firebase Auth');
        console.log('   💡 This might be a data inconsistency issue');
      }
    } else {
      console.log('\n✅ USER DOES NOT EXIST - Can send invitation');
    }
    
  } catch (error) {
    console.error('❌ Error during check:', error);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node debug-user-existence.js <email>');
  console.log('Example: node debug-user-existence.js badre9@gmail.com');
  process.exit(1);
}

// Run the debug check
debugUserExistence(email).catch(console.error);