import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

export type NotificationType =
  | 'petition_approved'
  | 'petition_rejected'
  | 'petition_paused'
  | 'signature_milestone'
  | 'petition_status_change'
  | 'new_comment'
  | 'petition_update';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: {
    petitionId?: string;
    petitionTitle?: string;
    milestone?: number;
    commentId?: string;
    [key: string]: any;
  };
  read: boolean;
  createdAt: Date;
}

/**
 * Create a new notification
 */
export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  data?: any,
): Promise<string> => {
  try {
    const notificationData = {
      userId,
      type,
      title,
      message,
      data: data || {},
      read: false,
      createdAt: Timestamp.fromDate(new Date()),
    };

    const docRef = await addDoc(
      collection(db, 'notifications'),
      notificationData,
    );
    return docRef.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error('Failed to create notification');
  }
};

/**
 * Get user notifications
 */
export const getUserNotifications = async (
  userId: string,
  limit: number = 20,
): Promise<Notification[]> => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const notificationsQuery = query(
      notificationsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
    );

    const snapshot = await getDocs(notificationsQuery);
    const notifications: Notification[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      notifications.push({
        id: doc.id,
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || {},
        read: data.read || false,
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    });

    return notifications.slice(0, limit);
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw new Error('Failed to get notifications');
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (
  notificationId: string,
): Promise<void> => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw new Error('Failed to mark notification as read');
  }
};

/**
 * Mark all user notifications as read
 */
export const markAllNotificationsAsRead = async (
  userId: string,
): Promise<void> => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const unreadQuery = query(
      notificationsRef,
      where('userId', '==', userId),
      where('read', '==', false),
    );

    const snapshot = await getDocs(unreadQuery);
    const updatePromises = snapshot.docs.map((doc) =>
      updateDoc(doc.ref, { read: true }),
    );

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw new Error('Failed to mark all notifications as read');
  }
};

/**
 * Listen to real-time notifications for a user
 */
