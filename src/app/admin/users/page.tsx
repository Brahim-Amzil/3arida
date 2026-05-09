'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/HeaderWrapper';
import AdminNav from '@/components/admin/AdminNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminGuard } from '@/lib/auth-guards';
import { useTranslation } from '@/hooks/useTranslation';
import {
  collection,
  query,
  getDocs,
  getCountFromServer,
  orderBy,
  updateDoc,
  doc,
  where,
  limit,
  startAfter,
  type QueryDocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ADMIN_USERS_PAGE_SIZE } from '@/lib/firestore-page-sizes';
import { User } from '@/types/petition';

export default function AdminUsersPage() {
  const {
    user,
    userProfile,
    loading: authLoading,
    hasRequiredRole,
  } = useAdminGuard();
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<
    'all' | 'active' | 'inactive' | 'moderators'
  >('all');
  const [actionLoading, setActionLoading] = useState<string>('');
  const [hasMoreUsers, setHasMoreUsers] = useState(false);
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    active: 0,
    inactive: 0,
    moderators: 0,
  });
  const lastUserDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(
    null,
  );

  const loadTabCounts = useCallback(async () => {
    const usersRef = collection(db, 'users');
    const [allSnap, activeSnap, inactiveSnap, modSnap] = await Promise.all([
      getCountFromServer(usersRef),
      getCountFromServer(
        query(usersRef, where('isActive', '==', true)),
      ),
      getCountFromServer(
        query(usersRef, where('isActive', '==', false)),
      ),
      getCountFromServer(
        query(usersRef, where('role', 'in', ['moderator', 'admin'])),
      ),
    ]);
    setTabCounts({
      all: allSnap.data().count,
      active: activeSnap.data().count,
      inactive: inactiveSnap.data().count,
      moderators: modSnap.data().count,
    });
  }, []);

  const loadUsers = useCallback(
    async (mode: 'replace' | 'append' = 'replace') => {
      try {
        if (mode === 'replace') {
          setLoading(true);
          lastUserDocRef.current = null;
        } else {
          if (!lastUserDocRef.current) {
            setLoadingMore(false);
            return;
          }
          setLoadingMore(true);
        }
        setError('');

        const usersRef = collection(db, 'users');
        const pageSize = ADMIN_USERS_PAGE_SIZE;

        const constraints = [];
        switch (filter) {
          case 'active':
            constraints.push(where('isActive', '==', true));
            constraints.push(orderBy('createdAt', 'desc'));
            break;
          case 'inactive':
            constraints.push(where('isActive', '==', false));
            constraints.push(orderBy('createdAt', 'desc'));
            break;
          case 'moderators':
            constraints.push(where('role', 'in', ['moderator', 'admin']));
            constraints.push(orderBy('createdAt', 'desc'));
            break;
          default:
            constraints.push(orderBy('createdAt', 'desc'));
        }
        if (mode === 'append' && lastUserDocRef.current) {
          constraints.push(startAfter(lastUserDocRef.current));
        }
        constraints.push(limit(pageSize));

        const snapshot = await getDocs(query(usersRef, ...constraints));
        const usersList: User[] = [];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const userData = {
            id: docSnap.id,
            ...data,
            createdAt: (data.createdAt as { toDate?: () => Date })?.toDate?.() || new Date(),
            updatedAt: (data.updatedAt as { toDate?: () => Date })?.toDate?.() || new Date(),
            lastLoginAt: (data.lastLoginAt as { toDate?: () => Date })?.toDate?.(),
          } as User;
          usersList.push(userData);
        });

        lastUserDocRef.current =
          snapshot.docs.length > 0
            ? (snapshot.docs[snapshot.docs.length - 1] ?? null)
            : null;
        setHasMoreUsers(snapshot.docs.length === pageSize);

        if (mode === 'append') {
          setUsers((prev) => {
            const seen = new Set(prev.map((u) => u.id));
            const merged = [...prev];
            for (const u of usersList) {
              if (!seen.has(u.id)) {
                seen.add(u.id);
                merged.push(u);
              }
            }
            return merged;
          });
        } else {
          setUsers(usersList);
        }
      } catch (err: unknown) {
        console.error('Error loading users:', err);
        setError(t('admin.users.failedToLoad'));
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filter, t],
  );

  useEffect(() => {
    if (!authLoading && hasRequiredRole) {
      void loadTabCounts();
    }
  }, [authLoading, hasRequiredRole, loadTabCounts]);

  useEffect(() => {
    if (!authLoading && hasRequiredRole) {
      void loadUsers('replace');
    }
  }, [authLoading, hasRequiredRole, filter, loadUsers]);

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

      void loadTabCounts();
      if (filter !== 'all') {
        void loadUsers('replace');
      }
    } catch (err: any) {
      console.error(`Error ${action}ing user:`, err);
      alert(t('admin.users.failedAction', { action }));
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
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('admin.users.title')}
          </h1>
          <p className="text-lg text-gray-600">{t('admin.users.subtitle')}</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                {
                  key: 'all',
                  label: t('admin.users.allUsers'),
                  count: tabCounts.all,
                },
                {
                  key: 'active',
                  label: t('admin.users.active'),
                  count: tabCounts.active,
                },
                {
                  key: 'inactive',
                  label: t('admin.users.inactive'),
                  count: tabCounts.inactive,
                },
                {
                  key: 'moderators',
                  label: t('admin.users.staff'),
                  count: tabCounts.moderators,
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
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {tab.count}
                  </span>
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
            <Button
              onClick={() => {
                void loadTabCounts();
                void loadUsers('replace');
              }}
              className="mt-4"
              variant="outline"
            >
              {t('admin.users.tryAgain')}
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
                {t('admin.users.noUsers')}
              </h3>
              <p className="text-gray-600">{t('admin.users.noUsersDesc')}</p>
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
                          {(userData.name || userData.email || 'U')
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {userData.name || userData.email || 'Unknown User'}
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
                            {t(`admin.roles.${userData.role}`)}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              userData.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {userData.isActive
                              ? t('admin.userStatus.active')
                              : t('admin.userStatus.inactive')}
                          </span>
                        </div>
                        <p className="text-gray-600">{userData.email}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>
                            {t('admin.users.joined')}{' '}
                            {userData.createdAt.toLocaleDateString()}
                          </span>
                          {userData.lastLoginAt && (
                            <span>
                              {t('admin.users.lastLogin')}{' '}
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
                                {t('admin.users.email')}
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
                                {t('admin.users.phone')}
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
                                  confirm(t('admin.users.confirmDeactivate'))
                                ) {
                                  handleUserAction(userData.id, 'deactivate');
                                }
                              }}
                              disabled={actionLoading === userData.id}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              {t('admin.users.deactivate')}
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
                              {t('admin.users.activate')}
                            </Button>
                          )}

                          {userData.role === 'user' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (confirm(t('admin.users.confirmPromote'))) {
                                  handleUserAction(userData.id, 'promote');
                                }
                              }}
                              disabled={actionLoading === userData.id}
                            >
                              {t('admin.users.promoteToModerator')}
                            </Button>
                          ) : userData.role === 'moderator' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (confirm(t('admin.users.confirmDemote'))) {
                                  handleUserAction(userData.id, 'demote');
                                }
                              }}
                              disabled={actionLoading === userData.id}
                            >
                              {t('admin.users.demoteToUser')}
                            </Button>
                          ) : null}
                        </>
                      )}

                      {userData.id === userProfile?.id && (
                        <span className="text-sm text-gray-500 px-3 py-1 bg-gray-100 rounded-md">
                          {t('admin.users.you')}
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
            {hasMoreUsers && (
              <div className="mt-6 flex flex-col items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void loadUsers('append')}
                  disabled={loadingMore}
                >
                  {loadingMore
                    ? 'Loading…'
                    : `Load more (${ADMIN_USERS_PAGE_SIZE} per batch)`}
                </Button>
                <p className="text-xs text-gray-500 text-center max-w-md">
                  Tab numbers are full totals. This list loads in batches to
                  limit Firestore reads.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
