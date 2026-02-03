import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Check if we have service account credentials in environment
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccount) {
      // Parse service account JSON from environment variable
      const credentials = JSON.parse(serviceAccount);
      admin.initializeApp({
        credential: admin.credential.cert(credentials),
      });
      console.log('✅ Firebase Admin initialized with service account');
    } else {
      // For development: Use emulator or initialize with minimal config
      // This allows Firestore operations to work with security rules
      const projectId =
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'arida-c5faf';

      // Check if we're using emulator
      const useEmulator = process.env.FIRESTORE_EMULATOR_HOST;

      if (useEmulator) {
        admin.initializeApp({
          projectId,
        });
        console.log('✅ Firebase Admin initialized for emulator');
      } else {
        // For production without service account, try application default
        try {
          admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId,
          });
          console.log(
            '✅ Firebase Admin initialized with application default credentials',
          );
        } catch {
          // Last resort: initialize with just project ID
          // This works for Firestore but bypasses security rules
          admin.initializeApp({
            projectId,
          });
          console.warn(
            '⚠️ Firebase Admin initialized with project ID only - using security rules',
          );
        }
      }
    }
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error);
    throw error;
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

export default admin;
