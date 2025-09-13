import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth, adminDb } from '../../../lib/firebase/admin';
import { FirebaseUser } from '../../../lib/firebase/auth';
import { PetitionManagementService } from '../../../lib/services/petitionService';

interface AuthenticatedRequest extends NextApiRequest {
  user: FirebaseUser;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify Firebase token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Fetch user document from Firestore
    const userDoc = await adminDb
      .collection('users')
      .doc(decodedToken.uid)
      .get();

    let userData: FirebaseUser;
    if (userDoc.exists) {
      userData = userDoc.data() as FirebaseUser;
    } else {
      // Create default user document if it doesn't exist
      userData = {
        id: decodedToken.uid,
        email: decodedToken.email || '',
        name: decodedToken.name || 'Anonymous',
        verifiedEmail: decodedToken.email_verified || false,
        verifiedPhone: !!decodedToken.phone_number,
        role: 'user',
        createdAt: new Date(),
      };
      
      await adminDb
        .collection('users')
        .doc(decodedToken.uid)
        .set(userData);
    }

    // Fetch user petitions
    const result = await PetitionManagementService.getPetitionsByCreator(userData.id);
    
    if (result.success && result.data) {
      res.status(200).json({
        success: true,
        data: result.data.data,
        pagination: result.data.pagination,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error || 'Failed to fetch petitions',
      });
    }
  } catch (error) {
    console.error('Error in my-petitions API:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch petitions',
    });
  }
}