import { useAuth } from './AuthContext';
import { AuthService } from './auth';

// Compatibility hook to replace next-auth useSession
export const useSession = () => {
  try {
    const { user, userDocument, loading } = useAuth();

    return {
      data: user
        ? {
            user: {
              id: user.uid,
              name: userDocument?.name || user.displayName || 'Anonymous',
              email: user.email || '',
              image: user.photoURL || null,
              roles: userDocument?.role ? [{ role: userDocument.role }] : [],
            },
          }
        : null,
      status: loading ? 'loading' : user ? 'authenticated' : 'unauthenticated',
    };
  } catch (error) {
    // Fallback for static export or when AuthProvider is not available
    console.warn('useSession: AuthProvider not available, returning fallback');
    return {
      data: null,
      status: 'unauthenticated' as const,
    };
  }
};

// Compatibility function to replace next-auth signIn
export const signIn = async (provider?: string, options?: any) => {
  if (provider === 'google') {
    return await AuthService.signInWithGoogle();
  }

  if (provider === 'credentials' && options?.email && options?.password) {
    try {
      const user = await AuthService.signInWithEmail(options.email, options.password);
      return { ok: true, user };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }

  throw new Error(`Provider ${provider} not supported`);
};

// Compatibility function to replace next-auth signOut
export const signOut = async () => {
  return await AuthService.signOut();
};

// Compatibility function - Firebase doesn't use CSRF tokens
export const getCsrfToken = async () => {
  return null;
};

export default useSession;
