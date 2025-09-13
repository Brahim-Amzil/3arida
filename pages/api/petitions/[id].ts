import { NextApiRequest, NextApiResponse } from 'next';
import { PetitionManagementService } from '../../../lib/services/petitionService';
import { SignatureManagementService } from '../../../lib/services/signatureService';
import {
  requireAuth,
  AuthenticatedRequest,
  optionalAuth,
} from '../../../lib/firebase/middleware';
import { petitionUpdateSchema } from '../../../lib/validation/schemas';
import type { UpdatePetitionData } from '../../../lib/services/petitionService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid petition ID',
    });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res, id);
      case 'PUT':
        return await handleUpdate(req, res, id);
      case 'DELETE':
        return await handleDelete(req, res, id);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Petition API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse,
  petitionId: string
) {
  // Apply optional auth to get user context if available
  await new Promise<void>((resolve, reject) => {
    optionalAuth(req, res, (error?: any) => {
      if (error) reject(error);
      else resolve();
    });
  });

  const user = (req as AuthenticatedRequest).user;
  const { includeSignatures = 'false', includeStats = 'false' } = req.query;

  // Get petition
  const petitionResult = await PetitionManagementService.getPetitionById(
    petitionId,
    user?.id
  );

  if (!petitionResult.success) {
    return res.status(404).json(petitionResult);
  }

  const response: any = {
    success: true,
    data: {
      petition: petitionResult.data,
    },
  };

  // Include signatures if requested
  if (includeSignatures === 'true') {
    const signaturesResult =
      await SignatureManagementService.getPetitionSignatures(
        petitionId,
        true, // Include anonymous
        user?.id,
        user?.role || 'user'
      );

    if (signaturesResult.success) {
      response.data.signatures = signaturesResult.data;
    }
  }

  // Include statistics if requested
  if (includeStats === 'true') {
    const statsResult =
      await SignatureManagementService.getPetitionSignatureStats(
        petitionId,
        user?.id,
        user?.role || 'user'
      );

    if (statsResult.success) {
      response.data.statistics = statsResult.data;
    }
  }

  res.status(200).json(response);
}

async function handleUpdate(
  req: NextApiRequest,
  res: NextApiResponse,
  petitionId: string
) {
  // Require authentication for updates
  await new Promise<void>((resolve, reject) => {
    requireAuth(req, res, (error?: any) => {
      if (error) reject(error);
      else resolve();
    });
  });

  const user = (req as AuthenticatedRequest).user;
  const updateData = req.body as UpdatePetitionData;

  // Validate update data
  const validationResult = petitionUpdateSchema.safeParse(updateData);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      error: 'Invalid update data',
      errors: validationResult.error.errors,
    });
  }

  // Update petition
  const result = await PetitionManagementService.updatePetition(
    petitionId,
    user.id,
    updateData,
    user.role
  );

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(200).json(result);
}

async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse,
  petitionId: string
) {
  // Require authentication for deletion
  await new Promise<void>((resolve, reject) => {
    requireAuth(req, res, (error?: any) => {
      if (error) reject(error);
      else resolve();
    });
  });

  const user = (req as AuthenticatedRequest).user;
  const { reason } = req.body;

  // Delete petition
  const result = await PetitionManagementService.deletePetition(
    petitionId,
    user.id,
    user.role,
    reason
  );

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(200).json(result);
}
