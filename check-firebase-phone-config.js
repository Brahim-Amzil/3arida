#!/usr/bin/env node

/**
 * Check Firebase Phone Authentication Configuration
 * This script helps diagnose phone auth issues
 */

require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking Firebase Phone Authentication Configuration\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('✓ API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing');
console.log('✓ Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '❌ Missing');
console.log('✓ Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ Missing');
console.log('✓ App ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing');

console.log('\n📱 Phone Auth Configuration:');
console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);

console.log('\n🔐 reCAPTCHA Configuration:');
console.log('✓ Site Key:', process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? '✅ Set' : '❌ Missing');
console.log('✓ Secret Key:', process.env.RECAPTCHA_SECRET_KEY ? '✅ Set' : '❌ Missing');

console.log('\n📞 Alternative Verification Methods:');
console.log('✓ WhatsApp Phone ID:', process.env.WHATSAPP_PHONE_NUMBER_ID ? '✅ Set' : '❌ Missing');
console.log('✓ WhatsApp Token:', process.env.WHATSAPP_ACCESS_TOKEN ? '✅ Set' : '❌ Missing');

console.log('\n🔗 Important Links:');
console.log('Firebase Console:', `https://console.firebase.google.com/project/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
console.log('Google Cloud Console:', `https://console.cloud.google.com/home/dashboard?project=${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
console.log('Google Cloud Logs:', `https://console.cloud.google.com/logs/query?project=${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
console.log('Identity Platform:', `https://console.cloud.google.com/customer-identity/providers?project=${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);

console.log('\n⚠️  CRITICAL: Check Google Cloud Logs for 500 error details');
console.log('Filter: resource.type="identitytoolkit.googleapis.com/project" severity>=ERROR');

console.log('\n📝 Common Issues with auth/internal-error-encountered:');
console.log('1. SMS region not allowed (check Identity Platform → Settings → SMS regions)');
console.log('2. SMS quota exceeded (check Firebase Console → Usage)');
console.log('3. Phone number already registered to another account');
console.log('4. Identity Platform not properly configured');
console.log('5. Billing issue (Blaze plan required for SMS)');

console.log('\n✅ Next Steps:');
console.log('1. Open Google Cloud Logs (link above)');
console.log('2. Look for errors from the last 1 hour');
console.log('3. Check Identity Platform SMS region settings');
console.log('4. Verify Firebase billing is active');
console.log('5. Try a different phone number');
