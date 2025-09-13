import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from '../firebase/config';
import {
  AdminPetitionService as FirestorePetitionService,
  AdminUserService as UserService,
  AdminSignatureService as FirestoreSignatureService,
} from '../firebase/adminFirestore';
import { petitionSchema, petitionUpdateSchema } from '../validation/schemas';
import type {
  Petition,
  PetitionFilters,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
  User,
} from '../../types/models';
import { z } from 'zod';

export interface CreatePetitionData {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  targetSignatures: number;
  pricingTier:
    | 'free'
    | 'starter'
    | 'growth'
    | 'impact'
    | 'large'
    | 'mass'
    | 'enterprise';
  mediaFiles?: any[];
  tags?: string[];
  location?: {
    country: string;
    city?: string;
    region?: string;
  };
  isPublic?: boolean;
}

export interface UpdatePetitionData {
  title?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  tags?: string[];
  location?: {
    country: string;
    city?: string;
    region?: string;
  };
  isPublic?: boolean;
}

export class PetitionManagementService {
  // Calculate pricing tier based on target signatures (from requirements)
  static calculatePricingTier(targetSignatures: number): {
    tier:
      | 'free'
      | 'starter'
      | 'growth'
      | 'impact'
      | 'large'
      | 'mass'
      | 'enterprise';
    price: number;
  } {
    if (targetSignatures <= 2500) {
      return { tier: 'free', price: 0 };
    } else if (targetSignatures <= 5000) {
      return { tier: 'starter', price: 49 };
    } else if (targetSignatures <= 10000) {
      return { tier: 'growth', price: 79 };
    } else if (targetSignatures <= 25000) {
      return { tier: 'impact', price: 119 };
    } else if (targetSignatures <= 50000) {
      return { tier: 'large', price: 149 };
    } else if (targetSignatures <= 100000) {
      return { tier: 'mass', price: 199 };
    } else {
      return { tier: 'enterprise', price: 0 }; // Custom pricing - handled separately
    }
  }

  // Upload media files to Firebase Storage
  static async uploadMediaFiles(
    petitionId: string,
    files: any[]
  ): Promise<string[]> {
    const fs = require('fs');

    const uploadPromises = files.map(async (file, index) => {
      const fileName = `${Date.now()}_${index}_${file.originalFilename}`;
      const storageRef = ref(
        storage,
        `petitions/${petitionId}/media/${fileName}`
      );

      // Read file buffer from filepath
      const buffer = fs.readFileSync(file.filepath);
      const snapshot = await uploadBytes(storageRef, buffer, {
        contentType: file.mimetype,
      });
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    });

    return Promise.all(uploadPromises);
  }

  // Delete media files from Firebase Storage
  static async deleteMediaFiles(mediaUrls: string[]): Promise<void> {
    const deletePromises = mediaUrls.map(async (url) => {
      try {
        const storageRef = ref(storage, url);
        await deleteObject(storageRef);
      } catch (error) {
        console.warn('Failed to delete media file:', url, error);
      }
    });

    await Promise.all(deletePromises);
  }

