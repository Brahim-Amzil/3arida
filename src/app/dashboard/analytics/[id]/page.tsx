'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import PetitionAnalytics from '@/components/petitions/PetitionAnalytics';
import { Button } from '@/components/ui/button';
import { useAuthGuard } from '@/lib/auth-guards';
import { getPetitionById } from '@/lib/petitions';
import { Petition } from '@/types/petition';

export default function PetitionAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const petitionId = params?.id as string;

  const { user } = useAuthGuard();
  const [petition, setPetition] = useState<Petition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (user && petitionId) {
      loadPetition();
    }
  }, [user, petitionId]);

  const loadPetition = async () => {
    try {
      setLoading(true);
      setError('');

      const petitionData = await getPetitionById(petitionId);
      if (!petitionData) {
        setError('Petition not found');
        return;
      }

      // Check if user owns this petition
      if (petitionData.createdBy !== user?.uid) {
        setError('You can only view analytics for your own petitions');
        return;
      }

      setPetition(petitionData);
    } catch (err: any) {
      console.error('Error loading petition:', err);
      setError('Failed to load petition');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error || !petition) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/petitions/${petition.id}`}>View Petition</Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Petition Analytics
          </h1>
          <p className="text-lg text-gray-600">{petition.title}</p>
        </div>

        {/* Analytics Component */}
        <PetitionAnalytics petition={petition} />
      </div>
    </div>
  );
}
