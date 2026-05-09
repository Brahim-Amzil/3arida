'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
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
  const profileUnsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    function detachProfileListener() {
      if (profileUnsubscribeRef.current) {
        profileUnsubscribeRef.current();
        profileUnsubscribeRef.current = null;
      }
    }

    function attachProfileListener(firebaseUser: FirebaseUser) {
      detachProfileListener();
      const userDocRef = doc(db, 'users', firebaseUser.uid);

      profileUnsubscribeRef.current = onSnapshot(
        userDocRef,
        async (userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('👤 User profile updated from Firestore', {
              hasBio: !!userData.bio,
              bio: userData.bio,
              isActive: userData.isActive,
            });

            if (userData.isActive === false) {
              console.warn('⚠️ User account is inactive, logging out...');
              await auth.signOut();
              if (typeof window !== 'undefined') {
                window.location.href = '/auth/login?error=account-inactive';
              }
              return;
            }

            setUserProfile({
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || '',
              email: userData.email || firebaseUser.email || '',
              phone: userData.phone,
              photoURL: userData.photoURL || firebaseUser.photoURL,
              bio: userData.bio,
              verifiedEmail:
                userData.verifiedEmail || firebaseUser.emailVerified || false,
              verifiedPhone: userData.verifiedPhone || false,
              role: userData.role || 'user',
              creatorPageId: userData.creatorPageId,
              fcmToken: userData.fcmToken,
              fcmTokenUpdatedAt: userData.fcmTokenUpdatedAt?.toDate?.(),
              createdAt: userData.createdAt?.toDate?.() || new Date(),
              updatedAt: userData.updatedAt?.toDate?.(),
              lastLoginAt: userData.lastLoginAt?.toDate?.(),
              isActive: userData.isActive !== false,
            } as User);
          } else {
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
        },
        (error) => {
          console.error('Error listening to user profile:', error);
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
      );
    }

    function onVisibilityChange() {
      if (typeof document === 'undefined') return;
      const u = auth.currentUser;
      if (!u) return;
      if (document.visibilityState === 'hidden') {
        detachProfileListener();
      } else {
        attachProfileListener(u);
      }
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log(
        '🔐 Auth state changed:',
        firebaseUser ? 'User logged in' : 'User logged out'
      );

      setUser(firebaseUser);
      setLoading(false);

      detachProfileListener();

      if (firebaseUser) {
        attachProfileListener(firebaseUser);
      } else {
        setUserProfile(null);
      }
    });

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisibilityChange);
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibilityChange);
      }
      unsubscribeAuth();
      detachProfileListener();
    };
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
