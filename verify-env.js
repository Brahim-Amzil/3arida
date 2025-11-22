#!/usr/bin/env node

/**
 * Verify that environment variables are being read correctly
 * Run this before starting the dev server to debug env issues
 */

const path = require('path');
const fs = require('fs');

console.log('🔍 Verifying environment variable setup...\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found at:', envPath);
  process.exit(1);
}

console.log('✅ .env.local file found\n');

// Try to load with dotenv if available
let dotenvLoaded = false;
try {
  require('dotenv').config({ path: envPath });
  dotenvLoaded = true;
  console.log('✅ Loaded .env.local with dotenv\n');
} catch (e) {
  console.log('⚠️  dotenv not available, Next.js will load .env.local automatically\n');
}

// Check required variables
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

console.log('📋 Checking environment variables:\n');
let allGood = true;

requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (value && value.trim() !== '') {
    const display = value.length > 30 ? value.substring(0, 30) + '...' : value;
    console.log(`  ✅ ${varName}: ${display}`);
  } else {
    console.log(`  ❌ ${varName}: NOT SET or EMPTY`);
    allGood = false;
  }
});

console.log('\n');

if (allGood) {
  console.log('✅ All environment variables are set correctly!');
  console.log('\n💡 Next steps:');
  console.log('   1. Make sure your dev server is completely stopped');
  console.log('   2. Clear the .next cache: rm -rf .next');
  console.log('   3. Start the dev server: npm run dev');
  console.log('   4. Hard refresh your browser (Cmd+Shift+R / Ctrl+Shift+R)');
} else {
  console.error('❌ Some environment variables are missing!');
  console.error('\n💡 Make sure your .env.local file contains all required variables.');
  process.exit(1);
}

