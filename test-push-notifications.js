/**
 * Test Push Notifications
 * 
 * Run this in the browser console to test push notifications manually
 */

// Check if service worker is registered
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('📱 Service Workers:', registrations.length);
  registrations.forEach((reg, i) => {
    console.log(`  ${i + 1}. Scope: ${reg.scope}`);
    console.log(`     Active: ${reg.active ? 'Yes' : 'No'}`);
  });
});

// Check notification permission
console.log('🔔 Notification Permission:', Notification.permission);

// Check if push is supported
if ('PushManager' in window) {
  console.log('✅ Push notifications are supported');
} else {
  console.log('❌ Push notifications are NOT supported');
}

// Try to get FCM token
async function testFCMToken() {
  try {
    const { getMessaging, getToken } = await import('firebase/messaging');
    const { app } = await import('./src/lib/firebase');
    
    const messaging = getMessaging(app);
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || 'BKSAZcAXAFWEt8aB9sIU0aqT0_T5mmJ0HMFg2QdvSbBb_YTghHIzJ7QyR0vtXFTkPZQDzFRI_MxZcoCbqALcudg';
    
    console.log('🔑 VAPID Key:', vapidKey.substring(0, 20) + '...');
    
    const token = await getToken(messaging, { vapidKey });
    
    if (token) {
      console.log('✅ FCM Token obtained!');
      console.log('Token:', token);
      return token;
    } else {
      console.log('❌ No FCM token obtained');
    }
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
  }
}

// Run the test
console.log('\n🧪 Testing Push Notifications...\n');
testFCMToken();
