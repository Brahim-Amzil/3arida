'use client';

import React from 'react';
import {
  ChannelPreview,
  getPlatformDisplayName,
  getPlatformIcon,
} from '@/hooks/useChannelPreview';
import { useTranslation } from '@/hooks/useTranslation';

interface InfluencerCardProps {
  channelData: ChannelPreview;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function InfluencerCard({
  channelData,
  className = '',
  size = 'medium',
}: InfluencerCardProps) {
  const { t } = useTranslation();

  const sizeClasses = {
    small: {
      container: 'p-3',
      image: 'h-10 w-10',
      name: 'text-sm font-semibold',
      platform: 'text-xs',
      icon: 'text-sm',
    },
    medium: {
      container: 'p-4',
      image: 'h-12 w-12',
      name: 'text-base font-semibold',
      platform: 'text-sm',
      icon: 'text-base',
    },
    large: {
      container: 'p-6',
      image: 'h-16 w-16',
      name: 'text-lg font-semibold',
      platform: 'text-base',
      icon: 'text-lg',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={`bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg ${classes.container} ${className}`}
    >
      <div className="flex items-center gap-3">
        {/* Profile Image */}
        <div className="relative">
          {channelData.image ? (
            <img
              src={channelData.image}
              className={`${classes.image} rounded-full object-cover border-2 border-white shadow-sm`}
              alt={channelData.name}
              onError={(e) => {
                // Fallback to default avatar if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = `data:image/svg+xml;base64,${btoa(`
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="24" fill="#E5E7EB"/>
                    <circle cx="24" cy="20" r="8" fill="#9CA3AF"/>
                    <path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="#9CA3AF"/>
                  </svg>
                `)}`;
              }}
            />
          ) : (
            <div
              className={`${classes.image} rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-sm`}
            >
              <span className="text-gray-500 text-xl">👤</span>
            </div>
          )}

          {/* Platform Icon Badge */}
          <div
            className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow-sm border border-gray-200 flex items-center justify-center"
            style={{ width: '20px', height: '20px' }}
          >
            <span className="text-xs leading-none">
              {getPlatformIcon(channelData.platform)}
            </span>
          </div>
        </div>

        {/* Channel Info */}
        <div className="flex-1 min-w-0">
          <p className={`${classes.name} text-gray-900 truncate`}>
            {channelData.name}
          </p>
          <p
            className={`${classes.platform} text-blue-600 flex items-center gap-1`}
          >
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            {t('influencer.verifiedFrom')}{' '}
            {getPlatformDisplayName(channelData.platform)}
          </p>
          {channelData.description && size !== 'small' && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {channelData.description}
            </p>
          )}
        </div>

        {/* External Link Icon */}
        <a
          href={channelData.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-blue-600 transition-colors p-1"
          title={t('influencer.visitChannel')}
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
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

// Loading state component
export function InfluencerCardSkeleton({
  size = 'medium',
  className = '',
}: {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}) {
  const sizeClasses = {
    small: { container: 'p-3', image: 'h-10 w-10' },
    medium: { container: 'p-4', image: 'h-12 w-12' },
    large: { container: 'p-6', image: 'h-16 w-16' },
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={`bg-gray-50 border border-gray-200 rounded-lg ${classes.container} ${className} animate-pulse`}
    >
      <div className="flex items-center gap-3">
        <div className={`${classes.image} rounded-full bg-gray-300`}></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}
