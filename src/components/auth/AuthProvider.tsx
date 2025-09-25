'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types/petition';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isAuthenticated: false,
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
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log(
        '🔐 Auth state changed:',
        firebaseUser ? 'User logged in' : 'User logged out'
      );

      setUser(firebaseUser);
      setLoading(false); // Set loading to false immediately

      if (firebaseUser) {
        // Try to fetch user profile, but don't block the UI
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserProfile({
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || '',
              email: userData.email || firebaseUser.email || '',
              phone: userData.phone,
              verifiedEmail: userData.verifiedEmail || false,
              verifiedPhone: userData.verifiedPhone || false,
              role: userData.role || 'user',
              creatorPageId: userData.creatorPageId,
              createdAt: userData.createdAt?.toDate?.() || new Date(),
              updatedAt: userData.updatedAt?.toDate?.(),
              lastLoginAt: userData.lastLoginAt?.toDate?.(),
              isActive: userData.isActive !== false,
            });
          } else {
            // Create a basic profile from Firebase user
            setUserProfile({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              verifiedEmail: firebaseUser.emailVerified,
              verifiedPhone: false,
              role: 'user',
              isActive: true,
              createdAt: new Date(),
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Create a basic profile even if Firestore fails
          setUserProfile({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            verifiedEmail: firebaseUser.emailVerified,
            verifiedPhone: false,
            role: 'user',
            isActive: true,
            createdAt: new Date(),
          });
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
