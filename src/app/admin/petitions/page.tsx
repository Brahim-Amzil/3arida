'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/HeaderWrapper';
import AdminNav from '@/components/admin/AdminNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useModeratorGuard } from '@/lib/auth-guards';
import { useTranslation } from '@/hooks/useTranslation';
import PetitionAdminActions from '@/components/admin/PetitionAdminActions';
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  orderBy,
  doc,
  deleteDoc,
  getCountFromServer,
  limit,
  startAfter,
  type QueryDocumentSnapshot,
  type DocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ADMIN_PETITIONS_PAGE_SIZE } from '@/lib/firestore-page-sizes';
import { Petition } from '@/types/petition';

const MODERATION_STATUS_FILTERS = [
  'pending',
  'approved',
  'rejected',
  'paused',
  'archived',
  'deleted',
] as const;

type ModerationStatusFilter = (typeof MODERATION_STATUS_FILTERS)[number];

function mapFirestorePetitionDoc(
  docSnap: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>,
): Petition {
  const data = docSnap.data()!;
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
  } as Petition;
}

export default function AdminPetitionsPage() {
  const { t } = useTranslation();
  const {
    user,
    userProfile,
    loading: authLoading,
    hasRequiredRole,
  } = useModeratorGuard();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [allPetitions, setAllPetitions] = useState<Petition[]>([]); // Store all petitions for counts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<
    | 'all'
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'paused'
    | 'archived'
    | 'deleted'
    | 'deletion-requests'
  >('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deletionRequests, setDeletionRequests] = useState<any[]>([]);
  const [deletionRequestsCount, setDeletionRequestsCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState<
    Record<ModerationStatusFilter, number>
  >({
    pending: 0,
    approved: 0,
    rejected: 0,
    paused: 0,
    archived: 0,
    deleted: 0,
  });
  const [totalPetitionCount, setTotalPetitionCount] = useState(0);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [hasMorePetitions, setHasMorePetitions] = useState(false);
  const [loadingMorePetitions, setLoadingMorePetitions] = useState(false);
  const lastPetitionDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(
    null,
  );

  const filterAndSearchPetitions = (
    petitionsList: Petition[],
    statusFilter: string,
    search: string,
    category: string,
  ) => {
    let filtered = petitionsList;

    if (
      statusFilter !== 'all' &&
      statusFilter !== 'deletion-requests'
    ) {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }

    const serverIndexedSearch =
      statusFilter === 'all' && search.trim().length > 0;

    if (search.trim() && !serverIndexedSearch) {
      const searchLower = search.toLowerCase();
      const searchUpper = search.toUpperCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          (p.category?.toLowerCase() ?? '').includes(searchLower) ||
          p.publisherName?.toLowerCase().includes(searchLower) ||
          (p.referenceCode?.toUpperCase() ?? '').includes(searchUpper),
      );
    }

    setPetitions(filtered);
  };

  const loadStatusCounts = async () => {
    const petitionsRef = collection(db, 'petitions');
    const [totalSnap, ...statusSnaps] = await Promise.all([
      getCountFromServer(petitionsRef),
      ...MODERATION_STATUS_FILTERS.map((s) =>
        getCountFromServer(
          query(petitionsRef, where('status', '==', s)),
        ),
      ),
    ]);
    setTotalPetitionCount(totalSnap.data().count);
    setStatusCounts(
      Object.fromEntries(
        MODERATION_STATUS_FILTERS.map((s, i) => [s, statusSnaps[i].data().count]),
      ) as Record<ModerationStatusFilter, number>,
    );
  };

  const loadCategoryOptions = async () => {
    const snap = await getDocs(collection(db, 'categories'));
    const names = snap.docs
      .map((d) => d.data().name as string)
      .filter(Boolean);
    setCategoryOptions(names.sort((a, b) => a.localeCompare(b)));
  };

  useEffect(() => {
    if (!authLoading && hasRequiredRole) {
      void loadCategoryOptions();
      void loadStatusCounts();
      void loadDeletionRequests();
    }
  }, [authLoading, hasRequiredRole]);

  const loadPetitionsPage = useCallback(
    async (mode: 'replace' | 'append' = 'replace') => {
      if (filter === 'deletion-requests') return;

      try {
        if (mode === 'replace') {
          setLoading(true);
          lastPetitionDocRef.current = null;
        } else {
          if (!lastPetitionDocRef.current) return;
          setLoadingMorePetitions(true);
        }
        setError('');

        const petitionsRef = collection(db, 'petitions');
        const pageSize = ADMIN_PETITIONS_PAGE_SIZE;

        const constraints = [];
        if (filter !== 'all') {
          constraints.push(where('status', '==', filter));
        }
        constraints.push(orderBy('createdAt', 'desc'));
        if (mode === 'append' && lastPetitionDocRef.current) {
          constraints.push(startAfter(lastPetitionDocRef.current));
        }
        constraints.push(limit(pageSize));

        const snapshot = await getDocs(query(petitionsRef, ...constraints));
        const page = snapshot.docs.map(mapFirestorePetitionDoc);

        lastPetitionDocRef.current =
          snapshot.docs.length > 0
            ? (snapshot.docs[snapshot.docs.length - 1] ?? null)
            : null;
        setHasMorePetitions(snapshot.docs.length === pageSize);

        if (mode === 'append') {
          setAllPetitions((prev) => {
            const seen = new Set(prev.map((p) => p.id));
            const merged = [...prev];
            for (const p of page) {
              if (!seen.has(p.id)) {
                seen.add(p.id);
                merged.push(p);
              }
            }
            return merged;
          });
        } else {
          setAllPetitions(page);
        }
      } catch (err: unknown) {
        console.error('Error loading petitions:', err);
        setError('Failed to load petitions');
      } finally {
        setLoading(false);
        setLoadingMorePetitions(false);
      }
    },
    [filter],
  );

  const loadIndexedSearchAll = useCallback(async () => {
    if (filter !== 'all') return;
    const raw = searchQuery.trim();
    if (!raw) return;

    try {
      setLoading(true);
      setError('');
      setHasMorePetitions(false);
      lastPetitionDocRef.current = null;

      const petitionsRef = collection(db, 'petitions');
      const merged: Petition[] = [];
      const seen = new Set<string>();

      const pushPetition = (p: Petition) => {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          merged.push(p);
        }
      };

      const upperRef = raw.toUpperCase().trim();
      const refSnap = await getDocs(
        query(
          petitionsRef,
          where('referenceCode', '==', upperRef),
          limit(5),
        ),
      );
      refSnap.docs.forEach((d) => pushPetition(mapFirestorePetitionDoc(d)));

      if (/^[a-zA-Z0-9_-]{10,}$/.test(raw)) {
        try {
          const d = await getDoc(doc(db, 'petitions', raw));
          if (d.exists()) {
            pushPetition(mapFirestorePetitionDoc(d));
          }
        } catch {
          /* ignore invalid id */
        }
      }

      const prefix = raw.slice(0, 120);
      if (prefix.length >= 1) {
        try {
          const titleSnap = await getDocs(
            query(
              petitionsRef,
              orderBy('title'),
              where('title', '>=', prefix),
              where('title', '<=', `${prefix}\uf8ff`),
              limit(40),
            ),
          );
          titleSnap.docs.forEach((d) => pushPetition(mapFirestorePetitionDoc(d)));
        } catch (titleErr) {
          console.warn('Admin title prefix search skipped:', titleErr);
        }
      }

      setAllPetitions(merged);
    } catch (err: unknown) {
      console.error('Error searching petitions:', err);
      setError('Failed to search petitions');
    } finally {
      setLoading(false);
    }
  }, [filter, searchQuery]);

  const refreshPetitionsAndCounts = useCallback(async () => {
    await loadStatusCounts();
    if (filter === 'deletion-requests') return;
    if (filter === 'all' && searchQuery.trim()) {
      await loadIndexedSearchAll();
    } else {
      await loadPetitionsPage('replace');
    }
  }, [filter, searchQuery, loadIndexedSearchAll, loadPetitionsPage]);

  useEffect(() => {
    if (!authLoading || !hasRequiredRole) return;

    if (filter === 'deletion-requests') {
      setAllPetitions([]);
      return;
    }

    const debounceMs = searchQuery.trim() && filter === 'all' ? 400 : 0;
    const timer = setTimeout(() => {
      lastPetitionDocRef.current = null;
      if (filter === 'all' && searchQuery.trim()) {
        void loadIndexedSearchAll();
      } else {
        void loadPetitionsPage('replace');
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [
    authLoading,
    hasRequiredRole,
    filter,
    searchQuery,
    loadIndexedSearchAll,
    loadPetitionsPage,
  ]);

  useEffect(() => {
    filterAndSearchPetitions(
      allPetitions,
      filter,
      searchQuery,
      searchCategory,
    );
  }, [filter, searchQuery, searchCategory, allPetitions]);

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [filter, searchQuery, searchCategory]);

  const loadDeletionRequests = async () => {
    try {
      const requestsRef = collection(db, 'deletionRequests');
      const pendingCountSnap = await getCountFromServer(
        query(requestsRef, where('status', '==', 'pending')),
      );
      setDeletionRequestsCount(pendingCountSnap.data().count);

      const requestsQuery = query(
        requestsRef,
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc'),
        limit(100),
      );
      const snapshot = await getDocs(requestsQuery);
      const requests: any[] = [];

      snapshot.forEach((docSnap) => {
        requests.push({
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
        });
      });

      setDeletionRequests(requests);
    } catch (err) {
      console.error('Error loading deletion requests:', err);
    }
  };

  const handleApproveDeletion = async (
    requestId: string,
    petitionId: string
  ) => {
    if (
      !confirm('Approve this deletion request? The petition will be deleted.')
    )
      return;

    try {
      const {
        updateDoc,
        doc: firestoreDoc,
        Timestamp,
        getDoc,
      } = await import('firebase/firestore');
      const { notifyDeletionRequestApproved } =
        await import('@/lib/notifications');

      // Get petition details for notification
      const petitionDoc = await getDoc(
        firestoreDoc(db, 'petitions', petitionId)
      );
      const petitionData = petitionDoc.data();

      // Update petition status to deleted
      await updateDoc(firestoreDoc(db, 'petitions', petitionId), {
        status: 'deleted',
        deletedAt: Timestamp.now(),
        deletedBy: userProfile?.id,
      });

      // Update deletion request status
      await updateDoc(firestoreDoc(db, 'deletionRequests', requestId), {
        status: 'approved',
        approvedAt: Timestamp.now(),
        approvedBy: userProfile?.id,
      });

      // Send notification to creator
      if (petitionData?.publisherId) {
        try {
          await notifyDeletionRequestApproved(
            petitionData.publisherId,
            petitionData.title,
            petitionId
          );
        } catch (notifError) {
          console.error('Error sending notification:', notifError);
        }
      }

      alert('Deletion request approved');
      loadDeletionRequests();
      void refreshPetitionsAndCounts();
    } catch (error) {
      console.error('Error approving deletion:', error);
      alert('Failed to approve deletion request');
    }
  };

  const handleDenyDeletion = async (requestId: string) => {
    const reason = prompt(
      'Reason for denying this deletion request (optional):'
    );
    if (reason === null) return; // User cancelled

    try {
      const {
        updateDoc,
        doc: firestoreDoc,
        Timestamp,
        getDoc,
      } = await import('firebase/firestore');
      const { notifyDeletionRequestDenied } =
        await import('@/lib/notifications');

      // Get deletion request details for notification
      const requestDoc = await getDoc(
        firestoreDoc(db, 'deletionRequests', requestId)
      );
      const requestData = requestDoc.data();

      // Update deletion request status
      await updateDoc(firestoreDoc(db, 'deletionRequests', requestId), {
        status: 'denied',
        deniedAt: Timestamp.now(),
        deniedBy: userProfile?.id,
        denialReason: reason || 'No reason provided',
      });

      // Send notification to creator
      if (requestData?.creatorId) {
        try {
          await notifyDeletionRequestDenied(
            requestData.creatorId,
            requestData.petitionTitle,
            requestData.petitionId,
            reason || 'No reason provided'
          );
        } catch (notifError) {
          console.error('Error sending notification:', notifError);
        }
      }

      alert('Deletion request denied');
      loadDeletionRequests();
    } catch (error) {
      console.error('Error denying deletion:', error);
      alert('Failed to deny deletion request');
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
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('admin.moderation.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('admin.moderation.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={t('admin.moderation.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">{t('admin.moderation.allCategories')}</option>
              {Array.from(
                new Set([
                  ...categoryOptions,
                  ...allPetitions.map((p) => p.category).filter(Boolean),
                ] as string[]),
              )
                .sort((a, b) => a.localeCompare(b))
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
            {(searchQuery || searchCategory !== 'all') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSearchCategory('all');
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {filter !== 'deletion-requests' && (
          <p className="text-xs text-gray-500 mb-4 max-w-3xl">
            {filter === 'all' && searchQuery.trim()
              ? 'With the All tab and a search term, we match exact reference code, petition document ID, and title prefix (up to 40 hits). Category still filters those results. Clear search to browse by date in batches.'
              : `Petitions load in batches of ${ADMIN_PETITIONS_PAGE_SIZE} (newest first). Use “Load more” for older rows; tab counts show full totals.`}
          </p>
        )}

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                {
                  key: 'pending',
                  label: t('admin.moderation.tabs.pendingReview'),
                  count: statusCounts.pending,
                },
                {
                  key: 'approved',
                  label: t('admin.moderation.tabs.approved'),
                  count: statusCounts.approved,
                },
                {
                  key: 'rejected',
                  label: t('admin.moderation.tabs.rejected'),
                  count: statusCounts.rejected,
                },
                {
                  key: 'paused',
                  label: t('admin.moderation.tabs.paused'),
                  count: statusCounts.paused,
                },
                {
                  key: 'archived',
                  label: t('admin.moderation.tabs.archived'),
                  count: statusCounts.archived,
                },
                {
                  key: 'deleted',
                  label: t('admin.moderation.tabs.deleted'),
                  count: statusCounts.deleted,
                },
                {
                  key: 'deletion-requests',
                  label: t('admin.moderation.tabs.deletionRequests'),
                  count: deletionRequestsCount,
                },
                {
                  key: 'all',
                  label: t('admin.moderation.tabs.allPetitions'),
                  count: totalPetitionCount,
                },
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
            <Button
              onClick={() => void refreshPetitionsAndCounts()}
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        ) : filter === 'deletion-requests' ? (
          deletionRequests.length === 0 ? (
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
                  {t('admin.moderation.noDeletionRequests')}
                </h3>
                <p className="text-gray-600">
                  {t('admin.moderation.noDeletionRequestsDesc')}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {deletionRequests.map((request) => (
                <Card
                  key={request.id}
                  className="border-orange-200 bg-orange-50"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {request.petitionTitle}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Petition ID:</span>{' '}
                            {request.petitionId}
                          </p>
                          <p>
                            <span className="font-medium">
                              Current Signatures:
                            </span>{' '}
                            {request.currentSignatures}
                          </p>
                          <p>
                            <span className="font-medium">Requested:</span>{' '}
                            {request.createdAt.toLocaleDateString()}
                          </p>
                          <div className="mt-3 p-3 bg-white rounded border border-orange-200">
                            <p className="font-medium text-gray-900 mb-1">
                              Reason:
                            </p>
                            <p className="text-gray-700">{request.reason}</p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col gap-2">
                        <Button
                          onClick={() =>
                            handleApproveDeletion(
                              request.id,
                              request.petitionId
                            )
                          }
                          className="bg-red-600 hover:bg-red-700"
                          size="sm"
                        >
                          Approve Deletion
                        </Button>
                        <Button
                          onClick={() => handleDenyDeletion(request.id)}
                          variant="outline"
                          size="sm"
                        >
                          Deny Request
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/petitions/${request.petitionId}`}>
                            View Petition
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
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
                {searchQuery || searchCategory !== 'all'
                  ? t('admin.moderation.noPetitions')
                  : filter === 'pending'
                    ? t('admin.moderation.noPendingPetitions')
                    : t('admin.moderation.noStatusPetitions', {
                        status: filter,
                      })}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-6">
              {petitions
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((petition) => (
                  <Card key={petition.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        {/* Petition Image */}
                        <div className="flex-shrink-0">
                          {petition.mediaUrls &&
                          petition.mediaUrls.length > 0 ? (
                            <Image
                              src={petition.mediaUrls[0]}
                              alt={petition.title}
                              width={192}
                              height={128}
                              className="w-48 h-32 object-cover rounded-lg"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
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
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Petition Content */}
                        <div className="flex-1 min-w-0">
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
                                          : petition.status === 'deleted'
                                            ? 'bg-gray-800 text-white'
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
                                  <span className="font-medium">
                                    Signatures:
                                  </span>
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
                                      Moderator Notes:
                                    </span>{' '}
                                    {petition.moderationNotes}
                                  </p>
                                </div>
                              )}

                              {/* Rejection History */}
                              {petition.status === 'rejected' &&
                                petition.resubmissionHistory &&
                                petition.resubmissionHistory.length > 0 && (
                                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm font-medium text-red-800 mb-2">
                                      سجل الرفض (
                                      {petition.resubmissionCount || 0}{' '}
                                      resubmission
                                      {(petition.resubmissionCount || 0) !== 1
                                        ? 's'
                                        : ''}
                                      ):
                                    </p>
                                    <div className="space-y-2">
                                      {petition.resubmissionHistory.map(
                                        (entry, index) => (
                                          <div
                                            key={index}
                                            className="text-xs text-red-700 border-l-2 border-red-300 pl-2"
                                          >
                                            <p>
                                              <strong>
                                                المحاولة {index + 1}:
                                              </strong>
                                            </p>
                                            <p>
                                              Rejected:{' '}
                                              {entry.rejectedAt instanceof Date
                                                ? entry.rejectedAt.toLocaleDateString()
                                                : new Date(
                                                    entry.rejectedAt
                                                  ).toLocaleDateString()}
                                            </p>
                                            <p>السبب: {entry.reason}</p>
                                            {entry.resubmittedAt && (
                                              <p>
                                                Resubmitted:{' '}
                                                {entry.resubmittedAt instanceof
                                                Date
                                                  ? entry.resubmittedAt.toLocaleDateString()
                                                  : new Date(
                                                      entry.resubmittedAt
                                                    ).toLocaleDateString()}
                                              </p>
                                            )}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>

                            <div className="ml-6 flex flex-col gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/admin/petitions/${petition.id}`}>
                                  {t('admin.actions.review')}
                                </Link>
                              </Button>

                              {/* Permanent Delete Button - Only for deleted petitions */}
                              {petition.status === 'deleted' && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={async () => {
                                    if (confirm('⚠️ هل أنت متأكد من الحذف النهائي؟ لا يمكن التراجع عن هذا الإجراء!')) {
                                      try {
                                        const petitionRef = doc(db, 'petitions', petition.id);
                                        await deleteDoc(petitionRef);
                                        alert('✅ تم الحذف النهائي بنجاح');
                                        void refreshPetitionsAndCounts();
                                      } catch (error) {
                                        console.error('Error permanently deleting:', error);
                                        alert('❌ فشل الحذف النهائي');
                                      }
                                    }
                                  }}
                                >
                                  🗑️ حذف نهائي
                                </Button>
                              )}

                              <PetitionAdminActions
                                petition={petition}
                                onUpdate={(updatedPetition) => {
                                  setPetitions((prev) =>
                                    prev.map((p) =>
                                      p.id === petition.id ? updatedPetition : p
                                    )
                                  );
                                  if (
                                    updatedPetition.status !== petition.status
                                  ) {
                                    void refreshPetitionsAndCounts();
                                  }
                                }}
                                size="sm"
                                layout="vertical"
                                moderatorId={userProfile?.id}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Pagination */}
            {petitions.length > itemsPerPage && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
                <div className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, petitions.length)}
                  </span>{' '}
                  of <span className="font-medium">{petitions.length}</span>{' '}
                  results
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <svg
                      className="w-4 h-4"
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
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {Array.from(
                      { length: Math.ceil(petitions.length / itemsPerPage) },
                      (_, i) => i + 1
                    )
                      .filter((page) => {
                        // Show first page, last page, current page, and pages around current
                        const totalPages = Math.ceil(
                          petitions.length / itemsPerPage
                        );
                        return (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        );
                      })
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 py-1 text-gray-500">...</span>
                          )}
                          <Button
                            variant={
                              currentPage === page ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={
                              currentPage === page
                                ? 'bg-green-600 hover:bg-green-700'
                                : ''
                            }
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          Math.ceil(petitions.length / itemsPerPage),
                          prev + 1
                        )
                      )
                    }
                    disabled={
                      currentPage === Math.ceil(petitions.length / itemsPerPage)
                    }
                  >
                    Next
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            )}

            {!searchQuery.trim() && hasMorePetitions && (
                <div className="mt-4 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void loadPetitionsPage('append')}
                    disabled={loadingMorePetitions || loading}
                  >
                    {loadingMorePetitions
                      ? 'Loading…'
                      : `Load more (${ADMIN_PETITIONS_PAGE_SIZE})`}
                  </Button>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}
