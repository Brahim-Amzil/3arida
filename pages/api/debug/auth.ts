import { NextApiRequest, NextApiResponse } from 'next';
import {
  verifyFirebaseToken,
  AuthenticatedRequest,
} from '../../../lib/firebase/middleware';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Apply Firebase token verification
    await new Promise<void>((resolve, reject) => {
      verifyFirebaseToken(req, res, (error?: any) => {
        if (error) reject(error);
        else resolve();
      });
    });

    const user = (req as AuthenticatedRequest).user;

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        verifiedEmail: user.verifiedEmail,
        verifiedPhone: user.verifiedPhone,
        role: user.role,
      },
      message: 'Authentication successful',
    });
  } catch (error) {
    console.error('Debug auth error:', error);
    res.status(401).json({
      success: false,
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
