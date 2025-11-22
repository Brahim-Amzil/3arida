'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/HeaderWrapper';
import AdminNav from '@/components/admin/AdminNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminGuard } from '@/lib/auth-guards';
import { getAuditLogs, AuditLogEntry } from '@/lib/audit-log';

export default function AdminActivityPage() {
  const {
    user,
    userProfile,
    loading: authLoading,
    hasRequiredRole,
  } = useAdminGuard();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterModerator, setFilterModerator] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && hasRequiredRole) {
      loadLogs();
    }
  }, [authLoading, hasRequiredRole]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const auditLogs = await getAuditLogs({ limitCount: 200 });
      setLogs(auditLogs);
    } catch (err: any) {
      console.error('Error loading audit logs:', err);
      setError('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AdminNav />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (!hasRequiredRole) {
    return null;
  }

  // Get unique moderators for filter
  const uniqueModerators = Array.from(
    new Set(logs.map((log) => log.actorName))
  ).sort();

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    if (filterAction !== 'all' && log.action !== filterAction) return false;
    if (filterModerator !== 'all' && log.actorName !== filterModerator)
      return false;
    return true;
  });

  const getActionColor = (action: string) => {
    if (action.includes('approved')) return 'text-green-600 bg-green-50';
    if (action.includes('rejected')) return 'text-red-600 bg-red-50';
    if (action.includes('paused')) return 'text-orange-600 bg-orange-50';
    if (action.includes('deleted')) return 'text-gray-600 bg-gray-50';
    if (action.includes('promoted')) return 'text-blue-600 bg-blue-50';
    if (action.includes('demoted')) return 'text-purple-600 bg-purple-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getActionLabel = (action: string) => {
    return action
      .split('.')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Activity Log
          </h1>
          <p className="text-lg text-gray-600">
            Track all moderator and admin actions
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Action
                </label>
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Actions</option>
                  <option value="petition.approved">Petition Approved</option>
                  <option value="petition.rejected">Petition Rejected</option>
                  <option value="petition.paused">Petition Paused</option>
                  <option value="petition.deleted">Petition Deleted</option>
                  <option value="petition.archived">Petition Archived</option>
                  <option value="user.promoted_to_moderator">
                    User Promoted
                  </option>
                  <option value="user.demoted_from_moderator">
                    User Demoted
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Moderator
                </label>
                <select
                  value={filterModerator}
                  onChange={(e) => setFilterModerator(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Moderators</option>
                  {uniqueModerators.map((mod) => (
                    <option key={mod} value={mod}>
                      {mod}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setFilterAction('all');
                    setFilterModerator('all');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Total Actions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {filteredLogs.length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Approvals</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {
                  filteredLogs.filter((l) => l.action === 'petition.approved')
                    .length
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">Rejections</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {
                  filteredLogs.filter((l) => l.action === 'petition.rejected')
                    .length
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">
                Active Moderators
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {uniqueModerators.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadLogs} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No activity logs found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* Timestamp */}
                    <div className="flex-shrink-0 text-sm text-gray-500 w-32">
                      {log.timestamp instanceof Date
                        ? log.timestamp.toLocaleString()
                        : new Date(log.timestamp).toLocaleString()}
                    </div>

                    {/* Action Badge */}
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getActionColor(
                          log.action
                        )}`}
                      >
                        {getActionLabel(log.action)}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {log.actorName}
                        <span className="text-gray-500 font-normal ml-2">
                          ({log.actorRole})
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {log.targetType === 'petition' && (
                          <>
                            Petition:{' '}
                            <Link
                              href={`/petitions/${log.targetId}`}
                              className="text-green-600 hover:underline"
                            >
                              {log.targetName || log.targetId}
                            </Link>
                          </>
                        )}
                        {log.targetType === 'user' && (
                          <>User: {log.targetName || log.targetId}</>
                        )}
                      </p>
                      {log.details?.reason && (
                        <p className="text-sm text-gray-500 mt-1 italic">
                          Reason: {log.details.reason}
                        </p>
                      )}
                      {log.details?.oldValue && log.details?.newValue && (
                        <p className="text-xs text-gray-400 mt-1">
                          Changed from{' '}
                          <span className="font-medium">
                            {log.details.oldValue}
                          </span>{' '}
                          to{' '}
                          <span className="font-medium">
                            {log.details.newValue}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* View Link */}
                    {log.targetType === 'petition' && (
                      <div className="flex-shrink-0">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/petitions/${log.targetId}`}>View</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
