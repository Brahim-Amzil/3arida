import { NextApiRequest, NextApiResponse } from 'next';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { requireAdminAuth } from '@/lib/firebase/middleware';

interface ToggleStatusRequest {
  userId: string;
  isActive: boolean;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, isActive }: ToggleStatusRequest = req.body;

    if (!userId || typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Update user status in Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isActive,
      updatedAt: new Date(),
    });

    res.status(200).json({ 
      success: true, 
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully` 
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  // Apply admin authentication middleware
  await new Promise<void>((resolve, reject) => {
    requireAdminAuth(req, res, (error?: any) => {
      if (error) reject(error);
      else resolve();
    });
  });

  // Call the main handler
  return handler(req, res);
}