import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  linkWithPhoneNumber,
  ConfirmationResult,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { createVerificationToken, sendVerificationEmail } from '../email-verification';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// User interface for Firestore
export interface FirebaseUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  verifiedEmail: boolean;
  verifiedPhone: boolean;
  role: 'user' | 'moderator' | 'admin';
  creatorPageId?: string;
  createdAt: Date;
}

// Authentication service class
export class AuthService {
  // Sign in with Google
  static async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await this.createOrUpdateUserDocument(user);
      return user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  // Sign in with email and password
  static async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      await this.createOrUpdateUserDocument(user);
      return user;
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  }

  // Create account with email and password
  static async createAccountWithEmail(
    email: string,
    password: string,
    name: string
  ): Promise<User> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      await this.createOrUpdateUserDocument(user, name);
      
      // Send custom email verification
      const verificationToken = await createVerificationToken(user.uid, user.email!);
      await sendVerificationEmail(user.email!, verificationToken);
      
      return user;
    } catch (error) {
      console.error('Account creation error:', error);
      throw error;
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  }

  // Get current user
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Send password reset email
  static async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Create or update user document in Firestore
  static async createOrUpdateUserDocument(
    user: User,
    displayName?: string
  ): Promise<void> {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    const userData: any = {
      id: user.uid,
      name: displayName || user.displayName || 'Anonymous',
      email: user.email || '',
      verifiedEmail: false,
      verifiedPhone: !!user.phoneNumber,
    };

    if (user.phoneNumber && user.phoneNumber.trim() !== '') {
      userData.phone = user.phoneNumber;
    }

    if (!userDoc.exists()) {
      const newUserData: FirebaseUser = {
        ...userData,
        role: 'user',
        createdAt: new Date(),
      } as FirebaseUser;

      await setDoc(userRef, newUserData);
    } else {
      const updateData: any = {
        name: userData.name,
        email: userData.email,
        verifiedEmail: userData.verifiedEmail,
        verifiedPhone: userData.verifiedPhone,
        updatedAt: new Date(),
      };
      
      if (user.phoneNumber && user.phoneNumber.trim() !== '') {
        updateData.phone = user.phoneNumber;
      }

      await updateDoc(userRef, updateData);
    }
  }

  // Get user document from Firestore
  static async getUserDocument(userId: string): Promise<FirebaseUser | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        return userDoc.data() as FirebaseUser;
      }
      return null;
    } catch (error) {
      console.error('Error getting user document:', error);
      return null;
    }
  }

  // Update user role (admin function)
  static async updateUserRole(
    userId: string,
    role: 'user' | 'moderator' | 'admin'
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }
}

// Simple reCAPTCHA verifier creation
export const createRecaptchaVerifier = (containerId: string): RecaptchaVerifier => {
  if (typeof window === 'undefined') {
    // Return dummy verifier for SSR
    return {
      type: 'recaptcha',
      verify: () => Promise.resolve('dummy-token'),
      clear: () => {},
    } as unknown as RecaptchaVerifier;
  }

  // Clear any existing verifier
  const existingVerifier = (window as any).recaptchaVerifier;
  if (existingVerifier) {
    try {
      existingVerifier.clear();
    } catch (e) {
      console.warn('Error clearing existing reCAPTCHA:', e);
    }
  }

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: 'normal',
    callback: () => {
      console.log('reCAPTCHA solved');
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
    },
  });

  (window as any).recaptchaVerifier = verifier;
  return verifier;
};

// Simple phone verification function
export const verifyPhoneForSigning = async (
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> => {
  // Format phone number
  let formattedPhone = phoneNumber.trim().replace(/[^\d+]/g, '');
  
  if (!formattedPhone.startsWith('+')) {
    // Remove leading 0 and add Morocco country code
    formattedPhone = formattedPhone.replace(/^0/, '');
    formattedPhone = `+212${formattedPhone}`;
  }

  // Basic validation
  if (!/^\+[1-9]\d{1,14}$/.test(formattedPhone)) {
    throw new Error('Invalid phone number format. Use international format: +212612345678');
  }

  try {
    // Use signInWithPhoneNumber for verification - this creates a temporary session
    // The calling component will handle updating Firestore before the session ends
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
    return confirmationResult;
  } catch (error: any) {
    console.error('Phone verification error:', error);
    
    if (error.code === 'auth/invalid-app-credential') {
      throw new Error('Phone authentication setup required: 1) Go to Firebase Console → Authentication → Sign-in method 2) Enable "Phone" provider 3) Go to Firebase Console → Authentication → Settings → Authorized domains 4) Add "localhost" to the authorized domains list 5) Ensure reCAPTCHA is properly configured. Current error: ' + error.message);
    } else if (error.code === 'auth/captcha-check-failed') {
      throw new Error('reCAPTCHA verification failed. Please try again.');
    } else if (error.code === 'auth/invalid-phone-number') {
      throw new Error('Invalid phone number. Use format: +212612345678');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many requests. Please wait a few minutes.');
    } else if (error.code === 'auth/provider-already-linked') {
      throw new Error('Phone number already linked to another account.');
    }
    
    throw new Error(error.message || 'Phone verification failed');
  }
};

// Simple OTP verification function
export const verifyOTPForSigning = async (
  confirmationResult: ConfirmationResult,
  code: string
): Promise<{ phoneNumber: string; verified: boolean }> => {
  try {
    const result = await confirmationResult.confirm(code);
    const phoneNumber = result.user.phoneNumber;

    // Keep the temporary session active - the calling component will handle
    // updating Firestore and then sign out if needed

    return {
      phoneNumber: phoneNumber || '',
      verified: true
    };
  } catch (error: any) {
    console.error('OTP verification error:', error);
    throw new Error('Invalid OTP code');
  }
};

export default AuthService;
