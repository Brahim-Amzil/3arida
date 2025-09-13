import { NextApiRequest, NextApiResponse } from 'next';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { requireAdminAuth } from '@/lib/firebase/middleware';

interface UpdatePermissionsRequest {
  moderatorId: string;
  permissions: {
    approve: boolean;
    pause: boolean;
    delete: boolean;
    statsAccess: boolean;
  };
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { moderatorId, permissions }: UpdatePermissionsRequest = req.body;

    // Validate required fields
    if (!moderatorId || !permissions) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if moderator exists
    const moderatorDoc = await getDoc(doc(db, 'moderators', moderatorId));
    if (!moderatorDoc.exists()) {
      return res.status(404).json({ error: 'Moderator not found' });
    }

    // Update moderator permissions
    await updateDoc(doc(db, 'moderators', moderatorId), {
      permissions,
      updatedAt: new Date(),
    });

    res.status(200).json({ 
      message: 'Moderator permissions updated successfully',
      moderatorId,
      permissions
    });
  } catch (error) {
    console.error('Error updating moderator permissions:', error);
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