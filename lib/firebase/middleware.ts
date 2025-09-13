import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth, adminDb } from './admin';
import { FirebaseUser } from './auth';

export interface AuthenticatedRequest extends NextApiRequest {
  user: FirebaseUser;
}

// Middleware to verify Firebase ID token
export const verifyFirebaseToken = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  try {
    console.log('Verifying Firebase token...');
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No authorization header or invalid format');
      return res.status(401).json({ error: 'No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    console.log('Token extracted, length:', idToken.length);

    // Verify the ID token
    console.log('Verifying token with Firebase Admin...');
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log('Token verified successfully for user:', decodedToken.uid);

    // Fetch user document from Firestore to get role and other info
    const userDoc = await adminDb
      .collection('users')
      .doc(decodedToken.uid)
      .get();

    let userData: FirebaseUser;

    if (userDoc.exists) {
      userData = userDoc.data() as FirebaseUser;
    } else {
      // Create default user document if it doesn't exist
      userData = {
        id: decodedToken.uid,
        email: decodedToken.email || '',
        name: decodedToken.name || 'Anonymous',
        verifiedEmail: decodedToken.email_verified || false,
        verifiedPhone: !!decodedToken.phone_number,
        role: 'user',
        createdAt: new Date(),
      };

      // Only add phone if it exists (avoid undefined values)
      if (decodedToken.phone_number) {
        userData.phone = decodedToken.phone_number;
      }

      // Save the new user document
      await adminDb.collection('users').doc(decodedToken.uid).set(userData);
    }

    // Attach user info to request
    (req as AuthenticatedRequest).user = userData;

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to check if user has required role
export const requireRole = (requiredRole: 'user' | 'moderator' | 'admin') => {
  return (
    req: AuthenticatedRequest,
    res: NextApiResponse,
    next: () => void
  ) => {
    const userRole = req.user.role;

    // Role hierarchy: admin > moderator > user
    const roleHierarchy = { user: 0, moderator: 1, admin: 2 };

    if (roleHierarchy[userRole] < roleHierarchy[requiredRole]) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Middleware to check if email is verified
export const requireEmailVerification = (
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => void
) => {
  if (!req.user.verifiedEmail) {
    return res.status(403).json({ error: 'Email verification required' });
  }

  next();
};

// Middleware to check if phone is verified
export const requirePhoneVerification = (
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => void
) => {
  if (!req.user.verifiedPhone) {
    return res.status(403).json({ error: 'Phone verification required' });
  }

  next();
};

// Combine multiple middleware functions
export const combineMiddleware = (...middlewares: Function[]) => {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const runMiddleware = async (index: number) => {
      if (index >= middlewares.length) {
        return next();
      }

      await new Promise<void>((resolve, reject) => {
        const middleware = middlewares[index];
        const nextMiddleware = () => {
          runMiddleware(index + 1).then(resolve).catch(reject);
        };
        
        try {
          const result = middleware(req, res, nextMiddleware);
          // If middleware returns a promise, wait for it
          if (result && typeof result.then === 'function') {
            result.catch(reject);
          }
        } catch (error) {
          reject(error);
        }
      });
    };

    await runMiddleware(0);
  };
};

// Middleware for petition creation (requires email verification)
export const requirePetitionCreationAuth = combineMiddleware(
  verifyFirebaseToken,
  requireEmailVerification
);

// Middleware for petition signing (requires phone verification)
export const requirePetitionSigningAuth = combineMiddleware(
  verifyFirebaseToken,
  requirePhoneVerification
);

// Middleware for moderator actions
export const requireModeratorAuth = combineMiddleware(
  verifyFirebaseToken,
  requireRole('moderator')
);

// Middleware for admin actions
export const requireAdminAuth = combineMiddleware(
  verifyFirebaseToken,
  requireRole('admin')
);

// Check if user has specific moderator permissions
export const requireModeratorPermission = (
  permission: 'approve' | 'pause' | 'delete' | 'statsAccess'
) => {
  return async (
    req: AuthenticatedRequest,
    res: NextApiResponse,
    next: () => void
  ) => {
    try {
      // Check if user is admin (has all permissions)
      if (req.user.role === 'admin') {
        return next();
      }

      // Check if user is moderator with specific permission
      if (req.user.role === 'moderator') {
        const moderatorDoc = await adminDb
          .collection('moderators')
          .where('userId', '==', req.user.id)
          .limit(1)
          .get();

        if (!moderatorDoc.empty) {
          const moderatorData = moderatorDoc.docs[0].data();
          if (
            moderatorData.permissions &&
            moderatorData.permissions[permission]
          ) {
            return next();
          }
        }
      }

      return res
        .status(403)
        .json({ error: `Insufficient permissions: ${permission} required` });
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ error: 'Permission check failed' });
    }
  };
};

// Basic auth middleware
export const requireAuth = combineMiddleware(verifyFirebaseToken);

// Optional auth middleware (doesn't fail if no token)
export const optionalAuth = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided, continue without user
    return next();
  }

  // Token provided, verify it
  verifyFirebaseToken(req, res, next);
};

export default verifyFirebaseToken;
