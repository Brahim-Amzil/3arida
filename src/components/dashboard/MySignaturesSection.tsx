'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { useTranslation } from '@/hooks/useTranslation';
import PetitionCard from '@/components/petitions/PetitionCard';
import { Button } from '@/components/ui/button';
import { Petition } from '@/types/petition';

export default function MySignaturesSection() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [signedPetitions, setSignedPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadSignedPetitions();
    }
  }, [user]);

  const loadSignedPetitions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      // Import Firebase functions
      const { collection, query, where, getDocs, doc, getDoc } =
        await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      // Get all signatures by this user
      const signaturesRef = collection(db, 'signatures');
      const signaturesQuery = query(
        signaturesRef,
        where('userId', '==', user.uid)
      );

      const signaturesSnapshot = await getDocs(signaturesQuery);

      // Extract unique petition IDs
      const petitionIds = new Set<string>();
      signaturesSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.petitionId) {
          petitionIds.add(data.petitionId);
        }
      });

      // Fetch petition details for each signed petition
      const petitionPromises = Array.from(petitionIds).map(
        async (petitionId) => {
          try {
            const petitionRef = doc(db, 'petitions', petitionId);
            const petitionSnap = await getDoc(petitionRef);

            if (petitionSnap.exists()) {
              const data = petitionSnap.data();
              return {
                id: petitionSnap.id,
                title: data.title,
                description: data.description,
                category: data.category,
                subcategory: data.subcategory,
                targetSignatures: data.targetSignatures,
                currentSignatures: data.currentSignatures || 0,
                status: data.status,
                creatorId: data.creatorId,
                creatorName: data.creatorName,
                mediaUrls: data.mediaUrls || [],
                qrCodeUrl: data.qrCodeUrl,
                hasQrCode: data.hasQrCode || false,
                pricingTier: data.pricingTier,
                amountPaid: data.amountPaid || 0,
                paymentStatus: data.paymentStatus || 'unpaid',
                location: data.location,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
                viewCount: data.viewCount || 0,
                shareCount: data.shareCount || 0,
                isPublic: data.isPublic !== false,
                isActive: data.isActive !== false,
                publisherType: data.publisherType,
                publisherName: data.publisherName,
                petitionType: data.petitionType,
                addressedToType: data.addressedToType,
                addressedToSpecific: data.addressedToSpecific,
                referenceCode: data.referenceCode,
                youtubeVideoUrl: data.youtubeVideoUrl,
                tags: data.tags,
              } as Petition;
            }
            return null;
          } catch (error) {
            console.error(`Error fetching petition ${petitionId}:`, error);
            return null;
          }
        }
      );

      const petitions = await Promise.all(petitionPromises);
      const validPetitions = petitions.filter((p): p is Petition => p !== null);

      // Sort by creation date (most recent first)
      validPetitions.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );

      setSignedPetitions(validPetitions);
    } catch (err) {
      console.error('Error loading signed petitions:', err);
      setError(t('dashboard.mySignatures.error'));
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('dashboard.mySignatures.title')}
          </h2>
          <div className="animate-pulse h-4 w-20 bg-gray-200 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded mb-2"></div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('dashboard.mySignatures.title')}
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">{error}</p>
          <Button
            onClick={loadSignedPetitions}
            className="mt-4"
            variant="outline"
          >
            {t('dashboard.tryAgain')}
          </Button>
        </div>
      </div>
    );
  }

  // Empty State
  if (signedPetitions.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('dashboard.mySignatures.title')}
        </h2>
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('dashboard.mySignatures.noSignatures')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('dashboard.mySignatures.noSignaturesDesc')}
          </p>
          <Button asChild>
            <Link href="/petitions">
              {t('dashboard.mySignatures.discoverPetitions')}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Success State - Show signed petitions
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('dashboard.mySignatures.title')}
        </h2>
        <div className="text-sm text-gray-600">
          {signedPetitions.length === 1
            ? t('dashboard.mySignatures.countSingle')
            : t('dashboard.mySignatures.count', {
                count: signedPetitions.length,
              })}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">
              Track Your Impact
            </h3>
            <p className="text-sm text-blue-700">
              These are the petitions you've signed. You can track their
              progress and see updates from the creators.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {signedPetitions.map((petition) => (
          <PetitionCard
            key={petition.id}
            petition={petition}
            variant="grid"
            showProgress={true}
            showCreator={true}
            showActions={false}
          />
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center py-8 border-t border-gray-200">
        <p className="text-gray-600 mb-4">Want to support more causes?</p>
        <Button asChild variant="outline">
          <Link href="/petitions">Discover More Petitions</Link>
        </Button>
      </div>
    </div>
  );
}
