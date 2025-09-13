import { NextApiRequest, NextApiResponse } from 'next';
import {
  verifyFirebaseToken,
  requireRole,
  requireEmailVerification,
  requirePhoneVerification,
  AuthenticatedRequest,
} from '../middleware';

// Mock Firebase Admin
jest.mock('../admin', () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
  },
  adminDb: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
      })),
    })),
  },
}));

describe('Firebase Middleware', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('verifyFirebaseToken', () => {
    test('should return 401 when no token provided', async () => {
      await verifyFirebaseToken(
        req as NextApiRequest,
        res as NextApiResponse,
        next
      );

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 401 when token does not start with Bearer', async () => {
      req.headers = { authorization: 'InvalidToken' };

      await verifyFirebaseToken(
        req as NextApiRequest,
        res as NextApiResponse,
        next
      );

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requireRole', () => {
    test('should allow access for users with sufficient role', () => {
      const authenticatedReq = {
        ...req,
        user: {
          id: 'user123',
          role: 'admin',
          email: 'test@example.com',
          name: 'Test User',
          verifiedEmail: true,
          verifiedPhone: true,
          createdAt: new Date(),
        },
      } as AuthenticatedRequest;

      const middleware = requireRole('moderator');
      middleware(authenticatedReq, res as NextApiResponse, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should deny access for users with insufficient role', () => {
      const authenticatedReq = {
        ...req,
        user: {
          id: 'user123',
          role: 'user',
          email: 'test@example.com',
          name: 'Test User',
          verifiedEmail: true,
          verifiedPhone: true,
          createdAt: new Date(),
        },
      } as AuthenticatedRequest;

      const middleware = requireRole('admin');
      middleware(authenticatedReq, res as NextApiResponse, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Insufficient permissions',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requireEmailVerification', () => {
    test('should allow access for users with verified email', () => {
      const authenticatedReq = {
        ...req,
        user: {
          id: 'user123',
          role: 'user',
          email: 'test@example.com',
          name: 'Test User',
          verifiedEmail: true,
          verifiedPhone: false,
          createdAt: new Date(),
        },
      } as AuthenticatedRequest;

      requireEmailVerification(authenticatedReq, res as NextApiResponse, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should deny access for users without verified email', () => {
      const authenticatedReq = {
        ...req,
        user: {
          id: 'user123',
          role: 'user',
          email: 'test@example.com',
          name: 'Test User',
          verifiedEmail: false,
          verifiedPhone: true,
          createdAt: new Date(),
        },
      } as AuthenticatedRequest;

      requireEmailVerification(authenticatedReq, res as NextApiResponse, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email verification required',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requirePhoneVerification', () => {
    test('should allow access for users with verified phone', () => {
      const authenticatedReq = {
        ...req,
        user: {
          id: 'user123',
          role: 'user',
          email: 'test@example.com',
          name: 'Test User',
          verifiedEmail: true,
          verifiedPhone: true,
          createdAt: new Date(),
        },
      } as AuthenticatedRequest;

      requirePhoneVerification(authenticatedReq, res as NextApiResponse, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should deny access for users without verified phone', () => {
      const authenticatedReq = {
        ...req,
        user: {
          id: 'user123',
          role: 'user',
          email: 'test@example.com',
          name: 'Test User',
          verifiedEmail: true,
          verifiedPhone: false,
          createdAt: new Date(),
        },
      } as AuthenticatedRequest;

      requirePhoneVerification(authenticatedReq, res as NextApiResponse, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Phone verification required',
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
