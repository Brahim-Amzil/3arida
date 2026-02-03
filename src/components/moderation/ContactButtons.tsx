'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Petition } from '@/types/petition';
import { canAccessAppeals } from '@/lib/tier-restrictions';
import { LockIcon } from '@/components/ui/UpgradeModal';

interface ContactButtonsProps {
  petition: Petition;
  onContactModerator: () => void;
  variant?: 'rejected' | 'paused';
}

export default function ContactButtons({
  petition,
  onContactModerator,
  variant = 'rejected',
}: ContactButtonsProps) {
  const router = useRouter();
  const [showLockedMessage, setShowLockedMessage] = useState(false);
  const isPaidPetition = canAccessAppeals(petition.pricingTier);

  const handleContactModeratorClick = () => {
    if (isPaidPetition) {
      onContactModerator();
    } else {
      setShowLockedMessage(true);
      setTimeout(() => setShowLockedMessage(false), 5000);
    }
  };

  const handleContactSupportClick = () => {
    router.push('/contact');
  };

  const colorClasses = {
    rejected: {
      moderator: isPaidPetition
        ? 'border-red-300 text-red-700 hover:bg-red-50'
        : 'border-gray-400 text-gray-700 cursor-not-allowed bg-gray-50 !opacity-100',
      support: 'border-blue-300 text-blue-700 hover:bg-blue-50',
      message: 'bg-red-50 border-red-200 text-red-700',
    },
    paused: {
      moderator: isPaidPetition
        ? 'border-orange-300 text-orange-700 hover:bg-orange-50'
        : 'border-gray-400 text-gray-700 cursor-not-allowed bg-gray-50 !opacity-100',
      support: 'border-blue-300 text-blue-700 hover:bg-blue-50',
      message: 'bg-orange-50 border-orange-200 text-orange-700',
    },
  };

  const colors = colorClasses[variant];

  return (
    <div className="mt-3 space-y-3">
      {/* Buttons Container */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Contact Moderator Button */}
        <Button
          size="sm"
          onClick={handleContactModeratorClick}
          variant="outline"
          className={`flex-1 ${colors.moderator}`}
        >
          <div className="flex items-center justify-center gap-2">
            {!isPaidPetition && <LockIcon className="w-4 h-4" />}
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
            <span>تواصل مع المشرف</span>
          </div>
        </Button>

        {/* Contact Support Button */}
        <Button
          size="sm"
          onClick={handleContactSupportClick}
          variant="outline"
          className={`flex-1 ${colors.support}`}
        >
          <div className="flex items-center justify-center gap-2">
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
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>تواصل مع الدعم</span>
          </div>
        </Button>
      </div>
      {/* Locked Message */}
      {showLockedMessage && !isPaidPetition && (
        <div
          className={`p-3 border rounded-lg ${colors.message} animate-in fade-in slide-in-from-top-2 duration-300`}
        >
          <div className="flex items-start gap-2">
            <LockIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                التواصل المباشر مع المشرفين متاح للعرائض المدفوعة فقط
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
