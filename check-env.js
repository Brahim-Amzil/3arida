#!/usr/bin/env node

/**
 * Quick script to verify Firebase environment variables are set
 * Run: node check-env.js
 */

const fs = require('fs');
const path = require('path');

const envLocalPath = path.join(__dirname, '.env.local');
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

console.log('🔍 Checking Firebase environment variables...\n');

// Check if .env.local exists
if (!fs.existsSync(envLocalPath)) {
  console.error('❌ .env.local file not found!');
  console.error(`   Expected location: ${envLocalPath}`);
  console.error('\n💡 Solution:');
  console.error('   1. Copy .env.example to .env.local: cp .env.example .env.local');
  console.error('   2. Fill in your Firebase configuration values');
  process.exit(1);
}

// Read and parse .env.local
const envContent = fs.readFileSync(envLocalPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Check each required variable
let allPresent = true;
const missing = [];
const empty = [];

requiredVars.forEach((varName) => {
  const value = envVars[varName];
  if (!value) {
    missing.push(varName);
    allPresent = false;
  } else if (value === '' || value === `your-${varName.toLowerCase().replace(/next_public_firebase_/g, '').replace(/_/g, '-')}`) {
    empty.push(varName);
    allPresent = false;
  }
});

// Report results
if (allPresent) {
  console.log('✅ All required Firebase environment variables are set!\n');
  requiredVars.forEach((varName) => {
    const value = envVars[varName];
    const displayValue = value.length > 20 ? `${value.substring(0, 20)}...` : value;
    console.log(`   ✓ ${varName}=${displayValue}`);
  });
  console.log('\n💡 If you\'re still seeing errors:');
  console.log('   1. Make sure you\'ve restarted your Next.js dev server');
  console.log('   2. Stop the server (Ctrl+C) and run: npm run dev');
  console.log('   3. Clear Next.js cache: rm -rf .next');
} else {
  console.error('❌ Some Firebase environment variables are missing or empty:\n');
  
  if (missing.length > 0) {
    console.error('   Missing variables:');
    missing.forEach((varName) => {
      console.error(`     - ${varName}`);
    });
  }
  
  if (empty.length > 0) {
    console.error('   Empty or placeholder variables:');
    empty.forEach((varName) => {
      console.error(`     - ${varName}`);
    });
  }
  
  console.error('\n💡 Solution:');
  console.error('   1. Open .env.local in your editor');
  console.error('   2. Make sure all NEXT_PUBLIC_FIREBASE_* variables have real values');
  console.error('   3. Get your Firebase config from: https://console.firebase.google.com/');
  console.error('   4. After updating, restart your dev server');
  process.exit(1);
}

