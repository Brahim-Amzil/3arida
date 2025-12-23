'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/HeaderWrapper';
import AppealThreadView from '@/components/appeals/AppealThreadView';
import { useAuth } from '@/components/auth/AuthProvider';
import { Appeal } from '@/types/appeal';

export default function AppealDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [appeal, setAppeal] = useState<Appeal | null>(null);
  const [petition, setPetition] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      loadAppeal();
    }
  }, [user, params.id]);

  const loadAppeal = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `/api/appeals/${params.id}?userId=${user.uid}&userRole=user`
      );

      if (!response.ok) {
        throw new Error('Failed to load appeal');
      }

      const data = await response.json();
      setAppeal(data.appeal);
      setPetition(data.petition);
    } catch (err) {
      console.error('Error loading appeal:', err);
      setError('Failed to load appeal details');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (message: string) => {
    if (!user) return;

    const response = await fetch(`/api/appeals/${params.id}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        userId: user.uid,
        userName: user.displayName || 'User',
        userRole: 'creator',
        userEmail: user.email,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to send reply');
    }

    // Reload appeal to show new message
    await loadAppeal();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error || !appeal || !petition) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                {error || 'Appeal not found'}
              </h2>
              <p className="mt-2 text-gray-600">
                The appeal you're looking for doesn't exist or you don't have
                permission to view it.
              </p>
              <Link
                href="/dashboard"
                className="mt-6 inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                العودة إلى لوحة التحكم
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center gap-2 text-gray-600">
              <li>
                <Link href="/dashboard" className="hover:text-green-600">
                  لوحة التحكم
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900">طلب الاستئناف</li>
            </ol>
          </nav>

          {/* Appeal Thread */}
          <AppealThreadView
            appeal={appeal}
            petitionTitle={petition.title}
            petitionStatus={petition.status}
            onReply={handleReply}
            isCreator={true}
          />
        </div>
      </div>
    </div>
  );
}
