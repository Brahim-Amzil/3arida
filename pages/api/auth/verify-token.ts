import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from '@/lib/firebase/admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    return res.status(200).json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        emailVerified: decodedToken.email_verified,
        phoneNumber: decodedToken.phone_number,
      },
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
