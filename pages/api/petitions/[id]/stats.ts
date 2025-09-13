import { NextApiRequest, NextApiResponse } from 'next';
import { SignatureManagementService } from '../../../../lib/services/signatureService';
import {
  requireAuth,
  AuthenticatedRequest,
} from '../../../../lib/firebase/middleware';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid petition ID',
    });
  }

  try {
    // Require authentication for detailed statistics
    await new Promise<void>((resolve, reject) => {
      requireAuth(req, res, (error?: any) => {
        if (error) reject(error);
        else resolve();
      });
    });

    const user = (req as AuthenticatedRequest).user;

    // Get petition signature statistics
    const result = await SignatureManagementService.getPetitionSignatureStats(
      id,
      user.id,
      user.role
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting petition statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
