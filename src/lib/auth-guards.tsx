'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { User } from '@/types/petition';

// Types for role checking
export type UserRole = 'user' | 'moderator' | 'admin';

// Hook to protect routes that require authentication
export const useAuthGuard = (redirectTo: string = '/auth/login') => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const currentPath = window.location.pathname;
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(
        currentPath
      )}`;
      router.push(redirectUrl);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading, isAuthenticated: !!user };
};

// Hook to protect routes that require specific roles
export const useRoleGuard = (
  requiredRoles: UserRole[],
  redirectTo: string = '/dashboard'
) => {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated, redirect to login
        const currentPath = window.location.pathname;
        const redirectUrl = `/auth/login?redirect=${encodeURIComponent(
          currentPath
        )}`;
        router.push(redirectUrl);
      } else if (
        userProfile &&
        !requiredRoles.includes(userProfile.role as UserRole)
      ) {
        // Authenticated but doesn't have required role
        router.push(redirectTo);
      }
    }
  }, [user, userProfile, loading, router, requiredRoles, redirectTo]);

  return {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    hasRequiredRole: userProfile
      ? requiredRoles.includes(userProfile.role as UserRole)
      : false,
  };
};

// Hook for admin-only routes
export const useAdminGuard = (redirectTo: string = '/dashboard') => {
  return useRoleGuard(['admin'], redirectTo);
};

// Hook for moderator and admin routes
export const useModeratorGuard = (redirectTo: string = '/dashboard') => {
  return useRoleGuard(['moderator', 'admin'], redirectTo);
};

// Utility functions for role checking
export const hasRole = (user: User | null, role: UserRole): boolean => {
  return user?.role === role;
};

export const hasAnyRole = (user: User | null, roles: UserRole[]): boolean => {
  return user ? roles.includes(user.role as UserRole) : false;
};

export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, 'admin');
};

export const isModerator = (user: User | null): boolean => {
  return hasRole(user, 'moderator');
};

export const isModeratorOrAdmin = (user: User | null): boolean => {
  return hasAnyRole(user, ['moderator', 'admin']);
};

// Component wrapper for role-based rendering
interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoles: UserRole[];
  fallback?: React.ReactNode;
  user?: User | null;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRoles,
  fallback = null,
  user,
}) => {
  const { userProfile } = useAuth();
  const currentUser = user || userProfile;

  if (!currentUser || !hasAnyRole(currentUser, requiredRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Component wrapper for admin-only content
interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  user?: User | null;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({
  children,
  fallback = null,
  user,
}) => {
  return (
    <RoleGuard requiredRoles={['admin']} fallback={fallback} user={user}>
      {children}
    </RoleGuard>
  );
};

// Component wrapper for moderator and admin content
interface ModeratorGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  user?: User | null;
}

export const ModeratorGuard: React.FC<ModeratorGuardProps> = ({
  children,
  fallback = null,
  user,
}) => {
  return (
    <RoleGuard
      requiredRoles={['moderator', 'admin']}
      fallback={fallback}
      user={user}
    >
      {children}
    </RoleGuard>
  );
};