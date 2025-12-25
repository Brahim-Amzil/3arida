'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/HeaderWrapper';
import AdminNav from '@/components/admin/AdminNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useModeratorGuard } from '@/lib/auth-guards';
import { useTranslation } from '@/hooks/useTranslation';
import { Appeal, AppealStatus } from '@/types/appeal';

export default function AdminAppealsPage() {
  const {
    user,
    userProfile,
    loading: authLoading,
    hasRequiredRole,
  } = useModeratorGuard();
  const { t } = useTranslation();
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [allAppeals, setAllAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<AppealStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (!authLoading && hasRequiredRole && user) {
      loadAppeals();
    }
  }, [authLoading, hasRequiredRole, user]);

  useEffect(() => {
    if (allAppeals.length > 0) {
      filterAppeals();
    }
  }, [statusFilter, searchQuery, allAppeals]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  const loadAppeals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `/api/appeals?userId=${user.uid}&userRole=moderator`
      );

      if (!response.ok) {
        throw new Error(t('appeals.failedToLoad'));
      }

      const data = await response.json();
      setAllAppeals(data.appeals || []);
      setAppeals(data.appeals || []);
    } catch (err) {
      console.error('Error loading appeals:', err);
      setError(t('appeals.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const filterAppeals = () => {
    let filtered = allAppeals;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.petitionTitle.toLowerCase().includes(searchLower) ||
          a.creatorName.toLowerCase().includes(searchLower) ||
          a.id.toLowerCase().includes(searchLower)
      );
    }

    setAppeals(filtered);
  };

  const getStatusBadge = (status: AppealStatus) => {
    const statusConfig = {
      pending: {
        label: t('appeals.status.pending'),
        className: 'bg-yellow-100 text-yellow-800',
      },
      'in-progress': {
        label: t('appeals.status.inProgress'),
        className: 'bg-blue-100 text-blue-800',
      },
      resolved: {
        label: t('appeals.status.resolved'),
        className: 'bg-green-100 text-green-800',
      },
      rejected: {
        label: t('appeals.status.rejected'),
        className: 'bg-red-100 text-red-800',
      },
    };

    const config = statusConfig[status];
    return (
      <Badge variant="default" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate status counts
  const statusCounts = {
    all: allAppeals.length,
    pending: allAppeals.filter((a) => a.status === 'pending').length,
    'in-progress': allAppeals.filter((a) => a.status === 'in-progress').length,
    resolved: allAppeals.filter((a) => a.status === 'resolved').length,
    rejected: allAppeals.filter((a) => a.status === 'rejected').length,
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppeals = appeals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(appeals.length / itemsPerPage);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AdminNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasRequiredRole) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
        {/* Page Header with Stats */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('appeals.title')}
              </h1>
              <p className="text-gray-600">{t('appeals.subtitle')}</p>
            </div>
          </div>

          {/* Stats Cards - Compact */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Card>
              <CardContent className="py-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {statusCounts.all}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {t('appeals.totalAppeals')}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {statusCounts.pending}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {t('appeals.pending')}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {statusCounts['in-progress']}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {t('appeals.inProgress')}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {statusCounts.resolved}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {t('appeals.resolved')}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {statusCounts.rejected}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {t('appeals.rejected')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Status Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('appeals.filterByStatus')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={statusFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('all')}
                    >
                      {t('appeals.filter.all', { count: statusCounts.all })}
                    </Button>
                    <Button
                      variant={
                        statusFilter === 'pending' ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setStatusFilter('pending')}
                    >
                      {t('appeals.filter.pending', {
                        count: statusCounts.pending,
                      })}
                    </Button>
                    <Button
                      variant={
                        statusFilter === 'in-progress' ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setStatusFilter('in-progress')}
                    >
                      {t('appeals.filter.inProgress', {
                        count: statusCounts['in-progress'],
                      })}
                    </Button>
                    <Button
                      variant={
                        statusFilter === 'resolved' ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setStatusFilter('resolved')}
                    >
                      {t('appeals.filter.resolved', {
                        count: statusCounts.resolved,
                      })}
                    </Button>
                    <Button
                      variant={
                        statusFilter === 'rejected' ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setStatusFilter('rejected')}
                    >
                      {t('appeals.filter.rejected', {
                        count: statusCounts.rejected,
                      })}
                    </Button>
                  </div>
                </div>

                {/* Search */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('appeals.search')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('appeals.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appeals List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t('appeals.appealsCount', { count: appeals.length })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="text-center py-8">
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={loadAppeals}
                    className="mt-4 text-sm text-blue-600 hover:underline"
                  >
                    {t('appeals.tryAgain')}
                  </button>
                </div>
              )}

              {!error && appeals.length === 0 && (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <p className="mt-4 text-gray-600">
                    {t('appeals.noAppealsFound')}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    {statusFilter !== 'all'
                      ? t('appeals.tryChangingFilter')
                      : t('appeals.noAppealsMessage')}
                  </p>
                </div>
              )}

              {!error && currentAppeals.length > 0 && (
                <div className="space-y-4">
                  {currentAppeals.map((appeal) => (
                    <Link
                      key={appeal.id}
                      href={`/admin/appeals/${appeal.id}`}
                      className="block"
                    >
                      <div className="border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {appeal.petitionTitle}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {t('appeals.creator')} {appeal.creatorName}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {t('appeals.appealId')}{' '}
                              {appeal.id.substring(0, 12)}...
                            </p>
                          </div>
                          {getStatusBadge(appeal.status)}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
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
                                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                              </svg>
                              {appeal.messages.length} {t('appeals.messages')}
                            </span>
                            <span>{formatDate(appeal.createdAt)}</span>
                          </div>

                          {/* Unread indicator */}
                          {appeal.messages.length > 0 &&
                            appeal.messages[appeal.messages.length - 1]
                              .senderRole === 'creator' &&
                            appeal.status !== 'resolved' &&
                            appeal.status !== 'rejected' && (
                              <span className="flex items-center gap-1 text-orange-600 font-medium">
                                <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                                {t('appeals.needsResponse')}
                              </span>
                            )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600">
                    {t('appeals.showingResults', {
                      start: indexOfFirstItem + 1,
                      end: Math.min(indexOfLastItem, appeals.length),
                      total: appeals.length,
                    })}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      {t('appeals.previous')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      {t('appeals.next')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
