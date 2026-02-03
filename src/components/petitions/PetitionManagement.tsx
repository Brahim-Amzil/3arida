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
}

export default function PetitionManagement({
  petition,
  onDelete,
  onArchive,
  onRequestDeletion,
}: PetitionManagementProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showRequestDeletion, setShowRequestDeletion] = useState(false);
  const [deletionReason, setDeletionReason] = useState('');
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      console.error('Error deleting petition:', error);
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
    } catch (error) {
      console.error('Error archiving petition:', error);
      alert('فشل في أرشفة العريضة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDeletion = async () => {
    if (!deletionReason.trim()) {
      alert('يرجى تقديم سبب للحذف');
      return;
    }

    try {
      setLoading(true);
      await onRequestDeletion(deletionReason);
      setShowRequestDeletion(false);
      setDeletionReason('');
      alert('تم تقديم طلب الحذف. سيقوم المسؤول بمراجعته قريباً.');
    } catch (error) {
      console.error('Error requesting deletion:', error);
      alert('فشل في تقديم طلب الحذف. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const userCanDelete = canDelete();

  return (
    <>
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
              هل أنت متأكد أنك تريد حذف هذه العريضة نهائياً؟ ستتم إزالة جميع التوقيعات والتعليقات والبيانات من العرض العام.
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
                <p className="text-sm text-gray-600">
                  يمكنك استعادتها لاحقاً
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              الأرشفة ستخفي هذه العريضة من العرض العام، ولكن يمكنك استعادتها في أي وقت من لوحة التحكم الخاصة بك. سيتم الاحتفاظ بجميع البيانات.
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
              عريضتك تحظى بدعم كبير. يرجى توضيح سبب رغبتك في حذفها، وسيقوم المسؤول بمراجعة طلبك.
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
                يمكنك حذف هذه العريضة لأنها تحتوي على 10 توقيعات أو أقل، أو أنها قيد الانتظار، أو تم إنشاؤها خلال 24 ساعة.
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
                هذه العريضة تحظى بدعم كبير. يمكنك أرشفتها أو طلب موافقة المسؤول لحذفها.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
