// Firebase Cloud Messaging Service Worker
// This file handles background push notifications

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

function getFirebaseConfigFromQuery() {
  const search = self.location.search || '';
  const params = new URLSearchParams(search);

  const config = {
    apiKey: params.get('apiKey') || '',
    authDomain: params.get('authDomain') || '',
    projectId: params.get('projectId') || '',
    storageBucket: params.get('storageBucket') || '',
    messagingSenderId: params.get('messagingSenderId') || '',
    appId: params.get('appId') || '',
  };

  if (
    !config.apiKey ||
    !config.authDomain ||
    !config.projectId ||
    !config.messagingSenderId ||
    !config.appId
  ) {
    console.error(
      '[firebase-messaging-sw] Missing Firebase config query params. Push background handling disabled.',
    );
    return null;
  }

  return config;
}

const firebaseConfig = getFirebaseConfigFromQuery();
const messaging = firebaseConfig
  ? firebase.messaging.isSupported()
    ? (firebase.initializeApp(firebaseConfig), firebase.messaging())
    : null
  : null;

// Handle background messages
if (messaging) {
  messaging.onBackgroundMessage((payload) => {
    console.log('Background message received:', payload);

    const notificationTitle = payload.notification?.title || '3arida';
    const notificationOptions = {
      body: payload.notification?.body || 'You have a new notification',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      data: payload.data,
      tag: payload.data?.petitionId || 'default',
      requireInteraction: false,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  // Navigate to the petition or relevant page
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window if none exists
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
