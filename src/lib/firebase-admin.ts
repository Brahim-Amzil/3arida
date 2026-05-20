import * as admin from 'firebase-admin';

function resolveAdminCredential(): admin.credential.Credential | null {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.trim();
  if (serviceAccountJson) {
    try {
      const credentials = JSON.parse(serviceAccountJson);
      return admin.credential.cert(credentials);
    } catch (error) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', error);
    }
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID?.trim() ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    return admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    });
  }

  return null;
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    const credential = resolveAdminCredential();
    const projectId =
      process.env.FIREBASE_PROJECT_ID?.trim() ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
      'arida-c5faf';

    if (credential) {
      admin.initializeApp({
        credential,
        projectId,
      });
      console.log('✅ Firebase Admin initialized with service account credentials');
    } else if (process.env.FIRESTORE_EMULATOR_HOST) {
      admin.initializeApp({ projectId });
      console.log('✅ Firebase Admin initialized for emulator');
    } else {
      try {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId,
        });
        console.log(
          '✅ Firebase Admin initialized with application default credentials',
        );
      } catch {
        admin.initializeApp({ projectId });
        console.error(
          '❌ Firebase Admin missing credentials (FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY or FIREBASE_SERVICE_ACCOUNT_KEY). Token verification and Auth Admin APIs will fail.',
        );
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
