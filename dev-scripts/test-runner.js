#!/usr/bin/env node

/**
 * Simple test runner for 3arida platform
 * This script helps verify the basic functionality before running full tests
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 3arida Platform Test Runner\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'next.config.js',
  'tailwind.config.js',
  'src/lib/firebase.ts',
  'src/lib/auth.ts',
  'src/lib/petitions.ts',
  'src/components/auth/AuthProvider.tsx',
  'src/app/layout.tsx',
];

console.log('📁 Checking required files...');
let missingFiles = [];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file}`);
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.log(`\n❌ Missing files: ${missingFiles.join(', ')}`);
  process.exit(1);
}

console.log('\n🔧 Running basic checks...');

try {
  // Check TypeScript compilation
  console.log('📝 Type checking...');
  execSync('npm run type-check', { stdio: 'pipe' });
  console.log('✅ TypeScript compilation successful');

  // Run unit tests
  console.log('🧪 Running unit tests...');
  execSync('npm test -- --passWithNoTests', { stdio: 'pipe' });
  console.log('✅ Unit tests passed');

  console.log('\n🎉 All basic checks passed! Ready for development.');
  
} catch (error) {
  console.log(`\n❌ Error: ${error.message}`);
  process.exit(1);
}