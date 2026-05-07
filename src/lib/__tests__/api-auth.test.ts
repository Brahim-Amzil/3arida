/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import {
  authenticateApiRequest,
  requireAdminApiRequest,
  requireNonProductionRoute,
} from '../api-auth';

jest.mock('@/lib/firebase-admin', () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
  },
  adminDb: {
    collection: jest.fn(),
  },
}));

import { adminAuth, adminDb } from '@/lib/firebase-admin';

function requestWithAuth(token?: string) {
  return new NextRequest('http://localhost/api/test', {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
}

function mockUserDoc(exists: boolean, data?: Record<string, unknown>) {
  const get = jest.fn().mockResolvedValue({
    exists,
    data: () => data ?? {},
  });
  (adminDb.collection as jest.Mock).mockReturnValue({
    doc: () => ({ get }),
  });
}

describe('api-auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticateApiRequest', () => {
    it('returns 401 when Authorization header is missing', async () => {
      const result = await authenticateApiRequest(requestWithAuth());
      expect('error' in result).toBe(true);
      if ('error' in result) expect(result.error.status).toBe(401);
    });

    it('returns 401 when Authorization is not Bearer', async () => {
      const req = new NextRequest('http://localhost/api/test', {
        headers: { authorization: 'Basic abc' },
      });
      const result = await authenticateApiRequest(req);
      expect('error' in result).toBe(true);
      if ('error' in result) expect(result.error.status).toBe(401);
    });

    it('returns 401 when verifyIdToken rejects', async () => {
      const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (adminAuth.verifyIdToken as jest.Mock).mockRejectedValue(
        new Error('invalid token'),
      );
      const result = await authenticateApiRequest(requestWithAuth('bad'));
      errSpy.mockRestore();
      expect('error' in result).toBe(true);
      if ('error' in result) expect(result.error.status).toBe(401);
    });

    it('returns 403 when Firestore user document is missing', async () => {
      (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue({
        uid: 'uid1',
        email: 'a@example.com',
      });
      mockUserDoc(false);
      const result = await authenticateApiRequest(requestWithAuth('tok'));
      expect('error' in result).toBe(true);
      if ('error' in result) expect(result.error.status).toBe(403);
    });

    it('returns authenticated user with role from Firestore', async () => {
      (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue({
        uid: 'uid1',
        email: 'a@example.com',
        name: 'Token Name',
      });
      mockUserDoc(true, {
        email: 'a@example.com',
        name: 'Doc Name',
        role: 'moderator',
      });
      const result = await authenticateApiRequest(requestWithAuth('valid'));
      expect('user' in result).toBe(true);
      if ('user' in result) {
        expect(result.user.uid).toBe('uid1');
        expect(result.user.role).toBe('moderator');
        expect(result.user.name).toBe('Doc Name');
      }
    });

    it('defaults role to user when Firestore has no role field', async () => {
      (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue({
        uid: 'uid1',
        email: 'a@example.com',
      });
      mockUserDoc(true, { email: 'a@example.com' });
      const result = await authenticateApiRequest(requestWithAuth('valid'));
      expect('user' in result).toBe(true);
      if ('user' in result) expect(result.user.role).toBe('user');
    });
  });

  describe('requireAdminApiRequest', () => {
    function mockVerifiedUser(role: string) {
      (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue({
        uid: 'uid1',
        email: 'admin@example.com',
      });
      mockUserDoc(true, { role, email: 'admin@example.com', name: 'Admin' });
    }

    it('returns 403 for user role', async () => {
      mockVerifiedUser('user');
      const result = await requireAdminApiRequest(requestWithAuth('tok'));
      expect('error' in result).toBe(true);
      if ('error' in result) expect(result.error.status).toBe(403);
    });

    it('returns 403 for moderator role', async () => {
      mockVerifiedUser('moderator');
      const result = await requireAdminApiRequest(requestWithAuth('tok'));
      expect('error' in result).toBe(true);
      if ('error' in result) expect(result.error.status).toBe(403);
    });

    it('allows admin role', async () => {
      mockVerifiedUser('admin');
      const result = await requireAdminApiRequest(requestWithAuth('tok'));
      expect('user' in result).toBe(true);
      if ('user' in result) expect(result.user.role).toBe('admin');
    });

    it('allows master_admin role', async () => {
      mockVerifiedUser('master_admin');
      const result = await requireAdminApiRequest(requestWithAuth('tok'));
      expect('user' in result).toBe(true);
      if ('user' in result) expect(result.user.role).toBe('master_admin');
    });
  });

  describe('requireNonProductionRoute', () => {
    const previousNodeEnv = process.env.NODE_ENV;

    afterEach(() => {
      (process as unknown as { env: { NODE_ENV?: string } }).env.NODE_ENV =
        previousNodeEnv;
    });

    it('returns 404 JSON response in production', () => {
      (process as unknown as { env: { NODE_ENV?: string } }).env.NODE_ENV =
        'production';
      const res = requireNonProductionRoute();
      expect(res).not.toBeNull();
      expect(res!.status).toBe(404);
    });

    it('returns null when not production', () => {
      (process as unknown as { env: { NODE_ENV?: string } }).env.NODE_ENV =
        'test';
      expect(requireNonProductionRoute()).toBeNull();
    });
  });
});
