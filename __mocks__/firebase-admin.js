// Mock Firebase Admin for Jest tests
export const initializeApp = jest.fn(() => ({
  name: 'mock-admin-app',
}));

export const getApps = jest.fn(() => []);

export const getAuth = jest.fn(() => ({
  verifyIdToken: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  getUserByEmail: jest.fn(),
}));

export const getFirestore = jest.fn(() => ({
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
    add: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    get: jest.fn(),
  })),
}));

export const credential = {
  cert: jest.fn(() => ({ type: 'mock-cert' })),
  applicationDefault: jest.fn(() => ({ type: 'mock-default' })),
};

export const cert = jest.fn(() => ({ type: 'mock-cert' }));

// Default export
const admin = {
  initializeApp,
  getApps,
  auth: getAuth,
  firestore: getFirestore,
  credential,
  cert,
};

export default admin;
