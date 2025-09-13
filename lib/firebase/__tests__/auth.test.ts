import { AuthService, verifyPhoneForSigning, verifyOTPForSigning } from '../auth';

// Mock Firebase modules
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signOut: jest.fn(),
  sendEmailVerification: jest.fn(),
  onAuthStateChanged: jest.fn(),
  RecaptchaVerifier: jest.fn(),
  signInWithPhoneNumber: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('../config', () => ({
  auth: {
    currentUser: null,
  },
  db: {},
}));

describe('AuthService', () => {
  test('should have required methods', () => {
    expect(typeof AuthService.signInWithGoogle).toBe('function');
    expect(typeof AuthService.signInWithEmail).toBe('function');
    expect(typeof AuthService.createAccountWithEmail).toBe('function');
    expect(typeof AuthService.signOut).toBe('function');
    expect(typeof AuthService.getCurrentUser).toBe('function');
    expect(typeof AuthService.onAuthStateChanged).toBe('function');
    expect(typeof AuthService.sendPasswordResetEmail).toBe('function');
    expect(typeof verifyPhoneForSigning).toBe('function');
    expect(typeof verifyOTPForSigning).toBe('function');
  });

  test('getCurrentUser should return null when no user is logged in', () => {
    const result = AuthService.getCurrentUser();
    expect(result).toBeNull();
  });

  test('should have phone verification methods for petition signing', () => {
    expect(typeof verifyPhoneForSigning).toBe('function');
    expect(typeof verifyOTPForSigning).toBe('function');
  });

  test('should have user document management methods', () => {
    expect(typeof AuthService.getUserDocument).toBe('function');
    expect(typeof AuthService.updateUserRole).toBe('function');
  });
});
