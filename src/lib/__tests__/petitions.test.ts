import {
  createPetition,
  getPetitionById,
  getUserPetitions,
  signPetition,
  calculatePetitionPrice,
  getPetitionsByCategory,
  searchPetitions,
} from '../petitions';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { PetitionFormData, Petition } from '../../types/petition';

// Mock Firebase modules
jest.mock('firebase/firestore');
jest.mock('../firebase');

const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;
const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;
const mockUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>;
const mockDoc = doc as jest.MockedFunction<typeof doc>;
const mockCollection = collection as jest.MockedFunction<typeof collection>;
const mockQuery = query as jest.MockedFunction<typeof query>;
const mockWhere = where as jest.MockedFunction<typeof where>;
const mockIncrement = increment as jest.MockedFunction<typeof increment>;

describe('Petitions Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPetition', () => {
    it('should create a petition successfully', async () => {
      const petitionData: PetitionFormData = {
        title: 'Save Our Environment',
        description:
          'This petition is about protecting our environment from pollution and climate change.',
        category: 'Environment',
        targetSignatures: 1000,
        mediaUrls: ['https://example.com/image.jpg'],
      };

      const userId = 'user123';
      const mockDocRef = { id: 'petition123' };

      mockCollection.mockReturnValue({} as any);
      mockAddDoc.mockResolvedValue(mockDocRef as any);

      const result = await createPetition(petitionData, userId);

      expect(mockAddDoc).toHaveBeenCalled();
      expect(result).toBe('petition123');
    });

    it('should handle creation errors', async () => {
      const petitionData: PetitionFormData = {
        title: 'Test Petition',
        description: 'Test description',
        category: 'Test',
        targetSignatures: 100,
        mediaUrls: [],
      };

      mockAddDoc.mockRejectedValue(new Error('Firestore error'));

      await expect(createPetition(petitionData, 'user123')).rejects.toThrow(
        'Failed to create petition'
      );
    });
  });

  describe('getPetitionById', () => {
    it('should return petition when found', async () => {
      const petitionId = 'petition123';
      const mockPetitionData = {
        title: 'Test Petition',
        description: 'Test description',
        category: 'Environment',
        currentSignatures: 50,
        targetSignatures: 1000,
        status: 'approved',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const mockDocSnap = {
        exists: () => true,
        data: () => mockPetitionData,
        id: petitionId,
      };

      mockDoc.mockReturnValue({} as any);
      mockGetDoc.mockResolvedValue(mockDocSnap as any);

      const result = await getPetitionById(petitionId);

      expect(mockGetDoc).toHaveBeenCalled();
      expect(result).toEqual({
        id: petitionId,
        ...mockPetitionData,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should return null when petition not found', async () => {
      const petitionId = 'nonexistent';

      const mockDocSnap = {
        exists: () => false,
      };

      mockDoc.mockReturnValue({} as any);
      mockGetDoc.mockResolvedValue(mockDocSnap as any);

      const result = await getPetitionById(petitionId);

      expect(result).toBeNull();
    });
  });

  describe('getUserPetitions', () => {
    it('should return user petitions', async () => {
      const userId = 'user123';
      const mockPetitions = [
        {
          id: 'petition1',
          title: 'Petition 1',
          createdBy: userId,
          createdAt: Timestamp.now(),
        },
        {
          id: 'petition2',
          title: 'Petition 2',
          createdBy: userId,
          createdAt: Timestamp.now(),
        },
      ];

      const mockQuerySnapshot = {
        forEach: (callback: any) => {
          mockPetitions.forEach((petition, index) => {
            callback({
              id: petition.id,
              data: () => petition,
            });
          });
        },
      };

      mockCollection.mockReturnValue({} as any);
      mockQuery.mockReturnValue({} as any);
      mockWhere.mockReturnValue({} as any);
      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await getUserPetitions(userId);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('petition1');
      expect(result[1].id).toBe('petition2');
    });
  });

  describe('signPetition', () => {
    it('should sign petition successfully', async () => {
      const petitionId = 'petition123';
      const signatureData = {
        signerName: 'John Doe',
        signerPhone: '+212612345678',
        verificationMethod: 'phone_otp' as const,
        ipAddress: '192.168.1.1',
      };

      mockCollection.mockReturnValue({} as any);
      mockAddDoc.mockResolvedValue({ id: 'signature123' } as any);
      mockDoc.mockReturnValue({} as any);
      mockUpdateDoc.mockResolvedValue(undefined);
      mockIncrement.mockReturnValue({} as any);

      const result = await signPetition(petitionId, signatureData);

      expect(mockAddDoc).toHaveBeenCalled();
      expect(mockUpdateDoc).toHaveBeenCalled();
      expect(result).toBe('signature123');
    });

    it('should handle signing errors', async () => {
      const petitionId = 'petition123';
      const signatureData = {
        signerName: 'John Doe',
        signerPhone: '+212612345678',
        verificationMethod: 'phone_otp' as const,
        ipAddress: '192.168.1.1',
      };

      mockAddDoc.mockRejectedValue(new Error('Firestore error'));

      await expect(signPetition(petitionId, signatureData)).rejects.toThrow(
        'Failed to sign petition'
      );
    });
  });

  describe('calculatePetitionPrice', () => {
    it('should return correct price for different tiers', () => {
      expect(calculatePetitionPrice(1000)).toBe(0); // Free tier
      expect(calculatePetitionPrice(3000)).toBe(49); // Basic tier
      expect(calculatePetitionPrice(7000)).toBe(79); // Premium tier
      expect(calculatePetitionPrice(50000)).toBe(199); // Enterprise tier
    });

    it('should handle edge cases', () => {
      expect(calculatePetitionPrice(2500)).toBe(0); // Exactly at free limit
      expect(calculatePetitionPrice(5000)).toBe(49); // Exactly at basic limit
      expect(calculatePetitionPrice(10000)).toBe(79); // Exactly at premium limit
    });
  });

  describe('getPetitionsByCategory', () => {
    it('should return petitions by category', async () => {
      const category = 'Environment';
      const mockPetitions = [
        {
          id: 'petition1',
          title: 'Save Trees',
          category: 'Environment',
          status: 'approved',
        },
      ];

      const mockQuerySnapshot = {
        forEach: (callback: any) => {
          mockPetitions.forEach((petition) => {
            callback({
              id: petition.id,
              data: () => petition,
            });
          });
        },
      };

      mockCollection.mockReturnValue({} as any);
      mockQuery.mockReturnValue({} as any);
      mockWhere.mockReturnValue({} as any);
      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await getPetitionsByCategory(category);

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe(category);
    });
  });

  describe('searchPetitions', () => {
    it('should search petitions by title', async () => {
      const searchTerm = 'environment';
      const mockPetitions = [
        {
          id: 'petition1',
          title: 'Save Our Environment',
          description: 'Environmental protection',
          status: 'approved',
        },
      ];

      const mockQuerySnapshot = {
        forEach: (callback: any) => {
          mockPetitions.forEach((petition) => {
            callback({
              id: petition.id,
              data: () => petition,
            });
          });
        },
      };

      mockCollection.mockReturnValue({} as any);
      mockQuery.mockReturnValue({} as any);
      mockWhere.mockReturnValue({} as any);
      mockGetDocs.mockResolvedValue(mockQuerySnapshot as any);

      const result = await searchPetitions(searchTerm);

      expect(result).toHaveLength(1);
      expect(result[0].title.toLowerCase()).toContain(searchTerm);
    });
  });
});
