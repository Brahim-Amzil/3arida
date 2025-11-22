import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - using direct values for development
// Trim all values to remove any whitespace or newline characters
const firebaseConfig = {
  apiKey: (
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    'AIzaSyAhYUelLCS8ItJwaltcjtUl8HHJwp605T0'
  ).trim(),
  authDomain: (
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    'arida-c5faf.firebaseapp.com'
  ).trim(),
  projectId: (
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'arida-c5faf'
  ).trim(),
  storageBucket: (
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'arida-c5faf.firebasestorage.app'
  ).trim(),
  messagingSenderId: (
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '446881275370'
  ).trim(),
  appId: (
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    '1:446881275370:web:283f0360cfab3556a32693'
  ).trim(),
};

// Initialize Firebase - avoid duplicate initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
