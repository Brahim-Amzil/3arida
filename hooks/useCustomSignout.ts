import { useRouter } from 'next/router';
import { useAuth } from '@/lib/firebase/AuthContext';

export function useCustomSignOut() {
  const router = useRouter();
  const { signOut: firebaseSignOut } = useAuth();

  const signOut = async () => {
    try {
      await firebaseSignOut();
      router.push('/auth/firebase-login');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return signOut;
}
