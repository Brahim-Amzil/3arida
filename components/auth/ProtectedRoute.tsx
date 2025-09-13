import React from 'react';
import { useAuth } from '../../lib/firebase/AuthContext';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireEmailVerification?: boolean;
  requirePhoneVerification?: boolean;
  requiredRole?: 'user' | 'moderator' | 'admin';
  requiredPermission?: 'approve' | 'pause' | 'delete' | 'statsAccess';
  fallbackComponent?: React.ComponentType;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireEmailVerification = false,
  requirePhoneVerification = false,
  requiredRole,
  requiredPermission,
  fallbackComponent: FallbackComponent,
  redirectTo = '/auth/login',
}) => {
  const { user, userDocument, loading } = useAuth();
  const { hasPermission, isAdmin, isModerator } = useRoleAccess();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Check authentication requirement
    if (requireAuth && !user) {
      router.push(redirectTo);
      return;
    }

    // Check email verification requirement
    if (requireEmailVerification && !userDocument?.verifiedEmail) {
      router.push('/auth/verify-email');
      return;
    }

    // Check phone verification requirement
    if (requirePhoneVerification && !userDocument?.verifiedPhone) {
      router.push('/auth/verify-phone');
      return;
    }

    // Check role requirement
    if (requiredRole) {
      const roleHierarchy = { user: 0, moderator: 1, admin: 2 };
      const userRoleLevel = roleHierarchy[userDocument?.role || 'user'];
      const requiredRoleLevel = roleHierarchy[requiredRole];

      if (userRoleLevel < requiredRoleLevel) {
        router.push('/unauthorized');
        return;
      }
    }

    // Check specific permission requirement
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push('/unauthorized');
      return;
    }
  }, [
    loading,
    user,
    userDocument,
    requireAuth,
    requireEmailVerification,
    requirePhoneVerification,
    requiredRole,
    requiredPermission,
    hasPermission,
    router,
    redirectTo,
  ]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check all requirements
  const hasAccess = () => {
    if (requireAuth && !user) return false;
    if (requireEmailVerification && !userDocument?.verifiedEmail) return false;
    if (requirePhoneVerification && !userDocument?.verifiedPhone) return false;

    if (requiredRole) {
      const roleHierarchy = { user: 0, moderator: 1, admin: 2 };
      const userRoleLevel = roleHierarchy[userDocument?.role || 'user'];
      const requiredRoleLevel = roleHierarchy[requiredRole];
      if (userRoleLevel < requiredRoleLevel) return false;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) return false;

    return true;
  };

  if (!hasAccess()) {
    if (FallbackComponent) {
      return <FallbackComponent />;
    }
    return null;
  }

  return <>{children}</>;
};

// Convenience components for common use cases
export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <ProtectedRoute requireAuth={true}>{children}</ProtectedRoute>;

export const RequireEmailVerification: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <ProtectedRoute requireAuth={true} requireEmailVerification={true}>
    {children}
  </ProtectedRoute>
);

export const RequirePhoneVerification: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <ProtectedRoute requireAuth={true} requirePhoneVerification={true}>
    {children}
  </ProtectedRoute>
);

export const RequireModerator: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute requireAuth={true} requiredRole="moderator">
    {children}
  </ProtectedRoute>
);

export const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute requireAuth={true} requiredRole="admin">
    {children}
  </ProtectedRoute>
);

export const RequirePermission: React.FC<{
  children: React.ReactNode;
  permission: 'approve' | 'pause' | 'delete' | 'statsAccess';
}> = ({ children, permission }) => (
  <ProtectedRoute requireAuth={true} requiredPermission={permission}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
