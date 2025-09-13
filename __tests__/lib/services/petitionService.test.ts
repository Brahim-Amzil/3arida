import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';
import { PetitionManagementService } from '../../../lib/services/petitionService';
import type { CreatePetitionData } from '../../../lib/services/petitionService';

// Mock Firebase services
jest.mock('../../../lib/firebase/firestore', () => ({
  PetitionService: {
    createPetition: jest.fn(),
    getPetitionById: jest.fn(),
    updatePetition: jest.fn(),
    getPetitionsByCreator: jest.fn(),
    getPublicPetitions: jest.fn(),
    incrementSignatureCount: jest.fn(),
  },
  UserService: {
    getUserById: jest.fn(),
    updateUser: jest.fn(),
  },
  CreatorPageService: {
    createCreatorPage: jest.fn(),
    incrementPetitionCount: jest.fn(),
  },
}));

jest.mock('../../../lib/firebase/config', () => ({
  storage: {},
}));

jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
}));

describe('PetitionManagementService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculatePricingTier', () => {
    it('should return free tier for signatures <= 2500', () => {
      const result = PetitionManagementService.calculatePricingTier(1000);
      expect(result.tier).toBe('free');
      expect(result.price).toBe(0);
    });

    it('should return basic tier with correct pricing for 2500-5000 signatures', () => {
      const result = PetitionManagementService.calculatePricingTier(3000);
      expect(result.tier).toBe('basic');
      expect(result.price).toBe(49);
    });

    it('should return basic tier with higher pricing for 5000-10000 signatures', () => {
      const result = PetitionManagementService.calculatePricingTier(7000);
      expect(result.tier).toBe('basic');
      expect(result.price).toBe(79);
    });

    it('should return premium tier for signatures > 10000', () => {
      const result = PetitionManagementService.calculatePricingTier(15000);
      expect(result.tier).toBe('premium');
      expect(result.price).toBe(119);
    });

    it('should return enterprise pricing for very high signature counts', () => {
      const result = PetitionManagementService.calculatePricingTier(150000);
      expect(result.tier).toBe('premium');
      expect(result.price).toBe(299);
    });
  });

  describe('createPetition', () => {
    const mockUser = {
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com',
      verifiedEmail: true,
      verifiedPhone: false,
      role: 'user' as const,
      creatorPageId: undefined,
      createdAt: new Date(),
      isActive: true,
    };

    const mockPetitionData: CreatePetitionData = {
      title: 'Test Petition',
      description:
        'This is a test petition with enough characters to meet the minimum requirement for description length.',
      category: 'Environment',
      targetSignatures: 1000,
      pricingTier: 'free',
      isPublic: true,
    };

    it('should create a petition successfully for verified user', async () => {
      const {
        UserService,
        PetitionService,
        CreatorPageService,
      } = require('../../../lib/firebase/firestore');

      UserService.getUserById.mockResolvedValue(mockUser);
      PetitionService.createPetition.mockResolvedValue('petition123');
      PetitionService.getPetitionById.mockResolvedValue({
        id: 'petition123',
        ...mockPetitionData,
        creatorId: 'user123',
        currentSignatures: 0,
        status: 'pending',
        createdAt: new Date(),
      });
      CreatorPageService.createCreatorPage.mockResolvedValue('creator123');

      const result = await PetitionManagementService.createPetition(
        'user123',
        mockPetitionData
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(UserService.getUserById).toHaveBeenCalledWith('user123');
      expect(PetitionService.createPetition).toHaveBeenCalled();
    });

    it('should fail for unverified user', async () => {
      const { UserService } = require('../../../lib/firebase/firestore');

      UserService.getUserById.mockResolvedValue({
        ...mockUser,
        verifiedEmail: false,
      });

      const result = await PetitionManagementService.createPetition(
        'user123',
        mockPetitionData
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'Email verification required to create petitions'
      );
    });

    it('should fail for non-existent user', async () => {
      const { UserService } = require('../../../lib/firebase/firestore');

      UserService.getUserById.mockResolvedValue(null);

      const result = await PetitionManagementService.createPetition(
        'user123',
        mockPetitionData
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
    });

    it('should validate petition data', async () => {
      const invalidData = {
        ...mockPetitionData,
        title: 'Short', // Too short
      };

      const result = await PetitionManagementService.createPetition(
        'user123',
        invalidData
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid petition data');
      expect(result.errors).toBeDefined();
    });
  });

  describe('updatePetition', () => {
    const mockPetition = {
      id: 'petition123',
      title: 'Test Petition',
      description:
        'Test description with enough characters to meet requirements.',
      category: 'Environment',
      creatorId: 'user123',
      status: 'draft' as const,
      targetSignatures: 1000,
      currentSignatures: 0,
      createdAt: new Date(),
    };

    it('should update petition successfully for creator', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(mockPetition);
      PetitionService.updatePetition.mockResolvedValue(undefined);
      PetitionService.getPetitionById
        .mockResolvedValueOnce(mockPetition)
        .mockResolvedValueOnce({ ...mockPetition, title: 'Updated Title' });

      const updateData = { title: 'Updated Title' };
      const result = await PetitionManagementService.updatePetition(
        'petition123',
        'user123',
        updateData
      );

      expect(result.success).toBe(true);
      expect(PetitionService.updatePetition).toHaveBeenCalledWith(
        'petition123',
        updateData
      );
    });

    it('should fail for unauthorized user', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(mockPetition);

      const updateData = { title: 'Updated Title' };
      const result = await PetitionManagementService.updatePetition(
        'petition123',
        'different-user',
        updateData
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized to update this petition');
    });

    it('should fail for non-draft petition by regular user', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue({
        ...mockPetition,
        status: 'approved',
      });

      const updateData = { title: 'Updated Title' };
      const result = await PetitionManagementService.updatePetition(
        'petition123',
        'user123',
        updateData
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Can only update draft petitions');
    });

    it('should allow moderators to update any petition', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue({
        ...mockPetition,
        status: 'approved',
      });
      PetitionService.updatePetition.mockResolvedValue(undefined);
      PetitionService.getPetitionById
        .mockResolvedValueOnce({
          ...mockPetition,
          status: 'approved',
        })
        .mockResolvedValueOnce({
          ...mockPetition,
          status: 'approved',
          title: 'Updated Title',
        });

      const updateData = { title: 'Updated Title' };
      const result = await PetitionManagementService.updatePetition(
        'petition123',
        'moderator123',
        updateData,
        'moderator'
      );

      expect(result.success).toBe(true);
    });
  });

  describe('deletePetition', () => {
    const mockPetition = {
      id: 'petition123',
      title: 'Test Petition',
      creatorId: 'user123',
      mediaUrls: ['https://example.com/image1.jpg'],
      status: 'draft' as const,
    };

    it('should delete petition successfully for creator', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');
      const { deleteObject } = require('firebase/storage');

      PetitionService.getPetitionById.mockResolvedValue(mockPetition);
      PetitionService.updatePetition.mockResolvedValue(undefined);
      deleteObject.mockResolvedValue(undefined);

      const result = await PetitionManagementService.deletePetition(
        'petition123',
        'user123',
        'user',
        'Test reason'
      );

      expect(result.success).toBe(true);
      expect(PetitionService.updatePetition).toHaveBeenCalledWith(
        'petition123',
        {
          status: 'deleted',
          deletedAt: expect.any(Date),
          deletedBy: 'user123',
          deleteReason: 'Test reason',
        }
      );
    });

    it('should fail for unauthorized user', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(mockPetition);

      const result = await PetitionManagementService.deletePetition(
        'petition123',
        'different-user'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized to delete this petition');
    });

    it('should fail for non-existent petition', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(null);

      const result = await PetitionManagementService.deletePetition(
        'petition123',
        'user123'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Petition not found');
    });
  });

  describe('getPetitionById', () => {
    const mockPetition = {
      id: 'petition123',
      title: 'Test Petition',
      creatorId: 'user123',
      status: 'approved' as const,
      isPublic: true,
    };

    it('should return petition for public approved petition', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(mockPetition);

      const result =
        await PetitionManagementService.getPetitionById('petition123');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockPetition);
    });

    it('should return petition for creator', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue({
        ...mockPetition,
        status: 'draft',
        isPublic: false,
      });

      const result = await PetitionManagementService.getPetitionById(
        'petition123',
        'user123'
      );

      expect(result.success).toBe(true);
    });

    it('should fail for non-accessible petition', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue({
        ...mockPetition,
        status: 'draft',
        isPublic: false,
      });

      const result = await PetitionManagementService.getPetitionById(
        'petition123',
        'different-user'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Petition not accessible');
    });

    it('should fail for non-existent petition', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(null);

      const result =
        await PetitionManagementService.getPetitionById('petition123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Petition not found');
    });
  });

  describe('updatePetitionStatus', () => {
    const mockPetition = {
      id: 'petition123',
      title: 'Test Petition',
      status: 'pending' as const,
    };

    it('should update petition status to approved', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(mockPetition);
      PetitionService.updatePetition.mockResolvedValue(undefined);
      PetitionService.getPetitionById
        .mockResolvedValueOnce(mockPetition)
        .mockResolvedValueOnce({
          ...mockPetition,
          status: 'approved',
          approvedAt: expect.any(Date),
          approvedBy: 'moderator123',
        });

      const result = await PetitionManagementService.updatePetitionStatus(
        'petition123',
        'approved',
        'moderator123'
      );

      expect(result.success).toBe(true);
      expect(PetitionService.updatePetition).toHaveBeenCalledWith(
        'petition123',
        {
          status: 'approved',
          approvedAt: expect.any(Date),
          approvedBy: 'moderator123',
        }
      );
    });

    it('should update petition status to paused with reason', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(mockPetition);
      PetitionService.updatePetition.mockResolvedValue(undefined);
      PetitionService.getPetitionById
        .mockResolvedValueOnce(mockPetition)
        .mockResolvedValueOnce({
          ...mockPetition,
          status: 'paused',
        });

      const result = await PetitionManagementService.updatePetitionStatus(
        'petition123',
        'paused',
        'moderator123',
        'Inappropriate content'
      );

      expect(result.success).toBe(true);
      expect(PetitionService.updatePetition).toHaveBeenCalledWith(
        'petition123',
        {
          status: 'paused',
          pausedAt: expect.any(Date),
          pausedBy: 'moderator123',
          pauseReason: 'Inappropriate content',
        }
      );
    });

    it('should fail for non-existent petition', async () => {
      const { PetitionService } = require('../../../lib/firebase/firestore');

      PetitionService.getPetitionById.mockResolvedValue(null);

      const result = await PetitionManagementService.updatePetitionStatus(
        'petition123',
        'approved',
        'moderator123'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Petition not found');
    });
  });
});
