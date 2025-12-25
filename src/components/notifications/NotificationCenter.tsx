'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { useTranslation } from '@/hooks/useTranslation';
import {
  subscribeToUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getNotificationIcon,
  getNotificationColor,
  type Notification,
  type NotificationType,
} from '@/lib/notifications';

interface NotificationCenterProps {
  className?: string;
}

export default function NotificationCenter({
  className = '',
}: NotificationCenterProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToUserNotifications(
      user.uid,
      (newNotifications) => {
        setNotifications(newNotifications);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    if (!user || unreadCount === 0) return;

    try {
      await markAllNotificationsAsRead(user.uid);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return t('notifications.justNow');
    if (diffInSeconds < 3600)
      return t('notifications.minutesAgo', {
        count: Math.floor(diffInSeconds / 60),
      });
    if (diffInSeconds < 86400)
      return t('notifications.hoursAgo', {
        count: Math.floor(diffInSeconds / 3600),
      });
    if (diffInSeconds < 604800)
      return t('notifications.daysAgo', {
        count: Math.floor(diffInSeconds / 86400),
      });

    return date.toLocaleDateString();
  };

  const getNotificationLink = (notification: Notification): string => {
    if (notification.data?.petitionId) {
      const baseUrl = `/petitions/${notification.data.petitionId}`;

      // Add notification type and reason as URL parameters for NotificationAlert
      const params = new URLSearchParams();

      // Map notification type to alert type
      if (
        notification.type === 'petition_status_change' &&
        notification.data?.newStatus
      ) {
        const status = notification.data.newStatus;
        params.append('notif', status);

        // Add moderator notes/reason if available
        if (notification.data?.moderatorNotes) {
          params.append('reason', notification.data.moderatorNotes);
        }
      } else if (notification.type === 'petition_approved') {
        params.append('notif', 'approved');
        if (notification.data?.moderatorNotes) {
          params.append('reason', notification.data.moderatorNotes);
        }
      } else if (notification.type === 'petition_rejected') {
        params.append('notif', 'rejected');
        if (notification.data?.moderatorNotes) {
          params.append('reason', notification.data.moderatorNotes);
        }
      } else if (notification.type === 'petition_paused') {
        params.append('notif', 'paused');
        if (notification.data?.moderatorNotes) {
          params.append('reason', notification.data.moderatorNotes);
        }
      }

      const queryString = params.toString();
      return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    }
    return '/dashboard';
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
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
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {t('notifications.title')}
                </CardTitle>
                {unreadCount > 0 && (
                  <Button
                    onClick={handleMarkAllAsRead}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    {t('notifications.markAllRead')}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">
                    {t('notifications.loading')}
                  </p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {t('notifications.noNotifications')}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {t('notifications.allCaughtUp')}
                  </p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {notifications.slice(0, 10).map((notification) => (
                    <Link
                      key={notification.id}
                      href={getNotificationLink(notification)}
                      onClick={() => handleNotificationClick(notification)}
                      className={`block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`text-lg ${getNotificationColor(
                            notification.type
                          )}`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p
                              className={`text-sm font-medium ${
                                !notification.read
                                  ? 'text-gray-900'
                                  : 'text-gray-700'
                              }`}
                            >
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {notifications.length > 10 && (
                    <div className="p-3 text-center border-t border-gray-100">
                      <Link
                        href="/notifications"
                        className="text-sm text-green-600 hover:text-green-500 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        {t('notifications.viewAll')}
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
