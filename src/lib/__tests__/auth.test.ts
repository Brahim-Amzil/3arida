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
  updateProfile,
  signOut,
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
const mockUpdateProfile = updateProfile as jest.MockedFunction<
  typeof updateProfile
>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
const mockSetDoc = setDoc as jest.MockedFunction<typeof setDoc>;
const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>;
const mockUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>;
const mockDoc = doc as jest.MockedFunction<typeof doc>;

function authError(code: string) {
  const err = new Error(code) as Error & { code: string };
  err.code = code;
  return err;
}

function snapshotMissing() {
  return {
    exists: () => false,
    data: () => ({}),
  };
}

function snapshotActiveUser() {
  return {
    exists: () => true,
    data: () => ({ isActive: true }),
  };
}

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    }) as jest.Mock;
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
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      const mockUserCredential = {
        user: mockUser,
      };

      mockCreateUserWithEmailAndPassword.mockResolvedValue(
        mockUserCredential as any
      );
      mockUpdateProfile.mockResolvedValue(undefined);
      mockSignOut.mockResolvedValue(undefined);
      mockDoc.mockReturnValue({} as any);
      mockGetDoc.mockResolvedValue(snapshotMissing() as any);
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
      expect(global.fetch).toHaveBeenCalled();
      expect(mockSignOut).toHaveBeenCalled();
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
        authError('auth/weak-password'),
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
        emailVerified: true,
        reload: jest.fn().mockResolvedValue(undefined),
      };

      const mockUserCredential = {
        user: mockUser,
      };

      mockSignInWithEmailAndPassword.mockResolvedValue(
        mockUserCredential as any
      );
      mockDoc.mockReturnValue({} as any);
      mockGetDoc.mockResolvedValue(snapshotActiveUser() as any);
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

    it('should block login when email is not verified', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'SecurePass123',
      };

      const mockUser = {
        uid: 'user123',
        email: loginData.email,
        emailVerified: false,
        reload: jest.fn().mockResolvedValue(undefined),
      };

      mockSignInWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      } as any);

      await expect(loginWithEmail(loginData)).rejects.toThrow(
        'يجب تأكيد بريدك الإلكتروني',
      );
    });

    it('should handle login errors', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      mockSignInWithEmailAndPassword.mockRejectedValue(
        authError('auth/wrong-password'),
      );

      await expect(loginWithEmail(loginData)).rejects.toThrow(
        'Incorrect password. Please try again.'
      );
    });
  });

  describe('resetPassword', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('should request password reset via API', async () => {
      const email = 'john@example.com';

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      }) as jest.Mock;

      await resetPassword(email);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/request-password-reset',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email }),
        }),
      );
    });

    it('should handle reset password API errors', async () => {
      const email = 'nonexistent@example.com';

      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'تعذر إرسال رسالة إعادة التعيين. حاول لاحقاً.' }),
      }) as jest.Mock;

      await expect(resetPassword(email)).rejects.toThrow(
        'تعذر إرسال رسالة إعادة التعيين. حاول لاحقاً.',
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
