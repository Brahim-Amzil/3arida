import {
  registerWithEmail,
  loginWithEmail,
  resetPassword,
  getCurrentUser,
  isAuthenticated,
} from '../auth';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Mock Firebase modules
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('../firebase');

const mockCreateUserWithEmailAndPassword =
  createUserWithEmailAndPassword as jest.MockedFunction<
    typeof createUserWithEmailAndPassword
  >;
const mockSignInWithEmailAndPassword =
  signInWithEmailAndPassword as jest.MockedFunction<
    typeof signInWithEmailAndPassword
  >;
const mockSendPasswordResetEmail =
  sendPasswordResetEmail as jest.MockedFunction<typeof sendPasswordResetEmail>;
const mockUpdateProfile = updateProfile as jest.MockedFunction<
  typeof updateProfile
>;
const mockSendEmailVerification = sendEmailVerification as jest.MockedFunction<
  typeof sendEmailVerification
>;
const mockSetDoc = setDoc as jest.MockedFunction<typeof setDoc>;
const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>;
const mockDoc = doc as jest.MockedFunction<typeof doc>;

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerWithEmail', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
      };

      const mockUser = {
        uid: 'user123',
        email: userData.email,
        displayName: null,
      };

      const mockUserCredential = {
        user: mockUser,
      };

      mockCreateUserWithEmailAndPassword.mockResolvedValue(
        mockUserCredential as any
      );
      mockUpdateProfile.mockResolvedValue(undefined);
      mockSendEmailVerification.mockResolvedValue(undefined);
      mockDoc.mockReturnValue({} as any);
      mockSetDoc.mockResolvedValue(undefined);

      const result = await registerWithEmail(userData);

      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        userData.email,
        userData.password
      );
      expect(mockUpdateProfile).toHaveBeenCalledWith(mockUser, {
        displayName: userData.name,
      });
      expect(mockSendEmailVerification).toHaveBeenCalledWith(mockUser);
      expect(mockSetDoc).toHaveBeenCalled();
      expect(result).toBe(mockUserCredential);
    });

    it('should handle registration errors', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'weak',
      };

      mockCreateUserWithEmailAndPassword.mockRejectedValue(
        new Error('auth/weak-password')
      );

      await expect(registerWithEmail(userData)).rejects.toThrow(
        'Password should be at least 6 characters long.'
      );
    });
  });

  describe('loginWithEmail', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'SecurePass123',
      };

      const mockUser = {
        uid: 'user123',
        email: loginData.email,
      };

      const mockUserCredential = {
        user: mockUser,
      };

      mockSignInWithEmailAndPassword.mockResolvedValue(
        mockUserCredential as any
      );
      mockDoc.mockReturnValue({} as any);
      mockUpdateDoc.mockResolvedValue(undefined);

      const result = await loginWithEmail(loginData);

      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        loginData.email,
        loginData.password
      );
      expect(mockUpdateDoc).toHaveBeenCalled();
      expect(result).toBe(mockUserCredential);
    });

    it('should handle login errors', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      mockSignInWithEmailAndPassword.mockRejectedValue(
        new Error('auth/wrong-password')
      );

      await expect(loginWithEmail(loginData)).rejects.toThrow(
        'Incorrect password. Please try again.'
      );
    });
  });

  describe('resetPassword', () => {
    it('should send password reset email', async () => {
      const email = 'john@example.com';

      mockSendPasswordResetEmail.mockResolvedValue(undefined);

      await resetPassword(email);

      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(auth, email);
    });

    it('should handle reset password errors', async () => {
      const email = 'nonexistent@example.com';

      mockSendPasswordResetEmail.mockRejectedValue(
        new Error('auth/user-not-found')
      );

      await expect(resetPassword(email)).rejects.toThrow(
        'No account found with this email address.'
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', () => {
      const mockUser = { uid: 'user123', email: 'john@example.com' };
      (auth as any).currentUser = mockUser;

      const result = getCurrentUser();

      expect(result).toBe(mockUser);
    });

    it('should return null when no user', () => {
      (auth as any).currentUser = null;

      const result = getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      (auth as any).currentUser = { uid: 'user123' };

      const result = isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      (auth as any).currentUser = null;

      const result = isAuthenticated();

      expect(result).toBe(false);
    });
  });
});
