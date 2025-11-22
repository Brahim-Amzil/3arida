'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/HeaderWrapper';
import AdminNav from '@/components/admin/AdminNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminGuard } from '@/lib/auth-guards';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Petition } from '@/types/petition';

interface AnalyticsData {
  totalPetitions: number;
  totalSignatures: number;
  totalUsers: number;
  totalViews: number;
  totalShares: number;
  avgSignaturesPerPetition: number;
  petitionsByStatus: {
    pending: number;
    approved: number;
    rejected: number;
    paused: number;
    deleted: number;
    archived: number;
  };
  petitionsByCategory: { [key: string]: number };
  topPetitions: Petition[];
  recentGrowth: {
    petitionsThisWeek: number;
    petitionsLastWeek: number;
    signaturesThisWeek: number;
    signaturesLastWeek: number;
  };
}

export default function AdminAnalyticsPage() {
  const {
    user,
    userProfile,
    loading: authLoading,
    hasRequiredRole,
  } = useAdminGuard();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalPetitions: 0,
    totalSignatures: 0,
    totalUsers: 0,
    totalViews: 0,
    totalShares: 0,
    avgSignaturesPerPetition: 0,
    petitionsByStatus: {
      pending: 0,
      approved: 0,
      rejected: 0,
      paused: 0,
      deleted: 0,
      archived: 0,
    },
    petitionsByCategory: {},
    topPetitions: [],
    recentGrowth: {
      petitionsThisWeek: 0,
      petitionsLastWeek: 0,
      signaturesThisWeek: 0,
      signaturesLastWeek: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!authLoading && hasRequiredRole) {
      loadAnalytics();
    }
  }, [authLoading, hasRequiredRole]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');

      const petitionsRef = collection(db, 'petitions');
      const usersRef = collection(db, 'users');

      // Get all petitions
      const allPetitionsSnapshot = await getDocs(petitionsRef);
      const allUsers = await getDocs(usersRef);

      let totalSignatures = 0;
      let totalViews = 0;
      let totalShares = 0;
      const petitionsByStatus = {
        pending: 0,
        approved: 0,
        rejected: 0,
        paused: 0,
        deleted: 0,
        archived: 0,
      };
      const petitionsByCategory: { [key: string]: number } = {};
      const topPetitions: Petition[] = [];

      // Calculate date ranges for growth metrics
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      let petitionsThisWeek = 0;
      let petitionsLastWeek = 0;
      let signaturesThisWeek = 0;
      let signaturesLastWeek = 0;

      allPetitionsSnapshot.forEach((doc) => {
        const data = doc.data();
        const petition = {
          id: doc.id,
          ...data,
          currentSignatures: data.currentSignatures || 0,
          viewCount: data.viewCount || 0,
          shareCount: data.shareCount || 0,
          createdAt: (data.createdAt as any)?.toDate?.() || new Date(),
          updatedAt: (data.updatedAt as any)?.toDate?.() || new Date(),
        } as Petition;

        // Accumulate totals
        totalSignatures += petition.currentSignatures;
        totalViews += petition.viewCount;
        totalShares += petition.shareCount;

        // Count by status
        const status = petition.status as keyof typeof petitionsByStatus;
        if (petitionsByStatus[status] !== undefined) {
          petitionsByStatus[status]++;
        }

        // Count by category
        if (petition.category) {
          petitionsByCategory[petition.category] =
            (petitionsByCategory[petition.category] || 0) + 1;
        }

        // Track for top petitions
        topPetitions.push(petition);

        // Growth metrics
        const createdAt = petition.createdAt;
        if (createdAt >= oneWeekAgo) {
          petitionsThisWeek++;
          signaturesThisWeek += petition.currentSignatures || 0;
        } else if (createdAt >= twoWeeksAgo) {
          petitionsLastWeek++;
          signaturesLastWeek += petition.currentSignatures || 0;
        }
      });

      // Sort top petitions by signatures
      topPetitions.sort((a, b) => b.currentSignatures - a.currentSignatures);

      setAnalytics({
        totalPetitions: allPetitionsSnapshot.size,
        totalSignatures,
        totalUsers: allUsers.size,
        totalViews,
        totalShares,
        avgSignaturesPerPetition:
          allPetitionsSnapshot.size > 0
            ? Math.round(totalSignatures / allPetitionsSnapshot.size)
            : 0,
        petitionsByStatus,
        petitionsByCategory,
        topPetitions: topPetitions.slice(0, 10),
        recentGrowth: {
          petitionsThisWeek,
          petitionsLastWeek,
          signaturesThisWeek,
          signaturesLastWeek,
        },
      });
    } catch (err: any) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data');
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

  if (!hasRequiredRole) {
    return null;
  }

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Platform Analytics
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive insights and statistics
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">{error}</p>
            <Button onClick={loadAnalytics} className="mt-4" variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Petitions
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {analytics.totalPetitions}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        +{analytics.recentGrowth.petitionsThisWeek} this week
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
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
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Signatures
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {analytics.totalSignatures.toLocaleString()}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        +
                        {analytics.recentGrowth.signaturesThisWeek.toLocaleString()}{' '}
                        this week
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Users
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {analytics.totalUsers}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Platform members
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Avg. Signatures
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {analytics.avgSignaturesPerPetition}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Per petition</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Petitions by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analytics.petitionsByStatus).map(
                      ([status, count]) => (
                        <div
                          key={status}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : status === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : status === 'rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : status === 'paused'
                                        ? 'bg-orange-100 text-orange-800'
                                        : status === 'archived'
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-gray-900">
                              {count}
                            </span>
                            <span className="text-sm text-gray-500">
                              (
                              {analytics.totalPetitions > 0
                                ? Math.round(
                                    (count / analytics.totalPetitions) * 100
                                  )
                                : 0}
                              %)
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Petitions by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analytics.petitionsByCategory)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 6)
                      .map(([category, count]) => (
                        <div
                          key={category}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {category}
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{
                                  width: `${
                                    analytics.totalPetitions > 0
                                      ? (count / analytics.totalPetitions) * 100
                                      : 0
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-900 w-8 text-right">
                              {count}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Petitions */}
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Petitions by Signatures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topPetitions.map((petition, index) => (
                    <div
                      key={petition.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-green-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {petition.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-500">
                            {petition.category}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              petition.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {petition.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {(petition.currentSignatures || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">signatures</p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/petitions/${petition.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Total Views
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        {analytics.totalViews.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Total Shares
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        {analytics.totalShares.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Avg. Views per Petition
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        {analytics.totalPetitions > 0
                          ? Math.round(
                              analytics.totalViews / analytics.totalPetitions
                            )
                          : 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Growth Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Petitions Growth
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            calculateGrowth(
                              analytics.recentGrowth.petitionsThisWeek,
                              analytics.recentGrowth.petitionsLastWeek
                            ) >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {calculateGrowth(
                            analytics.recentGrowth.petitionsThisWeek,
                            analytics.recentGrowth.petitionsLastWeek
                          ) >= 0
                            ? '+'
                            : ''}
                          {calculateGrowth(
                            analytics.recentGrowth.petitionsThisWeek,
                            analytics.recentGrowth.petitionsLastWeek
                          )}
                          %
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Week over week comparison
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Signatures Growth
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            calculateGrowth(
                              analytics.recentGrowth.signaturesThisWeek,
                              analytics.recentGrowth.signaturesLastWeek
                            ) >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {calculateGrowth(
                            analytics.recentGrowth.signaturesThisWeek,
                            analytics.recentGrowth.signaturesLastWeek
                          ) >= 0
                            ? '+'
                            : ''}
                          {calculateGrowth(
                            analytics.recentGrowth.signaturesThisWeek,
                            analytics.recentGrowth.signaturesLastWeek
                          )}
                          %
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Week over week comparison
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
