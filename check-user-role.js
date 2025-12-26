#!/usr/bin/env node

/**
 * Check User Role in Firestore
 * 
 * This script checks what role a user has in the Firestore users collection
 * to debug moderator role assignment issues.
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

async function checkUserRole(email) {
  console.log(`🔍 Checking user role for: ${email}\n`);
  
  const db = admin.firestore();
  const auth = admin.auth();
  
  try {
    // Get user from Firebase Auth
    console.log('1️⃣ Getting user from Firebase Authentication...');
    let authUser;
    try {
      authUser = await auth.getUserByEmail(email);
      console.log(`   ✅ Found user in Firebase Auth:`);
      console.log(`      UID: ${authUser.uid}`);
      console.log(`      Email: ${authUser.email}`);
      console.log(`      Email Verified: ${authUser.emailVerified}`);
    } catch (authError) {
      console.log(`   ❌ User not found in Firebase Auth: ${authError.message}`);
      return;
    }
    
    // Check Firestore user document
    console.log('\n2️⃣ Checking Firestore user document...');
    const userDoc = await db.collection('users').doc(authUser.uid).get();
    
    if (!userDoc.exists) {
      console.log(`   ❌ User document not found in Firestore`);
      console.log(`   💡 This might be why the moderator badge isn't showing`);
      console.log(`   💡 The user needs a document in the 'users' collection with role: 'moderator'`);
      return;
    }
    
    const userData = userDoc.data();
    console.log(`   ✅ Found user document in Firestore:`);
    console.log(`      Document ID: ${userDoc.id}`);
    console.log(`      Email: ${userData.email}`);
    console.log(`      Name: ${userData.name || 'Not set'}`);
    console.log(`      Role: ${userData.role || 'user'} ${userData.role === 'moderator' ? '🎯' : ''}`);
    console.log(`      Active: ${userData.isActive !== false ? 'Yes' : 'No'}`);
    console.log(`      Created: ${userData.createdAt?.toDate?.() || 'Unknown'}`);
    console.log(`      Updated: ${userData.updatedAt?.toDate?.() || 'Unknown'}`);
    if (userData.moderatorSince) {
      console.log(`      Moderator Since: ${userData.moderatorSince?.toDate?.()}`);
    }
    
    // Check moderator invitations
    console.log('\n3️⃣ Checking moderator invitations...');
    const invitationsSnapshot = await db
      .collection('moderatorInvitations')
      .where('email', '==', email)
      .get();
    
    if (invitationsSnapshot.empty) {
      console.log(`   ❌ No invitations found`);
    } else {
      console.log(`   ✅ Found ${invitationsSnapshot.size} invitation(s):`);
      invitationsSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`      Status: ${data.status} ${data.status === 'accepted' ? '✅' : data.status === 'pending' ? '⏳' : '❌'}`);
        console.log(`      Invited by: ${data.invitedBy}`);
        console.log(`      Created: ${data.createdAt?.toDate?.()}`);
        if (data.acceptedAt) {
          console.log(`      Accepted: ${data.acceptedAt?.toDate?.()}`);
        }
        console.log(`      ---`);
      });
    }
    
    console.log('\n📋 Summary:');
    console.log(`   Firebase Auth: ✅ EXISTS (UID: ${authUser.uid})`);
    console.log(`   Firestore Document: ${userDoc.exists ? '✅ EXISTS' : '❌ MISSING'}`);
    console.log(`   Current Role: ${userData?.role || 'user'}`);
    console.log(`   Should Show Moderator Badge: ${userData?.role === 'moderator' ? '✅ YES' : '❌ NO'}`);
    
    if (userData?.role === 'moderator') {
      console.log('\n🎉 User is correctly set as moderator!');
      console.log('   If the badge still doesn\'t show:');
      console.log('   1. Clear browser cache and cookies');
      console.log('   2. Log out and log back in');
      console.log('   3. Check browser console for errors');
    } else {
      console.log('\n🚨 User is NOT set as moderator');
      console.log('   This explains why the moderator badge isn\'t showing');
      console.log('   The role should be "moderator" but it\'s:', userData?.role || 'user');
    }
    
  } catch (error) {
    console.error('❌ Error during check:', error);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node check-user-role.js <email>');
  console.log('Example: node check-user-role.js badre9@gmail.com');
  process.exit(1);
}

// Run the check
checkUserRole(email).catch(console.error);