// Mock Firebase for Jest tests
export const initializeApp = jest.fn(() => ({
  name: 'mock-app',
}));

export const getApps = jest.fn(() => []);

export const getAuth = jest.fn(() => ({
  currentUser: null,
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

export const getFirestore = jest.fn(() => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

export const getStorage = jest.fn(() => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

// Mock Firebase Auth functions
export const signInWithEmailAndPassword = jest.fn();
export const createUserWithEmailAndPassword = jest.fn();
export const signOut = jest.fn();
export const onAuthStateChanged = jest.fn();

// Mock Firestore functions
export const collection = jest.fn();
export const doc = jest.fn();
export const getDoc = jest.fn();
export const setDoc = jest.fn();
export const updateDoc = jest.fn();
export const deleteDoc = jest.fn();
export const query = jest.fn();
export const where = jest.fn();
export const orderBy = jest.fn();
export const limit = jest.fn();
export const getDocs = jest.fn();
