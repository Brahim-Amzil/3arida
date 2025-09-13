import { adminDb } from './admin';
import { FieldValue } from 'firebase-admin/firestore';
import type {
  User,
  Petition,
  CreatorPage,
  Signature,
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

// Generic CRUD operations using Admin SDK
export class AdminFirestoreService {
  // Get document by ID
  static async getById<T>(
    collectionName: string,
    id: string
  ): Promise<T | null> {
    const docRef = adminDb.collection(collectionName).doc(id);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data?.createdAt ? timestampToDate(data.createdAt) : new Date(),
        updatedAt: data?.updatedAt ? timestampToDate(data.updatedAt) : undefined,
      } as T;
    }

    return null;
  }

  // Create document
  static async create<T>(
    collectionName: string,
    data: Omit<T, 'id' | 'createdAt'>
  ): Promise<string> {
    const docRef = await adminDb.collection(collectionName).add({
      ...data,
      createdAt: new Date(),
    });
    return docRef.id;
  }

  // Update document
  static async update<T>(
    collectionName: string,
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt'>>
  ): Promise<void> {
    const docRef = adminDb.collection(collectionName).doc(id);
    await docRef.update({
      ...data,
      updatedAt: new Date(),
    });
  }

  // Delete document
  static async delete(collectionName: string, id: string): Promise<void> {
    const docRef = adminDb.collection(collectionName).doc(id);
    await docRef.delete();
  }

  // Increment field value
  static async incrementField(
    collectionName: string,
    id: string,
    field: string,
    value: number = 1
  ): Promise<void> {
    const docRef = adminDb.collection(collectionName).doc(id);
    await docRef.update({
      [field]: FieldValue.increment(value),
      updatedAt: new Date(),
    });
  }
}

// Admin Petition Service
export class AdminPetitionService extends AdminFirestoreService {
  static async createPetition(
    petitionData: Omit<Petition, 'id' | 'createdAt'>
  ): Promise<string> {
    return this.create<Petition>(collections.petitions, petitionData);
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
    const snapshot = await adminDb
      .collection(collections.petitions)
      .where('creatorId', '==', creatorId)
      .orderBy('createdAt', 'desc')
      .get();

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

// Admin Signature Service
export class AdminSignatureService extends AdminFirestoreService {
  static async createSignature(
    signatureData: Omit<Signature, 'id' | 'createdAt'>
  ): Promise<string> {
    return this.create<Signature>(collections.signatures, signatureData);
  }

  static async getSignaturesByPetition(
    petitionId: string
  ): Promise<Signature[]> {
    const snapshot = await adminDb
      .collection(collections.signatures)
      .where('petitionId', '==', petitionId)
      .orderBy('createdAt', 'desc')
      .get();

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
    const snapshot = await adminDb
      .collection(collections.signatures)
      .where('petitionId', '==', petitionId)
      .where('signerPhone', '==', phone)
      .get();

    return !snapshot.empty;
  }


}

// Admin User Service
export class AdminUserService extends AdminFirestoreService {
  static async createUser(
    userData: Omit<User, 'id' | 'createdAt'>
  ): Promise<string> {
    return this.create<User>(collections.users, userData);
  }

  static async getUserById(id: string): Promise<User | null> {
    return this.getById<User>(collections.users, id);
  }

  static async updateUser(id: string, userData: Partial<User>): Promise<void> {
    return this.update<User>(collections.users, id, userData);
  }
}

export default AdminFirestoreService;