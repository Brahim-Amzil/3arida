import { NextApiRequest, NextApiResponse } from 'next';
import { SignatureManagementService } from '../../../../lib/services/signatureService';
import {
  optionalAuth,
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
    // Apply optional auth to get user context if available
    await new Promise<void>((resolve, reject) => {
      optionalAuth(req, res, (error?: any) => {
        if (error) reject(error);
        else resolve();
      });
    });

    const user = (req as AuthenticatedRequest).user;
    const { includeAnonymous = 'true' } = req.query;

    // Get petition signatures
    const result = await SignatureManagementService.getPetitionSignatures(
      id,
      includeAnonymous === 'true',
      user?.id,
      user?.role || 'user'
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting petition signatures:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
