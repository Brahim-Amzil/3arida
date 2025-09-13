import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth, adminDb } from '../../lib/firebase/admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Check user document
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    
    const result = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      phoneNumber: decodedToken.phone_number,
      userDocExists: userDoc.exists,
      userData: userDoc.exists ? userDoc.data() : null,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Test user error:', error);
    res.status(500).json({ error: 'Failed to test user' });
  }
}