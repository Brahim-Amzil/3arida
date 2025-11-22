'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  requestNotificationPermission,
  saveFCMToken,
  isPushNotificationSupported,
  getNotificationPermission,
  onForegroundMessage,
} from '@/lib/push-notifications';

export default function PushNotificationPrompt() {
  const { user } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Check if we should show the prompt
    if (!mounted || !user) return;
    if (!isPushNotificationSupported()) return;

    // Check if dismissed recently
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('pushNotificationDismissed');
      if (dismissed) {
        const dismissedTime = parseInt(dismissed);
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - dismissedTime < sevenDays) {
          return;
        }
      }
    }

    const permission = getNotificationPermission();
    if (permission === 'default') {
      // Show prompt after 5 seconds
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else if (permission === 'granted') {
      // Already granted, get token
      handleEnableNotifications();
    }
  }, [mounted, user]);

  useEffect(() => {
    // Listen for foreground messages
    if (!mounted || !user) return;

    const unsubscribe = onForegroundMessage((payload) => {
      console.log('Received foreground message:', payload);
      // You can show a toast notification here
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [mounted, user]);

  const handleEnableNotifications = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const token = await requestNotificationPermission();
      if (token) {
        await saveFCMToken(user.uid, token);
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't ask again for 7 days
    if (typeof window !== 'undefined') {
      localStorage.setItem('pushNotificationDismissed', Date.now().toString());
    }
  };

  if (!mounted || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
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
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            تفعيل الإشعارات الفورية
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            احصل على تحديثات فورية عند الموافقة على عريضتك أو وصولها لهدف جديد
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleEnableNotifications}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'جاري التفعيل...' : 'تفعيل'}
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              لاحقاً
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