  // Create a new petition
  static async createPetition(
    creatorId: string,
    petitionData: CreatePetitionData
  ): Promise<ApiResponse<Petition>> {
    try {
      console.log('PetitionManagementService.createPetition called with:', {
        creatorId,
        petitionData: {
          ...petitionData,
          mediaFiles: petitionData.mediaFiles?.length || 0,
        },
      });

      // Validate input data
      console.log('Validating petition data...');
      const validationResult = petitionSchema.safeParse({
        ...petitionData,
        mediaUrls: [], // Will be populated after upload
      });

      if (!validationResult.success) {
        console.error('Validation failed:', validationResult.error.errors);
        return {
          success: false,
          error: 'Invalid petition data',
          errors: validationResult.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        };
      }

      console.log('Validation passed successfully');

      // Get user to verify they exist and are verified
      console.log('Getting user by ID:', creatorId);
      const user = await UserService.getUserById(creatorId);
      console.log(
        'User found:',
        user
          ? {
              id: user.id,
              email: user.email,
              verifiedEmail: user.verifiedEmail,
            }
          : 'null'
      );

      if (!user) {
        console.error('User not found for ID:', creatorId);
        return {
          success: false,
          error: 'User not found',
        };
      }

      if (!user.verifiedEmail) {
        console.error('User email not verified:', user.email);
        return {
          success: false,
          error: 'Email verification required to create petitions',
        };
      }

      console.log('User verification passed');

      // Calculate pricing
      const { tier, price } = this.calculatePricingTier(
        petitionData.targetSignatures
      );

      // Create petition document first to get ID
      const petitionId = await FirestorePetitionService.createPetition({
        title: petitionData.title,
        description: petitionData.description,
        category: petitionData.category,
        subcategory: petitionData.subcategory,
        targetSignatures: petitionData.targetSignatures,
        currentSignatures: 0,
        status: 'draft', // All petitions start as draft per Firestore rules
        creatorId,
        creatorPageId: user.creatorPageId,
        mediaUrls: [],
        qrCodeUrl: undefined,
        hasQrCode: false,
        pricingTier: tier,
        amountPaid: 0,
        paymentStatus: price > 0 ? 'unpaid' : 'paid',
        stripePaymentIntentId: undefined,
        approvedAt: undefined,
        approvedBy: undefined,
        pausedAt: undefined,
        pausedBy: undefined,
        pauseReason: undefined,
        deletedAt: undefined,
        deletedBy: undefined,
        deleteReason: undefined,
        expiresAt: undefined,
        isPublic: petitionData.isPublic ?? true,
        tags: petitionData.tags ?? [],
        location: petitionData.location,
      });

      // Upload media files if provided
      let mediaUrls: string[] = [];
      if (petitionData.mediaFiles && petitionData.mediaFiles.length > 0) {
        try {
          mediaUrls = await this.uploadMediaFiles(
            petitionId,
            petitionData.mediaFiles
          );

          // Update petition with media URLs
          await FirestorePetitionService.updatePetition(petitionId, {
            mediaUrls,
          });
        } catch (uploadError) {
          console.error('Media upload failed:', uploadError);
          // Continue without media - don't fail the entire petition creation
        }
      }

      // Note: Creator page functionality removed for simplification

      // Get the created petition
      const petition =
        await FirestorePetitionService.getPetitionById(petitionId);

      if (!petition) {
        throw new Error('Failed to retrieve created petition');
      }

      return {
        success: true,
        data: petition,
        message:
          price > 0
            ? `Petition created successfully. Payment of ${price} MAD required to publish.`
            : 'Petition created successfully and submitted for review.',
      };
    } catch (error) {
      console.error('Error creating petition:', error);
      return {
        success: false,
        error: 'Failed to create petition',
      };
    }
  }

  // Update an existing petition
  static async updatePetition(
    petitionId: string,
    userId: string,
    updateData: UpdatePetitionData,
    userRole: 'user' | 'moderator' | 'admin' = 'user'
  ): Promise<ApiResponse<Petition>> {
    try {
      // Validate input data
      const validationResult = petitionUpdateSchema.safeParse(updateData);

      if (!validationResult.success) {
        return {
          success: false,
          error: 'Invalid update data',
          errors: validationResult.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        };
      }

      // Get existing petition
      const petition =
        await FirestorePetitionService.getPetitionById(petitionId);
      if (!petition) {
        return {
          success: false,
          error: 'Petition not found',
        };
      }

      // Check authorization
      const canUpdate =
        petition.creatorId === userId ||
        userRole === 'moderator' ||
        userRole === 'admin';

      if (!canUpdate) {
        return {
          success: false,
          error: 'Unauthorized to update this petition',
        };
      }

      // Users can only update draft petitions, moderators/admins can update any
      if (userRole === 'user' && petition.status !== 'draft') {
        return {
          success: false,
          error: 'Can only update draft petitions',
        };
      }

      // Update petition
      await FirestorePetitionService.updatePetition(petitionId, updateData);

      // Get updated petition
      const updatedPetition =
        await FirestorePetitionService.getPetitionById(petitionId);

      return {
        success: true,
        data: updatedPetition!,
        message: 'Petition updated successfully',
      };
    } catch (error) {
      console.error('Error updating petition:', error);
      return {
        success: false,
        error: 'Failed to update petition',
      };
    }
  }

