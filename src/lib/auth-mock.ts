'use client';

// Mock authentication functions to replace Firebase auth

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Mock user credential type
export interface MockUserCredential {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    emailVerified: boolean;
  };
}

// Mock users storage (in real app, this would be a database)
const mockUsers = new Map<string, {
  uid: string;
  email: string;
  password: string;
  name: string;
  emailVerified: boolean;
}>();

// Current authenticated user
let currentUser: MockUserCredential['user'] | null = null;

// Mock authentication functions
export const registerWithEmail = async (userData: RegisterData): Promise<MockUserCredential> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check if user already exists
  const existingUser = Array.from(mockUsers.values()).find(user => user.email === userData.email);
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Create new user
  const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newUser = {
    uid,
    email: userData.email,
    password: userData.password,
    name: userData.name,
    emailVerified: false,
  };

  mockUsers.set(uid, newUser);

  const userCredential: MockUserCredential = {
    user: {
      uid,
      email: userData.email,
      displayName: userData.name,
      emailVerified: false,
    }
  };

  currentUser = userCredential.user;
  
  // Store in localStorage for persistence
  localStorage.setItem('mockAuth_currentUser', JSON.stringify(currentUser));

  return userCredential;
};

export const loginWithEmail = async (loginData: LoginData): Promise<MockUserCredential> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Find user by email
  const foundUser = Array.from(mockUsers.values()).find(user => 
    user.email === loginData.email && user.password === loginData.password
  );

  if (!foundUser) {
    throw new Error('Invalid email or password. Try these test accounts:\n• test@example.com / password123\n• admin@3arida.com / admin123\n• demo@3arida.com / demo123\n• user@3arida.com / 123456');
  }

  const userCredential: MockUserCredential = {
    user: {
      uid: foundUser.uid,
      email: foundUser.email,
      displayName: foundUser.name,
      emailVerified: foundUser.emailVerified,
    }
  };

  currentUser = userCredential.user;
  
  // Store in localStorage for persistence
  localStorage.setItem('mockAuth_currentUser', JSON.stringify(currentUser));

  return userCredential;
};

export const loginWithGoogle = async (): Promise<MockUserCredential> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock Google user data
  const googleUser = {
    uid: `google_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: 'user@gmail.com',
    name: 'Google User',
    emailVerified: true,
  };

  // Check if user exists, if not create them
  const existingUser = Array.from(mockUsers.values()).find(user => user.email === googleUser.email);

  if (!existingUser) {
    mockUsers.set(googleUser.uid, {
      uid: googleUser.uid,
      email: googleUser.email,
      password: '', // Google users don't have passwords
      name: googleUser.name,
      emailVerified: true,
    });
  }

  const userCredential: MockUserCredential = {
    user: {
      uid: existingUser?.uid || googleUser.uid,
      email: googleUser.email,
      displayName: googleUser.name,
      emailVerified: true,
    }
  };

  currentUser = userCredential.user;
  
  // Store in localStorage for persistence
  localStorage.setItem('mockAuth_currentUser', JSON.stringify(currentUser));

  return userCredential;
};

export const logout = async (): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  currentUser = null;
  localStorage.removeItem('mockAuth_currentUser');
};

export const resetPassword = async (email: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check if user exists
  const userExists = Array.from(mockUsers.values()).some(user => user.email === email);

  if (!userExists) {
    throw new Error('No user found with this email address');
  }

  // In a real app, this would send an email
  console.log(`Password reset email sent to ${email}`);
};

export const getCurrentUser = (): MockUserCredential['user'] | null => {
  if (currentUser) {
    return currentUser;
  }

  // Try to restore from localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('mockAuth_currentUser');
    if (stored) {
      try {
        currentUser = JSON.parse(stored);
        return currentUser;
      } catch (e) {
        localStorage.removeItem('mockAuth_currentUser');
      }
    }
  }

  return null;
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Initialize mock users with some test data
if (typeof window !== 'undefined') {
  // Add test users for development
  mockUsers.set('test_user_1', {
    uid: 'test_user_1',
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    emailVerified: true,
  });

  mockUsers.set('admin_user', {
    uid: 'admin_user',
    email: 'admin@3arida.com',
    password: 'admin123',
    name: 'Admin User',
    emailVerified: true,
  });

  mockUsers.set('demo_user', {
    uid: 'demo_user',
    email: 'demo@3arida.com',
    password: 'demo123',
    name: 'Demo User',
    emailVerified: true,
  });

  mockUsers.set('user_1', {
    uid: 'user_1',
    email: 'user@3arida.com',
    password: '123456',
    name: 'Regular User',
    emailVerified: true,
  });
}