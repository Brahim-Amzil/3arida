import {
  AdminSignatureService as FirestoreSignatureService,
  AdminPetitionService as FirestorePetitionService,
} from '../firebase/adminFirestore';
import { signatureSchema } from '../validation/schemas';
import type { Signature, Petition, ApiResponse } from '../../types/models';

export interface CreateSignatureData {
  petitionId: string;
  signerName: string;
  signerPhone: string;
  signerLocation?: {
    country: string;
    city?: string;
    region?: string;
  };
  ipAddress: string;
  userAgent?: string;
  isAnonymous?: boolean;
  comment?: string;
}

export class SignatureManagementService {
  // Sign a petition
  static async signPetition(
    signatureData: CreateSignatureData,
    isPhoneVerified: boolean = false
  ): Promise<ApiResponse<{ signature: Signature; petition: Petition }>> {
    try {
      // Validate input data
      const validationResult = signatureSchema.safeParse({
        ...signatureData,
        verificationMethod: 'phone_otp',
        verifiedAt: new Date(),
      });

      if (!validationResult.success) {
        return {
          success: false,
          error: 'Invalid signature data',
          errors: validationResult.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        };
      }

      // Check if phone is verified
      if (!isPhoneVerified) {
        return {
          success: false,
          error: 'Phone number verification required to sign petitions',
        };
      }

      // Get petition to verify it exists and can be signed
      const petition = await FirestorePetitionService.getPetitionById(
        signatureData.petitionId
      );

      if (!petition) {
        return {
          success: false,
          error: 'Petition not found',
        };
      }

      // Check if petition can be signed
      if (petition.status !== 'approved') {
        return {
          success: false,
          error: 'Petition is not available for signing',
        };
      }

      // Check if petition has reached its target
      if (petition.currentSignatures >= petition.targetSignatures) {
        return {
          success: false,
          error: 'Petition has already reached its signature target',
        };
      }

      // Check for duplicate signature from same phone number
      const existingSignature =
        await FirestoreSignatureService.checkExistingSignature(
          signatureData.petitionId,
          signatureData.signerPhone
        );

      if (existingSignature) {
        return {
          success: false,
          error: 'This phone number has already signed this petition',
        };
      }

      // Create signature
      const signatureId = await FirestoreSignatureService.createSignature({
        petitionId: signatureData.petitionId,
        signerName: signatureData.signerName,
        signerPhone: signatureData.signerPhone,
        signerLocation: signatureData.signerLocation,
        verificationMethod: 'phone_otp',
        verifiedAt: new Date(),
        ipAddress: signatureData.ipAddress,
        userAgent: signatureData.userAgent,
        isAnonymous: signatureData.isAnonymous ?? false,
        comment: signatureData.comment,
      });

      // Increment petition signature count
      await FirestorePetitionService.incrementSignatureCount(
        signatureData.petitionId
      );

      // Note: Creator page signature count update removed for simplification

      // Get the created signature and updated petition
      const signature = await FirestoreSignatureService.getById('signatures', signatureId);
      const updatedPetition = await FirestorePetitionService.getPetitionById(
        signatureData.petitionId
      );

      if (!signature || !updatedPetition) {
        throw new Error(
          'Failed to retrieve signature or petition after creation'
        );
      }

      return {
        success: true,
        data: {
          signature: signature as Signature,
          petition: updatedPetition,
        },
        message: 'Petition signed successfully',
      };
    } catch (error) {
      console.error('Error signing petition:', error);
      return {
        success: false,
        error: 'Failed to sign petition',
      };
    }
  }

