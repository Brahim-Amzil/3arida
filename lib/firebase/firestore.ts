import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './config';
import type {
  User,
  Petition,
  CreatorPage,
  Signature,
  Moderator,
  PaymentIntent,
  QRCodeRequest,
  Notification,
  PaginationParams,
  PaginatedResponse,
  PetitionFilters,
} from '../../types/models';

// Collection references
export const collections = {
  users: 'users',
  petitions: 'petitions',
  signatures: 'signatures',
  creatorPages: 'creatorPages',
  moderators: 'moderators',
  paymentIntents: 'paymentIntents',
  qrCodeRequests: 'qrCodeRequests',
  notifications: 'notifications',
  analytics: 'analytics',
  statistics: 'statistics',
  config: 'config',
  auditLogs: 'auditLogs',
} as const;

// Helper function to convert Firestore timestamp to Date
export const timestampToDate = (timestamp: any): Date => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp);
};

// Helper function to convert Date to Firestore timestamp
export const dateToTimestamp = (date: Date) => {
  return Timestamp.fromDate(date);
};

// Generic CRUD operations
export class FirestoreService {
  // Create document
  static async create<T>(
    collectionName: string,
    data: Omit<T, 'id'>
  ): Promise<string> {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // Create document with custom ID
  static async createWithId<T>(
    collectionName: string,
    id: string,
    data: Omit<T, 'id'>
  ): Promise<void> {
    await setDoc(doc(db, collectionName, id), {
      ...data,
      createdAt: serverTimestamp(),
    });
  }

  // Get document by ID
  static async getById<T>(
    collectionName: string,
    id: string
  ): Promise<T | null> {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: data.updatedAt ? timestampToDate(data.updatedAt) : undefined,
      } as T;
    }

    return null;
  }

  // Update document
  static async update<T>(
    collectionName: string,
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt'>>
  ): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  // Delete document
  static async delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  }

  // Get documents with pagination
  static async getPaginated<T>(
    collectionName: string,
    params: PaginationParams,
    filters?: any[],
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<PaginatedResponse<T>> {
    let q: any = collection(db, collectionName);

    // Apply filters
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        q = query(q, filter);
      });
    }

    // Apply sorting
    if (params.sortBy) {
      q = query(q, orderBy(params.sortBy, params.sortOrder || 'desc'));
    }

    // Apply pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    q = query(q, limit(params.limit));

    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map((doc) => {
      const data = doc.data() as any;
      return {
        id: doc.id,
        ...data,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: data.updatedAt
          ? timestampToDate(data.updatedAt)
          : undefined,
      } as T;
    });

    // Get total count (this is expensive, consider caching)
    const totalSnapshot = await getDocs(collection(db, collectionName));
    const total = totalSnapshot.size;

    return {
      data: docs,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
        hasNext: docs.length === params.limit,
        hasPrev: params.page > 1,
      },
    };
  }

  // Increment field value
  static async incrementField(
    collectionName: string,
    id: string,
    field: string,
    value: number = 1
  ): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      [field]: increment(value),
      updatedAt: serverTimestamp(),
    });
  }

  // Add to array field
  static async addToArray(
    collectionName: string,
    id: string,
    field: string,
    value: any
  ): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      [field]: arrayUnion(value),
      updatedAt: serverTimestamp(),
    });
  }

  // Remove from array field
  static async removeFromArray(
    collectionName: string,
    id: string,
    field: string,
    value: any
  ): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      [field]: arrayRemove(value),
      updatedAt: serverTimestamp(),
    });
  }
}

// Specialized services for each model
export class UserService extends FirestoreService {
  static async createUser(
    userData: Omit<User, 'id' | 'createdAt'>
  ): Promise<string> {
    return this.create<User>(collections.users, {
      ...userData,
      createdAt: new Date(),
    });
  }

  static async getUserById(id: string): Promise<User | null> {
    return this.getById<User>(collections.users, id);
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const q = query(
      collection(db, collections.users),
      where('email', '==', email)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: data.updatedAt ? timestampToDate(data.updatedAt) : undefined,
      } as User;
    }

    return null;
  }

  static async updateUser(id: string, userData: Partial<User>): Promise<void> {
    return this.update<User>(collections.users, id, userData);
  }
}

export class PetitionService extends FirestoreService {
  static async createPetition(
    petitionData: Omit<Petition, 'id' | 'createdAt'>
  ): Promise<string> {
    return this.create<Petition>(collections.petitions, {
      ...petitionData,
      createdAt: new Date(),
    });
  }

  static async getPetitionById(id: string): Promise<Petition | null> {
    return this.getById<Petition>(collections.petitions, id);
  }

