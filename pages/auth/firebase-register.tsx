import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { AuthService } from '@/lib/firebase/auth';
import { Button } from 'react-daisyui';
import { InputWithLabel } from '@/components/shared';
import { AuthLayout } from '@/components/layouts';
import { useAuth } from '@/lib/firebase/AuthContext';
import toast from 'react-hot-toast';
import Head from 'next/head';
import Link from 'next/link';

export default function FirebaseRegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !authLoading) {
      router.replace('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await AuthService.createAccountWithEmail(email, password, name);
      toast.success('Account created successfully! Please check your email to verify your account.');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);

    try {
      await AuthService.signInWithGoogle();
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Google registration failed');
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
    <AuthLayout
      heading="Create Account"
      description="Join the 3arida Petition Platform"
    >
      <Head>
        <title>Register - 3arida Petition Platform</title>
      </Head>

      <div className="rounded p-6 border">
        {/* Google Registration Button */}
        <Button
          onClick={handleGoogleRegister}
          disabled={loading}
          className="w-full mb-4"
          color="primary"
          variant="outline"
        >
          Continue with Google
        </Button>

        <div className="divider">or</div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailRegister} className="space-y-4">
          <InputWithLabel
            type="text"
            label="Full Name"
            name="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            placeholder="Enter your password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <InputWithLabel
            type="password"
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            className="w-full"
            color="primary"
          >
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link
            href="/auth/firebase-login"
            className="text-primary hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
