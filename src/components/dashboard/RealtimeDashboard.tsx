'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider-mock';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Petition } from '@/types/petition';

interface RealtimeDashboardProps {
  className?: string;
}

interface DashboardStats {
  totalPetitions: number;
  activePetitions: number;
  pendingPetitions: number;
  totalSignatures: number;
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  type: 'signature' | 'petition_created' | 'petition_approved' | 'milestone';
  message: string;
  timestamp: Date;
  petitionId?: string;
  petitionTitle?: string;
}

export default function RealtimeDashboard({
  className = '',
}: RealtimeDashboardProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPetitions: 0,
    activePetitions: 0,
    pendingPetitions: 0,
    totalSignatures: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [petitions, setPetitions] = useState<Petition[]>([]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Subscribe to user's petitions
    const petitionsRef = collection(db, 'petitions');
    const userPetitionsQuery = query(
      petitionsRef,
      where('creatorId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(userPetitionsQuery, (snapshot) => {
      const userPetitions: Petition[] = [];
      let totalSignatures = 0;
      let activePetitions = 0;
      let pendingPetitions = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const petition: Petition = {
          id: doc.id,
          title: data.title,
          description: data.description,
          category: data.category,
          subcategory: data.subcategory,
          targetSignatures: data.targetSignatures,
          currentSignatures: data.currentSignatures || 0,
          status: data.status,
          creatorId: data.creatorId,
          creatorPageId: data.creatorPageId,
          mediaUrls: data.mediaUrls || [],
          qrCodeUrl: data.qrCodeUrl,
          hasQrCode: data.hasQrCode || false,
          hasQrUpgrade: data.hasQrUpgrade || false,
          qrUpgradePaidAt: data.qrUpgradePaidAt?.toDate(),
          pricingTier: data.pricingTier,
          amountPaid: data.amountPaid || 0,
          paymentStatus: data.paymentStatus || 'unpaid',
          location: data.location,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          approvedAt: data.approvedAt?.toDate(),
          pausedAt: data.pausedAt?.toDate(),
          deletedAt: data.deletedAt?.toDate(),
          viewCount: data.viewCount || 0,
          shareCount: data.shareCount || 0,
          moderatedBy: data.moderatedBy,
          moderationNotes: data.moderationNotes,
          isPublic: data.isPublic !== false,
          isActive: data.isActive !== false,
        };

        userPetitions.push(petition);
        totalSignatures += petition.currentSignatures;

        if (petition.status === 'approved') activePetitions++;
        if (petition.status === 'pending') pendingPetitions++;
      });

      setPetitions(userPetitions);

      // Generate recent activity
      const recentActivity = generateRecentActivity(userPetitions);

      setStats({
        totalPetitions: userPetitions.length,
        activePetitions,
        pendingPetitions,
        totalSignatures,
        recentActivity,
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const generateRecentActivity = (petitions: Petition[]): ActivityItem[] => {
    const activities: ActivityItem[] = [];

    // Add recent petition creations
    petitions
      .filter((p) => {
        const daysSinceCreated =
          (Date.now() - p.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceCreated <= 7; // Last 7 days
      })
      .forEach((petition) => {
        activities.push({
          id: `created-${petition.id}`,
          type: 'petition_created',
          message: `Created petition "${petition.title}"`,
          timestamp: petition.createdAt,
          petitionId: petition.id,
          petitionTitle: petition.title,
        });
      });

    // Add recent approvals
    petitions
      .filter((p) => p.approvedAt && p.status === 'approved')
      .filter((p) => {
        const daysSinceApproved =
          (Date.now() - (p.approvedAt?.getTime() || 0)) / (1000 * 60 * 60 * 24);
        return daysSinceApproved <= 7;
      })
      .forEach((petition) => {
        activities.push({
          id: `approved-${petition.id}`,
          type: 'petition_approved',
          message: `Petition "${petition.title}" was approved`,
          timestamp: petition.approvedAt!,
          petitionId: petition.id,
          petitionTitle: petition.title,
        });
      });

    // Add milestone achievements
    petitions
      .filter((p) => p.currentSignatures > 0)
      .forEach((petition) => {
        const progress =
          (petition.currentSignatures / petition.targetSignatures) * 100;
        const milestones = [25, 50, 75, 100];

        milestones.forEach((milestone) => {
          if (progress >= milestone) {
            activities.push({
              id: `milestone-${petition.id}-${milestone}`,
              type: 'milestone',
              message: `"${petition.title}" reached ${milestone}% of its goal`,
              timestamp: new Date(
                petition.updatedAt.getTime() - Math.random() * 86400000
              ), // Random time in last day
              petitionId: petition.id,
              petitionTitle: petition.title,
            });
          }
        });
      });

    // Sort by timestamp and return recent items
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'petition_created':
        return '📝';
      case 'petition_approved':
        return '✅';
      case 'signature':
        return '✍️';
      case 'milestone':
        return '🎯';
      default:
        return '📊';
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'petition_created':
        return 'text-blue-600';
      case 'petition_approved':
        return 'text-green-600';
      case 'signature':
        return 'text-purple-600';
      case 'milestone':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Petitions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats.totalPetitions
                  )}
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Petitions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats.activePetitions
                  )}
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats.pendingPetitions
                  )}
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
                <p className="text-sm font-medium text-gray-600">
                  Total Signatures
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats.totalSignatures.toLocaleString()
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live Updates
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : stats.recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-300"
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No recent activity
              </h3>
              <p className="text-gray-600">
                Create your first petition to see activity here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`text-lg ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Petition Updates */}
      {petitions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Petitions (Live)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {petitions.slice(0, 5).map((petition) => {
                const progress =
                  (petition.currentSignatures / petition.targetSignatures) *
                  100;
                return (
                  <div
                    key={petition.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {petition.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            petition.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : petition.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : petition.status === 'paused'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {petition.status}
                        </span>
                        <span className="text-sm text-gray-600">
                          {petition.currentSignatures.toLocaleString()}{' '}
                          signatures
                        </span>
                        <span className="text-sm text-gray-500">
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
