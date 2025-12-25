#!/usr/bin/env node

/**
 * Firebase Domain Authorization Checker
 * 
 * This script helps diagnose and fix Firebase auth/unauthorized-domain errors
 * by checking which domains are authorized in your Firebase project.
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
    console.log('\n🔧 To fix this, you need to:');
    console.log('1. Go to Firebase Console → Project Settings → Service Accounts');
    console.log('2. Generate a new private key');
    console.log('3. Add the credentials to your Vercel environment variables:');
    console.log('   - FIREBASE_PROJECT_ID');
    console.log('   - FIREBASE_CLIENT_EMAIL');
    console.log('   - FIREBASE_PRIVATE_KEY');
    process.exit(1);
  }
}

async function checkFirebaseDomains() {
  console.log('🔍 Checking Firebase Authentication Configuration...\n');
  
  // Project information
  console.log('📋 Project Information:');
  console.log(`   Project ID: ${process.env.FIREBASE_PROJECT_ID || 'arida-c5faf'}`);
  console.log(`   Auth Domain: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'arida-c5faf.firebaseapp.com'}`);
  
  console.log('\n🌐 Common Production Domains to Authorize:');
  console.log('   • your-app.vercel.app (Vercel auto-generated)');
  console.log('   • your-custom-domain.com (if you have one)');
  console.log('   • localhost:3000 (for development)');
  console.log('   • localhost:3001, localhost:3002 (other dev ports)');
  
  console.log('\n🔧 How to Fix the auth/unauthorized-domain Error:');
  console.log('1. Go to Firebase Console: https://console.firebase.google.com');
  console.log('2. Select your project: arida-c5faf');
  console.log('3. Navigate to: Authentication → Settings → Authorized domains');
  console.log('4. Click "Add domain" and add your production domain');
  console.log('5. Save the changes');
  
  console.log('\n📝 Domains you should add:');
  
  // Try to get the current Vercel URL from environment
  const vercelUrl = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercelUrl) {
    console.log(`   ✅ Add: ${vercelUrl}`);
  } else {
    console.log('   ⚠️  Add your Vercel production URL (check Vercel dashboard)');
  }
  
  // Check if we're in Vercel environment
  if (process.env.VERCEL) {
    console.log('\n🚀 Running in Vercel environment');
    console.log(`   VERCEL_URL: ${process.env.VERCEL_URL || 'Not set'}`);
    console.log(`   VERCEL_ENV: ${process.env.VERCEL_ENV || 'Not set'}`);
  }
  
  console.log('\n💡 Quick Fix Commands:');
  console.log('   # Check your Vercel domains');
  console.log('   vercel domains ls');
  console.log('   ');
  console.log('   # Get your current deployment URL');
  console.log('   vercel ls');
  
  console.log('\n🔗 Useful Links:');
  console.log('   Firebase Console: https://console.firebase.google.com/project/arida-c5faf/authentication/settings');
  console.log('   Vercel Dashboard: https://vercel.com/dashboard');
}

// Run the check
checkFirebaseDomains().catch(console.error);