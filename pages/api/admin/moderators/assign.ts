import { NextApiRequest, NextApiResponse } from 'next';
import { collection, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { requireAdminAuth } from '@/lib/firebase/middleware';

interface AssignModeratorRequest {
  userId: string;
  permissions: {
    approve: boolean;
    pause: boolean;
    delete: boolean;
    statsAccess: boolean;
  };
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, permissions }: AssignModeratorRequest = req.body;

    // Validate required fields
    if (!userId || !permissions) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already a moderator
    const existingModeratorQuery = await getDoc(doc(db, 'moderators', userId));
    if (existingModeratorQuery.exists()) {
      return res.status(400).json({ error: 'User is already a moderator' });
    }

    // Get admin user ID from the authenticated request
    const adminUserId = (req as any).user?.uid || 'system';

    // Create moderator record
    const moderatorData = {
      userId,
      permissions,
      assignedAt: new Date(),
      assignedBy: adminUserId,
      isActive: true,
    };

    await setDoc(doc(db, 'moderators', userId), moderatorData);

    // Update user role to moderator
    await updateDoc(doc(db, 'users', userId), {
      role: 'moderator',
      updatedAt: new Date(),
    });

    res.status(200).json({ 
      message: 'Moderator assigned successfully',
      moderator: {
        id: userId,
        ...moderatorData,
      }
    });
  } catch (error) {
    console.error('Error assigning moderator:', error);
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