  // Delete a petition
  static async deletePetition(
    petitionId: string,
    userId: string,
    userRole: 'user' | 'moderator' | 'admin' = 'user',
    deleteReason?: string
  ): Promise<ApiResponse<void>> {
    try {
      // Get existing petition
      const petition =
        await FirestorePetitionService.getPetitionById(petitionId);
      if (!petition) {
        return {
          success: false,
          error: 'Petition not found',
        };
      }

      // Check authorization
      const canDelete =
        petition.creatorId === userId ||
        userRole === 'moderator' ||
        userRole === 'admin';

      if (!canDelete) {
        return {
          success: false,
          error: 'Unauthorized to delete this petition',
        };
      }

      // Soft delete - update status instead of actually deleting
      await FirestorePetitionService.updatePetition(petitionId, {
        status: 'deleted',
        deletedAt: new Date(),
        deletedBy: userId,
        deleteReason,
      });

      // Delete media files from storage
      if (petition.mediaUrls && petition.mediaUrls.length > 0) {
        await this.deleteMediaFiles(petition.mediaUrls);
      }

      return {
        success: true,
        message: 'Petition deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting petition:', error);
      return {
        success: false,
        error: 'Failed to delete petition',
      };
    }
  }

  // Get petition by ID
  static async getPetitionById(
    petitionId: string,
    userId?: string
  ): Promise<ApiResponse<Petition>> {
    try {
      const petition =
        await FirestorePetitionService.getPetitionById(petitionId);

      if (!petition) {
        return {
          success: false,
          error: 'Petition not found',
        };
      }

      // Check if user can view this petition
      const canView =
        petition.isPublic ||
        petition.creatorId === userId ||
        petition.status === 'approved';

      if (!canView) {
        return {
          success: false,
          error: 'Petition not accessible',
        };
      }

      return {
        success: true,
        data: petition,
      };
    } catch (error) {
      console.error('Error getting petition:', error);
      return {
        success: false,
        error: 'Failed to get petition',
      };
    }
  }

