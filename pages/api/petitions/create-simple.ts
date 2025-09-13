import { NextApiRequest, NextApiResponse } from 'next';
import {
  verifyFirebaseToken,
  AuthenticatedRequest,
} from '../../../lib/firebase/middleware';
import { PetitionManagementService } from '../../../lib/services/petitionService';
import type { CreatePetitionData } from '../../../lib/services/petitionService';

// Simplified petition creation endpoint - only requires authentication, not email verification
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Simple petition creation request received');
    console.log(
      'Headers:',
      req.headers.authorization
        ? 'Authorization header present'
        : 'No authorization header'
    );

    // Apply only basic Firebase token verification (no email verification requirement)
    await new Promise<void>((resolve, reject) => {
      verifyFirebaseToken(req, res, (error?: any) => {
        if (error) {
          console.error('Token verification error:', error);
          reject(error);
        } else {
          console.log('Token verification passed');
          resolve();
        }
      });
    });

    const user = (req as AuthenticatedRequest).user;
    console.log('Authenticated user:', {
      id: user.id,
      email: user.email,
      verifiedEmail: user.verifiedEmail,
    });

    // Simple test data
    const petitionData: CreatePetitionData = {
      title: 'Simple Test Petition',
      description:
        'This is a simple test petition to debug the authentication and creation process. It should be at least 50 characters long to pass validation.',
      category: 'Environment',
      subcategory: 'Climate Change',
      targetSignatures: 1000,
      pricingTier: 'free',
      tags: ['test', 'debug'],
      isPublic: true,
    };

    console.log('Creating petition with data:', petitionData);

    // Create petition
    const result = await PetitionManagementService.createPetition(
      user.id,
      petitionData
    );

    console.log('Petition creation result:', result);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Simple petition created successfully',
        data: result.data,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        errors: result.errors,
      });
    }
  } catch (error) {
    console.error('Simple petition creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
