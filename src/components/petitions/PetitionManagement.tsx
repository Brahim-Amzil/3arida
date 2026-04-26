'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Archive, AlertCircle } from 'lucide-react';
import { Petition } from '@/types/petition';

interface PetitionManagementProps {
  petition: Petition;
  onDelete: () => Promise<void>;
  onArchive: () => Promise<void>;
  onRequestDeletion: (reason: string) => Promise<void>;
  onClose: (closingMessage?: string) => Promise<void>;
}

export default function PetitionManagement({
  petition,
  onDelete,
  onArchive,
  onRequestDeletion,
  onClose,
}: PetitionManagementProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showRequestDeletion, setShowRequestDeletion] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [deletionReason, setDeletionReason] = useState('');
  const [closingMessage, setClosingMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageType, setSuccessMessageType] = useState<
    'close' | 'deletion-request'
  >('close');

  // Check if user can delete directly
  const canDelete = () => {
    const createdAt = petition.createdAt.getTime();
    const now = Date.now();
    const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);

    return (
      petition.currentSignatures <= 10 ||
      petition.status === 'pending' ||
      hoursSinceCreation < 24
    );
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onDelete();
      setShowDeleteConfirm(false);
      // Note: User will be redirected to dashboard by parent component
      // No need for success message here as they won't see it
    } catch (error) {
      console.error('Error deleting petition:', error);
      // Keep alert for errors since user needs to see them
      alert('فشل في حذف العريضة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    try {
      setLoading(true);
      await onArchive();
      setShowArchiveConfirm(false);
      // Note: User will be redirected to dashboard by parent component
      // No need for success message here as they won't see it
    } catch (error) {
      console.error('Error archiving petition:', error);
      // Keep alert for errors since user needs to see them
      alert('فشل في أرشفة العريضة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDeletion = async () => {
    if (!deletionReason.trim()) {
      // Keep alert for validation errors
      alert('يرجى تقديم سبب للحذف');
      return;
    }

    try {
      setLoading(true);
      await onRequestDeletion(deletionReason);
      setShowRequestDeletion(false);
      setDeletionReason('');
      // Show inline success message
      setSuccessMessageType('deletion-request');
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (error) {
      console.error('Error requesting deletion:', error);
      // Keep alert for errors
      alert('فشل في تقديم طلب الحذف. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    try {
      setLoading(true);
      await onClose(closingMessage.trim() || undefined);
      setShowCloseConfirm(false);
      setClosingMessage('');
      // Show success message instead of alert
      setSuccessMessageType('close');
      setShowSuccessMessage(true);
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (error) {
      console.error('Error closing petition:', error);
      alert('فشل في إغلاق العريضة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const userCanDelete = canDelete();

  return (
    <>
      {/* Success Message Banner */}
      {showSuccessMessage && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg animate-fade-in">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              {successMessageType === 'close' ? (
                <>
                  <h4 className="text-sm font-medium text-green-800">
                    ✓ تم إغلاق العريضة بنجاح
                  </h4>
                  <p className="mt-1 text-sm text-green-700">
                    العريضة الآن مغلقة ولن تقبل توقيعات جديدة. ستبقى مرئية
                    للجميع.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="text-sm font-medium text-green-800">
                    ✓ تم تقديم طلب الحذف بنجاح
                  </h4>
                  <p className="mt-1 text-sm text-green-700">
                    سيقوم المسؤول بمراجعة طلبك قريباً. ستتلقى إشعاراً عند اتخاذ
                    القرار.
                  </p>
                </>
              )}
            </div>
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="flex-shrink-0 ml-3 text-green-500 hover:text-green-700"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  هل تريد حذف العريضة؟
                </h3>
                <p className="text-sm text-gray-600">
                  لا يمكن التراجع عن هذا الإجراء
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              هل أنت متأكد أنك تريد حذف هذه العريضة نهائياً؟ ستتم إزالة جميع
              التوقيعات والتعليقات والبيانات من العرض العام.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                إلغاء
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'جاري الحذف...' : 'حذف العريضة'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Modal */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Archive className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  أرشفة العريضة؟
                </h3>
                <p className="text-sm text-gray-600">يمكنك استعادتها لاحقاً</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              الأرشفة ستخفي هذه العريضة من العرض العام، ولكن يمكنك استعادتها في
              أي وقت من لوحة التحكم الخاصة بك. سيتم الاحتفاظ بجميع البيانات.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowArchiveConfirm(false)}
                disabled={loading}
              >
                إلغاء
              </Button>
              <Button
                className="bg-yellow-600 hover:bg-yellow-700"
                onClick={handleArchive}
                disabled={loading}
              >
                {loading ? 'جاري الأرشفة...' : 'أرشفة العريضة'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Request Deletion Modal */}
      {showRequestDeletion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  طلب الحذف
                </h3>
                <p className="text-sm text-gray-600">
                  سيقوم المسؤول بمراجعة طلبك
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              عريضتك تحظى بدعم كبير. يرجى توضيح سبب رغبتك في حذفها، وسيقوم
              المسؤول بمراجعة طلبك.
            </p>
            <textarea
              value={deletionReason}
              onChange={(e) => setDeletionReason(e.target.value)}
              placeholder="سبب طلب الحذف..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none mb-4"
              disabled={loading}
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRequestDeletion(false);
                  setDeletionReason('');
                }}
                disabled={loading}
              >
                إلغاء
              </Button>
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={handleRequestDeletion}
                disabled={loading || !deletionReason.trim()}
              >
                {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Close Petition Modal */}
      {showCloseConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Archive className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  إغلاق العريضة؟
                </h3>
                <p className="text-sm text-gray-600">
                  ستبقى مرئية ولكن لن تقبل توقيعات جديدة
                </p>
              </div>
            </div>

            {/* Red Warning Alert */}
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
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
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-red-800">
                    ⚠️ تحذير: هذا الإجراء لا يمكن التراجع عنه
                  </h4>
                  <p className="mt-1 text-sm text-red-700">
                    بمجرد إغلاق العريضة، لن تتمكن من إعادة فتحها مرة أخرى. تأكد
                    من قرارك قبل المتابعة.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">
              إغلاق العريضة يعني أنها ستبقى مرئية للجميع ولكن لن تقبل توقيعات
              جديدة. يمكنك إضافة رسالة اختيارية لشرح سبب الإغلاق.
            </p>
            <textarea
              value={closingMessage}
              onChange={(e) => setClosingMessage(e.target.value)}
              placeholder="رسالة الإغلاق (اختياري)..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
              disabled={loading}
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCloseConfirm(false);
                  setClosingMessage('');
                }}
                disabled={loading}
              >
                إلغاء
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleClose}
                disabled={loading}
              >
                {loading ? 'جاري الإغلاق...' : 'إغلاق العريضة'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Management Card */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            إدارة العريضة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-700 mb-4">
            بصفتك المنشئ، يمكنك إدارة هذه العريضة.
          </p>

          {/* Close Petition Button - Always available if not already closed */}
          {!petition.closedByCreator && petition.status === 'approved' && (
            <>
              <Button
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowCloseConfirm(true)}
              >
                <Archive className="w-4 h-4" />
                إغلاق العريضة
              </Button>
              <p className="text-xs text-gray-600 mb-4">
                إغلاق العريضة يعني أنها ستبقى مرئية ولكن لن تقبل توقيعات جديدة.
              </p>
            </>
          )}

          {/* Show closed status if already closed */}
          {petition.closedByCreator && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mb-4">
              <p className="text-sm font-medium text-blue-800">
                ✓ هذه العريضة مغلقة
              </p>
              <p className="text-xs text-blue-600 mt-1">
                لا تقبل توقيعات جديدة
              </p>
              {petition.closingMessage && (
                <p className="text-xs text-blue-700 mt-2 italic">
                  "{petition.closingMessage}"
                </p>
              )}
            </div>
          )}

          {userCanDelete ? (
            <>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                حذف العريضة
              </Button>
              <p className="text-xs text-gray-600">
                يمكنك حذف هذه العريضة لأنها تحتوي على 10 توقيعات أو أقل، أو أنها
                قيد الانتظار، أو تم إنشاؤها خلال 24 ساعة.
              </p>
            </>
          ) : (
            <>
              <Button
                className="w-full flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700"
                onClick={() => setShowArchiveConfirm(true)}
              >
                <Archive className="w-4 h-4" />
                أرشفة العريضة
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRequestDeletion(true)}
                className="w-full flex items-center justify-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                <AlertCircle className="w-4 h-4" />
                طلب الحذف
              </Button>
              <p className="text-xs text-gray-600">
                هذه العريضة تحظى بدعم كبير. يمكنك أرشفتها أو طلب موافقة المسؤول
                لحذفها.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
