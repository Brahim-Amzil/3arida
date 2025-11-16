'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Clock } from 'lucide-react';

interface PetitionUpdate {
  id: string;
  petitionId: string;
  title: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  createdByName: string;
}

interface PetitionUpdatesProps {
  petitionId: string;
  isCreator: boolean;
}

export default function PetitionUpdates({
  petitionId,
  isCreator,
}: PetitionUpdatesProps) {
  const [updates, setUpdates] = useState<PetitionUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUpdate, setNewUpdate] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUpdates();
  }, [petitionId]);

  const fetchUpdates = async () => {
    try {
      const { collection, query, where, orderBy, getDocs } = await import(
        'firebase/firestore'
      );
      const { db } = await import('@/lib/firebase');

      const updatesRef = collection(db, 'petitionUpdates');
      const q = query(
        updatesRef,
        where('petitionId', '==', petitionId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const updatesData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as PetitionUpdate;
      });

      setUpdates(updatesData);
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUpdate.title.trim() || !newUpdate.content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const { collection, addDoc, serverTimestamp } = await import(
        'firebase/firestore'
      );
      const { db, auth } = await import('@/lib/firebase');

      const user = auth.currentUser;
      if (!user) {
        alert('You must be logged in to post updates');
        return;
      }

      await addDoc(collection(db, 'petitionUpdates'), {
        petitionId,
        title: newUpdate.title.trim(),
        content: newUpdate.content.trim(),
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        createdByName: user.displayName || 'Anonymous',
      });

      setNewUpdate({ title: '', content: '' });
      setShowAddForm(false);
      await fetchUpdates();
    } catch (error) {
      console.error('Error adding update:', error);
      alert('Failed to add update. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Updates</h2>
          {isCreator && !showAddForm && (
            <Button
              onClick={() => setShowAddForm(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Post Update
            </Button>
          )}
        </div>

        {/* Add Update Form */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="mb-6 space-y-4">
            <div>
              <label
                htmlFor="update-title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Update Title
              </label>
              <input
                id="update-title"
                type="text"
                value={newUpdate.title}
                onChange={(e) =>
                  setNewUpdate({ ...newUpdate, title: e.target.value })
                }
                placeholder="e.g., We reached 1,000 signatures!"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                maxLength={100}
                disabled={submitting}
              />
            </div>

            <div>
              <label
                htmlFor="update-content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Update Content
              </label>
              <textarea
                id="update-content"
                value={newUpdate.content}
                onChange={(e) =>
                  setNewUpdate({ ...newUpdate, content: e.target.value })
                }
                placeholder="Share progress, news, or thank supporters..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                maxLength={1000}
                disabled={submitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                {newUpdate.content.length}/1000 characters
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post Update'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setNewUpdate({ title: '', content: '' });
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Updates Timeline */}
        {updates.length > 0 ? (
          <div className="space-y-6">
            {updates.map((update, index) => (
              <div key={update.id} className="relative">
                {/* Timeline line */}
                {index < updates.length - 1 && (
                  <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200" />
                )}

                <div className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center relative z-10">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>

                  {/* Update content */}
                  <div className="flex-1 pb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {update.title}
                      </h3>
                      <p className="text-xs text-blue-600 mb-3">
                        {formatDateTime(update.createdAt)} • by{' '}
                        {update.createdByName}
                      </p>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {update.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <p className="font-medium">No updates yet</p>
            <p className="text-sm">
              {isCreator
                ? 'Post your first update to keep supporters informed'
                : "The petition creator hasn't posted any updates"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
