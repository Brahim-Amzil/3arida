/**
 * Check Firebase authorized domains
 * Run this to see what domains are currently authorized
 */

console.log('🔍 Checking Firebase Configuration...');

// Check current domain
console.log('Current domain:', window.location.hostname);
console.log('Current origin:', window.location.origin);
console.log('Current protocol:', window.location.protocol);

// Check Firebase config
const firebaseConfig = {
  authDomain: 'arida-c5faf.firebaseapp.com',
  projectId: 'arida-c5faf'
};

console.log('Firebase Auth Domain:', firebaseConfig.authDomain);
console.log('Firebase Project ID:', firebaseConfig.projectId);

// Check if we're on the right domain
const isFirebaseDomain = window.location.hostname.includes('firebaseapp.com');
const isVercelDomain = window.location.hostname.includes('vercel.app');
const isCustomDomain = window.location.hostname === '3arida.ma';

console.log('\nDomain Analysis:');
console.log('Is Firebase domain:', isFirebaseDomain);
console.log('Is Vercel domain:', isVercelDomain);
console.log('Is custom domain:', isCustomDomain);

if (isVercelDomain) {
  console.log('\n🚨 ISSUE FOUND:');
  console.log('You are on a Vercel domain that is not authorized in Firebase.');
  console.log('Current domain:', window.location.hostname);
  console.log('\n🔧 TO FIX:');
  console.log('1. Go to Firebase Console → Authentication → Settings → Authorized domains');
  console.log('2. Add this domain:', window.location.hostname);
  console.log('3. Save and try login again');
}

// Test Google Auth availability
try {
  if (window.google && window.google.accounts) {
    console.log('\n✅ Google Auth SDK loaded');
  } else {
    console.log('\n⚠️ Google Auth SDK not loaded');
  }
} catch (error) {
  console.log('\n❌ Google Auth SDK error:', error.message);
}