#!/usr/bin/env node

/**
 * Test reCAPTCHA v3 Configuration
 * 
 * This script checks if reCAPTCHA is properly configured
 */

require('dotenv').config({ path: '.env.local' });

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const secretKey = process.env.RECAPTCHA_SECRET_KEY;

console.log('\n🔍 Checking reCAPTCHA v3 Configuration...\n');

let hasErrors = false;

// Check Site Key
if (!siteKey) {
  console.log('❌ NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set');
  hasErrors = true;
} else if (!siteKey.startsWith('6L')) {
  console.log('⚠️  NEXT_PUBLIC_RECAPTCHA_SITE_KEY looks invalid (should start with 6L)');
  console.log(`   Current value: ${siteKey.substring(0, 10)}...`);
  hasErrors = true;
} else {
  console.log('✅ NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set');
  console.log(`   Value: ${siteKey.substring(0, 10)}...${siteKey.substring(siteKey.length - 5)}`);
}

// Check Secret Key
if (!secretKey) {
  console.log('❌ RECAPTCHA_SECRET_KEY is not set');
  hasErrors = true;
} else if (!secretKey.startsWith('6L')) {
  console.log('⚠️  RECAPTCHA_SECRET_KEY looks invalid (should start with 6L)');
  console.log(`   Current value: ${secretKey.substring(0, 10)}...`);
  hasErrors = true;
} else {
  console.log('✅ RECAPTCHA_SECRET_KEY is set');
  console.log(`   Value: ${secretKey.substring(0, 10)}...${secretKey.substring(secretKey.length - 5)}`);
}

console.log('\n' + '='.repeat(60) + '\n');

if (hasErrors) {
  console.log('❌ Configuration Issues Found!\n');
  console.log('📝 To fix:');
  console.log('1. Go to https://www.google.com/recaptcha/admin/create');
  console.log('2. Create a new reCAPTCHA v3 site');
  console.log('3. Add your keys to .env.local:');
  console.log('   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key');
  console.log('   RECAPTCHA_SECRET_KEY=your-secret-key');
  console.log('4. Restart your dev server\n');
  process.exit(1);
} else {
  console.log('✅ reCAPTCHA v3 is properly configured!\n');
  console.log('🚀 Next steps:');
  console.log('1. Start your dev server: npm run dev');
  console.log('2. Go to any petition page');
  console.log('3. Click "Sign Petition"');
  console.log('4. reCAPTCHA will run invisibly in the background');
  console.log('5. Check browser console for: "✅ reCAPTCHA passed with score: X.X"\n');
  console.log('📊 Monitor your reCAPTCHA stats:');
  console.log('   https://www.google.com/recaptcha/admin\n');
}
