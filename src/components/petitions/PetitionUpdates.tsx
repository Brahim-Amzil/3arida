'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface PetitionUpdate {
  id: string;
  petitionId: string;
  title: string;
  content: string;
  createdAt: Date;
  createdBy: string;
  createdByName: string;
  editedAt?: Date;
  editedOnce?: boolean;
}

interface PetitionUpdatesProps {
  petitionId: string;
  isCreator: boolean;
}

export default function PetitionUpdates({
  petitionId,
  isCreator,
}: PetitionUpdatesProps) {
  const { t, locale } = useTranslation();
  const isRTL = locale === 'ar';
  const [updates, setUpdates] = useState<PetitionUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUpdate, setNewUpdate] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUpdates();
  }, [petitionId]);

  const fetchUpdates = async () => {
    try {
      const { collection, query, where, orderBy, getDocs } =
        await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      const updatesRef = collection(db, 'petitionUpdates');
      const q = query(
        updatesRef,
        where('petitionId', '==', petitionId),
        orderBy('createdAt', 'desc'),
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
      alert(t('updates.fillAllFields'));
      return;
    }

    setSubmitting(true);
    try {
      const { collection, addDoc, serverTimestamp } =
        await import('firebase/firestore');
      const { db, auth } = await import('@/lib/firebase');

      const user = auth.currentUser;
      if (!user) {
        alert(t('updates.mustBeLoggedIn'));
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
      alert(t('updates.addFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (update: PetitionUpdate) => {
    setEditingUpdate(update.id);
    setEditForm({ title: update.title, content: update.content });
  };

  const handleUpdateEdit = async (updateId: string) => {
    if (!editForm.title.trim() || !editForm.content.trim()) {
      alert(t('updates.fillAllFields'));
      return;
    }

    setSubmitting(true);
    try {
      const { doc, updateDoc, serverTimestamp } =
        await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      const updateRef = doc(db, 'petitionUpdates', updateId);
      await updateDoc(updateRef, {
        title: editForm.title.trim(),
        content: editForm.content.trim(),
        editedAt: serverTimestamp(),
        editedOnce: true,
      });

      setEditingUpdate(null);
      setEditForm({ title: '', content: '' });
      await fetchUpdates();
    } catch (error) {
      console.error('Error updating:', error);
      alert(t('updates.updateFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (updateId: string) => {
    setDeleteConfirmId(updateId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;

    setDeleting(true);
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      const updateRef = doc(db, 'petitionUpdates', deleteConfirmId);
      await deleteDoc(updateRef);

      setDeleteConfirmId(null);
      await fetchUpdates();
    } catch (error) {
      console.error('Error deleting update:', error);
      alert(t('updates.deleteFailed'));
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat(
      locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-FR' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    ).format(date);
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
    <>
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`bg-white rounded-lg max-w-md w-full p-6 shadow-xl ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="flex items-start mb-4">
              <div
                className={`flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center ${isRTL ? 'ml-4' : 'mr-4'}`}
              >
                <svg
                  className="w-6 h-6 text-red-600"
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
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('updates.deleteConfirmTitle')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('updates.deleteConfirmMessage')}
                </p>
              </div>
            </div>
            <div
              className={`flex gap-3 ${isRTL ? 'justify-start' : 'justify-end'}`}
            >
              <Button
                variant="outline"
                onClick={handleDeleteCancel}
                disabled={deleting}
              >
                {t('updates.cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? t('updates.deleting') : t('updates.delete')}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('updates.title')}
            </h2>
            {isCreator && !showAddForm && (
              <Button
                onClick={() => setShowAddForm(true)}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t('updates.postUpdate')}
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
                  {t('updates.updateTitle')}
                </label>
                <input
                  id="update-title"
                  type="text"
                  value={newUpdate.title}
                  onChange={(e) =>
                    setNewUpdate({ ...newUpdate, title: e.target.value })
                  }
                  placeholder={t('updates.titlePlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  maxLength={100}
                  disabled={submitting}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>

              <div>
                <label
                  htmlFor="update-content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t('updates.updateContent')}
                </label>
                <textarea
                  id="update-content"
                  value={newUpdate.content}
                  onChange={(e) =>
                    setNewUpdate({ ...newUpdate, content: e.target.value })
                  }
                  placeholder={t('updates.contentPlaceholder')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  maxLength={1000}
                  disabled={submitting}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('updates.charactersCount', {
                    count: newUpdate.content.length,
                  })}
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? t('updates.posting') : t('updates.postUpdate')}
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
                  {t('updates.cancel')}
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
                    <div
                      className={`absolute top-10 bottom-0 w-0.5 bg-gray-200 ${isRTL ? 'right-4' : 'left-4'}`}
                    />
                  )}

                  <div className="flex gap-4">
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center relative z-10">
                      <Clock className="w-4 h-4 text-green-600" />
                    </div>

                    {/* Update content */}
                    <div className="flex-1 pb-6">
                      {editingUpdate === update.id ? (
                        // Edit Form
                        <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm space-y-3">
                          <div>
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  title: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              maxLength={100}
                              disabled={submitting}
                              dir={isRTL ? 'rtl' : 'ltr'}
                            />
                          </div>
                          <div>
                            <textarea
                              value={editForm.content}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  content: e.target.value,
                                })
                              }
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              maxLength={1000}
                              disabled={submitting}
                              dir={isRTL ? 'rtl' : 'ltr'}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {t('updates.charactersCount', {
                                count: editForm.content.length,
                              })}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateEdit(update.id)}
                              disabled={submitting}
                            >
                              {submitting
                                ? t('updates.saving')
                                : t('updates.saveChanges')}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingUpdate(null);
                                setEditForm({ title: '', content: '' });
                              }}
                              disabled={submitting}
                            >
                              {t('updates.cancel')}
                            </Button>
                          </div>
                          <p className="text-xs text-amber-600 flex items-center gap-1">
                            <svg
                              className="w-3 h-3"
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
                            {t('updates.editOnce')}
                          </p>
                        </div>
                      ) : (
                        // Display Mode
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 flex-1">
                              {update.title}
                            </h3>
                            {isCreator && (
                              <div
                                className={`flex gap-1 ${isRTL ? 'mr-2' : 'ml-2'}`}
                              >
                                {!update.editedOnce && (
                                  <button
                                    onClick={() => handleEdit(update)}
                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                    title={t('updates.edit')}
                                  >
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
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteClick(update.id)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                  title={t('updates.delete')}
                                >
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
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-blue-600 mb-3">
                            {formatDateTime(update.createdAt)} •{' '}
                            {t('updates.by')} {update.createdByName}
                            {update.editedAt && (
                              <span
                                className={`${isRTL ? 'mr-2' : 'ml-2'} text-amber-600`}
                              >
                                • {t('updates.edited')}{' '}
                                {formatDateTime(update.editedAt)}
                              </span>
                            )}
                          </p>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {update.content}
                          </p>
                        </div>
                      )}
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
              <p className="font-medium">{t('updates.noUpdates')}</p>
              <p className="text-sm">
                {isCreator
                  ? t('updates.noUpdatesCreator')
                  : t('updates.noUpdatesVisitor')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
