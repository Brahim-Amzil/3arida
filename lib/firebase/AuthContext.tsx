import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { AuthService, FirebaseUser, verifyPhoneForSigning, verifyOTPForSigning } from './auth';
import { db } from './config';

interface AuthContextType {
  user: User | null;
  userDocument: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  createAccountWithEmail: (
    email: string,
    password: string,
    name: string
  ) => Promise<User>;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  verifyPhoneForSigning: (
    phoneNumber: string,
    recaptchaVerifier: any
  ) => Promise<any>;
  verifyOTPForSigning: (
    confirmationResult: any,
    code: string
  ) => Promise<{ phoneNumber: string; verified: boolean }>;
  refreshUserDocument: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // During static export, AuthProvider might not be available
    if (typeof window === 'undefined') {
      // Server-side rendering or static export
      return {
        user: null,
        userDocument: null,
        loading: false,
        signInWithGoogle: async () => { throw new Error('Auth not available during static export'); },
        signInWithEmail: async () => { throw new Error('Auth not available during static export'); },
        createAccountWithEmail: async () => { throw new Error('Auth not available during static export'); },
        signOut: async () => { throw new Error('Auth not available during static export'); },
        sendPasswordResetEmail: async () => { throw new Error('Auth not available during static export'); },
        verifyPhoneForSigning: async () => { throw new Error('Auth not available during static export'); },
        verifyOTPForSigning: async () => { throw new Error('Auth not available during static export'); },
        refreshUserDocument: async () => { throw new Error('Auth not available during static export'); },
      };
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDocument, setUserDocument] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let userDocUnsubscribe: (() => void) | null = null;

    const authUnsubscribe = AuthService.onAuthStateChanged(async (user) => {
      setUser(user);

      // Clean up previous user document listener
      if (userDocUnsubscribe) {
        userDocUnsubscribe();
        userDocUnsubscribe = null;
      }

      if (user) {
        // Set up real-time listener for user document
        const userDocRef = doc(db, 'users', user.uid);
        userDocUnsubscribe = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data() as FirebaseUser;
            console.log('AuthContext: Real-time update received for user document:', { verifiedEmail: userData.verifiedEmail, email: userData.email });
            setUserDocument(userData);
          } else {
            console.log('AuthContext: User document does not exist');
            setUserDocument(null);
          }
        }, (error) => {
          console.error('Error listening to user document:', error);
          // Fallback to one-time fetch if listener fails
          AuthService.getUserDocument(user.uid).then(setUserDocument);
        });
      } else {
        setUserDocument(null);
      }

      setLoading(false);
    });

    return () => {
      authUnsubscribe();
      if (userDocUnsubscribe) {
        userDocUnsubscribe();
      }
    };
  }, []);

  const signInWithGoogle = async (): Promise<User> => {
    setLoading(true);
    try {
      const user = await AuthService.signInWithGoogle();
      return user;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<User> => {
    setLoading(true);
    try {
      const user = await AuthService.signInWithEmail(email, password);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const createAccountWithEmail = async (
    email: string,
    password: string,
    name: string
  ): Promise<User> => {
    setLoading(true);
    try {
      const user = await AuthService.createAccountWithEmail(
        email,
        password,
        name
      );
      return user;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await AuthService.signOut();
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordResetEmail = async (email: string): Promise<void> => {
    await AuthService.sendPasswordResetEmail(email);
  };

  const verifyPhoneForSigningWrapper = async (
    phoneNumber: string,
    recaptchaVerifier: any
  ) => {
    return await verifyPhoneForSigning(
      phoneNumber,
      recaptchaVerifier
    );
  };

  const verifyOTPForSigningWrapper = async (confirmationResult: any, code: string) => {
    return await verifyOTPForSigning(confirmationResult, code);
  };

  const refreshUserDocument = async (): Promise<void> => {
    if (user) {
      console.log('AuthContext: Refreshing user document for user:', user.uid);
      let userDoc = await AuthService.getUserDocument(user.uid);
      
      // If no user document exists, create one (for existing users who registered the old way)
      if (!userDoc) {
        console.log('AuthContext: No user document found, creating one...');
        await AuthService.createOrUpdateUserDocument(user);
        userDoc = await AuthService.getUserDocument(user.uid);
      }
      
      console.log('AuthContext: Retrieved user document:', { verifiedEmail: userDoc?.verifiedEmail, email: userDoc?.email });
      setUserDocument(userDoc);
      console.log('AuthContext: User document state updated');
    } else {
      console.log('AuthContext: No user available for refresh');
    }
  };

  const value: AuthContextType = {
    user,
    userDocument,
    loading,
    signInWithGoogle,
    signInWithEmail,
    createAccountWithEmail,
    signOut,
    sendPasswordResetEmail,
    verifyPhoneForSigning: verifyPhoneForSigningWrapper,
    verifyOTPForSigning: verifyOTPForSigningWrapper,
    refreshUserDocument,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
