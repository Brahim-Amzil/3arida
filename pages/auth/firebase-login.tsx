import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthService } from '@/lib/firebase/auth';
import { Button } from 'react-daisyui';
import { InputWithLabel } from '@/components/shared';
import { AuthLayout } from '@/components/layouts';
import { useAuth } from '@/lib/firebase/AuthContext';
import toast from 'react-hot-toast';
import Head from 'next/head';
import Link from 'next/link';
import { ReactElement } from 'react';

export default function FirebaseLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !authLoading) {
      router.replace('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AuthService.signInWithEmail(email, password);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      await AuthService.signInWithGoogle();
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <div>Redirecting...</div>;
  }

  return (
    <>
      <Head>
        <title>Login - 3arida Petition Platform</title>
      </Head>

      <div className="rounded p-6 border">
        {/* Google Login Button */}
        <Button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full mb-4"
          color="primary"
          variant="outline"
        >
          Continue with Google
        </Button>

        <div className="divider">or</div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <InputWithLabel
            type="email"
            label="Email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <InputWithLabel
            type="password"
            label="Password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            className="w-full"
            color="primary"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link
            href="/auth/firebase-register"
            className="text-primary hover:underline"
          >
            Create a free account
          </Link>
        </p>
      </div>
    </>
  );
}

// Add this getLayout function to use AuthLayout instead of AccountLayout
FirebaseLoginPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout heading="Welcome Back" description="Sign in to your account">
      {page}
    </AuthLayout>
  );
};
