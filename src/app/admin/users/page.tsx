'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminGuard } from '@/lib/auth-guards';
import {
  collection,
  query,
  getDocs,
  orderBy,
  updateDoc,
  doc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/types/petition';

export default function AdminUsersPage() {
  const {
    user,
    userProfile,
    loading: authLoading,
    hasRequiredRole,
  } = useAdminGuard();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<
    'all' | 'active' | 'inactive' | 'moderators'
  >('all');
  const [actionLoading, setActionLoading] = useState<string>('');

  useEffect(() => {
    if (!authLoading && hasRequiredRole) {
      loadUsers();
    }
  }, [authLoading, hasRequiredRole, filter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const usersRef = collection(db, 'users');
      let usersQuery;

      switch (filter) {
        case 'active':
          usersQuery = query(
            usersRef,
            where('isActive', '==', true),
            orderBy('createdAt', 'desc')
          );
          break;
        case 'inactive':
          usersQuery = query(
            usersRef,
            where('isActive', '==', false),
            orderBy('createdAt', 'desc')
          );
          break;
        case 'moderators':
          usersQuery = query(
            usersRef,
            where('role', 'in', ['moderator', 'admin']),
            orderBy('createdAt', 'desc')
          );
          break;
        default:
          usersQuery = query(usersRef, orderBy('createdAt', 'desc'));
      }

      const snapshot = await getDocs(usersQuery);
      const usersList: User[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const userData = {
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as any)?.toDate?.() || new Date(),
          updatedAt: (data.updatedAt as any)?.toDate?.() || new Date(),
          lastLoginAt: (data.lastLoginAt as any)?.toDate?.(),
        } as User;
        usersList.push(userData);
      });

      setUsers(usersList);
    } catch (err: any) {
      console.error('Error loading users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (
    userId: string,
    action: 'activate' | 'deactivate' | 'promote' | 'demote'
  ) => {
    if (!userProfile) return;

    try {
      setActionLoading(userId);

      const userRef = doc(db, 'users', userId);
      const updateData: any = {
        updatedAt: new Date(),
      };

      switch (action) {
        case 'activate':
          updateData.isActive = true;
          break;
        case 'deactivate':
          updateData.isActive = false;
          break;
        case 'promote':
          updateData.role = 'moderator';
          break;
        case 'demote':
          updateData.role = 'user';
          break;
      }

      await updateDoc(userRef, updateData);

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updateData } : u))
      );

      // Reload if filtering by status
      if (filter !== 'all') {
        loadUsers();
      }
    } catch (err: any) {
      console.error(`Error ${action}ing user:`, err);
      alert(`Failed to ${action} user. Please try again.`);
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
    return null; // Will redirect via useAdminGuard
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
            User Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage user accounts and permissions
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Users', count: users.length },
                {
                  key: 'active',
                  label: 'Active',
                  count: users.filter((u) => u.isActive).length,
                },
                {
                  key: 'inactive',
                  label: 'Inactive',
                  count: users.filter((u) => !u.isActive).length,
                },
                {
                  key: 'moderators',
                  label: 'Staff',
                  count: users.filter((u) =>
                    ['moderator', 'admin'].includes(u.role)
                  ).length,
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
            {[...Array(5)].map((_, i) => (
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
            <Button onClick={loadUsers} className="mt-4" variant="outline">
              Try Again
            </Button>
          </div>
        ) : users.length === 0 ? (
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-600">
                No users match the current filter criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {users.map((userData) => (
              <Card key={userData.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-medium text-lg">
                          {userData.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {userData.name}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              userData.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : userData.role === 'moderator'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {userData.role}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              userData.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {userData.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-600">{userData.email}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>
                            Joined: {userData.createdAt.toLocaleDateString()}
                          </span>
                          {userData.lastLoginAt && (
                            <span>
                              Last login:{' '}
                              {userData.lastLoginAt.toLocaleDateString()}
                            </span>
                          )}
                          <div className="flex items-center gap-2">
                            {userData.verifiedEmail && (
                              <span className="inline-flex items-center text-green-600">
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Email
                              </span>
                            )}
                            {userData.verifiedPhone && (
                              <span className="inline-flex items-center text-green-600">
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Phone
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {userData.id !== userProfile?.id && (
                        <>
                          {userData.isActive ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (
                                  confirm(
                                    'Are you sure you want to deactivate this user?'
                                  )
                                ) {
                                  handleUserAction(userData.id, 'deactivate');
                                }
                              }}
                              disabled={actionLoading === userData.id}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleUserAction(userData.id, 'activate')
                              }
                              disabled={actionLoading === userData.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Activate
                            </Button>
                          )}

                          {userData.role === 'user' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (
                                  confirm(
                                    'Are you sure you want to promote this user to moderator?'
                                  )
                                ) {
                                  handleUserAction(userData.id, 'promote');
                                }
                              }}
                              disabled={actionLoading === userData.id}
                            >
                              Promote to Moderator
                            </Button>
                          ) : userData.role === 'moderator' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (
                                  confirm(
                                    'Are you sure you want to demote this moderator to user?'
                                  )
                                ) {
                                  handleUserAction(userData.id, 'demote');
                                }
                              }}
                              disabled={actionLoading === userData.id}
                            >
                              Demote to User
                            </Button>
                          ) : null}
                        </>
                      )}

                      {userData.id === userProfile?.id && (
                        <span className="text-sm text-gray-500 px-3 py-1 bg-gray-100 rounded-md">
                          You
                        </span>
                      )}

                      {actionLoading === userData.id && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
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
