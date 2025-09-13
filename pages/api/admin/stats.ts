import { NextApiRequest, NextApiResponse } from 'next';
import { requireAdminAuth, AuthenticatedRequest } from '../../../lib/firebase/middleware';
import { adminDb } from '../../../lib/firebase/admin';
import { collections } from '../../../lib/firebase/adminFirestore';

interface AdminStatsResponse {
  totalUsers: number;
  totalPetitions: number;
  totalSignatures: number;
  pendingPetitions: number;
  activeModerators: number;
  recentActivity: {
    newUsers: number;
    newPetitions: number;
    newSignatures: number;
  };
}

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<AdminStatsResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Apply admin authentication middleware
    await new Promise<void>((resolve, reject) => {
      requireAdminAuth(req, res, (error?: any) => {
        if (error) reject(error);
        else resolve();
      });
    });

    // Calculate date for recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get total users count
    const usersSnapshot = await adminDb.collection(collections.users).count().get();
    const totalUsers = usersSnapshot.data().count;

    // Get total petitions count
    const petitionsSnapshot = await adminDb.collection(collections.petitions).count().get();
    const totalPetitions = petitionsSnapshot.data().count;

    // Get total signatures count
    const signaturesSnapshot = await adminDb.collection(collections.signatures).count().get();
    const totalSignatures = signaturesSnapshot.data().count;

    // Get pending petitions count
    const pendingPetitionsSnapshot = await adminDb
      .collection(collections.petitions)
      .where('status', '==', 'pending')
      .count()
      .get();
    const pendingPetitions = pendingPetitionsSnapshot.data().count;

    // Get active moderators count
    const activeModeratorsSnapshot = await adminDb
      .collection(collections.moderators)
      .where('isActive', '==', true)
      .count()
      .get();
    const activeModerators = activeModeratorsSnapshot.data().count;

    // Get recent activity counts
    const recentUsersSnapshot = await adminDb
      .collection(collections.users)
      .where('createdAt', '>=', sevenDaysAgo)
      .count()
      .get();
    const newUsers = recentUsersSnapshot.data().count;

    const recentPetitionsSnapshot = await adminDb
      .collection(collections.petitions)
      .where('createdAt', '>=', sevenDaysAgo)
      .count()
      .get();
    const newPetitions = recentPetitionsSnapshot.data().count;

    const recentSignaturesSnapshot = await adminDb
      .collection(collections.signatures)
      .where('createdAt', '>=', sevenDaysAgo)
      .count()
      .get();
    const newSignatures = recentSignaturesSnapshot.data().count;

    const stats: AdminStatsResponse = {
      totalUsers,
      totalPetitions,
      totalSignatures,
      pendingPetitions,
      activeModerators,
      recentActivity: {
        newUsers,
        newPetitions,
        newSignatures,
      },
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin statistics' });
  }
}