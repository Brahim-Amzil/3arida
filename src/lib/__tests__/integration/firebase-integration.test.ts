/**
 * Integration tests for Firebase operations
 * These tests require Firebase emulators to be running
 * Run: firebase emulators:start --only auth,firestore,storage
 *
 * To run these tests: FIREBASE_EMULATOR=true npm test
 */

import { initializeApp, getApps, deleteApp } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Test Firebase config
const testFirebaseConfig = {
  apiKey: 'test-api-key',
  authDomain: 'test-project.firebaseapp.com',
  projectId: 'test-project',
  storageBucket: 'test-project.appspot.com',
  messagingSenderId: '123456789',
  appId: 'test-app-id',
};

// Skip these tests unless Firebase emulators are running
const describeIfEmulator =
  process.env.FIREBASE_EMULATOR === 'true' ? describe : describe.skip;

describeIfEmulator('Firebase Integration Tests', () => {
  let app: any;
  let auth: any;
  let db: any;
  let storage: any;

  beforeAll(async () => {
    // Initialize Firebase app for testing
    if (getApps().length === 0) {
      app = initializeApp(testFirebaseConfig, 'test-app');
    } else {
      app = getApps()[0];
    }

    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Connect to emulators
    try {
      connectAuthEmulator(auth, 'http://localhost:9099', {
        disableWarnings: true,
      });
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
    } catch (error) {
      // Emulators might already be connected
      console.log('Emulators already connected or not available');
    }
  });

  afterAll(async () => {
    if (app) {
      await deleteApp(app);
    }
  });

  describe('Authentication Integration', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'TestPassword123',
    };

    it('should create a new user account', async () => {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        testUser.email,
        testUser.password
      );

      expect(userCredential.user).toBeDefined();
      expect(userCredential.user.email).toBe(testUser.email);
      expect(userCredential.user.uid).toBeDefined();
    });

    it('should sign in existing user', async () => {
      // First create the user
      await createUserWithEmailAndPassword(
        auth,
        'signin@example.com',
        'TestPassword123'
      );

      // Then sign in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        'signin@example.com',
        'TestPassword123'
      );

      expect(userCredential.user).toBeDefined();
      expect(userCredential.user.email).toBe('signin@example.com');
    });

    it('should reject invalid credentials', async () => {
      await expect(
        signInWithEmailAndPassword(
          auth,
          'nonexistent@example.com',
          'wrongpassword'
        )
      ).rejects.toThrow();
    });
  });

  describe('Firestore Integration', () => {
    it('should create and retrieve a petition document', async () => {
      const petitionData = {
        title: 'Test Petition',
        description: 'This is a test petition for integration testing',
        category: 'Test',
        targetSignatures: 1000,
        currentSignatures: 0,
        status: 'draft',
        createdBy: 'test-user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: true,
        isActive: true,
        viewCount: 0,
        shareCount: 0,
        mediaUrls: [],
        hasQrCode: false,
        pricingTier: 'free',
        amountPaid: 0,
        paymentStatus: 'unpaid',
      };

      // Add document
      const docRef = await addDoc(collection(db, 'petitions'), petitionData);
      expect(docRef.id).toBeDefined();

      // Retrieve document
      const docSnap = await getDoc(doc(db, 'petitions', docRef.id));
      expect(docSnap.exists()).toBe(true);

      const retrievedData = docSnap.data();
      expect(retrievedData?.title).toBe(petitionData.title);
      expect(retrievedData?.description).toBe(petitionData.description);
      expect(retrievedData?.category).toBe(petitionData.category);
    });

    it('should create and retrieve user documents', async () => {
      const userData = {
        id: 'test-user-123',
        name: 'Test User',
        email: 'testuser@example.com',
        phone: '+212612345678',
        verifiedEmail: false,
        verifiedPhone: false,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      // Add user document
      const docRef = await addDoc(collection(db, 'users'), userData);
      expect(docRef.id).toBeDefined();

      // Retrieve user document
      const docSnap = await getDoc(doc(db, 'users', docRef.id));
      expect(docSnap.exists()).toBe(true);

      const retrievedData = docSnap.data();
      expect(retrievedData?.name).toBe(userData.name);
      expect(retrievedData?.email).toBe(userData.email);
      expect(retrievedData?.role).toBe(userData.role);
    });

    it('should create and retrieve signature documents', async () => {
      const signatureData = {
        id: 'signature-123',
        petitionId: 'petition-123',
        signerName: 'John Doe',
        signerPhone: '+212612345678',
        verificationMethod: 'phone_otp',
        verifiedAt: new Date(),
        ipAddress: '192.168.1.1',
        isAnonymous: false,
        createdAt: new Date(),
      };

      // Add signature document
      const docRef = await addDoc(collection(db, 'signatures'), signatureData);
      expect(docRef.id).toBeDefined();

      // Retrieve signature document
      const docSnap = await getDoc(doc(db, 'signatures', docRef.id));
      expect(docSnap.exists()).toBe(true);

      const retrievedData = docSnap.data();
      expect(retrievedData?.signerName).toBe(signatureData.signerName);
      expect(retrievedData?.petitionId).toBe(signatureData.petitionId);
    });

    it('should query documents by field', async () => {
      // Add multiple test petitions
      const petitions = [
        {
          title: 'Environment Petition 1',
          category: 'Environment',
          status: 'approved',
          createdAt: new Date(),
        },
        {
          title: 'Environment Petition 2',
          category: 'Environment',
          status: 'approved',
          createdAt: new Date(),
        },
        {
          title: 'Education Petition',
          category: 'Education',
          status: 'approved',
          createdAt: new Date(),
        },
      ];

      // Add all petitions
      for (const petition of petitions) {
        await addDoc(collection(db, 'test-petitions'), petition);
      }

      // Query by category
      const querySnapshot = await getDocs(collection(db, 'test-petitions'));
      const docs = querySnapshot.docs.map((doc) => doc.data());

      expect(docs.length).toBeGreaterThanOrEqual(3);

      const environmentPetitions = docs.filter(
        (doc) => doc.category === 'Environment'
      );
      expect(environmentPetitions.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('End-to-End Petition Flow', () => {
    it('should complete full petition creation and signing flow', async () => {
      // 1. Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        'petitioncreator@example.com',
        'TestPassword123'
      );
      const userId = userCredential.user.uid;

      // 2. Create user profile in Firestore
      const userProfileData = {
        id: userId,
        name: 'Petition Creator',
        email: 'petitioncreator@example.com',
        role: 'user',
        createdAt: new Date(),
        isActive: true,
        verifiedEmail: false,
        verifiedPhone: false,
      };

      const userDocRef = await addDoc(collection(db, 'users'), userProfileData);
      expect(userDocRef.id).toBeDefined();

      // 3. Create petition
      const petitionData = {
        title: 'Save Local Park',
        description:
          'We need to save our local park from development. This green space is vital for our community.',
        category: 'Environment',
        targetSignatures: 500,
        currentSignatures: 0,
        status: 'pending',
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: true,
        isActive: true,
        viewCount: 0,
        shareCount: 0,
        mediaUrls: [],
        hasQrCode: false,
        pricingTier: 'free',
        amountPaid: 0,
        paymentStatus: 'unpaid',
      };

      const petitionDocRef = await addDoc(
        collection(db, 'petitions'),
        petitionData
      );
      const petitionId = petitionDocRef.id;

      // 4. Verify petition was created
      const petitionSnap = await getDoc(doc(db, 'petitions', petitionId));
      expect(petitionSnap.exists()).toBe(true);
      expect(petitionSnap.data()?.title).toBe(petitionData.title);

      // 5. Create signature
      const signatureData = {
        petitionId: petitionId,
        signerName: 'Jane Supporter',
        signerPhone: '+212612345678',
        verificationMethod: 'phone_otp',
        verifiedAt: new Date(),
        ipAddress: '192.168.1.100',
        isAnonymous: false,
        createdAt: new Date(),
      };

      const signatureDocRef = await addDoc(
        collection(db, 'signatures'),
        signatureData
      );
      expect(signatureDocRef.id).toBeDefined();

      // 6. Verify signature was created
      const signatureSnap = await getDoc(
        doc(db, 'signatures', signatureDocRef.id)
      );
      expect(signatureSnap.exists()).toBe(true);
      expect(signatureSnap.data()?.petitionId).toBe(petitionId);
      expect(signatureSnap.data()?.signerName).toBe(signatureData.signerName);
    });
  });
});
