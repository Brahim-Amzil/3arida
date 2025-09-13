import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/lib/firebase/admin';
import { requireAdminAuth } from '@/lib/firebase/middleware';
import { Petition } from '../../../types/models';

interface PetitionsResponse {
  petitions: Petition[];
  total: number;
  page: number;
  limit: number;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      page = '1',
      limit: limitParam = '10',
      status,
      search,
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limitParam as string, 10);
    const offset = (pageNum - 1) * limitNum;

    // Build query using Admin SDK
    let petitionsQuery = adminDb.collection('petitions').orderBy('createdAt', 'desc');

    // Add status filter if provided
    if (status && status !== 'all') {
      petitionsQuery = adminDb.collection('petitions')
        .where('status', '==', status)
        .orderBy('createdAt', 'desc');
    }

    // Get all petitions (we'll handle pagination and search in memory for simplicity)
    const petitionsSnapshot = await petitionsQuery.get();
    let allPetitions: Petition[] = [];

    petitionsSnapshot.docs.forEach((petitionDoc) => {
      const petitionData = petitionDoc.data();
      
      // Ensure mediaUrls is an array
      if (!petitionData.mediaUrls) {
        petitionData.mediaUrls = [];
      }
      
      allPetitions.push({
        id: petitionDoc.id,
        ...petitionData,
        createdAt: petitionData.createdAt?.toDate() || new Date(),
        updatedAt: petitionData.updatedAt?.toDate(),
        approvedAt: petitionData.approvedAt?.toDate(),
        pausedAt: petitionData.pausedAt?.toDate(),
        deletedAt: petitionData.deletedAt?.toDate(),
        expiresAt: petitionData.expiresAt?.toDate(),
      } as Petition);
    });

    // Apply search filter if provided
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      allPetitions = allPetitions.filter(
        (petition) =>
          petition.title.toLowerCase().includes(searchTerm) ||
          petition.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply pagination
    const total = allPetitions.length;
    const paginatedPetitions = allPetitions.slice(offset, offset + limitNum);

    const response: PetitionsResponse = {
      petitions: paginatedPetitions,
      total,
      page: pageNum,
      limit: limitNum,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching petitions:', error);
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