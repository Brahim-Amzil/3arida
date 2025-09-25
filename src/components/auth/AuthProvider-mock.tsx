'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/petition';
import { getCurrentUser } from '@/lib/auth-mock';

// Mock Firebase User type
interface MockFirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

interface AuthContextType {
  user: MockFirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: false,
  isAuthenticated: false,
  refreshAuth: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<MockFirebaseUser | null>(null);
  const [userProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  const refreshAuth = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };

  useEffect(() => {
    // Initialize auth state
    refreshAuth();
    setLoading(false);

    // Listen for storage changes (for logout in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mockAuth_currentUser') {
        refreshAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAuthenticated,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}