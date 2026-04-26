'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface InfluencerBannerProps {
  profilePhotoUrl: string;
  channelName: string;
  followerCount: string;
  platform: string;
  socialMediaUrl: string;
}

export function InfluencerBanner({
  profilePhotoUrl,
  channelName,
  followerCount,
  platform,
  socialMediaUrl,
}: InfluencerBannerProps) {
  const { t } = useTranslation();

  const getPlatformIcon = (platform: string): string => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return '📺';
      case 'instagram':
        return '📷';
      case 'tiktok':
        return '';
      case 'x':
      case 'twitter':
        return '🐦';
      case 'facebook':
        return '👥';
      case 'linkedin':
        return '💼';
      case 'snapchat':
        return '👻';
      default:
        return '🌐';
    }
  };

  const getPlatformColor = (platform: string): string => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return 'from-red-50 to-red-100 border-red-200';
      case 'instagram':
        return 'from-pink-50 to-purple-100 border-purple-200';
      case 'tiktok':
        return 'from-gray-50 to-gray-100 border-gray-300';
      case 'x':
      case 'twitter':
        return 'from-blue-50 to-blue-100 border-blue-200';
      case 'facebook':
        return 'from-blue-50 to-blue-100 border-blue-300';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  return (
    <div className="relative">
      {/* Label Pill - Overlaying top border on the RIGHT */}
      <div className="absolute -top-5 right-6 z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 border-[1px] border-gray-250 rounded-full text-sm">
          {t('influencer.petitionStartedBy')}
        </div>
      </div>

      {/* Influencer Card */}
      <div
        className={`bg-gradient-to-r ${getPlatformColor(platform)} border-[1px] rounded-xl p-2 pt-6 shadow-sm hover:shadow-md transition-shadow`}
      >
        <div className="flex items-center gap-4">
          {/* Profile Photo */}
          <div className="relative flex-shrink-0">
            <img
              src={profilePhotoUrl}
              alt={channelName}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-white shadow-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `data:image/svg+xml;base64,${btoa(`
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="40" fill="#E5E7EB"/>
                  <circle cx="40" cy="32" r="12" fill="#9CA3AF"/>
                  <path d="M16 70c0-13.255 10.745-24 24-24s24 10.745 24 24" fill="#9CA3AF"/>
                </svg>
              `)}`;
              }}
            />
            {/* Verified Badge */}
            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-2 border-white shadow-sm">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Channel Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                {channelName}
              </h3>
              <span className="text-xl">{getPlatformIcon(platform)}</span>
            </div>
            <p className="text-sm md:text-base text-gray-700 font-medium mb-1">
              {followerCount} {t('influencer.followers')} • {platform}
            </p>
            {/* Show channel handle/username */}
            <p className="text-xs md:text-sm text-gray-600 font-mono">
              {channelName.startsWith('@') ? channelName : `@${channelName}`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <a
              href={socialMediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
  px-4 py-2
  bg-gradient-to-r from-blue-50 to-blue-100
  text-blue-700 font-semibold
  rounded-lg
  hover:from-blue-100 hover:to-blue-100
  transition-all
  shadow-sm hover:shadow-md
  text-sm md:text-base
  whitespace-nowrap
  flex items-center gap-2
"
            >
              <span>{t('influencer.visitProfile')}</span>
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
