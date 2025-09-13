import { NextApiRequest, NextApiResponse } from 'next';
import {
  requirePetitionSigningAuth,
  AuthenticatedRequest,
} from '../../../lib/firebase/middleware';
import { SignatureManagementService } from '../../../lib/services/signatureService';
import type { CreateSignatureData } from '../../../lib/services/signatureService';

interface SignPetitionRequest extends AuthenticatedRequest {
  body: {
    petitionId: string;
    signerName: string;
    signerLocation?: {
      country: string;
      city?: string;
      region?: string;
    };
    isAnonymous?: boolean;
    comment?: string;
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
    // Apply petition signing middleware (requires auth + phone verification)
    await new Promise<void>((resolve, reject) => {
      requirePetitionSigningAuth(req, res, (error?: any) => {
        if (error) reject(error);
        else resolve();
      });
    });

    const { petitionId, signerName, signerLocation, isAnonymous, comment } = (
      req as SignPetitionRequest
    ).body;
    const user = (req as AuthenticatedRequest).user;

    // Validate required fields
    if (!petitionId || !signerName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: petitionId, signerName',
      });
    }

    // Get client IP address
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.connection.remoteAddress ||
      '127.0.0.1';

    // Get user agent
    const userAgent = req.headers['user-agent'];

    // Prepare signature data
    const signatureData: CreateSignatureData = {
      petitionId,
      signerName,
      signerPhone: user.phone!, // Phone is verified by middleware
      signerLocation,
      ipAddress,
      userAgent,
      isAnonymous,
      comment,
    };

    // Sign petition
    const result = await SignatureManagementService.signPetition(
      signatureData,
      user.verifiedPhone // Phone verification status from middleware
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Petition signing error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
