'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Petition } from '@/types/petition';
import { calculateProgress } from '@/lib/petition-utils';

interface PetitionAnalyticsProps {
  petition: Petition;
  className?: string;
}

interface AnalyticsData {
  totalViews: number;
  totalShares: number;
  totalSignatures: number;
  conversionRate: number;
  shareRate: number;
  dailyViews: number[];
  dailySignatures: number[];
  topReferrers: { source: string; count: number }[];
  demographics: {
    ageGroups: { range: string; count: number }[];
    locations: { city: string; count: number }[];
  };
}

export default function PetitionAnalytics({
  petition,
  className = '',
}: PetitionAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const progress = calculateProgress(
    petition.currentSignatures,
    petition.targetSignatures
  );

  useEffect(() => {
    loadAnalytics();
  }, [petition.id, timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // In a real implementation, this would fetch from an analytics service
      // For now, we'll generate mock data based on petition stats
      const mockAnalytics: AnalyticsData = {
        totalViews: petition.viewCount,
        totalShares: petition.shareCount,
        totalSignatures: petition.currentSignatures,
        conversionRate:
          petition.viewCount > 0
            ? (petition.currentSignatures / petition.viewCount) * 100
            : 0,
        shareRate:
          petition.viewCount > 0
            ? (petition.shareCount / petition.viewCount) * 100
            : 0,
        dailyViews: generateMockDailyData(petition.viewCount, timeRange),
        dailySignatures: generateMockDailyData(
          petition.currentSignatures,
          timeRange
        ),
        topReferrers: [
          { source: 'Direct', count: Math.floor(petition.viewCount * 0.4) },
          { source: 'Facebook', count: Math.floor(petition.viewCount * 0.25) },
          { source: 'WhatsApp', count: Math.floor(petition.viewCount * 0.15) },
          { source: 'Twitter', count: Math.floor(petition.viewCount * 0.1) },
          { source: 'Other', count: Math.floor(petition.viewCount * 0.1) },
        ],
        demographics: {
          ageGroups: [
            {
              range: '18-24',
              count: Math.floor(petition.currentSignatures * 0.2),
            },
            {
              range: '25-34',
              count: Math.floor(petition.currentSignatures * 0.35),
            },
            {
              range: '35-44',
              count: Math.floor(petition.currentSignatures * 0.25),
            },
            {
              range: '45-54',
              count: Math.floor(petition.currentSignatures * 0.15),
            },
            {
              range: '55+',
              count: Math.floor(petition.currentSignatures * 0.05),
            },
          ],
          locations: [
            {
              city: 'Casablanca',
              count: Math.floor(petition.currentSignatures * 0.3),
            },
            {
              city: 'Rabat',
              count: Math.floor(petition.currentSignatures * 0.2),
            },
            {
              city: 'Marrakech',
              count: Math.floor(petition.currentSignatures * 0.15),
            },
            {
              city: 'Fes',
              count: Math.floor(petition.currentSignatures * 0.1),
            },
            {
              city: 'Other',
              count: Math.floor(petition.currentSignatures * 0.25),
            },
          ],
        },
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockDailyData = (
    total: number,
    range: '7d' | '30d' | '90d'
  ): number[] => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const data: number[] = [];

    for (let i = 0; i < days; i++) {
      // Generate realistic daily distribution
      const baseValue = total / days;
      const variation = Math.random() * 0.5 + 0.75; // 75% to 125% of base
      data.push(Math.floor(baseValue * variation));
    }

    return data;
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={`${className}`}>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Failed to load analytics data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Petition Analytics</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range === '7d'
                ? '7 days'
                : range === '30d'
                ? '30 days'
                : '90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totalViews.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Signatures</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totalSignatures.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
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
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Shares</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totalShares.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Conversion Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.conversionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">
                {analytics.totalSignatures.toLocaleString()} of{' '}
                {petition.targetSignatures.toLocaleString()} signatures
              </span>
              <span className="text-lg font-bold text-green-600">
                {progress.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Remaining:</span>{' '}
                {Math.max(
                  0,
                  petition.targetSignatures - analytics.totalSignatures
                ).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Share Rate:</span>{' '}
                {analytics.shareRate.toFixed(1)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topReferrers.map((referrer, index) => {
                const percentage =
                  analytics.totalViews > 0
                    ? (referrer.count / analytics.totalViews) * 100
                    : 0;
                return (
                  <div
                    key={referrer.source}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-3 ${
                          index === 0
                            ? 'bg-blue-500'
                            : index === 1
                            ? 'bg-green-500'
                            : index === 2
                            ? 'bg-yellow-500'
                            : index === 3
                            ? 'bg-purple-500'
                            : 'bg-gray-500'
                        }`}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {referrer.source}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">
                        {referrer.count.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.demographics.locations.map((location, index) => {
                const percentage =
                  analytics.totalSignatures > 0
                    ? (location.count / analytics.totalSignatures) * 100
                    : 0;
                return (
                  <div
                    key={location.city}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-3 ${
                          index === 0
                            ? 'bg-red-500'
                            : index === 1
                            ? 'bg-orange-500'
                            : index === 2
                            ? 'bg-yellow-500'
                            : index === 3
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        }`}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {location.city}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">
                        {location.count.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.conversionRate < 2 && (
              <div className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <svg
                  className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">
                    Low Conversion Rate
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your conversion rate is{' '}
                    {analytics.conversionRate.toFixed(1)}%. Consider improving
                    your petition description or adding compelling images.
                  </p>
                </div>
              </div>
            )}

            {analytics.shareRate < 5 && (
              <div className="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
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
                  <h4 className="text-sm font-medium text-blue-800">
                    Increase Sharing
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your share rate is {analytics.shareRate.toFixed(1)}%.
                    Encourage supporters to share your petition on social media.
                  </p>
                </div>
              </div>
            )}

            {progress >= 75 && (
              <div className="flex items-start p-4 bg-green-50 border border-green-200 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0"
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
                <div>
                  <h4 className="text-sm font-medium text-green-800">
                    Great Progress!
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    You're {progress.toFixed(1)}% of the way to your goal. Keep
                    promoting your petition to reach 100%!
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
