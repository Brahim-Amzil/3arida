import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import {
  canAccessAdmin,
  isModeratorRole as hasModeratorAccess,
} from '@/lib/role-authorization';

export type ApiAuthUser = {
  uid: string;
  email: string;
  name: string;
  role: string;
};

export async function authenticateApiRequest(
  request: NextRequest,
): Promise<{ user: ApiAuthUser } | { error: NextResponse }> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      error: NextResponse.json(
        { error: 'Missing or invalid authorization token' },
        { status: 401 },
      ),
    };
  }

  const idToken = authHeader.slice('Bearer '.length).trim();

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return {
        error: NextResponse.json({ error: 'User profile not found' }, { status: 403 }),
      };
    }

    const userData = userDoc.data() || {};

    return {
      user: {
        uid: decodedToken.uid,
        email: (decodedToken.email || userData.email || '').toString(),
        name: (userData.name || decodedToken.name || 'User').toString(),
        role: (userData.role || 'user').toString(),
      },
    };
  } catch (error) {
    console.error('API auth failed:', error);
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
}

export function isModeratorRole(role: string): boolean {
  return hasModeratorAccess(role);
}

export async function requireAdminApiRequest(
  request: NextRequest,
): Promise<{ user: ApiAuthUser } | { error: NextResponse }> {
  const authResult = await authenticateApiRequest(request);
  if ('error' in authResult) return authResult;

  if (!canAccessAdmin(authResult.user.role)) {
    return {
      error: NextResponse.json({ error: 'Admin access required' }, { status: 403 }),
    };
  }

  return authResult;
}

export function requireNonProductionRoute(): NextResponse | null {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return null;
}