export const subscribeToUserNotifications = (
  userId: string,
  callback: (notifications: Notification[]) => void,
) => {
  const notificationsRef = collection(db, 'notifications');
  const notificationsQuery = query(
    notificationsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(notificationsQuery, (snapshot) => {
    const notifications: Notification[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      notifications.push({
        id: doc.id,
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || {},
        read: data.read || false,
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    });

    callback(notifications);
  });
};

/**
 * Create petition status change notification
 */
export const notifyPetitionStatusChange = async (
  petitionId: string,
  creatorId: string,
  petitionTitle: string,
  newStatus: string,
  moderatorNotes?: string,
  locale: 'ar' | 'fr' = 'ar',
): Promise<void> => {
  let title = '';
  let message = '';

  // Translation messages
  const translations = {
    ar: {
      approved: {
        title: '🎉 تمت الموافقة على العريضة!',
        message: `تمت الموافقة على عريضتك "${petitionTitle}" ونشرها على المنصة.`,
      },
      paused: {
        title: '⏸️ تم إيقاف العريضة مؤقتاً',
        message: `تم إيقاف عريضتك "${petitionTitle}" مؤقتاً من قبل المشرفين.`,
      },
      deleted: {
        title: '❌ تم حذف العريضة',
        message: `تم حذف عريضتك "${petitionTitle}".`,
      },
      default: {
        title: '📝 تم تحديث حالة العريضة',
        message: `تم تحديث حالة عريضتك "${petitionTitle}" إلى ${newStatus}.`,
      },
    },
    fr: {
      approved: {
        title: '🎉 Pétition Approuvée!',
        message: `Votre pétition "${petitionTitle}" a été approuvée et est maintenant en ligne.`,
      },
      paused: {
        title: '⏸️ Pétition Suspendue',
        message: `Votre pétition "${petitionTitle}" a été suspendue par les modérateurs.`,
      },
      deleted: {
        title: '❌ Pétition Supprimée',
        message: `Votre pétition "${petitionTitle}" a été supprimée.`,
      },
      default: {
        title: '📝 Statut de Pétition Mis à Jour',
        message: `Le statut de votre pétition "${petitionTitle}" a été mis à jour à ${newStatus}.`,
      },
    },
  };

  const statusTranslations = translations[locale];

  switch (newStatus) {
    case 'approved':
      title = statusTranslations.approved.title;
      message = statusTranslations.approved.message;
      break;
    case 'paused':
      title = statusTranslations.paused.title;
      message = statusTranslations.paused.message;
      break;
    case 'deleted':
      title = statusTranslations.deleted.title;
      message = statusTranslations.deleted.message;
      break;
    default:
      title = statusTranslations.default.title;
      message = statusTranslations.default.message;
  }

  if (moderatorNotes) {
    message += ` Reason: ${moderatorNotes}`;
  }

  await createNotification(
    creatorId,
    'petition_status_change',
    title,
    message,
    {
      petitionId,
      petitionTitle,
      newStatus,
      moderatorNotes,
    },
  );
};

/**
 * Create signature milestone notification
 */
export const notifySignatureMilestone = async (
  petitionId: string,
  creatorId: string,
  petitionTitle: string,
  currentSignatures: number,
  milestone: number,
  locale: 'ar' | 'fr' = 'ar',
): Promise<void> => {
  const translations = {
    ar: {
      title: '🎯 تم الوصول إلى هدف!',
      message: `وصلت عريضتك "${petitionTitle}" إلى ${milestone}% من هدفها مع ${currentSignatures.toLocaleString()} توقيع!`,
    },
    fr: {
      title: '🎯 Objectif Atteint!',
      message: `Votre pétition "${petitionTitle}" a atteint ${milestone}% de son objectif avec ${currentSignatures.toLocaleString()} signatures!`,
    },
  };

  const t = translations[locale];

  await createNotification(
    creatorId,
    'signature_milestone',
    t.title,
    t.message,
    {
      petitionId,
      petitionTitle,
      currentSignatures,
      milestone,
    },
  );
};

/**
 * Create new comment notification
 */
export const notifyNewComment = async (
  petitionId: string,
  creatorId: string,
  petitionTitle: string,
  commenterName: string,
  commentId: string,
  locale: 'ar' | 'fr' = 'ar',
): Promise<void> => {
  const translations = {
    ar: {
      title: '💬 تعليق جديد',
      message: `${commenterName} علق على عريضتك "${petitionTitle}".`,
    },
    fr: {
      title: '💬 Nouveau Commentaire',
      message: `${commenterName} a commenté votre pétition "${petitionTitle}".`,
    },
  };

  const t = translations[locale];

  await createNotification(creatorId, 'new_comment', t.title, t.message, {
    petitionId,
    petitionTitle,
    commenterName,
    commentId,
  });
};

/**
 * Send email notification (placeholder for future implementation)
 */
export const sendEmailNotification = async (
  email: string,
  subject: string,
  message: string,
  data?: any,
): Promise<void> => {
  // This would integrate with an email service like SendGrid, Mailgun, etc.
  // For now, we'll just log it
  console.log('Email notification:', {
    to: email,
    subject,
    message,
    data,
  });

  // TODO: Implement actual email sending
  // Example with SendGrid:
  // const msg = {
  //   to: email,
  //   from: 'notifications@3arida.ma',
  //   subject,
  //   text: message,
  //   html: generateEmailTemplate(subject, message, data),
  // };
  // await sgMail.send(msg);
};

/**
 * Send push notification (placeholder for future implementation)
 */
export const sendPushNotification = async (
  userId: string,
  title: string,
  message: string,
  data?: any,
): Promise<void> => {
  // This would integrate with Firebase Cloud Messaging or similar
  console.log('Push notification:', {
    userId,
    title,
    message,
    data,
  });

  // TODO: Implement actual push notifications
};

/**
 * Get notification icon based on type
 */
export const getNotificationIcon = (type: NotificationType): string => {
  switch (type) {
    case 'petition_approved':
      return '🎉';
    case 'petition_rejected':
      return '❌';
    case 'petition_paused':
      return '⏸️';
    case 'signature_milestone':
      return '🎯';
    case 'petition_status_change':
      return '📝';
    case 'new_comment':
      return '💬';
    case 'petition_update':
      return '📢';
    default:
      return '🔔';
  }
};

/**
 * Get notification color based on type
 */
export const getNotificationColor = (type: NotificationType): string => {
  switch (type) {
    case 'petition_approved':
      return 'text-green-600';
    case 'petition_rejected':
      return 'text-red-600';
    case 'petition_paused':
      return 'text-yellow-600';
    case 'signature_milestone':
      return 'text-purple-600';
    case 'petition_status_change':
      return 'text-blue-600';
    case 'new_comment':
      return 'text-indigo-600';
    case 'petition_update':
      return 'text-orange-600';
    default:
      return 'text-gray-600';
  }
};

/**
 * Notify admins when a creator requests petition deletion
 */
export const notifyAdminsOfDeletionRequest = async (
  petitionId: string,
  petitionTitle: string,
  creatorId: string,
  reason: string,
  signatureCount: number,
): Promise<void> => {
  try {
    // Get all admin and moderator users
    const usersRef = collection(db, 'users');
    const adminsQuery = query(
      usersRef,
      where('role', 'in', ['admin', 'moderator']),
    );
    const adminsSnapshot = await getDocs(adminsQuery);

    // Create notification for each admin/moderator
    const notificationPromises = adminsSnapshot.docs.map((adminDoc) =>
      createNotification(
        adminDoc.id,
        'petition_status_change',
        'Deletion Request',
        `${creatorId} requested deletion of "${petitionTitle}" (${signatureCount} signatures). Reason: ${reason}`,
        {
          petitionId,
          petitionTitle,
          creatorId,
          reason,
          signatureCount,
          actionType: 'deletion_request',
        },
      ),
    );

    await Promise.all(notificationPromises);
    console.log(
      `✅ Notified ${adminsSnapshot.size} admins of deletion request`,
    );
  } catch (error) {
    console.error('Error notifying admins of deletion request:', error);
    throw error;
  }
};

/**
 * Notify creator when deletion request is approved
 */
export const notifyDeletionRequestApproved = async (
  petitionId: string,
  petitionTitle: string,
  creatorId: string,
): Promise<void> => {
  try {
    await createNotification(
      creatorId,
      'petition_status_change',
      'Deletion Request Approved',
      `Your deletion request for "${petitionTitle}" has been approved. The petition has been removed.`,
      {
        petitionId,
        petitionTitle,
        actionType: 'deletion_approved',
      },
    );
    console.log('✅ Notified creator of deletion approval');
  } catch (error) {
    console.error('Error notifying creator of deletion approval:', error);
    throw error;
  }
};

/**
 * Notify creator when deletion request is denied
 */
export const notifyDeletionRequestDenied = async (
  petitionId: string,
  petitionTitle: string,
  creatorId: string,
  reason: string,
): Promise<void> => {
  try {
    await createNotification(
      creatorId,
      'petition_status_change',
      'Deletion Request Denied',
      `Your deletion request for "${petitionTitle}" has been denied. Reason: ${reason}`,
      {
        petitionId,
        petitionTitle,
        reason,
        actionType: 'deletion_denied',
      },
    );
    console.log('✅ Notified creator of deletion denial');
  } catch (error) {
    console.error('Error notifying creator of deletion denial:', error);
    throw error;
  }
};
