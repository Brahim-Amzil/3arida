'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminGuard } from '@/lib/auth-guards';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Petition, User } from '@/types/petition';

interface AdminStats {
  totalPetitions: number;
  pendingPetitions: number;
  approvedPetitions: number;
  pausedPetitions: number;
  totalUsers: number;
  totalSignatures: number;
  recentPetitions: Petition[];
}

export default function AdminDashboard() {
  const {
    user,
    userProfile,
    loading: authLoading,
    hasRequiredRole,
  } = useAdminGuard();
  const [stats, setStats] = useState<AdminStats>({
    totalPetitions: 0,
    pendingPetitions: 0,
    approvedPetitions: 0,
    pausedPetitions: 0,
    totalUsers: 0,
    totalSignatures: 0,
    recentPetitions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!authLoading && hasRequiredRole) {
      loadAdminStats();
    }
  }, [authLoading, hasRequiredRole]);

  const loadAdminStats = async () => {
    try {
      setLoading(true);
      setError('');

      // Load petition statistics
      const petitionsRef = collection(db, 'petitions');
      const [
        allPetitions,
        pendingPetitions,
        approvedPetitions,
        pausedPetitions,
        recentPetitions,
        allUsers,
      ] = await Promise.all([
        getDocs(query(petitionsRef)),
        getDocs(query(petitionsRef, where('status', '==', 'pending'))),
        getDocs(query(petitionsRef, where('status', '==', 'approved'))),
        getDocs(query(petitionsRef, where('status', '==', 'paused'))),
        getDocs(query(petitionsRef, orderBy('createdAt', 'desc'), limit(5))),
        getDocs(collection(db, 'users')),
      ]);

      // Calculate total signatures
      let totalSignatures = 0;
      const recentPetitionsList: Petition[] = [];

      allPetitions.forEach((doc) => {
        const petition = { id: doc.id, ...doc.data() } as Petition;
        totalSignatures += petition.currentSignatures || 0;
      });

      recentPetitions.forEach((doc) => {
        const petition = { id: doc.id, ...doc.data() } as Petition;
        petition.createdAt = petition.createdAt?.toDate?.() || new Date();
        petition.updatedAt = petition.updatedAt?.toDate?.() || new Date();
        recentPetitionsList.push(petition);
      });

      setStats({
        totalPetitions: allPetitions.size,
        pendingPetitions: pendingPetitions.size,
        approvedPetitions: approvedPetitions.size,
        pausedPetitions: pausedPetitions.size,
        totalUsers: allUsers.size,
        totalSignatures,
        recentPetitions: recentPetitionsList,
      });
    } catch (err: any) {
      console.error('Error loading admin stats:', err);
      setError('Failed to load admin statistics');
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
    return null; // Will redirect via useAdminGuard
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage petitions, users, and platform statistics
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <a href="/admin/petitions">Manage Petitions</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/admin/users">Manage Users</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/admin/moderators">Manage Moderators</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/admin/analytics">View Analytics</a>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <p className="text-red-600">{error}</p>
            <Button onClick={loadAdminStats} className="mt-4" variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
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
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Petitions
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalPetitions}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
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
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Pending Review
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.pendingPetitions}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Users
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalUsers}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
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
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Signatures
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalSignatures.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Petitions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Petitions</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.recentPetitions.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No recent petitions
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {stats.recentPetitions.map((petition) => (
                        <div
                          key={petition.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 truncate">
                              {petition.title}
                            </h4>
                            <div className="flex items-center gap-4 mt-1">
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
                              <span className="text-sm text-gray-500">
                                {petition.currentSignatures} signatures
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/admin/petitions/${petition.id}`}>
                              Review
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Platform Status
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Operational
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Database
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Storage
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Payments
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
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
