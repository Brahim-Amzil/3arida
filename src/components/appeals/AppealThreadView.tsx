'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Appeal, AppealStatus } from '@/types/appeal';

interface AppealThreadViewProps {
  appeal: Appeal;
  petitionTitle: string;
  petitionStatus: string;
  onReply?: (message: string) => Promise<void>;
  isCreator?: boolean;
}

export default function AppealThreadView({
  appeal,
  petitionTitle,
  petitionStatus,
  onReply,
  isCreator = true,
}: AppealThreadViewProps) {
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getStatusBadge = (status: AppealStatus) => {
    const statusConfig = {
      pending: {
        label: 'قيد الانتظار',
        icon: '⏳',
        className: 'bg-yellow-100 text-yellow-800',
      },
      'in-progress': {
        label: 'قيد المعالجة',
        icon: '🔄',
        className: 'bg-blue-100 text-blue-800',
      },
      resolved: {
        label: 'تم الحل',
        icon: '✅',
        className: 'bg-green-100 text-green-800',
      },
      rejected: {
        label: 'مرفوض',
        icon: '❌',
        className: 'bg-red-100 text-red-800',
      },
    };

    const config = statusConfig[status];
    return (
      <Badge variant="default" className={config.className}>
        {config.icon} {config.label}
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ar-MA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyMessage.trim()) {
      setError('الرجاء إدخال رسالة');
      return;
    }

    if (!onReply) return;

    setLoading(true);
    setError('');

    try {
      await onReply(replyMessage.trim());
      setReplyMessage('');
    } catch (err) {
      console.error('Error sending reply:', err);
      setError('فشل إرسال الرد. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const canReply = appeal.status !== 'resolved' && appeal.status !== 'rejected';

  return (
    <div className="space-y-6">
      {/* Petition Preview Card */}
      <Link href={`/petitions/${appeal.petitionId}`}>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg hover:text-green-600 transition-colors">
                  {petitionTitle}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  حالة العريضة:{' '}
                  <span className="font-medium">
                    {petitionStatus === 'paused' ? 'موقوفة' : 'مرفوضة'}
                  </span>
                </p>
              </div>
              {getStatusBadge(appeal.status)}
            </div>
          </CardHeader>
        </Card>
      </Link>

      {/* Messages Thread */}
      <Card>
        <CardHeader>
          <CardTitle>المحادثة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appeal.messages
              .filter((message) => !message.isInternal)
              .map((message, index) => {
                const isFromCreator = message.senderRole === 'creator';
                const isCurrentUser = isCreator
                  ? isFromCreator
                  : !isFromCreator;

                return (
                  <div
                    key={message.id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        isCurrentUser
                          ? 'bg-green-100 text-gray-900'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">
                          {isFromCreator ? '👤 منشئ العريضة' : '👨‍💼 المشرف'}
                        </span>
                        <span className="text-xs text-gray-600">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Reply Form */}
          {canReply && onReply && (
            <form onSubmit={handleSubmitReply} className="mt-6">
              <div className="border-t pt-6">
                <label
                  htmlFor="reply"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ردك
                </label>
                <textarea
                  id="reply"
                  rows={4}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="اكتب ردك هنا..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                <div className="mt-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading || !replyMessage.trim()}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        جاري الإرسال...
                      </>
                    ) : (
                      'إرسال الرد'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {!canReply && (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <p className="text-sm text-gray-600">
                {appeal.status === 'resolved'
                  ? 'تم حل هذا الطلب ولا يمكن إضافة ردود جديدة'
                  : 'تم رفض هذا الطلب ولا يمكن إضافة ردود جديدة'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status History */}
      {appeal.statusHistory.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">سجل الحالة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appeal.statusHistory.map((change, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {change.status === 'pending' && 'تم إنشاء الطلب'}
                      {change.status === 'in-progress' && 'قيد المعالجة'}
                      {change.status === 'resolved' && 'تم الحل'}
                      {change.status === 'rejected' && 'تم الرفض'}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {formatDate(change.changedAt)}
                    </p>
                    {change.reason && (
                      <p className="text-gray-700 mt-1">{change.reason}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
