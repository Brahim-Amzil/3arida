'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/HeaderWrapper';
import AdminNav from '@/components/admin/AdminNav';
import AppealThreadView from '@/components/appeals/AppealThreadView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useModeratorGuard } from '@/lib/auth-guards';
import { Appeal, AppealStatus } from '@/types/appeal';

export default function AdminAppealDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    user,
    userProfile,
    loading: authLoading,
    hasRequiredRole,
  } = useModeratorGuard();
  const [appeal, setAppeal] = useState<Appeal | null>(null);
  const [petition, setPetition] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [internalNote, setInternalNote] = useState('');
  const [showInternalNotes, setShowInternalNotes] = useState(false);

  useEffect(() => {
    if (!authLoading && hasRequiredRole && user) {
      loadAppeal();
    }
  }, [authLoading, hasRequiredRole, user, params.id]);

  const loadAppeal = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `/api/appeals/${params.id}?userId=${user.uid}&userRole=moderator`
      );

      if (!response.ok) {
        throw new Error('Failed to load appeal');
      }

      const data = await response.json();
      setAppeal(data.appeal);
      setPetition(data.petition);
    } catch (err) {
      console.error('Error loading appeal:', err);
      setError('Failed to load appeal details');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (message: string) => {
    if (!user || !userProfile) return;

    const response = await fetch(`/api/appeals/${params.id}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        userId: user.uid,
        userName: userProfile.name || user.displayName || 'Moderator',
        userRole: 'moderator',
        userEmail: user.email,
        isInternal: false,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to send reply');
    }

    await loadAppeal();
  };

  const handleInternalNote = async () => {
    if (!user || !userProfile || !internalNote.trim()) return;

    try {
      const response = await fetch(`/api/appeals/${params.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: internalNote.trim(),
          userId: user.uid,
          userName: userProfile.name || user.displayName || 'Moderator',
          userRole: 'moderator',
          userEmail: user.email,
          isInternal: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add internal note');
      }

      setInternalNote('');
      setShowInternalNotes(false);
      await loadAppeal();
    } catch (err) {
      console.error('Error adding internal note:', err);
      alert('Failed to add internal note');
    }
  };

  const handleStatusUpdate = async (
    newStatus: AppealStatus,
    reason?: string
  ) => {
    if (!user || !userProfile) return;

    if (newStatus === 'rejected' && !reason) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setStatusUpdateLoading(true);

      const response = await fetch(`/api/appeals/${params.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          reason,
          userId: user.uid,
          userName: userProfile.name || user.displayName || 'Moderator',
          userRole: 'moderator',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update status');
      }

      await loadAppeal();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update appeal status');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleResolve = () => {
    const reason = prompt('Resolution notes (optional):');
    if (reason !== null) {
      handleStatusUpdate('resolved', reason || undefined);
    }
  };

  const handleReject = () => {
    const reason = prompt('Rejection reason (required):');
    if (reason && reason.trim()) {
      handleStatusUpdate('rejected', reason.trim());
    } else if (reason !== null) {
      alert('Rejection reason is required');
    }
  };

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

  if (error || !appeal || !petition) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AdminNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              {error || 'Appeal not found'}
            </h2>
            <Link
              href="/admin/appeals"
              className="mt-6 inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Back to Appeals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <Link href="/admin" className="hover:text-green-600">
                Admin
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/admin/appeals" className="hover:text-green-600">
                Appeals
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">Appeal Details</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AppealThreadView
              appeal={appeal}
              petitionTitle={petition.title}
              petitionStatus={petition.status}
              onReply={handleReply}
              isCreator={false}
            />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/admin/petitions/${petition.id}`}>
                  <Button variant="outline" className="w-full">
                    View Petition in Admin
                  </Button>
                </Link>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-600 mb-2">
                    Export Appeal Data
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={`/api/appeals/${params.id}/export?userId=${user?.uid}&userRole=moderator&format=json`}
                      download
                    >
                      <Button variant="outline" size="sm" className="flex-1">
                        📄 JSON
                      </Button>
                    </a>
                    <a
                      href={`/api/appeals/${params.id}/export?userId=${user?.uid}&userRole=moderator&format=csv`}
                      download
                    >
                      <Button variant="outline" size="sm" className="flex-1">
                        📊 CSV
                      </Button>
                    </a>
                  </div>
                </div>

                {appeal.status !== 'resolved' &&
                  appeal.status !== 'rejected' && (
                    <>
                      <Button
                        onClick={handleResolve}
                        disabled={statusUpdateLoading}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        ✅ Resolve Appeal
                      </Button>
                      <Button
                        onClick={handleReject}
                        disabled={statusUpdateLoading}
                        variant="destructive"
                        className="w-full"
                      >
                        ❌ Reject Appeal
                      </Button>
                    </>
                  )}

                {(appeal.status === 'resolved' ||
                  appeal.status === 'rejected') && (
                  <Button
                    onClick={() => handleStatusUpdate('in-progress')}
                    disabled={statusUpdateLoading}
                    variant="outline"
                    className="w-full"
                  >
                    🔄 Reopen Appeal
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Internal Notes</CardTitle>
                <p className="text-xs text-gray-600">
                  Only visible to moderators
                </p>
              </CardHeader>
              <CardContent>
                {!showInternalNotes ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowInternalNotes(true)}
                    className="w-full"
                  >
                    + Add Internal Note
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      rows={4}
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      placeholder="Add a note for other moderators..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleInternalNote}
                        disabled={!internalNote.trim()}
                      >
                        Save Note
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowInternalNotes(false);
                          setInternalNote('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  {appeal.messages
                    .filter((msg) => msg.isInternal)
                    .map((note) => (
                      <div
                        key={note.id}
                        className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm"
                      >
                        <p className="font-medium text-yellow-900 text-xs mb-1">
                          {note.senderName} •{' '}
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-yellow-800">{note.content}</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Appeal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Creator</p>
                  <p className="font-medium">{appeal.creatorName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Creator Email</p>
                  <p className="font-medium">{appeal.creatorEmail}</p>
                </div>
                <div>
                  <p className="text-gray-600">Appeal ID</p>
                  <p className="font-mono text-xs">{appeal.id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Created</p>
                  <p className="font-medium">
                    {new Date(appeal.createdAt).toLocaleString()}
                  </p>
                </div>
                {appeal.resolvedAt && (
                  <div>
                    <p className="text-gray-600">Resolved</p>
                    <p className="font-medium">
                      {new Date(appeal.resolvedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
