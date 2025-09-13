import { NextApiRequest, NextApiResponse } from 'next';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { requireAdminAuth } from '@/lib/firebase/middleware';

interface UpdateStatusRequest {
  petitionId: string;
  status: 'draft' | 'pending' | 'approved' | 'paused' | 'deleted';
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { petitionId, status }: UpdateStatusRequest = req.body;

    // Validate required fields
    if (!petitionId || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate status value
    const validStatuses = ['draft', 'pending', 'approved', 'paused', 'deleted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    // Check if petition exists
    const petitionDoc = await getDoc(doc(db, 'petitions', petitionId));
    if (!petitionDoc.exists()) {
      return res.status(404).json({ error: 'Petition not found' });
    }

    // Get admin user ID from the authenticated request
    const adminUserId = (req as any).user?.uid || 'system';
    const currentTime = new Date();

    // Prepare update data based on status
    const updateData: any = {
      status,
      updatedAt: currentTime,
    };

    // Add status-specific fields
    switch (status) {
      case 'approved':
        updateData.approvedAt = currentTime;
        updateData.approvedBy = adminUserId;
        // Clear pause/delete fields if they exist
        updateData.pausedAt = null;
        updateData.pausedBy = null;
        updateData.pauseReason = null;
        updateData.deletedAt = null;
        updateData.deletedBy = null;
        updateData.deleteReason = null;
        break;
      case 'paused':
        updateData.pausedAt = currentTime;
        updateData.pausedBy = adminUserId;
        updateData.pauseReason = 'Paused by admin';
        break;
      case 'deleted':
        updateData.deletedAt = currentTime;
        updateData.deletedBy = adminUserId;
        updateData.deleteReason = 'Deleted by admin';
        break;
    }

    // Update petition status
    await updateDoc(doc(db, 'petitions', petitionId), updateData);

    res.status(200).json({ 
      message: 'Petition status updated successfully',
      petitionId,
      status,
      updatedAt: currentTime
    });
  } catch (error) {
    console.error('Error updating petition status:', error);
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