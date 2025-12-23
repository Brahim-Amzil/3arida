#!/usr/bin/env node

/**
 * Environment Variable Diagnostic Tool
 * Checks which environment variables are set and their values (sanitized)
 */

const requiredVars = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_APP_NAME',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
];

const optionalVars = [
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
  'NEXT_PUBLIC_SENTRY_DSN',
  'STRIPE_SECRET_KEY',
  'NEXTAUTH_SECRET',
];

console.log('🔍 Environment Variable Diagnostic\n');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Platform:', process.env.VERCEL ? 'Vercel' : 'Local');
console.log('');

console.log('📋 Required Variables:');
console.log('─'.repeat(60));

let missingCount = 0;
requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    // Sanitize sensitive values
    const sanitized = varName.includes('KEY') || varName.includes('SECRET')
      ? `${value.substring(0, 10)}...`
      : value;
    console.log(`✅ ${varName}: ${sanitized}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    missingCount++;
  }
});

console.log('');
console.log('📋 Optional Variables:');
console.log('─'.repeat(60));

optionalVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    const sanitized = varName.includes('KEY') || varName.includes('SECRET')
      ? `${value.substring(0, 10)}...`
      : value;
    console.log(`✅ ${varName}: ${sanitized}`);
  } else {
    console.log(`⚠️  ${varName}: NOT SET (optional)`);
  }
});

console.log('');
console.log('─'.repeat(60));

if (missingCount === 0) {
  console.log('✅ All required environment variables are set!');
} else {
  console.log(`❌ ${missingCount} required variable(s) missing`);
  console.log('');
  console.log('To fix:');
  console.log('1. Copy .env.example to .env.local');
  console.log('2. Fill in all required values');
  console.log('3. For Vercel, run: vercel env add <VAR_NAME>');
}

console.log('');
