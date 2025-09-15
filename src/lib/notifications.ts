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
  data?: any
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
      notificationData
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
  limit: number = 20
): Promise<Notification[]> => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const notificationsQuery = query(
      notificationsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
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
  notificationId: string
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
  userId: string
): Promise<void> => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const unreadQuery = query(
      notificationsRef,
      where('userId', '==', userId),
      where('read', '==', false)
    );

    const snapshot = await getDocs(unreadQuery);
    const updatePromises = snapshot.docs.map((doc) =>
      updateDoc(doc.ref, { read: true })
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
  callback: (notifications: Notification[]) => void
) => {
  const notificationsRef = collection(db, 'notifications');
  const notificationsQuery = query(
    notificationsRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
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
  moderatorNotes?: string
): Promise<void> => {
  let title = '';
  let message = '';

  switch (newStatus) {
    case 'approved':
      title = '🎉 Petition Approved!';
      message = `Your petition "${petitionTitle}" has been approved and is now live.`;
      break;
    case 'paused':
      title = '⏸️ Petition Paused';
      message = `Your petition "${petitionTitle}" has been paused by moderators.`;
      break;
    case 'deleted':
      title = '❌ Petition Removed';
      message = `Your petition "${petitionTitle}" has been removed.`;
      break;
    default:
      title = '📝 Petition Status Updated';
      message = `Your petition "${petitionTitle}" status has been updated to ${newStatus}.`;
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
    }
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
  milestone: number
): Promise<void> => {
  const title = `🎯 Milestone Reached!`;
  const message = `Your petition "${petitionTitle}" has reached ${milestone}% of its goal with ${currentSignatures.toLocaleString()} signatures!`;

  await createNotification(creatorId, 'signature_milestone', title, message, {
    petitionId,
    petitionTitle,
    currentSignatures,
    milestone,
  });
};

/**
 * Create new comment notification
 */
export const notifyNewComment = async (
  petitionId: string,
  creatorId: string,
  petitionTitle: string,
  commenterName: string,
  commentId: string
): Promise<void> => {
  const title = '💬 New Comment';
  const message = `${commenterName} commented on your petition "${petitionTitle}".`;

  await createNotification(creatorId, 'new_comment', title, message, {
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
  data?: any
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
  data?: any
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
