'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Petition } from '@/types/petition';
import {
  calculateProgress,
  getPetitionStatusColor,
  getPetitionStatusLabel,
  getPetitionUrl,
  formatCurrency,
} from '@/lib/petition-utils';

interface PetitionCardProps {
  petition: Petition;
  variant?: 'grid' | 'list' | 'featured';
  showProgress?: boolean;
  showCreator?: boolean;
  showActions?: boolean;
  className?: string;
}

export default function PetitionCard({
  petition,
  variant = 'grid',
  showProgress = true,
  showCreator = true,
  showActions = false,
  className = '',
}: PetitionCardProps) {
  const progress = calculateProgress(
    petition.currentSignatures,
    petition.targetSignatures
  );
  const statusColor = getPetitionStatusColor(petition.status);
  const statusLabel = getPetitionStatusLabel(petition.status);
  const petitionUrl = getPetitionUrl(petition);

  // Grid variant (default)
  if (variant === 'grid') {
    return (
      <div
        className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden ${className}`}
      >
        <Link href={petitionUrl} className="block">
          {/* Petition Image */}
          <div className="relative h-48 bg-gray-200">
            {petition.mediaUrls && petition.mediaUrls.length > 0 ? (
              <Image
                src={petition.mediaUrls[0]}
                alt={petition.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full text-white bg-${statusColor}-500`}
              >
                {statusLabel}
              </span>
            </div>

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-white text-gray-700">
                {petition.category}
              </span>
            </div>
          </div>

          {/* Petition Content */}
          <div className="p-4">
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {petition.title}
            </h3>

            {/* Description Preview */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {petition.description.substring(0, 120)}...
            </p>

            {/* Creator Info */}
            {showCreator && (
              <div className="flex items-center mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span>Created by User</span>
                  {/* TODO: Add creator verification badge */}
                </div>
              </div>
            )}

            {/* Progress Section */}
            {showProgress && (
              <div className="mb-4">
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                {/* Progress Stats */}
                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray-900 font-medium">
                    {petition.currentSignatures.toLocaleString()} signatures
                  </div>
                  <div className="text-gray-600">
                    {progress.toFixed(0)}% of{' '}
                    {petition.targetSignatures.toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* Petition Stats */}
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
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
                {petition.viewCount} views
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                {petition.shareCount} shares
              </div>
            </div>
          </div>
        </Link>

        {/* Action Buttons */}
        {showActions && (
          <div className="px-4 pb-4">
            <div className="flex gap-2">
              <Link
                href={petitionUrl}
                className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
              >
                View Petition
              </Link>
              {!petition.hasQrUpgrade && (
                <Link
                  href={`/petitions/${petition.id}/qr`}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                >
                  QR
                </Link>
              )}
              <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // List variant
  if (variant === 'list') {
    return (
      <div
        className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden ${className}`}
      >
        <Link href={petitionUrl} className="block">
          <div className="flex items-center">
            {/* Petition Image */}
            <div className="relative w-32 h-24 bg-gray-200 flex-shrink-0">
              {petition.mediaUrls && petition.mediaUrls.length > 0 ? (
                <Image
                  src={petition.mediaUrls[0]}
                  alt={petition.title}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Petition Content */}
            <div className="flex-1 p-4 flex flex-col justify-center min-h-[96px]">
              <div className="flex justify-between items-start mb-1">
                <h3
                  className="text-lg font-semibold line-clamp-1 flex-1 pr-2"
                  style={{ color: '#4d1694' }}
                >
                  {petition.title}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full text-white bg-${statusColor}-500 flex-shrink-0`}
                >
                  {statusLabel}
                </span>
              </div>

              {showCreator && (
                <div className="flex items-center mb-1">
                  <span className="text-sm text-gray-600">Created by User</span>
                </div>
              )}

              {showProgress && (
                <div className="mb-1">
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                    <div
                      className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900 font-medium">
                      {petition.currentSignatures.toLocaleString()} signatures
                    </span>
                    <span className="text-gray-600">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>{petition.viewCount} views</span>
                <span>{petition.shareCount} shares</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Featured variant
  if (variant === 'featured') {
    return (
      <div
        className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden border-2 border-green-200 ${className}`}
      >
        <Link href={petitionUrl} className="block">
          {/* Featured Badge */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-2">
            <span className="text-sm font-medium">⭐ Featured Petition</span>
          </div>

          {/* Petition Image */}
          <div className="relative h-56 bg-gray-200">
            {petition.mediaUrls && petition.mediaUrls.length > 0 ? (
              <Image
                src={petition.mediaUrls[0]}
                alt={petition.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-white text-gray-700 shadow-md">
                {petition.category}
              </span>
            </div>
          </div>

          {/* Petition Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
              {petition.title}
            </h3>

            {showCreator && (
              <div className="flex items-center mb-4">
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">Created by User</span>
                </div>
              </div>
            )}

            {showProgress && (
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {petition.currentSignatures.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      signatures of {petition.targetSignatures.toLocaleString()}{' '}
                      goal
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {progress.toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600">complete</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center text-gray-600 border-t pt-4">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
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
                {petition.viewCount.toLocaleString()} views
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                {petition.shareCount.toLocaleString()} shares
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return null;
}
