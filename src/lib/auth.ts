import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
  UserCredential,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, db } from './firebase';
import { User } from '../types/petition';

// Types for our auth functions
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Custom hook for authentication
export const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
  };
};

// Register new user with email and password
export const registerWithEmail = async (
  userData: RegisterData,
): Promise<UserCredential> => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password,
    );

    // Update Firebase Auth profile
    await updateProfile(userCredential.user, {
      displayName: userData.name,
    });

    // Create user profile in Firestore
    await createUserProfile(userCredential.user, {
      name: userData.name,
      email: userData.email,
    });

    // Send email verification (optional - won't block if it fails)
    try {
      await sendEmailVerification(userCredential.user);
      console.log('✅ Verification email sent');
    } catch (emailError) {
      console.warn('⚠️ Could not send verification email:', emailError);
      // Don't throw - allow registration to proceed
    }

    // Send welcome email (async, don't block registration)
    // Wrapped in setTimeout to ensure it runs after registration completes
    setTimeout(async () => {
      try {
        const { sendWelcomeEmail } = await import('./email-notifications');
        await sendWelcomeEmail(userData.name, userData.email);
        console.log('✅ Welcome email sent');
      } catch (emailError) {
        console.warn('⚠️ Could not send welcome email:', emailError);
      }
    }, 0);

    return userCredential;
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Login with email and password
export const loginWithEmail = async (
  loginData: LoginData,
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      loginData.email,
      loginData.password,
    );

    // Check if user is active
    const userRef = doc(db, 'users', userCredential.user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.isActive === false) {
        // Sign out immediately
        await signOut(auth);
        throw new Error(
          'Your account has been deactivated. Please contact support.',
        );
      }
    }

    // Update login tracking
    await updateUserLoginTracking(userCredential.user.uid);

    return userCredential;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Login with Google
export const loginWithGoogle = async (): Promise<UserCredential> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Ensure user profile exists in Firestore
    await ensureUserProfile(result.user);

    // Check if user is active
    const userRef = doc(db, 'users', result.user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.isActive === false) {
        // Sign out immediately
        await signOut(auth);
        throw new Error(
          'Your account has been deactivated. Please contact support.',
        );
      }
    }

    // Update login tracking
    await updateUserLoginTracking(result.user.uid);

    return result;
  } catch (error: any) {
    console.error('Google login error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Phone verification for petition signing
export const verifyPhoneForSigning = async (
  phoneNumber: string,
): Promise<ConfirmationResult> => {
  try {
    // Format phone number for Morocco (+212)
    const formattedPhone = formatMoroccanPhone(phoneNumber);

    // Create reCAPTCHA verifier
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'recaptcha-container',
      {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
      },
    );

    // Send OTP
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      formattedPhone,
      recaptchaVerifier,
    );
    return confirmationResult;
  } catch (error: any) {
    console.error('Phone verification error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Verify OTP for petition signing
export const verifyOTPForSigning = async (
  confirmationResult: ConfirmationResult,
  otp: string,
): Promise<UserCredential> => {
  try {
    const result = await confirmationResult.confirm(otp);

    // Update user's phone verification status
    if (result.user) {
      await updateDoc(doc(db, 'users', result.user.uid), {
        verifiedPhone: true,
        phone: result.user.phoneNumber,
        updatedAt: new Date(),
      });
    }

    return result;
  } catch (error: any) {
    console.error('OTP verification error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Logout user
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error('Failed to logout');
  }
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Send email verification
export const sendVerificationEmail = async (
  user?: FirebaseUser,
): Promise<void> => {
  try {
    const currentUser = user || auth.currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }
    await sendEmailVerification(currentUser);
  } catch (error: any) {
    console.error('Email verification error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Create user profile in Firestore
const createUserProfile = async (
  user: FirebaseUser,
  additionalData: {
    name: string;
    email: string;
  },
) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const { name, email } = additionalData;
      const createdAt = new Date();

      await setDoc(userRef, {
        // Basic fields
        id: user.uid,
        name,
        email,
        phone: user.phoneNumber || null,

        // Verification status
        verifiedEmail: false, // Requires email verification
        verifiedPhone: false, // Requires phone verification for signing

        // Role and permissions
        role: 'user', // Default role

        // Creator page
        creatorPageId: null,

        // Activity tracking
        lastLoginAt: createdAt,

        // Timestamps
        createdAt,
        updatedAt: createdAt,

        // Status
        isActive: true,
      });
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile');
  }
};

// Ensure user profile exists (for social logins)
const ensureUserProfile = async (user: FirebaseUser): Promise<void> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const createdAt = new Date();

      await setDoc(userRef, {
        // Basic fields
        id: user.uid,
        name: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || null,
        photoURL: user.photoURL || null,

        // Verification status
        verifiedEmail: user.emailVerified,
        verifiedPhone: false,

        // Role and permissions
        role: 'user',

        // Creator page
        creatorPageId: null,

        // Activity tracking
        lastLoginAt: createdAt,

        // Timestamps
        createdAt,
        updatedAt: createdAt,

        // Status
        isActive: true,
      });
    }
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    // Don't throw - allow login to proceed
  }
};

// Update user login tracking
const updateUserLoginTracking = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating login tracking:', error);
    // Don't throw error for tracking - it's not critical
  }
};

// Format Moroccan phone number
const formatMoroccanPhone = (phone: string): string => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // Handle different formats
  if (digits.startsWith('212')) {
    return `+${digits}`;
  } else if (digits.startsWith('0')) {
    return `+212${digits.substring(1)}`;
  } else if (digits.length === 9) {
    return `+212${digits}`;
  }

  return `+212${digits}`;
};

// Convert Firebase auth error codes to user-friendly messages
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled.';
    case 'auth/invalid-phone-number':
      return 'Please enter a valid Moroccan phone number.';
    case 'auth/invalid-verification-code':
      return 'Invalid verification code. Please try again.';
    case 'auth/code-expired':
      return 'Verification code has expired. Please request a new one.';
    case 'auth/account-inactive':
      return 'Your account has been deactivated. Please contact support.';
    default:
      return 'An error occurred. Please try again.';
  }
};

// Get current user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!auth.currentUser;
};
