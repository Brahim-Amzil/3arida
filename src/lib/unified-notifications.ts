/**
 * Unified Notification Service
 * Smart strategy: Email for welcome/signature, Push for everything else
 */

import {
  sendWelcomeEmail,
  sendSignatureConfirmationEmail,
} from './email-notifications';

// Push notification service (to be implemented with FCM token)
async function sendPushNotification(
  userId: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<boolean> {
  try {
    // Get user's FCM token from Firestore
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await import('./firebase');

    const userDoc = await getDoc(doc(db, 'users', userId));
    const fcmToken = userDoc.data()?.fcmToken;

    if (!fcmToken) {
      console.log('No FCM token for user:', userId);
      return false;
    }

    // Send via server-side API (will be implemented)
    const response = await fetch('/api/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: fcmToken,
        title,
        body,
        data,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send push notification:', error);
    return false;
  }
}

/**
 * Notification Strategy Configuration
 */
const NOTIFICATION_STRATEGY = {
  // Email ONLY for these (important receipts)
  emailOnly: ['welcome', 'signature_confirmation'],

  // Push ONLY for these (instant updates)
  pushOnly: [
    'petition_approved',
    'petition_update',
    'milestone',
    'comment',
    'like',
  ],

  // Both for critical actions (redundancy)
  both: ['account_security', 'payment_confirmation'],
};

/**
 * 1. Welcome Notification (EMAIL ONLY)
 * Sent when user registers - they don't have push yet
 */
export async function notifyWelcome(userName: string, userEmail: string) {
  console.log('📧 Sending welcome email to:', userEmail);
  await sendWelcomeEmail(userName, userEmail);
}

/**
 * 2. Signature Confirmation (EMAIL ONLY)
 * Important receipt - users expect email confirmation
 */
export async function notifySignatureConfirmation(
  userName: string,
  userEmail: string,
  petitionTitle: string,
  petitionId: string
) {
  console.log('📧 Sending signature confirmation email to:', userEmail);
  await sendSignatureConfirmationEmail(
    userName,
    userEmail,
    petitionTitle,
    petitionId
  );
}

/**
 * 3. Petition Approved (PUSH ONLY)
 * Instant notification - no email needed
 */
export async function notifyPetitionApproved(
  userId: string,
  userName: string,
  petitionTitle: string,
  petitionId: string
) {
  console.log('🔔 Sending push notification for petition approval');

  await sendPushNotification(
    userId,
    '✅ تمت الموافقة على عريضتك',
    `عريضتك "${petitionTitle}" الآن متاحة للتوقيع`,
    {
      type: 'petition_approved',
      petitionId,
      url: `/petitions/${petitionId}`,
    }
  );
}

/**
 * 4. Petition Update (PUSH ONLY)
 * Instant notification to all signers
 */
export async function notifyPetitionUpdate(
  signerIds: string[],
  petitionTitle: string,
  petitionId: string,
  updateTitle: string
) {
  console.log(`🔔 Sending push notifications to ${signerIds.length} signers`);

  const promises = signerIds.map((userId) =>
    sendPushNotification(
      userId,
      `📢 تحديث جديد: ${petitionTitle}`,
      updateTitle,
      {
        type: 'petition_update',
        petitionId,
        url: `/petitions/${petitionId}`,
      }
    )
  );

  await Promise.allSettled(promises);
}

/**
 * 5. Milestone Reached (PUSH ONLY)
 * Instant celebration notification
 */
export async function notifyMilestone(
  userId: string,
  petitionTitle: string,
  petitionId: string,
  milestone: number,
  currentSignatures: number
) {
  console.log(`🔔 Sending milestone notification: ${milestone}%`);

  await sendPushNotification(
    userId,
    `🎯 عريضتك وصلت إلى ${milestone}%`,
    `${currentSignatures.toLocaleString()} توقيع على "${petitionTitle}"`,
    {
      type: 'milestone',
      petitionId,
      milestone: milestone.toString(),
      url: `/petitions/${petitionId}`,
    }
  );
}

/**
 * 6. Comment on Petition (PUSH ONLY)
 * Quick notification - no email spam
 */
export async function notifyComment(
  userId: string,
  petitionTitle: string,
  petitionId: string,
  commenterName: string
) {
  console.log('🔔 Sending comment notification');

  await sendPushNotification(
    userId,
    '💬 تعليق جديد على عريضتك',
    `${commenterName} علق على "${petitionTitle}"`,
    {
      type: 'comment',
      petitionId,
      url: `/petitions/${petitionId}#comments`,
    }
  );
}

/**
 * Helper: Check if user has push notifications enabled
 */
export async function userHasPushEnabled(userId: string): Promise<boolean> {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await import('./firebase');

    const userDoc = await getDoc(doc(db, 'users', userId));
    return !!userDoc.data()?.fcmToken;
  } catch (error) {
    return false;
  }
}

/**
 * Get notification statistics
 */
export function getNotificationStats() {
  return {
    emailOnly: NOTIFICATION_STRATEGY.emailOnly.length,
    pushOnly: NOTIFICATION_STRATEGY.pushOnly.length,
    both: NOTIFICATION_STRATEGY.both.length,
    strategy: 'Email for receipts, Push for updates',
    costSavings: '95% reduction vs email-only',
  };
}
