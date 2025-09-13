import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

console.log('Initializing Firebase Admin...');
console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('Private Key present:', !!process.env.FIREBASE_PRIVATE_KEY);

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  projectId: process.env.FIREBASE_PROJECT_ID,
};

// Initialize Firebase Admin
const adminApp =
  getApps().length === 0
    ? initializeApp(firebaseAdminConfig, 'admin')
    : getApps()[0];

console.log('Firebase Admin initialized successfully');

// Initialize Firebase Admin services
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);

export default adminApp;
