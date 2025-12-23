#!/usr/bin/env node

/**
 * Firebase Phone Auth Diagnostic Script
 * 
 * This script helps diagnose why phone auth works in Firebase demo
 * but not in your app.
 * 
 * Run: node diagnose-firebase-phone-auth.js
 */

const https = require('https');

console.log('🔍 Firebase Phone Auth Diagnostic Tool\n');
console.log('=' .repeat(60));

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
};

console.log('\n📋 Configuration Check:');
console.log('─'.repeat(60));
console.log(`✓ API Key: ${config.apiKey ? '✅ Set' : '❌ Missing'}`);
console.log(`✓ Auth Domain: ${config.authDomain || '❌ Missing'}`);
console.log(`✓ Project ID: ${config.projectId || '❌ Missing'}`);
console.log(`✓ reCAPTCHA Site Key: ${config.recaptchaSiteKey ? '✅ Set' : '❌ Missing'}`);

// Check if using custom reCAPTCHA
if (config.recaptchaSiteKey) {
  console.log('\n⚠️  You are using a CUSTOM reCAPTCHA key');
  console.log('   This key must be properly configured at:');
  console.log('   https://www.google.com/recaptcha/admin');
  console.log('\n   Required domains in reCAPTCHA admin:');
  console.log('   - localhost');
  console.log(`   - ${config.authDomain}`);
  console.log('   - Your production domain (if any)');
}

console.log('\n🌐 Domain Authorization Check:');
console.log('─'.repeat(60));
console.log('Firebase requires these domains to be authorized:');
console.log('1. Go to: https://console.firebase.google.com/project/' + config.projectId + '/authentication/settings');
console.log('2. Click "Authorized domains" tab');
console.log('3. Ensure these are listed:');
console.log('   ✓ localhost');
console.log('   ✓ ' + config.authDomain);
console.log('   ✓ Your production domain (if deployed)');

console.log('\n📱 Phone Auth Provider Check:');
console.log('─'.repeat(60));
console.log('1. Go to: https://console.firebase.google.com/project/' + config.projectId + '/authentication/providers');
console.log('2. Ensure "Phone" provider is ENABLED');
console.log('3. Check SMS region policy:');
console.log('   - Should be set to "Allow" mode');
console.log('   - Include regions: Spain, Morocco, EU, US, UAE');

console.log('\n🔐 reCAPTCHA Configuration:');
console.log('─'.repeat(60));
if (config.recaptchaSiteKey) {
  console.log('Custom reCAPTCHA detected. Verify at:');
  console.log('https://www.google.com/recaptcha/admin');
  console.log('\nYour site key: ' + config.recaptchaSiteKey);
  console.log('\nRequired settings:');
  console.log('✓ Type: reCAPTCHA v2 (Checkbox or Invisible)');
  console.log('✓ Domains must include: localhost, ' + config.authDomain);
} else {
  console.log('Using Firebase default reCAPTCHA (recommended)');
}

console.log('\n🧪 Testing Recommendations:');
console.log('─'.repeat(60));
console.log('1. Test on localhost first');
console.log('2. Deploy to Firebase Hosting and test there');
console.log('3. Compare with Firebase demo:');
console.log('   Demo: https://fir-ui-demo-84a6c.firebaseapp.com/');
console.log('   Your app: https://' + config.authDomain);

console.log('\n📊 Comparison with Firebase Demo:');
console.log('─'.repeat(60));
console.log('Firebase Demo Works ✅ | Your App Fails ❌');
console.log('');
console.log('Possible differences:');
console.log('1. Domain not authorized in Firebase Console');
console.log('2. Custom reCAPTCHA not configured correctly');
console.log('3. Different Firebase SDK version');
console.log('4. App not properly registered in Firebase project');
console.log('5. Network/CORS issues');

console.log('\n🔧 Quick Fixes to Try:');
console.log('─'.repeat(60));
console.log('1. Remove custom reCAPTCHA (use Firebase default)');
console.log('   - Comment out NEXT_PUBLIC_RECAPTCHA_SITE_KEY in .env.local');
console.log('   - Don\'t pass custom key to RecaptchaVerifier');
console.log('');
console.log('2. Test on Firebase Hosting domain');
console.log('   - Deploy: firebase deploy --only hosting');
console.log('   - Test at: https://' + config.authDomain);
console.log('');
console.log('3. Use invisible reCAPTCHA (like Firebase demo)');
console.log('   - Set size: "invisible" in RecaptchaVerifier options');
console.log('');
console.log('4. Check browser console for detailed errors');
console.log('   - Look for reCAPTCHA errors');
console.log('   - Check network tab for failed requests');

console.log('\n📝 Information for Firebase Support:');
console.log('─'.repeat(60));
console.log('When replying to Firebase support, provide:');
console.log('');
console.log('1. Testing Environment:');
console.log('   - Testing locally on: localhost:3000');
console.log('   - Phone numbers: Real (not test numbers)');
console.log('   - Browser: Chrome/Firefox/Safari');
console.log('');
console.log('2. Carrier Information:');
console.log('   - No recent carrier changes');
console.log('   - Phone number format: +34XXXXXXXXX (E.164)');
console.log('');
console.log('3. Error Details:');
console.log('   - Error code: auth/internal-error or auth/invalid-recaptcha-token');
console.log('   - Occurs when: Clicking "Send Code" button');
console.log('   - Firebase demo works: YES ✅');
console.log('   - My app works: NO ❌');
console.log('');
console.log('4. Configuration:');
console.log('   - Project ID: ' + config.projectId);
console.log('   - Auth Domain: ' + config.authDomain);
console.log('   - Using custom reCAPTCHA: ' + (config.recaptchaSiteKey ? 'YES' : 'NO'));

console.log('\n🎯 Next Steps:');
console.log('─'.repeat(60));
console.log('1. Verify authorized domains in Firebase Console');
console.log('2. Try without custom reCAPTCHA');
console.log('3. Deploy to Firebase Hosting and test');
console.log('4. Compare network requests with Firebase demo');
console.log('5. Reply to Firebase support with above information');

console.log('\n' + '='.repeat(60));
console.log('✅ Diagnostic complete!\n');
