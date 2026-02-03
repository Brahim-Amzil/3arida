'use client';

import React, { useState } from 'react';
import { Petition } from '@/types/petition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { useTranslation } from '@/hooks/useTranslation';

interface ContactModeratorModalProps {
  petition: Petition;
  onClose: () => void;
}

export default function ContactModeratorModal({
  petition,
  onClose,
}: ContactModeratorModalProps) {
  const { user, userProfile } = useAuth();
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError(t('contactModerator.errorMessage'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/appeals/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petitionId: petition.id,
          message: message.trim(),
          userId: user?.uid,
          userName:
            userProfile?.name ||
            user?.displayName ||
            petition.creatorName ||
            'Petition Creator',
          userEmail: user?.email || 'no-reply@3arida.ma',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create appeal');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error creating appeal:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to send message. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('contactModerator.title')}</CardTitle>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg
                  className="w-5 h-5"
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
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Petition Preview */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start gap-4">
                {petition.mediaUrls && petition.mediaUrls.length > 0 && (
                  <img
                    src={petition.mediaUrls[0]}
                    alt={petition.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {petition.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {t('contactModerator.status')}:{' '}
                    <span
                      className={`font-medium ${petition.status === 'paused' ? 'text-orange-600' : 'text-red-600'}`}
                    >
                      {petition.status === 'paused'
                        ? t('contactModerator.paused')
                        : t('contactModerator.rejected')}
                    </span>
                  </p>
                  <a
                    href={`/petitions/${petition.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {t('contactModerator.viewPetition')} ←
                  </a>
                </div>
              </div>

              {/* Moderation Notes */}
              {petition.moderationNotes && (
                <div
                  className={`mt-3 p-3 rounded ${
                    petition.status === 'paused'
                      ? 'bg-orange-50 border border-orange-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <p
                    className={`text-sm font-medium mb-1 ${
                      petition.status === 'paused'
                        ? 'text-orange-800'
                        : 'text-red-800'
                    }`}
                  >
                    {t('contactModerator.reasonFor')}{' '}
                    {petition.status === 'paused'
                      ? t('contactModerator.pause')
                      : t('contactModerator.rejection')}
                    :
                  </p>
                  <p
                    className={`text-sm ${
                      petition.status === 'paused'
                        ? 'text-orange-700'
                        : 'text-red-700'
                    }`}
                  >
                    {petition.moderationNotes}
                  </p>
                </div>
              )}

              {/* Resubmission Info for Rejected Petitions */}
              {petition.status === 'rejected' &&
                petition.resubmissionCount !== undefined && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      {t('contactModerator.resubmissionStatus')}:
                    </p>
                    <p className="text-sm text-blue-700">
                      {petition.resubmissionCount >= 3
                        ? t('contactModerator.maxResubmissionReached')
                        : t('contactModerator.resubmissionAttemptsRemaining', {
                            count: 3 - petition.resubmissionCount,
                          })}
                    </p>
                  </div>
                )}
            </div>

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
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
                  <p className="text-sm text-green-800 font-medium">
                    {t('contactModerator.appealSubmittedSuccess')}
                  </p>
                </div>
                <p className="text-xs text-green-700 mr-7">
                  {t('contactModerator.appealReviewMessage')}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Form */}
            {!success && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {t('contactModerator.yourMessage')}
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('contactModerator.messagePlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t('contactModerator.messageHelp')}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="flex-1"
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
                        {t('contactModerator.sending')}
                      </>
                    ) : (
                      t('contactModerator.sendMessage')
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                  >
                    {t('contactModerator.cancel')}
                  </Button>
                </div>
              </form>
            )}

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h5 className="text-sm font-medium text-blue-800 mb-1">
                    {t('contactModerator.whatHappensNext')}
                  </h5>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• {t('contactModerator.step1')}</li>
                    <li>• {t('contactModerator.step2')}</li>
                    <li>• {t('contactModerator.step3')}</li>
                    <li>• {t('contactModerator.step4')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
