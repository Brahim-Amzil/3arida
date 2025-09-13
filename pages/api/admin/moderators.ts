import { NextApiRequest, NextApiResponse } from 'next';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { requireAdminAuth } from '@/lib/firebase/middleware';
import { User } from '../../../types/models';

interface ModeratorPermissions {
  approve: boolean;
  pause: boolean;
  delete: boolean;
  statsAccess: boolean;
}

interface Moderator {
  id: string;
  userId: string;
  user: User;
  permissions: ModeratorPermissions;
  assignedAt: Date;
  assignedBy: string;
  isActive: boolean;
}

interface ModeratorsResponse {
  moderators: Moderator[];
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all moderators from the moderators collection
    const moderatorsQuery = query(collection(db, 'moderators'));
    const moderatorsSnapshot = await getDocs(moderatorsQuery);
    
    const moderators: Moderator[] = [];
    
    for (const moderatorDoc of moderatorsSnapshot.docs) {
      const moderatorData = moderatorDoc.data();
      
      // Fetch user data for each moderator
      const userDoc = await getDoc(doc(db, 'users', moderatorData.userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        moderators.push({
          id: moderatorDoc.id,
          userId: moderatorData.userId,
          user: {
            id: userDoc.id,
            ...userData,
            createdAt: userData.createdAt?.toDate() || new Date(),
            updatedAt: userData.updatedAt?.toDate(),
            lastLoginAt: userData.lastLoginAt?.toDate(),
          } as User,
          permissions: moderatorData.permissions || {
            approve: false,
            pause: false,
            delete: false,
            statsAccess: false,
          },
          assignedAt: moderatorData.assignedAt?.toDate() || new Date(),
          assignedBy: moderatorData.assignedBy || '',
          isActive: moderatorData.isActive !== false, // Default to true if not specified
        });
      }
    }

    // Sort by assignment date (newest first)
    moderators.sort((a, b) => b.assignedAt.getTime() - a.assignedAt.getTime());

    const response: ModeratorsResponse = {
      moderators,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching moderators:', error);
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