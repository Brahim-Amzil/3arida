import { auth } from './firebase/config';

const fetcher = async (url: string, options?: RequestInit) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  // Add Firebase auth token if user is signed in
  if (auth.currentUser) {
    try {
      const idToken = await auth.currentUser.getIdToken();
      headers.Authorization = `Bearer ${idToken}`;
    } catch (error) {
      console.warn('Failed to get Firebase ID token:', error);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  const json = await response.json();

  if (!response.ok) {
    throw new Error(
      json.error?.message || json.message || 'An error occurred while fetching the data'
    );
  }

  return json;
};

export default fetcher;