  static async updatePetition(
    id: string,
    petitionData: Partial<Petition>
  ): Promise<void> {
    return this.update<Petition>(collections.petitions, id, petitionData);
  }

  static async getPetitionsByCreator(creatorId: string): Promise<Petition[]> {
    const q = query(
      collection(db, collections.petitions),
      where('creatorId', '==', creatorId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: timestampToDate(doc.data().createdAt),
      updatedAt: doc.data().updatedAt
        ? timestampToDate(doc.data().updatedAt)
        : undefined,
    })) as Petition[];
  }

  static async getPublicPetitions(
    filters?: PetitionFilters
  ): Promise<Petition[]> {
    let q = query(
      collection(db, collections.petitions),
      where('status', '==', 'approved'),
      where('isPublic', '==', true)
    );

    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }

    q = query(q, orderBy('currentSignatures', 'desc'), limit(50));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: timestampToDate(doc.data().createdAt),
      updatedAt: doc.data().updatedAt
        ? timestampToDate(doc.data().updatedAt)
        : undefined,
    })) as Petition[];
  }

  static async incrementSignatureCount(petitionId: string): Promise<void> {
    return this.incrementField(
      collections.petitions,
      petitionId,
      'currentSignatures'
    );
  }
}

export class SignatureService extends FirestoreService {
  static async createSignature(
    signatureData: Omit<Signature, 'id' | 'createdAt'>
  ): Promise<string> {
    return this.create<Signature>(collections.signatures, {
      ...signatureData,
      createdAt: new Date(),
    });
  }

  static async getSignaturesByPetition(
    petitionId: string
  ): Promise<Signature[]> {
    const q = query(
      collection(db, collections.signatures),
      where('petitionId', '==', petitionId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: timestampToDate(doc.data().createdAt),
    })) as Signature[];
  }

  static async checkExistingSignature(
    petitionId: string,
    phone: string
  ): Promise<boolean> {
    const q = query(
      collection(db, collections.signatures),
      where('petitionId', '==', petitionId),
      where('signerPhone', '==', phone)
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }
}

export class CreatorPageService extends FirestoreService {
  static async createCreatorPage(
    pageData: Omit<CreatorPage, 'id' | 'createdAt'>
  ): Promise<string> {
    return this.create<CreatorPage>(collections.creatorPages, {
      ...pageData,
      createdAt: new Date(),
    });
  }

  static async getCreatorPageById(id: string): Promise<CreatorPage | null> {
    return this.getById<CreatorPage>(collections.creatorPages, id);
  }

  static async getCreatorPageByUserId(
    userId: string
  ): Promise<CreatorPage | null> {
    const q = query(
      collection(db, collections.creatorPages),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: data.updatedAt ? timestampToDate(data.updatedAt) : undefined,
      } as CreatorPage;
    }

    return null;
  }

  static async updateCreatorPage(
    id: string,
    pageData: Partial<CreatorPage>
  ): Promise<void> {
    return this.update<CreatorPage>(collections.creatorPages, id, pageData);
  }

  static async incrementPetitionCount(pageId: string): Promise<void> {
    return this.incrementField(
      collections.creatorPages,
      pageId,
      'petitionCount'
    );
  }

  static async incrementSignatureCount(
    pageId: string,
    count: number = 1
  ): Promise<void> {
    return this.incrementField(
      collections.creatorPages,
      pageId,
      'totalSignatures',
      count
    );
  }
}

// Initialize default configuration
export const initializeFirestore = async () => {
  try {
    // Create default configuration document
    const configRef = doc(db, collections.config, 'platform');
    const configSnap = await getDoc(configRef);

    if (!configSnap.exists()) {
      await setDoc(configRef, {
        pricingTiers: {
          free: {
            maxSignatures: 100,
            price: 0,
            features: ['Basic petition creation', 'Email notifications'],
          },
          basic: {
            maxSignatures: 1000,
            price: 50,
            features: ['All free features', 'QR code generation', 'Analytics'],
          },
          premium: {
            maxSignatures: 10000,
            price: 200,
            features: [
              'All basic features',
              'Priority support',
              'Custom branding',
            ],
          },
        },
        qrCodePrice: 10,
        categories: [
          'Environment',
          'Social Justice',
          'Politics',
          'Education',
          'Healthcare',
          'Technology',
          'Human Rights',
          'Animal Rights',
          'Community',
          'Other',
        ],
        maxPetitionLength: 5000,
        maxTitleLength: 200,
        maxMediaFiles: 5,
        maxFileSize: 10485760, // 10MB
        supportedFileTypes: [
          'image/jpeg',
          'image/png',
          'image/webp',
          'video/mp4',
        ],
        createdAt: serverTimestamp(),
      });
    }

    console.log('Firestore initialized successfully');
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    throw error;
  }
};

export default FirestoreService;
