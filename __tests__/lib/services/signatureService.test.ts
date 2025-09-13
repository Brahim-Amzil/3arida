import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { SignatureManagementService } from '../../../lib/services/signatureService';
import type { CreateSignatureData } from '../../../lib/services/signatureService';

// Mock Firebase services
jest.mock('../../../lib/firebase/firestore', () => ({
  SignatureService: {
    createSignature: jest.fn(),
    getSignaturesByPetition: jest.fn(),
    checkExistingSignature: jest.fn(),
    getById: jest.fn(),
  },
  PetitionService: {
    getPetitionById: jest.fn(),
    incrementSignatureCount: jest.fn(),
  },
  CreatorPageService: {
    incrementSignatureCount: jest.fn(),
  },
}));

describe('SignatureManagementService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signPetition', () => {
    const mockPetition = {
      id: 'petition123',
      title: 'Test Petition',
      status: 'approved' as const,
      currentSignatures: 50,
      targetSignatures: 1000,
      creatorPageId: 'creator123',
    };

    const mockSignatureData: CreateSignatureData = {
      petitionId: 'petition123',
      signerName: 'John Doe',
      signerPhone: '+212600000000',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      isAnonymous: false,
    };

    it('should sign petition successfully with verified phone', async () => {
      const {
        SignatureService,
        PetitionService,
        CreatorPageService,
      } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(mockPetition);
      SignatureService.checkExistingSignature.mockResolvedValue(false);
      SignatureService.createSignature.mockResolvedValue('signature123');
      SignatureService.getById.mockResolvedValue({
        id: 'signature123',
        ...mockSignatureData,
        verificationMethod: 'phone_otp',
        verifiedAt: new Date(),
        createdAt: new Date(),
      });
      PetitionService.incrementSignatureCount.mockResolvedValue(undefined);
      CreatorPageService.incrementSignatureCount.mockResolvedValue(undefined);
      PetitionService.getPetitionById
        .mockResolvedValueOnce(mockPetition)
        .mockResolvedValueOnce({
          ...mockPetition,
          currentSignatures: 51,
        });

      const result = await SignatureManagementService.signPetition(
        mockSignatureData,
        true
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.signature).toBeDefined();
      expect(result.data?.petition).toBeDefined();
      expect(SignatureService.createSignature).toHaveBeenCalled();
      expect(PetitionService.incrementSignatureCount).toHaveBeenCalledWith(
        'petition123'
      );
    });

    it('should fail without phone verification', async () => {
      const result = await SignatureManagementService.signPetition(
        mockSignatureData,
        false
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'Phone number verification required to sign petitions'
      );
    });

    it('should fail for non-existent petition', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(null);

      const result = await SignatureManagementService.signPetition(
        mockSignatureData,
        true
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Petition not found');
    });

    it('should fail for non-approved petition', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue({
        ...mockPetition,
        status: 'pending',
      });

      const result = await SignatureManagementService.signPetition(
        mockSignatureData,
        true
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Petition is not available for signing');
    });

    it('should fail when petition has reached target', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue({
        ...mockPetition,
        currentSignatures: 1000,
        targetSignatures: 1000,
      });

      const result = await SignatureManagementService.signPetition(
        mockSignatureData,
        true
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'Petition has already reached its signature target'
      );
    });

    it('should fail for duplicate signature from same phone', async () => {
      const {
        PetitionService,
        SignatureService,
      } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(mockPetition);
      SignatureService.checkExistingSignature.mockResolvedValue(true);

      const result = await SignatureManagementService.signPetition(
        mockSignatureData,
        true
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'This phone number has already signed this petition'
      );
    });

    it('should validate signature data', async () => {
      const invalidData = {
        ...mockSignatureData,
        signerName: 'A', // Too short
      };

      const result = await SignatureManagementService.signPetition(
        invalidData,
        true
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid signature data');
      expect(result.errors).toBeDefined();
    });
  });

  describe('getPetitionSignatures', () => {
    const mockPetition = {
      id: 'petition123',
      creatorId: 'user123',
      status: 'approved' as const,
      isPublic: true,
    };

    const mockSignatures = [
      {
        id: 'sig1',
        petitionId: 'petition123',
        signerName: 'John Doe',
        signerPhone: '+212600000001',
        isAnonymous: false,
        createdAt: new Date(),
      },
      {
        id: 'sig2',
        petitionId: 'petition123',
        signerName: 'Anonymous',
        signerPhone: '+212600000002',
        isAnonymous: true,
        createdAt: new Date(),
      },
    ];

    it('should return signatures for petition creator', async () => {
      const {
        PetitionService,
        SignatureService,
      } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(mockPetition);
      SignatureService.getSignaturesByPetition.mockResolvedValue(
        mockSignatures
      );

      const result = await SignatureManagementService.getPetitionSignatures(
        'petition123',
        true,
        'user123',
        'user'
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSignatures);
    });

    it('should return signatures for moderator', async () => {
      const {
        PetitionService,
        SignatureService,
      } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(mockPetition);
      SignatureService.getSignaturesByPetition.mockResolvedValue(
        mockSignatures
      );

      const result = await SignatureManagementService.getPetitionSignatures(
        'petition123',
        true,
        'moderator123',
        'moderator'
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSignatures);
    });

    it('should hide sensitive info for non-creators', async () => {
      const {
        PetitionService,
        SignatureService,
      } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(mockPetition);
      SignatureService.getSignaturesByPetition.mockResolvedValue(
        mockSignatures
      );

      const result = await SignatureManagementService.getPetitionSignatures(
        'petition123',
        true,
        'other-user',
        'user'
      );

      expect(result.success).toBe(true);
      expect(result.data?.[0].signerPhone).toMatch(/\+212\*\*\*\*01/);
      expect(result.data?.[0].ipAddress).toBe('Hidden');
    });

    it('should filter out anonymous signatures when requested', async () => {
      const {
        PetitionService,
        SignatureService,
      } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(mockPetition);
      SignatureService.getSignaturesByPetition.mockResolvedValue(
        mockSignatures
      );

      const result = await SignatureManagementService.getPetitionSignatures(
        'petition123',
        false, // Don't include anonymous
        'user123',
        'user'
      );

      expect(result.success).toBe(true);
      expect(result.data?.length).toBe(1);
      expect(result.data?.[0].isAnonymous).toBe(false);
    });

    it('should fail for unauthorized access', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue({
        ...mockPetition,
        status: 'draft',
        isPublic: false,
      });

      const result = await SignatureManagementService.getPetitionSignatures(
        'petition123',
        true,
        'other-user',
        'user'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized to view petition signatures');
    });

    it('should fail for non-existent petition', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(null);

      const result = await SignatureManagementService.getPetitionSignatures(
        'petition123',
        true,
        'user123',
        'user'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Petition not found');
    });
  });

  describe('checkSignatureExists', () => {
    it('should return true when signature exists', async () => {
      const { SignatureService } = require('../../../lib/firebase/firestore');

      SignatureService.checkExistingSignature.mockResolvedValue(true);
      SignatureService.getSignaturesByPetition.mockResolvedValue([
        {
          id: 'sig1',
          signerPhone: '+212600000001',
          createdAt: new Date(),
        },
      ]);

      const result = await SignatureManagementService.checkSignatureExists(
        'petition123',
        '+212600000001'
      );

      expect(result.success).toBe(true);
      expect(result.data?.exists).toBe(true);
      expect(result.data?.signature).toBeDefined();
    });

    it('should return false when signature does not exist', async () => {
      const { SignatureService } = require('../../../lib/firebase/firestore');

      SignatureService.checkExistingSignature.mockResolvedValue(false);

      const result = await SignatureManagementService.checkSignatureExists(
        'petition123',
        '+212600000001'
      );

      expect(result.success).toBe(true);
      expect(result.data?.exists).toBe(false);
      expect(result.data?.signature).toBeUndefined();
    });
  });

  describe('getPetitionSignatureStats', () => {
    const mockPetition = {
      id: 'petition123',
      creatorId: 'user123',
      status: 'approved' as const,
    };

    const mockSignatures = [
      {
        id: 'sig1',
        signerLocation: { country: 'Morocco', city: 'Casablanca' },
        isAnonymous: false,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'sig2',
        signerLocation: { country: 'Morocco', city: 'Rabat' },
        isAnonymous: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'sig3',
        signerLocation: { country: 'Morocco', city: 'Casablanca' },
        isAnonymous: false,
        createdAt: new Date('2024-01-02'),
      },
    ];

    it('should return statistics for petition creator', async () => {
      const {
        PetitionService,
        SignatureService,
      } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(mockPetition);
      SignatureService.getSignaturesByPetition.mockResolvedValue(
        mockSignatures
      );

      const result = await SignatureManagementService.getPetitionSignatureStats(
        'petition123',
        'user123',
        'user'
      );

      expect(result.success).toBe(true);
      expect(result.data?.totalSignatures).toBe(3);
      expect(result.data?.anonymousCount).toBe(1);
      expect(result.data?.signaturesByLocation).toEqual({
        'Casablanca, Morocco': 2,
        'Rabat, Morocco': 1,
      });
      expect(result.data?.signaturesByDay).toEqual({
        '2024-01-01': 2,
        '2024-01-02': 1,
      });
      expect(result.data?.recentSignatures).toHaveLength(3);
    });

    it('should return statistics for moderator', async () => {
      const {
        PetitionService,
        SignatureService,
      } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(mockPetition);
      SignatureService.getSignaturesByPetition.mockResolvedValue(
        mockSignatures
      );

      const result = await SignatureManagementService.getPetitionSignatureStats(
        'petition123',
        'moderator123',
        'moderator'
      );

      expect(result.success).toBe(true);
      expect(result.data?.totalSignatures).toBe(3);
    });

    it('should fail for unauthorized user', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(mockPetition);

      const result = await SignatureManagementService.getPetitionSignatureStats(
        'petition123',
        'other-user',
        'user'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized to view petition statistics');
    });

    it('should fail for non-existent petition', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(null);

      const result = await SignatureManagementService.getPetitionSignatureStats(
        'petition123',
        'user123',
        'user'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Petition not found');
    });
  });
});
