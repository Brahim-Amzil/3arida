import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/lib/firebase/admin';

// Email verification token interface
interface VerificationToken {
  userId: string;
  email: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  isUsed: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: { message: 'Method not allowed' } 
    });
  }

  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: { message: 'Verification token is required' }
      });
    }

    // Get token document from Firestore using admin SDK
    const tokenDoc = await adminDb.collection('emailVerificationTokens').doc(token).get();
    
    if (!tokenDoc.exists) {
      return res.status(400).json({
        error: { message: 'Invalid verification token' }
      });
    }

    const tokenData = tokenDoc.data() as VerificationToken;

    // Check if token is already used
    if (tokenData.isUsed) {
      return res.status(400).json({
        error: { message: 'Verification token has already been used' }
      });
    }

    // Check if token is expired
    const expiresAt = tokenData.expiresAt instanceof Date 
      ? tokenData.expiresAt 
      : (tokenData.expiresAt && typeof (tokenData.expiresAt as any).toDate === 'function') 
        ? (tokenData.expiresAt as any).toDate() 
        : new Date(tokenData.expiresAt as any);
    if (new Date() > expiresAt) {
      return res.status(400).json({
        error: { message: 'Verification token has expired' }
      });
    }

    // Mark token as used
    await adminDb.collection('emailVerificationTokens').doc(token).update({
      isUsed: true
    });

    // Update user document to mark email as verified
    // First check if user document exists, if not create it
    const userDocRef = adminDb.collection('users').doc(tokenData.userId);
    const userDoc = await userDocRef.get();
    
    if (!userDoc.exists) {
      // Create user document if it doesn't exist
      await userDocRef.set({
        email: tokenData.email,
        emailVerified: true,
        verifiedEmail: true,
        verifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      // Update existing user document
      await userDocRef.update({
        emailVerified: true,
        verifiedEmail: true, // Also set this field for consistency
        emailVerifiedAt: new Date(),
        verifiedAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Delete the used token
    await adminDb.collection('emailVerificationTokens').doc(token).delete();

    console.log('Email verified successfully for user:', tokenData.userId);
    
    return res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
      userId: tokenData.userId
    });
  } catch (error) {
    console.error('Error verifying email token:', error);
    return res.status(500).json({
      error: { message: 'Failed to verify email' }
    });
  }
}