  // Get signatures for a petition
  static async getPetitionSignatures(
    petitionId: string,
    includeAnonymous: boolean = true,
    requestingUserId?: string,
    userRole: 'user' | 'moderator' | 'admin' = 'user'
  ): Promise<ApiResponse<Signature[]>> {
    try {
      // Get petition to verify access
      const petition =
        await FirestorePetitionService.getPetitionById(petitionId);

      if (!petition) {
        return {
          success: false,
          error: 'Petition not found',
        };
      }

      // Check access rights
      const canViewSignatures =
        petition.creatorId === requestingUserId ||
        userRole === 'moderator' ||
        userRole === 'admin' ||
        (petition.status === 'approved' && petition.isPublic);

      if (!canViewSignatures) {
        return {
          success: false,
          error: 'Unauthorized to view petition signatures',
        };
      }

      // Get signatures
      const signatures =
        await FirestoreSignatureService.getSignaturesByPetition(petitionId);

      // Filter out anonymous signatures if requested
      let filteredSignatures = signatures;
      if (!includeAnonymous) {
        filteredSignatures = signatures.filter(
          (signature) => !signature.isAnonymous
        );
      }

      // For non-creators/non-moderators, hide sensitive information
      if (petition.creatorId !== requestingUserId && userRole === 'user') {
        filteredSignatures = filteredSignatures.map((signature) => ({
          ...signature,
          signerPhone: signature.isAnonymous
            ? 'Hidden'
            : signature.signerPhone.replace(/(\+\d{3})\d+(\d{2})/, '$1****$2'),
          ipAddress: 'Hidden',
          userAgent: undefined,
        }));
      }

      return {
        success: true,
        data: filteredSignatures,
      };
    } catch (error) {
      console.error('Error getting petition signatures:', error);
      return {
        success: false,
        error: 'Failed to get petition signatures',
      };
    }
  }

  // Check if a phone number has already signed a petition
  static async checkSignatureExists(
    petitionId: string,
    phoneNumber: string
  ): Promise<ApiResponse<{ exists: boolean; signature?: Signature }>> {
    try {
      const exists = await FirestoreSignatureService.checkExistingSignature(
        petitionId,
        phoneNumber
      );

      if (exists) {
        // Get the actual signature for more details
        const signatures =
          await FirestoreSignatureService.getSignaturesByPetition(petitionId);
        const signature = signatures.find(
          (sig) => sig.signerPhone === phoneNumber
        );

        return {
          success: true,
          data: {
            exists: true,
            signature,
          },
        };
      }

      return {
        success: true,
        data: {
          exists: false,
        },
      };
    } catch (error) {
      console.error('Error checking signature existence:', error);
      return {
        success: false,
        error: 'Failed to check signature existence',
      };
    }
  }

  // Get signature statistics for a petition
  static async getPetitionSignatureStats(
    petitionId: string,
    requestingUserId?: string,
    userRole: 'user' | 'moderator' | 'admin' = 'user'
  ): Promise<
    ApiResponse<{
      totalSignatures: number;
      signaturesByLocation: { [location: string]: number };
      signaturesByDay: { [date: string]: number };
      anonymousCount: number;
      recentSignatures: Signature[];
    }>
  > {
    try {
      // Get petition to verify access
      const petition =
        await FirestorePetitionService.getPetitionById(petitionId);

      if (!petition) {
        return {
          success: false,
          error: 'Petition not found',
        };
      }

      // Check access rights - only creator, moderators, and admins can see detailed stats
      const canViewStats =
        petition.creatorId === requestingUserId ||
        userRole === 'moderator' ||
        userRole === 'admin';

      if (!canViewStats) {
        return {
          success: false,
          error: 'Unauthorized to view petition statistics',
        };
      }

      // Get all signatures
      const signatures =
        await FirestoreSignatureService.getSignaturesByPetition(petitionId);

      // Calculate statistics
      const totalSignatures = signatures.length;
      const anonymousCount = signatures.filter((sig) => sig.isAnonymous).length;

      // Group by location
      const signaturesByLocation: { [location: string]: number } = {};
      signatures.forEach((signature) => {
        if (signature.signerLocation) {
          const location = signature.signerLocation.city
            ? `${signature.signerLocation.city}, ${signature.signerLocation.country}`
            : signature.signerLocation.country;
          signaturesByLocation[location] =
            (signaturesByLocation[location] || 0) + 1;
        } else {
          signaturesByLocation['Unknown'] =
            (signaturesByLocation['Unknown'] || 0) + 1;
        }
      });

      // Group by day
      const signaturesByDay: { [date: string]: number } = {};
      signatures.forEach((signature) => {
        const date = signature.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
        signaturesByDay[date] = (signaturesByDay[date] || 0) + 1;
      });

      // Get recent signatures (last 10)
      const recentSignatures = signatures
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 10);

      return {
        success: true,
        data: {
          totalSignatures,
          signaturesByLocation,
          signaturesByDay,
          anonymousCount,
          recentSignatures,
        },
      };
    } catch (error) {
      console.error('Error getting petition signature stats:', error);
      return {
        success: false,
        error: 'Failed to get petition signature statistics',
      };
    }
  }
}

export default SignatureManagementService;
