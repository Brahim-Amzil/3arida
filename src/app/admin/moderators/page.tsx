'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
  type QueryDocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MODERATORS_PAGE_USER_LIST_SIZE } from '@/lib/firestore-page-sizes';
import { useAuth } from '@/components/auth/AuthProvider';
import { useTranslation } from '@/hooks/useTranslation';
import Header from '@/components/layout/HeaderWrapper';
import AdminNav from '@/components/admin/AdminNav';
import ModeratorInvitations from '@/components/admin/ModeratorInvitations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types/petition';

export default function ModeratorsPage() {
  const router = useRouter();
  const { userProfile, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [moderators, setModerators] = useState<User[]>([]);
  const [regularUsers, setRegularUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMoreUsers, setLoadingMoreUsers] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    moderatorTotal: 0,
    activeModerators: 0,
    regularUsersTotal: 0,
  });
  const [hasMoreRegularUsers, setHasMoreRegularUsers] = useState(false);
  const lastRegularUserDocRef =
    useRef<QueryDocumentSnapshot<DocumentData> | null>(null);

  const loadStats = useCallback(async () => {
    const usersRef = collection(db, 'users');
    const [modTotal, modActive, userTotal] = await Promise.all([
      getCountFromServer(query(usersRef, where('role', '==', 'moderator'))),
      getCountFromServer(
        query(
          usersRef,
          where('role', '==', 'moderator'),
          where('isActive', '==', true),
        ),
      ),
      getCountFromServer(query(usersRef, where('role', '==', 'user'))),
    ]);
    setStats({
      moderatorTotal: modTotal.data().count,
      activeModerators: modActive.data().count,
      regularUsersTotal: userTotal.data().count,
    });
  }, []);

  const loadModerators = useCallback(async () => {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('role', '==', 'moderator'),
      orderBy('createdAt', 'desc'),
      limit(500),
    );
    const snap = await getDocs(q);
    const list: User[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.(),
        lastLoginAt: data.lastLoginAt?.toDate?.(),
      } as User;
    });
    setModerators(list);
  }, []);

  const loadRegularUsers = useCallback(
    async (mode: 'replace' | 'append' = 'replace') => {
      const usersRef = collection(db, 'users');
      const pageSize = MODERATORS_PAGE_USER_LIST_SIZE;

      if (mode === 'append') {
        if (!lastRegularUserDocRef.current) {
          setLoadingMoreUsers(false);
          return;
        }
        setLoadingMoreUsers(true);
      } else {
        lastRegularUserDocRef.current = null;
      }

      const baseConstraints = [
        where('role', '==', 'user'),
        orderBy('createdAt', 'desc'),
      ];
      const constraints =
        mode === 'append' && lastRegularUserDocRef.current
          ? [
              ...baseConstraints,
              startAfter(lastRegularUserDocRef.current),
              limit(pageSize),
            ]
          : [...baseConstraints, limit(pageSize)];

      const snap = await getDocs(query(usersRef, ...constraints));
      const list: User[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.(),
          lastLoginAt: data.lastLoginAt?.toDate?.(),
        } as User;
      });

      lastRegularUserDocRef.current =
        snap.docs.length > 0
          ? (snap.docs[snap.docs.length - 1] ?? null)
          : null;
      setHasMoreRegularUsers(snap.docs.length === pageSize);

      if (mode === 'append') {
        setRegularUsers((prev) => {
          const seen = new Set(prev.map((u) => u.id));
          const merged = [...prev];
          for (const u of list) {
            if (!seen.has(u.id)) {
              seen.add(u.id);
              merged.push(u);
            }
          }
          return merged;
        });
        setLoadingMoreUsers(false);
      } else {
        setRegularUsers(list);
      }
    },
    [],
  );

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      await Promise.all([loadStats(), loadModerators(), loadRegularUsers('replace')]);
    } catch (err) {
      console.error('Error loading users:', err);
      setError(t('admin.moderators.failedToLoad'));
    } finally {
      setLoading(false);
    }
  }, [loadStats, loadModerators, loadRegularUsers, t]);

  useEffect(() => {
    if (!authLoading && userProfile?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [authLoading, userProfile, router]);

  useEffect(() => {
    if (userProfile?.role === 'admin') {
      void loadAll();
    }
  }, [userProfile, loadAll]);

  const handlePromoteToModerator = async (userId: string) => {
    if (!confirm(t('admin.users.confirmPromote'))) {
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        role: 'moderator',
        updatedAt: new Date(),
      });
      await loadAll();
    } catch (err) {
      console.error('Error promoting user:', err);
      alert(t('admin.moderators.failedToPromote'));
    }
  };

  const handleDemoteToUser = async (userId: string) => {
    if (!confirm(t('admin.users.confirmDemote'))) {
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        role: 'user',
        updatedAt: new Date(),
      });
      await loadAll();
    } catch (err) {
      console.error('Error demoting moderator:', err);
      alert(t('admin.moderators.failedToDemote'));
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (userProfile?.role !== 'admin') {
    return null;
  }

  const filteredModerators = moderators.filter(
    (mod) =>
      mod.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredUsers = regularUsers.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('admin.moderators.title')}
          </h1>
          <p className="text-gray-600">{t('admin.moderators.subtitle')}</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
            <Button className="mt-2" variant="outline" onClick={() => void loadAll()}>
              Retry
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {t('admin.moderators.totalModerators')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.moderatorTotal}
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {t('admin.moderators.activeModerators')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeModerators}
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {t('admin.moderators.regularUsers')}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.regularUsersTotal}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder={t('admin.moderators.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <ModeratorInvitations currentUserEmail={userProfile?.email} />

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('admin.moderators.currentModerators')}</CardTitle>
            <p className="text-xs text-gray-500 mt-1">
              Showing up to 500 moderators (by creation date). Total above is exact.
            </p>
          </CardHeader>
          <CardContent>
            {filteredModerators.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                {t('admin.moderators.noModerators')}
              </p>
            ) : (
              <div className="space-y-4">
                {filteredModerators.map((moderator) => (
                  <div
                    key={moderator.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-lg">
                          {(moderator.name || moderator.email || 'M')
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {moderator.name || moderator.email || 'Unknown'}
                        </h3>
                        <p className="text-sm text-gray-600">{moderator.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {t('admin.roles.moderator')}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              moderator.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {moderator.isActive
                              ? t('admin.userStatus.active')
                              : t('admin.userStatus.inactive')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleDemoteToUser(moderator.id)}
                    >
                      {t('admin.users.demoteToUser')}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.moderators.regularUsers')}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {t('admin.moderators.promoteUsersDesc')}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Users load in batches ({MODERATORS_PAGE_USER_LIST_SIZE}); use search within loaded rows or load more.
            </p>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                {t('admin.moderators.noUsersFound')}
              </p>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-lg">
                          {(u.name || u.email || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {u.name || u.email || 'Unknown'}
                        </h3>
                        <p className="text-sm text-gray-600">{u.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {t('admin.roles.user')}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              u.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {u.isActive
                              ? t('admin.userStatus.active')
                              : t('admin.userStatus.inactive')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => handlePromoteToModerator(u.id)}>
                      {t('admin.users.promoteToModerator')}
                    </Button>
                  </div>
                ))}
                {hasMoreRegularUsers && (
                  <div className="pt-4 text-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void loadRegularUsers('append')}
                      disabled={loadingMoreUsers}
                    >
                      {loadingMoreUsers
                        ? 'Loading…'
                        : `Load more users (${MODERATORS_PAGE_USER_LIST_SIZE})`}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
