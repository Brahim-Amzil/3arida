'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Appeal, AppealStatus } from '@/types/appeal';
import { useAuth } from '@/components/auth/AuthProvider';

export default function CreatorAppealsSection() {
  const { user } = useAuth();
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [allAppeals, setAllAppeals] = useState<Appeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<AppealStatus | 'all'>('all');

  useEffect(() => {
    if (user) {
      loadAppeals();
    }
  }, [user]);

  useEffect(() => {
    if (allAppeals.length > 0) {
      filterAppeals();
    }
  }, [statusFilter, allAppeals]);

  const filterAppeals = () => {
    if (statusFilter === 'all') {
      setAppeals(allAppeals);
    } else {
      setAppeals(allAppeals.filter((a) => a.status === statusFilter));
    }
  };

  const loadAppeals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      // Use client SDK directly instead of API route
      const { getAppealsForUser } = await import('@/lib/appeals-service');
      const fetchedAppeals = await getAppealsForUser(user.uid, 'user');

      setAllAppeals(fetchedAppeals);
      setAppeals(fetchedAppeals);
    } catch (err) {
      console.error('Error loading appeals:', err);
      // Gracefully handle errors - just show empty state
      setError('');
      setAllAppeals([]);
      setAppeals([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: AppealStatus) => {
    const statusConfig = {
      pending: {
        label: 'قيد الانتظار',
        variant: 'default' as const,
        className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      },
      'in-progress': {
        label: 'قيد المعالجة',
        variant: 'default' as const,
        className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      },
      resolved: {
        label: 'تم الحل',
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 hover:bg-green-100',
      },
      rejected: {
        label: 'مرفوض',
        variant: 'default' as const,
        className: 'bg-red-100 text-red-800 hover:bg-red-100',
      },
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ar-MA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>طلبات الاستئناف</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>طلبات الاستئناف</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadAppeals}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              حاول مرة أخرى
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (appeals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>طلبات الاستئناف</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
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
            <p className="mt-4 text-gray-600">لا توجد طلبات استئناف</p>
            <p className="mt-2 text-sm text-gray-500">
              يمكنك تقديم طلب استئناف للعرائض الموقوفة أو المرفوضة
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate status counts
  const statusCounts = {
    all: allAppeals.length,
    pending: allAppeals.filter((a) => a.status === 'pending').length,
    'in-progress': allAppeals.filter((a) => a.status === 'in-progress').length,
    resolved: allAppeals.filter((a) => a.status === 'resolved').length,
    rejected: allAppeals.filter((a) => a.status === 'rejected').length,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>طلبات الاستئناف</CardTitle>
          <Badge variant="secondary">{appeals.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Status Filter Buttons */}
        {allAppeals.length > 0 && (
          <div className="mb-6 pb-4 border-b">
            <p className="text-sm font-medium text-gray-700 mb-3">
              تصفية حسب الحالة
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                الكل ({statusCounts.all})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                قيد الانتظار ({statusCounts.pending})
              </button>
              <button
                onClick={() => setStatusFilter('in-progress')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  statusFilter === 'in-progress'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                قيد المعالجة ({statusCounts['in-progress']})
              </button>
              <button
                onClick={() => setStatusFilter('resolved')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  statusFilter === 'resolved'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                تم الحل ({statusCounts.resolved})
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  statusFilter === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                مرفوض ({statusCounts.rejected})
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {appeals.map((appeal) => (
            <Link
              key={appeal.id}
              href={`/dashboard/appeals/${appeal.id}`}
              className="block"
            >
              <div className="border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {appeal.petitionTitle}
                    </h3>
                    <p className="text-sm text-gray-600">
                      رقم الطلب: {appeal.id.substring(0, 8)}...
                    </p>
                  </div>
                  {getStatusBadge(appeal.status)}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
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
                      {appeal.messages.length} رسالة
                    </span>
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(appeal.createdAt)}
                    </span>
                  </div>

                  {/* Unread indicator */}
                  {appeal.messages.length > 1 &&
                    appeal.messages[appeal.messages.length - 1].senderRole ===
                      'moderator' && (
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        رد جديد
                      </span>
                    )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
