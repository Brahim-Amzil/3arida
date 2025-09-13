import { NextApiRequest, NextApiResponse } from 'next';
import {
  requireModeratorPermission,
  AuthenticatedRequest,
} from '../../../lib/firebase/middleware';
import { PetitionManagementService } from '../../../lib/services/petitionService';

interface ModeratePetitionRequest extends AuthenticatedRequest {
  body: {
    petitionId: string;
    action: 'approve' | 'pause' | 'delete';
    reason?: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action } = req.body;

    // Validate action first
    if (!action || !['approve', 'pause', 'delete'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid action. Must be: approve, pause, or delete',
      });
    }

    // Apply appropriate permission middleware based on action
    const permissionMiddleware = requireModeratorPermission(action);

    await new Promise<void>((resolve, reject) => {
      permissionMiddleware(req as AuthenticatedRequest, res, (error?: any) => {
        if (error) reject(error);
        else resolve();
      });
    });

    const { petitionId, reason } = (req as ModeratePetitionRequest).body;
    const user = (req as AuthenticatedRequest).user;

    // Validate required fields
    if (!petitionId) {
      return res.status(400).json({
        success: false,
        error: 'Petition ID is required',
      });
    }

    // Map action to status
    let newStatus: 'approved' | 'paused' | 'deleted';
    switch (action) {
      case 'approve':
        newStatus = 'approved';
        break;
      case 'pause':
        newStatus = 'paused';
        break;
      case 'delete':
        newStatus = 'deleted';
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid action',
        });
    }

    // Update petition status
    const result = await PetitionManagementService.updatePetitionStatus(
      petitionId,
      newStatus,
      user.id,
      reason
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    // TODO: Send notification to petition creator
    // TODO: Create audit log entry

    res.status(200).json({
      ...result,
      message: `Petition ${action}d successfully`,
    });
  } catch (error) {
    console.error('Petition moderation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
