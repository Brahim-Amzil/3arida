const admin = require('firebase-admin');

// Initialize Firebase Admin with your service account
const serviceAccount = {
  "type": "service_account",
  "project_id": "arida-c5faf",
  "private_key_id": "3a8x6-1e924b6e47",
  // Add your actual service account key details here
};

// For now, let's use the Firebase CLI approach
console.log('Creating user document for existing user...');

const userData = {
  id: 'R4lEGogkyca79pB5Wfu9xFLwxBh1',
  email: '3aridapp@gmail.com',
  name: '3arida App',
  verifiedEmail: true, // Since Firebase shows emailVerified: true
  emailVerified: true, // Also set this for consistency
  emailVerifiedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  role: 'user',
  status: 'active'
};

console.log('User document to create:', JSON.stringify(userData, null, 2));