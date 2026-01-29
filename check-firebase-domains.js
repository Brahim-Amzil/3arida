/**
 * Check Firebase Authorized Domains
 * 
 * This script helps verify which domains are authorized in Firebase
 * for Google Sign-In and other authentication methods.
 * 
 * To fix the auth/unauthorized-domain error:
 * 
 * 1. Go to: https://console.firebase.google.com
 * 2. Select your project
 * 3. Go to Authentication > Settings > Authorized domains
 * 4. Add your Vercel deployment URL
 * 
 * Domains you should add:
 * - 3arida.vercel.app (or your actual Vercel URL)
 * - *.vercel.app (for preview deployments)
 * - localhost (for local development - should already be there)
 * - Your custom domain if you have one
 * 
 * Note: Changes take effect immediately, no deployment needed.
 */

console.log('🔍 Firebase Authorized Domains Check');
console.log('=====================================\n');

console.log('Current deployment URL from environment:');
console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL || 'Not set');
console.log('VERCEL_URL:', process.env.VERCEL_URL || 'Not set');
console.log('\n');

console.log('📋 Domains you should add to Firebase:');
console.log('1. localhost (for local development)');
console.log('2. 3arida.vercel.app (or your actual Vercel URL)');
console.log('3. *.vercel.app (for all preview deployments)');
console.log('4. Your custom domain (if you have one)');
console.log('\n');

console.log('🔗 Firebase Console Link:');
console.log('https://console.firebase.google.com/project/_/authentication/settings');
console.log('\n');

console.log('⚠️  After adding domains, the change is immediate - no redeployment needed!');
