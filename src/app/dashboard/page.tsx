'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/HeaderWrapper';
import PetitionCard from '@/components/petitions/PetitionCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { getUserPetitions } from '@/lib/petitions';
import { Petition } from '@/types/petition';

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    userProfile,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  // Load user petitions
  useEffect(() => {
    if (user) {
      loadUserPetitions();
    }
  }, [user]);

  const loadUserPetitions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');
      const userPetitions = await getUserPetitions(user.uid);
      setPetitions(userPetitions);
    } catch (err) {
      console.error('Error loading user petitions:', err);
      setError('Failed to load your petitions. Please try again.');
    } finally {
      setLoading(false);
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

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  // Calculate stats
  const totalSignatures = petitions.reduce(
    (sum, petition) => sum + petition.currentSignatures,
    0
  );
  const activePetitions = petitions.filter(
    (p) => p.status === 'approved'
  ).length;
  const pendingPetitions = petitions.filter(
    (p) => p.status === 'pending'
  ).length;

  // Filter petitions based on status
  const filteredPetitions = petitions.filter((petition) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return petition.status === 'approved';
    if (statusFilter === 'pending') return petition.status === 'pending';
    if (statusFilter === 'rejected') return petition.status === 'rejected';
    if (statusFilter === 'paused') return petition.status === 'paused';
    if (statusFilter === 'deleted')
      return petition.status === 'deleted' || petition.deletedAt !== undefined;
    return true;
  });

  // Count petitions by status
  const statusCounts = {
    all: petitions.length,
    active: petitions.filter((p) => p.status === 'approved').length,
    pending: petitions.filter((p) => p.status === 'pending').length,
    rejected: petitions.filter((p) => p.status === 'rejected').length,
    paused: petitions.filter((p) => p.status === 'paused').length,
    deleted: petitions.filter(
      (p) => p.status === 'deleted' || p.deletedAt !== undefined
    ).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back,{' '}
                {userProfile?.name ||
                  user?.displayName ||
                  user?.email?.split('@')[0]}
                !
              </h1>
              <p className="text-lg text-gray-600">
                Manage your petitions and track their progress
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/petitions/create">
                <Button>+ New Petition</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards - Compact Design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {/* Total Petitions */}
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-blue-600"
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
              <div>
                <p className="text-2xl font-bold text-gray-900 leading-none">
                  {petitions.length}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">Total Petitions</p>
              </div>
            </div>
          </div>

          {/* Active Petitions */}
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 leading-none">
                  {activePetitions}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">Active Petitions</p>
              </div>
            </div>
          </div>

          {/* Pending Review */}
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 leading-none">
                  {pendingPetitions}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">Pending Review</p>
              </div>
            </div>
          </div>

          {/* Total Signatures */}
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-purple-600"
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
              <div>
                <p className="text-2xl font-bold text-gray-900 leading-none">
                  {totalSignatures.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">Total Signatures</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Petitions */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Petitions</h2>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
              className="flex items-center gap-2"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              All
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                {statusCounts.all}
              </span>
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('active')}
              className="flex items-center gap-2"
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Active
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                {statusCounts.active}
              </span>
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('pending')}
              className="flex items-center gap-2"
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Pending Review
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                {statusCounts.pending}
              </span>
            </Button>
            <Button
              variant={statusFilter === 'rejected' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('rejected')}
              className="flex items-center gap-2"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Rejected
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                {statusCounts.rejected}
              </span>
            </Button>
            <Button
              variant={statusFilter === 'paused' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('paused')}
              className="flex items-center gap-2"
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
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Paused
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                {statusCounts.paused}
              </span>
            </Button>
            <Button
              variant={statusFilter === 'deleted' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('deleted')}
              className="flex items-center gap-2"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Deleted
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                {statusCounts.deleted}
              </span>
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
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
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">{error}</p>
              <Button
                onClick={loadUserPetitions}
                className="mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Petitions Grid */}
          {!loading && !error && filteredPetitions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPetitions.map((petition) => (
                <PetitionCard
                  key={petition.id}
                  petition={petition}
                  variant="grid"
                  showProgress={true}
                  showCreator={false}
                  showActions={true}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && petitions.length === 0 && (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No petitions yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't created any petitions yet. Start your first petition
                to make change happen!
              </p>
              <Button asChild>
                <Link href="/petitions/create">Create Your First Petition</Link>
              </Button>
            </div>
          )}

          {/* No Results for Filter */}
          {!loading &&
            !error &&
            petitions.length > 0 &&
            filteredPetitions.length === 0 && (
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {statusFilter} petitions
                </h3>
                <p className="text-gray-600 mb-6">
                  You don't have any {statusFilter} petitions at the moment.
                </p>
                <Button
                  onClick={() => setStatusFilter('all')}
                  variant="outline"
                >
                  Show All Petitions
                </Button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
