import { NextApiRequest, NextApiResponse } from 'next';
import { collection, query, where, orderBy, limit, startAfter, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { requireAdminAuth } from '@/lib/firebase/middleware';
import { User } from '../../../types/models';

interface UsersResponse {
  users: User[];
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
      role,
      search,
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limitParam as string, 10);
    const offset = (pageNum - 1) * limitNum;

    // Build query
    let q = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc')
    );

    // Add role filter if specified
    if (role && role !== 'all') {
      q = query(
        collection(db, 'users'),
        where('role', '==', role),
        orderBy('createdAt', 'desc')
      );
    }

    // Get total count for pagination
    const countQuery = role && role !== 'all' 
      ? query(collection(db, 'users'), where('role', '==', role))
      : query(collection(db, 'users'));
    
    const countSnapshot = await getCountFromServer(countQuery);
    const total = countSnapshot.data().count;

    // Apply pagination
    if (offset > 0) {
      // For pagination, we need to get the last document from the previous page
      // This is a simplified approach - in production, you'd want to use cursor-based pagination
      const prevQuery = query(
        collection(db, 'users'),
        ...(role && role !== 'all' ? [where('role', '==', role)] : []),
        orderBy('createdAt', 'desc'),
        limit(offset)
      );
      const prevSnapshot = await getDocs(prevQuery);
      if (prevSnapshot.docs.length > 0) {
        const lastDoc = prevSnapshot.docs[prevSnapshot.docs.length - 1];
        q = query(
          collection(db, 'users'),
          ...(role && role !== 'all' ? [where('role', '==', role)] : []),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(limitNum)
        );
      }
    } else {
      q = query(
        collection(db, 'users'),
        ...(role && role !== 'all' ? [where('role', '==', role)] : []),
        orderBy('createdAt', 'desc'),
        limit(limitNum)
      );
    }

    const snapshot = await getDocs(q);
    let users: User[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate(),
      lastLoginAt: doc.data().lastLoginAt?.toDate(),
    })) as User[];

    // Apply search filter (client-side for simplicity)
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      users = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    const response: UsersResponse = {
      users,
      total,
      page: pageNum,
      limit: limitNum,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching users:', error);
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