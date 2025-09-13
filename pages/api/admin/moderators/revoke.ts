import { NextApiRequest, NextApiResponse } from 'next';
import { doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { requireAdminAuth } from '@/lib/firebase/middleware';

interface RevokeModeratorRequest {
  moderatorId: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { moderatorId }: RevokeModeratorRequest = req.body;

    // Validate required fields
    if (!moderatorId) {
      return res.status(400).json({ error: 'Missing moderatorId' });
    }

    // Check if moderator exists
    const moderatorDoc = await getDoc(doc(db, 'moderators', moderatorId));
    if (!moderatorDoc.exists()) {
      return res.status(404).json({ error: 'Moderator not found' });
    }

    const moderatorData = moderatorDoc.data();
    const userId = moderatorData.userId;

    // Remove moderator record
    await deleteDoc(doc(db, 'moderators', moderatorId));

    // Update user role back to user
    await updateDoc(doc(db, 'users', userId), {
      role: 'user',
      updatedAt: new Date(),
    });

    res.status(200).json({ 
      message: 'Moderator status revoked successfully',
      moderatorId,
      userId
    });
  } catch (error) {
    console.error('Error revoking moderator:', error);
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