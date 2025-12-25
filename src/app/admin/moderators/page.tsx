'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && userProfile?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [authLoading, userProfile, router]);

  useEffect(() => {
    if (userProfile?.role === 'admin') {
      loadUsers();
    }
  }, [userProfile]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.(),
        lastLoginAt: doc.data().lastLoginAt?.toDate?.(),
      })) as User[];
      setUsers(usersData);
    } catch (err) {
      console.error('Error loading users:', err);
      setError(t('admin.moderators.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToModerator = async (userId: string) => {
    if (!confirm(t('admin.users.confirmPromote'))) {
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        role: 'moderator',
        updatedAt: new Date(),
      });
      await loadUsers();
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
      await loadUsers();
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

  const moderators = users.filter((u) => u.role === 'moderator');
  const regularUsers = users.filter((u) => u.role === 'user');

  const filteredModerators = moderators.filter(
    (mod) =>
      mod.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = regularUsers.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
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

        {/* Stats */}
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
                    {moderators.length}
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
                    {moderators.filter((m) => m.isActive).length}
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
                    {regularUsers.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder={t('admin.moderators.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Moderator Invitations */}
        <ModeratorInvitations currentUserEmail={userProfile?.email} />

        {/* Current Moderators */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('admin.moderators.currentModerators')}</CardTitle>
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
                        <p className="text-sm text-gray-600">
                          {moderator.email}
                        </p>
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

        {/* Regular Users (Can be promoted) */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.moderators.regularUsers')}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {t('admin.moderators.promoteUsersDesc')}
            </p>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                {t('admin.moderators.noUsersFound')}
              </p>
            ) : (
              <div className="space-y-4">
                {filteredUsers.slice(0, 10).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-lg">
                          {(user.name || user.email || 'U')
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {user.name || user.email || 'Unknown'}
                        </h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {t('admin.roles.user')}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.isActive
                              ? t('admin.userStatus.active')
                              : t('admin.userStatus.inactive')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => handlePromoteToModerator(user.id)}>
                      {t('admin.users.promoteToModerator')}
                    </Button>
                  </div>
                ))}
                {filteredUsers.length > 10 && (
                  <p className="text-sm text-gray-600 text-center pt-4">
                    {t('admin.moderators.showingUsers', {
                      total: filteredUsers.length,
                    })}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
