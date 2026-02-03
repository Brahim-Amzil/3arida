'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './button';
import { useTranslation } from '@/hooks/useTranslation';

interface UpgradeModalProps {
  feature: 'signatures' | 'updates' | 'appeals';
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ feature, isOpen, onClose }: UpgradeModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const featureInfo = {
    signatures: {
      icon: (
        <svg
          className="w-16 h-16 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
      title: t('upgrade.signatures.title') || 'Track Your Total Impact',
      description:
        t('upgrade.signatures.description') ||
        "See total signatures across all your petitions and track your campaign's overall reach and impact.",
      price: '69',
    },
    updates: {
      icon: (
        <svg
          className="w-16 h-16 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      title: t('upgrade.updates.title') || 'Keep Signees Updated',
      description:
        t('upgrade.updates.description') ||
        'Adding Updates is not available for free petitions. Please click below to change to a paid tier. Tiers start at 69 Moroccan Dirham.',
      price: '69',
    },
    appeals: {
      icon: (
        <svg
          className="w-16 h-16 text-green-600"
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
      ),
      title: t('upgrade.appeals.title') || 'Submit Appeals',
      description:
        t('upgrade.appeals.description') ||
        'Appeal rejected petitions and get a second review from our moderation team.',
      price: '69',
    },
  };

  const info = featureInfo[feature];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
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

          {/* Content */}
          <div className="text-center">
            {/* Lock icon overlay */}
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-50 to-purple-100 rounded-full flex items-center justify-center">
                {info.icon}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-400 rounded-full flex items-center justify-center border-2 border-white">
                <svg
                  className="w-4 h-4 text-gray-800"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {info.title}
            </h3>

            {/* Description with alert icon for updates feature */}
            {feature === 'updates' ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-800">{info.description}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 mb-6">{info.description}</p>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link href="/pricing" onClick={onClose}>
                <Button size="lg" className="w-full">
                  {t('upgrade.viewPlans') || 'View All Plans'}
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={onClose}
              >
                {t('upgrade.maybeLater') || 'Maybe Later'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Lock icon component for locked features
 */
export function LockIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
