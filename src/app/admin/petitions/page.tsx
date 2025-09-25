'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useModeratorGuard } from '@/lib/auth-guards';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { notifyPetitionStatusChange } from '@/lib/notifications';
import { db } from '@/lib/firebase';
import { Petition } from '@/types/petition';

export default function AdminPetitionsPage() {
  const {
    user,
    userProfile,
    loading: authLoading,
    hasRequiredRole,
  } = useModeratorGuard();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'approved' | 'paused'
  >('pending');
  const [actionLoading, setActionLoading] = useState<string>('');

  useEffect(() => {
    if (!authLoading && hasRequiredRole) {
      loadPetitions();
    }
  }, [authLoading, hasRequiredRole, filter]);

  const loadPetitions = async () => {
    try {
      setLoading(true);
      setError('');

      const petitionsRef = collection(db, 'petitions');
      let petitionsQuery;

      if (filter === 'all') {
        petitionsQuery = query(petitionsRef, orderBy('createdAt', 'desc'));
      } else {
        petitionsQuery = query(
          petitionsRef,
          where('status', '==', filter),
          orderBy('createdAt', 'desc')
        );
      }

      const snapshot = await getDocs(petitionsQuery);
      const petitionsList: Petition[] = [];

      snapshot.forEach((doc) => {
        const petition = { id: doc.id, ...doc.data() } as Petition;
        petition.createdAt = petition.createdAt?.toDate?.() || new Date();
        petition.updatedAt = petition.updatedAt?.toDate?.() || new Date();
        petitionsList.push(petition);
      });

      setPetitions(petitionsList);
    } catch (err: any) {
      console.error('Error loading petitions:', err);
      setError('Failed to load petitions');
    } finally {
      setLoading(false);
    }
  };

  const handlePetitionAction = async (
    petitionId: string,
    action: 'approve' | 'pause' | 'delete',
    notes?: string
  ) => {
    if (!userProfile) return;

    try {
      setActionLoading(petitionId);

      const petitionRef = doc(db, 'petitions', petitionId);
      const updateData: any = {
        moderatedBy: userProfile.id,
        moderationNotes: notes || '',
        updatedAt: new Date(),
      };

      switch (action) {
        case 'approve':
          updateData.status = 'approved';
          updateData.approvedAt = new Date();
          break;
        case 'pause':
          updateData.status = 'paused';
          updateData.pausedAt = new Date();
          break;
        case 'delete':
          updateData.status = 'deleted';
          updateData.deletedAt = new Date();
          break;
      }

      await updateDoc(petitionRef, updateData);

      // Find the petition to get creator info for notification
      const petition = petitions.find((p) => p.id === petitionId);
      if (petition) {
        try {
          await notifyPetitionStatusChange(
            petitionId,
            petition.creatorId,
            petition.title,
            updateData.status,
            notes
          );
        } catch (notificationError) {
          console.error(
            'Error sending status change notification:',
            notificationError
          );
          // Don't fail the moderation action if notification fails
        }
      }

      // Update local state
      setPetitions((prev) =>
        prev.map((p) => (p.id === petitionId ? { ...p, ...updateData } : p))
      );

      // Reload if filtering by status
      if (filter !== 'all') {
        loadPetitions();
      }
    } catch (err: any) {
      console.error(`Error ${action}ing petition:`, err);
      alert(`Failed to ${action} petition. Please try again.`);
    } finally {
      setActionLoading('');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (!hasRequiredRole) {
    return null; // Will redirect via useModeratorGuard
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" asChild>
              <Link href="/admin">
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
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Petition Moderation
          </h1>
          <p className="text-lg text-gray-600">
            Review and manage petitions on the platform
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                {
                  key: 'pending',
                  label: 'Pending Review',
                  count: petitions.filter((p) => p.status === 'pending').length,
                },
                {
                  key: 'approved',
                  label: 'Approved',
                  count: petitions.filter((p) => p.status === 'approved')
                    .length,
                },
                {
                  key: 'paused',
                  label: 'Paused',
                  count: petitions.filter((p) => p.status === 'paused').length,
                },
                { key: 'all', label: 'All Petitions', count: petitions.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {!loading && (
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">{error}</p>
            <Button onClick={loadPetitions} className="mt-4" variant="outline">
              Try Again
            </Button>
          </div>
        ) : petitions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No petitions found
              </h3>
              <p className="text-gray-600">
                {filter === 'pending'
                  ? 'No petitions are pending review.'
                  : `No ${filter} petitions found.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {petitions.map((petition) => (
              <Card key={petition.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link href={`/admin/petitions/${petition.id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600 cursor-pointer">
                            {petition.title}
                          </h3>
                        </Link>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            petition.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : petition.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : petition.status === 'paused'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {petition.status}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {petition.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Category:</span>
                          <br />
                          {petition.category}
                        </div>
                        <div>
                          <span className="font-medium">Signatures:</span>
                          <br />
                          {petition.currentSignatures} /{' '}
                          {petition.targetSignatures}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span>
                          <br />
                          {petition.createdAt.toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Tier:</span>
                          <br />
                          {petition.pricingTier}
                        </div>
                      </div>

                      {petition.moderationNotes && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">
                              Moderation Notes:
                            </span>{' '}
                            {petition.moderationNotes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="ml-6 flex flex-col gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/petitions/${petition.id}`}>
                          Review
                        </Link>
                      </Button>

                      {petition.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              handlePetitionAction(petition.id, 'approve')
                            }
                            disabled={actionLoading === petition.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {actionLoading === petition.id
                              ? 'Processing...'
                              : 'Approve'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const notes = prompt(
                                'Reason for pausing (optional):'
                              );
                              if (notes !== null) {
                                handlePetitionAction(
                                  petition.id,
                                  'pause',
                                  notes
                                );
                              }
                            }}
                            disabled={actionLoading === petition.id}
                          >
                            Pause
                          </Button>
                        </>
                      )}

                      {petition.status === 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const notes = prompt(
                              'Reason for pausing (optional):'
                            );
                            if (notes !== null) {
                              handlePetitionAction(petition.id, 'pause', notes);
                            }
                          }}
                          disabled={actionLoading === petition.id}
                        >
                          Pause
                        </Button>
                      )}

                      {petition.status === 'paused' && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handlePetitionAction(petition.id, 'approve')
                          }
                          disabled={actionLoading === petition.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Resume
                        </Button>
                      )}

                      {petition.status !== 'deleted' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (
                              confirm(
                                'Are you sure you want to delete this petition? This action cannot be undone.'
                              )
                            ) {
                              const notes = prompt(
                                'Reason for deletion (required):'
                              );
                              if (notes) {
                                handlePetitionAction(
                                  petition.id,
                                  'delete',
                                  notes
                                );
                              }
                            }
                          }}
                          disabled={actionLoading === petition.id}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
