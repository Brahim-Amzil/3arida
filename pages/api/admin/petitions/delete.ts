import { NextApiRequest, NextApiResponse } from 'next';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { requireAdminAuth } from '@/lib/firebase/middleware';

interface DeletePetitionRequest {
  petitionId: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { petitionId }: DeletePetitionRequest = req.body;

    // Validate required fields
    if (!petitionId) {
      return res.status(400).json({ error: 'Missing petitionId' });
    }

    // Check if petition exists
    const petitionDoc = await getDoc(doc(db, 'petitions', petitionId));
    if (!petitionDoc.exists()) {
      return res.status(404).json({ error: 'Petition not found' });
    }

    // Get admin user ID from the authenticated request
    const adminUserId = (req as any).user?.uid || 'system';
    const currentTime = new Date();

    // Soft delete by updating status and adding deletion metadata
    const updateData = {
      status: 'deleted' as const,
      deletedAt: currentTime,
      deletedBy: adminUserId,
      deleteReason: 'Deleted by admin',
      updatedAt: currentTime,
    };

    await updateDoc(doc(db, 'petitions', petitionId), updateData);

    res.status(200).json({ 
      message: 'Petition deleted successfully',
      petitionId,
      deletedAt: currentTime
    });
  } catch (error) {
    console.error('Error deleting petition:', error);
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