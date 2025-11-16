/**
 * Push Notifications Service
 * Uses Firebase Cloud Messaging for FREE unlimited push notifications
 */

import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from './firebase';

// Initialize Firebase Messaging
let messaging: any = null;

if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error('Failed to initialize Firebase Messaging:', error);
  }
}

/**
 * Request notification permission and get FCM token
 */
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // Get FCM token
    if (!messaging) {
      console.error('Firebase Messaging not initialized');
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
}

/**
 * Listen for foreground messages
 */
export function onForegroundMessage(callback: (payload: any) => void) {
  if (!messaging) return;

  return onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);
    callback(payload);

    // Show notification
    if (payload.notification) {
      new Notification(payload.notification.title || 'New Notification', {
        body: payload.notification.body,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        data: payload.data,
      });
    }
  });
}

/**
 * Save FCM token to Firestore
 */
export async function saveFCMToken(userId: string, token: string) {
  try {
    const { doc, setDoc } = await import('firebase/firestore');
    const { db } = await import('./firebase');

    await setDoc(
      doc(db, 'users', userId),
      {
        fcmToken: token,
        fcmTokenUpdatedAt: new Date(),
      },
      { merge: true }
    );

    console.log('FCM token saved to Firestore');
    return true;
  } catch (error) {
    console.error('Error saving FCM token:', error);
    return false;
  }
}

/**
 * Check if push notifications are supported
 */
export function isPushNotificationSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission | null {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }
  return Notification.permission;
}
