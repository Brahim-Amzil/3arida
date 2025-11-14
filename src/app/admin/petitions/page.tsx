'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useModeratorGuard } from '@/lib/auth-guards';
import PetitionAdminActions from '@/components/admin/PetitionAdminActions';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
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
  const [allPetitions, setAllPetitions] = useState<Petition[]>([]); // Store all petitions for counts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<
    'all' | 'pending' | 'approved' | 'paused' | 'deleted' | 'deletion-requests'
  >('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deletionRequests, setDeletionRequests] = useState<any[]>([]);
  const [deletionRequestsCount, setDeletionRequestsCount] = useState(0);

  useEffect(() => {
    if (!authLoading && hasRequiredRole) {
      loadPetitions();
      loadDeletionRequests();
    }
  }, [authLoading, hasRequiredRole]);

  useEffect(() => {
    if (allPetitions.length > 0) {
      filterAndSearchPetitions(
        allPetitions,
        filter,
        searchQuery,
        searchCategory
      );
    }
  }, [filter, searchQuery, searchCategory]);

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [filter, searchQuery, searchCategory]);

  const filterAndSearchPetitions = (
    petitionsList: Petition[],
    statusFilter: string,
    search: string,
    category: string
  ) => {
    let filtered = petitionsList;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Filter by search query
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      const searchUpper = search.toUpperCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower) ||
          p.publisherName?.toLowerCase().includes(searchLower) ||
          p.referenceCode?.toUpperCase().includes(searchUpper) // Search by reference code
      );
    }

    setPetitions(filtered);
  };

  const loadPetitions = async () => {
    try {
      setLoading(true);
      setError('');

      const petitionsRef = collection(db, 'petitions');

      // Always load ALL petitions for accurate counts
      const allPetitionsQuery = query(
        petitionsRef,
        orderBy('createdAt', 'desc')
      );
      const allSnapshot = await getDocs(allPetitionsQuery);
      const allPetitionsList: Petition[] = [];

      allSnapshot.forEach((doc) => {
        const data = doc.data();
        const petition = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
        } as Petition;
        allPetitionsList.push(petition);
      });

      setAllPetitions(allPetitionsList);

      // Filter for display
      filterAndSearchPetitions(
        allPetitionsList,
        filter,
        searchQuery,
        searchCategory
      );
    } catch (err: any) {
      console.error('Error loading petitions:', err);
      setError('Failed to load petitions');
    } finally {
      setLoading(false);
    }
  };

  const loadDeletionRequests = async () => {
    try {
      const requestsRef = collection(db, 'deletionRequests');
      const requestsQuery = query(
        requestsRef,
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(requestsQuery);
      const requests: any[] = [];

      snapshot.forEach((doc) => {
        requests.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        });
      });

      setDeletionRequests(requests);
      setDeletionRequestsCount(requests.length);
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
      const { notifyDeletionRequestApproved } = await import(
        '@/lib/notifications'
      );

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
      loadPetitions();
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
      const { notifyDeletionRequestDenied } = await import(
        '@/lib/notifications'
      );

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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by title, description, category, publisher, or reference code (e.g., AB1234)..."
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
              <option value="all">All Categories</option>
              {Array.from(new Set(allPetitions.map((p) => p.category)))
                .sort()
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

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                {
                  key: 'pending',
                  label: 'Pending Review',
                  count: allPetitions.filter((p) => p.status === 'pending')
                    .length,
                },
                {
                  key: 'approved',
                  label: 'Approved',
                  count: allPetitions.filter((p) => p.status === 'approved')
                    .length,
                },
                {
                  key: 'paused',
                  label: 'Paused',
                  count: allPetitions.filter((p) => p.status === 'paused')
                    .length,
                },
                {
                  key: 'deleted',
                  label: 'Deleted',
                  count: allPetitions.filter((p) => p.status === 'deleted')
                    .length,
                },
                {
                  key: 'deletion-requests',
                  label: 'Deletion Requests',
                  count: deletionRequestsCount,
                },
                {
                  key: 'all',
                  label: 'All Petitions',
                  count: allPetitions.length,
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
            <Button onClick={loadPetitions} className="mt-4" variant="outline">
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
                  No deletion requests
                </h3>
                <p className="text-gray-600">
                  There are no pending deletion requests at this time.
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
                  ? 'No petitions match your search criteria.'
                  : filter === 'pending'
                  ? 'No petitions are pending review.'
                  : `No ${filter} petitions found.`}
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
                            <img
                              src={petition.mediaUrls[0]}
                              alt={petition.title}
                              className="w-48 h-32 object-cover rounded-lg"
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

                              {petition.moderatorNotes && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                  <p className="text-sm text-blue-800">
                                    <span className="font-medium">
                                      Moderator Notes:
                                    </span>{' '}
                                    {petition.moderatorNotes}
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

                              <PetitionAdminActions
                                petition={petition}
                                onUpdate={(updatedPetition) => {
                                  setPetitions((prev) =>
                                    prev.map((p) =>
                                      p.id === petition.id ? updatedPetition : p
                                    )
                                  );
                                  // Reload if filtering by status and status changed
                                  if (
                                    filter !== 'all' &&
                                    updatedPetition.status !== petition.status
                                  ) {
                                    loadPetitions();
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
          </>
        )}
      </div>
    </div>
  );
}