  // Get petitions with filtering and pagination
  static async getPetitions(
    filters: PetitionFilters = {},
    pagination: PaginationParams = { page: 1, limit: 20 },
    userId?: string,
    userRole: 'user' | 'moderator' | 'admin' = 'user'
  ): Promise<ApiResponse<PaginatedResponse<Petition>>> {
    try {
      // Build Firestore query filters
      const firestoreFilters: any[] = [];

      // Status filtering based on user role
      if (userRole === 'user') {
        // Regular users can only see approved public petitions or their own
        if (userId) {
          // Show approved public petitions OR user's own petitions
          firestoreFilters
            .push
            // This is a simplified approach - in practice you'd need compound queries
            // For now, we'll handle this in the service layer
            ();
        } else {
          // Guest users can only see approved public petitions
          firestoreFilters.push(['status', '==', 'approved']);
          firestoreFilters.push(['isPublic', '==', true]);
        }
      } else {
        // Moderators and admins can see all petitions
        if (filters.status && filters.status.length > 0) {
          // For multiple status values, we'd need to use 'in' operator
          // For simplicity, we'll handle this in post-processing
        }
      }

      // Category filtering
      if (filters.category) {
        firestoreFilters.push(['category', '==', filters.category]);
      }

      // Location filtering
      if (filters.location?.country) {
        firestoreFilters.push([
          'location.country',
          '==',
          filters.location.country,
        ]);
      }

      // Get petitions from Firestore
      // Note: This is a simplified implementation
      // In production, you'd want to use Firestore's advanced querying capabilities
      const petitions =
        await FirestorePetitionService.getPetitionsByCreator('');

      // Apply additional filtering that can't be done in Firestore
      let filteredPetitions = petitions;

      // Filter by user access rights
      if (userRole === 'user') {
        filteredPetitions = petitions.filter(
          (petition) =>
            (petition.status === 'approved' && petition.isPublic) ||
            (userId && petition.creatorId === userId)
        );
      }

      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredPetitions = filteredPetitions.filter(
          (petition) =>
            petition.title.toLowerCase().includes(searchTerm) ||
            petition.description.toLowerCase().includes(searchTerm) ||
            petition.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Apply signature range filter
      if (filters.signatureRange) {
        filteredPetitions = filteredPetitions.filter((petition) => {
          const signatures = petition.currentSignatures;
          const min = filters.signatureRange?.min ?? 0;
          const max = filters.signatureRange?.max ?? Infinity;
          return signatures >= min && signatures <= max;
        });
      }

      // Apply date range filter
      if (filters.dateRange) {
        filteredPetitions = filteredPetitions.filter((petition) => {
          const createdAt = petition.createdAt;
          const from = filters.dateRange?.from;
          const to = filters.dateRange?.to;

          if (from && createdAt < from) return false;
          if (to && createdAt > to) return false;
          return true;
        });
      }

      // Apply QR code filter
      if (filters.hasQrCode !== undefined) {
        filteredPetitions = filteredPetitions.filter(
          (petition) => petition.hasQrCode === filters.hasQrCode
        );
      }

      // Apply sorting
      const sortBy = pagination.sortBy || 'createdAt';
      const sortOrder = pagination.sortOrder || 'desc';

      filteredPetitions.sort((a, b) => {
        let aValue: any = a[sortBy as keyof Petition];
        let bValue: any = b[sortBy as keyof Petition];

        // Handle date sorting
        if (aValue instanceof Date && bValue instanceof Date) {
          aValue = aValue.getTime();
          bValue = bValue.getTime();
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      // Apply pagination
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedPetitions = filteredPetitions.slice(startIndex, endIndex);

      const totalCount = filteredPetitions.length;
      const totalPages = Math.ceil(totalCount / pagination.limit);

      return {
        success: true,
        data: {
          data: paginatedPetitions,
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: totalCount,
            totalPages,
            hasNext: pagination.page < totalPages,
            hasPrev: pagination.page > 1,
          },
        },
      };
    } catch (error) {
      console.error('Error getting petitions:', error);
      return {
        success: false,
        error: 'Failed to get petitions',
      };
    }
  }

  // Get petitions by creator
  static async getPetitionsByCreator(
    creatorId: string,
    pagination: PaginationParams = { page: 1, limit: 20 },
    requestingUserId?: string,
    userRole: 'user' | 'moderator' | 'admin' = 'user'
  ): Promise<ApiResponse<PaginatedResponse<Petition>>> {
    try {
      const petitions =
        await FirestorePetitionService.getPetitionsByCreator(creatorId);

      // Filter based on access rights
      let filteredPetitions = petitions;

      if (userRole === 'user' && requestingUserId !== creatorId) {
        // Non-creators can only see approved public petitions
        filteredPetitions = petitions.filter(
          (petition) => petition.status === 'approved' && petition.isPublic
        );
      }

      // Apply pagination
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedPetitions = filteredPetitions.slice(startIndex, endIndex);

      const totalCount = filteredPetitions.length;
      const totalPages = Math.ceil(totalCount / pagination.limit);

      return {
        success: true,
        data: {
          data: paginatedPetitions,
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: totalCount,
            totalPages,
            hasNext: pagination.page < totalPages,
            hasPrev: pagination.page > 1,
          },
        },
      };
    } catch (error) {
      console.error('Error getting petitions by creator:', error);
      return {
        success: false,
        error: 'Failed to get petitions by creator',
      };
    }
  }

  // Update petition status (for moderators/admins)
  static async updatePetitionStatus(
    petitionId: string,
    newStatus: Petition['status'],
    moderatorId: string,
    reason?: string
  ): Promise<ApiResponse<Petition>> {
    try {
      const petition =
        await FirestorePetitionService.getPetitionById(petitionId);

      if (!petition) {
        return {
          success: false,
          error: 'Petition not found',
        };
      }

      const updateData: Partial<Petition> = {
        status: newStatus,
      };

      // Set appropriate timestamps and moderator info based on status
      switch (newStatus) {
        case 'approved':
          updateData.approvedAt = new Date();
          updateData.approvedBy = moderatorId;
          break;
        case 'paused':
          updateData.pausedAt = new Date();
          updateData.pausedBy = moderatorId;
          updateData.pauseReason = reason;
          break;
        case 'deleted':
          updateData.deletedAt = new Date();
          updateData.deletedBy = moderatorId;
          updateData.deleteReason = reason;
          break;
      }

      await FirestorePetitionService.updatePetition(petitionId, updateData);

      const updatedPetition =
        await FirestorePetitionService.getPetitionById(petitionId);

      return {
        success: true,
        data: updatedPetition!,
        message: `Petition ${newStatus} successfully`,
      };
    } catch (error) {
      console.error('Error updating petition status:', error);
      return {
        success: false,
        error: 'Failed to update petition status',
      };
    }
  }
}

export default PetitionManagementService;
