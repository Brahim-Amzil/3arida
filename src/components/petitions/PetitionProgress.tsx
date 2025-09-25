'use client';

import React from 'react';
import { Petition } from '@/types/petition';
import { calculateProgress } from '@/lib/petition-utils';

interface PetitionProgressProps {
  petition: Petition;
  variant?: 'default' | 'detailed' | 'compact';
  showMilestones?: boolean;
  className?: string;
}

export default function PetitionProgress({
  petition,
  variant = 'default',
  showMilestones = true,
  className = '',
}: PetitionProgressProps) {
  const progress = calculateProgress(
    petition.currentSignatures,
    petition.targetSignatures
  );
  const remaining = Math.max(
    0,
    petition.targetSignatures - petition.currentSignatures
  );

  // Calculate milestones
  const milestones = [
    { percentage: 25, reached: progress >= 25 },
    { percentage: 50, reached: progress >= 50 },
    { percentage: 75, reached: progress >= 75 },
    { percentage: 100, reached: progress >= 100 },
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-600';
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressMessage = (progress: number, remaining: number) => {
    if (progress >= 100) {
      return {
        title: '🎉 Goal Reached!',
        message: 'This petition has reached its signature goal!',
        color: 'text-green-600',
      };
    }

    if (progress >= 75) {
      return {
        title: '🔥 Almost There!',
        message: `Only ${remaining.toLocaleString()} more signatures needed!`,
        color: 'text-green-600',
      };
    }

    if (progress >= 50) {
      return {
        title: '💪 Halfway There!',
        message: `${remaining.toLocaleString()} signatures to go!`,
        color: 'text-yellow-600',
      };
    }

    if (progress >= 25) {
      return {
        title: '🚀 Building Momentum!',
        message: `${remaining.toLocaleString()} more signatures needed`,
        color: 'text-orange-600',
      };
    }

    return {
      title: '📢 Help Spread the Word!',
      message: `${remaining.toLocaleString()} signatures needed`,
      color: 'text-gray-600',
    };
  };

  const progressInfo = getProgressMessage(progress, remaining);

  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-gray-900">
            {petition.currentSignatures.toLocaleString()}
          </span>
          <span className="text-gray-600">{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${getProgressColor(
              progress
            )} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`bg-white rounded-lg border p-6 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Petition Progress
          </h3>
          <span className={`text-sm font-medium ${progressInfo.color}`}>
            {progress.toFixed(1)}% Complete
          </span>
        </div>

        {/* Progress Message */}
        <div className="mb-6">
          <h4 className={`text-lg font-medium ${progressInfo.color} mb-1`}>
            {progressInfo.title}
          </h4>
          <p className="text-gray-600">{progressInfo.message}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold text-gray-900">
              {petition.currentSignatures.toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">
              of {petition.targetSignatures.toLocaleString()} signatures
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 relative">
            <div
              className={`${getProgressColor(
                progress
              )} h-4 rounded-full transition-all duration-500 relative`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              {progress > 10 && (
                <div className="absolute right-2 top-0 h-full flex items-center">
                  <span className="text-white text-xs font-medium">
                    {progress.toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Milestones */}
        {showMilestones && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Milestones
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {milestones.map((milestone) => (
                <div
                  key={milestone.percentage}
                  className={`text-center p-3 rounded-lg border ${
                    milestone.reached
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div
                    className={`text-lg font-bold ${
                      milestone.reached ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {milestone.reached ? '✓' : milestone.percentage + '%'}
                  </div>
                  <div
                    className={`text-xs ${
                      milestone.reached ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {milestone.reached ? 'Reached' : 'Goal'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">
                {petition.viewCount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Views</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {petition.shareCount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Shares</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {Math.round(
                  (petition.currentSignatures / petition.viewCount) * 100
                ) || 0}
                %
              </div>
              <div className="text-xs text-gray-500">Conversion</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`${className}`}>
      {/* Progress Message */}
      <div className="mb-4">
        <h4 className={`text-lg font-medium ${progressInfo.color} mb-1`}>
          {progressInfo.title}
        </h4>
        <p className="text-gray-600">{progressInfo.message}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold text-gray-900">
            {petition.currentSignatures.toLocaleString()}
          </span>
          <span className="text-sm text-gray-600">
            {progress.toFixed(1)}% of{' '}
            {petition.targetSignatures.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`${getProgressColor(
              progress
            )} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Milestones */}
      {showMilestones && (
        <div className="flex justify-between items-center">
          {milestones.map((milestone) => (
            <div
              key={milestone.percentage}
              className={`flex flex-col items-center ${
                milestone.reached ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                  milestone.reached
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'border-gray-300'
                }`}
              >
                {milestone.reached ? '✓' : milestone.percentage}
              </div>
              <span className="text-xs mt-1">{milestone.percentage}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
