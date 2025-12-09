/**
 * Appeals Service - Admin SDK Version
 * Server-side only - uses Firebase Admin SDK to bypass security rules
 */

import { adminDb } from './firebase-admin';
import {
  Appeal,
  AppealStatus,
  AppealMessage,
  StatusChange,
} from '@/types/appeal';

/**
 * Create a new appeal for a petition (Admin SDK)
 */
export async function createAppealAdmin(
  petitionId: string,
  creatorId: string,
  creatorName: string,
  creatorEmail: string,
  message: string
): Promise<string> {
  // Get petition data
  const petitionRef = adminDb.collection('petitions').doc(petitionId);
  const petitionSnap = await petitionRef.get();

  if (!petitionSnap.exists) {
    throw new Error('Petition not found');
  }

  const petitionData = petitionSnap.data();

  // Validate petition status allows appeals
  if (
    petitionData?.status !== 'paused' &&
    petitionData?.status !== 'rejected'
  ) {
    throw new Error(
      'Appeals can only be created for paused or rejected petitions'
    );
  }

  // Check for existing open appeals
  const existingAppeals = await adminDb
    .collection('appeals')
    .where('petitionId', '==', petitionId)
    .where('status', 'in', ['pending', 'in-progress'])
    .get();

  if (!existingAppeals.empty) {
    throw new Error(
      'An open appeal already exists for this petition. Please wait for a response.'
    );
  }

  // Create appeal document
  const now = new Date();
  const appealData = {
    petitionId,
    petitionTitle: petitionData?.title || 'Unknown Petition',
    creatorId,
    creatorName,
    creatorEmail,
    status: 'pending' as AppealStatus,
    messages: [
      {
        id: `msg_${Date.now()}`,
        senderId: creatorId,
        senderName: creatorName,
        senderRole: 'creator' as const,
        content: message,
        createdAt: now,
        isInternal: false,
      },
    ],
    statusHistory: [
      {
        status: 'pending' as AppealStatus,
        changedBy: creatorId,
        changedAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await adminDb.collection('appeals').add(appealData);

  return docRef.id;
}

/**
 * Get appeals for a user based on their role (Admin SDK)
 */
export async function getAppealsForUserAdmin(
  userId: string,
  role: string,
  statusFilter?: AppealStatus
): Promise<Appeal[]> {
  let query = adminDb.collection('appeals');

  // Role-based filtering
  if (role === 'user' || role === 'creator') {
    // Creators only see their own appeals
    query = query.where('creatorId', '==', userId) as any;
  }
  // Moderators and admins see all appeals (no additional filter needed)

  // Status filter
  if (statusFilter) {
    query = query.where('status', '==', statusFilter) as any;
  }

  // Order by creation date
  query = query.orderBy('createdAt', 'desc') as any;

  const snapshot = await query.get();
  const appeals: Appeal[] = [];

  snapshot.forEach((doc: any) => {
    const data = doc.data();
    appeals.push({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      resolvedAt: data.resolvedAt?.toDate(),
      messages:
        data.messages?.map((msg: any) => ({
          ...msg,
          createdAt: msg.createdAt?.toDate() || new Date(),
        })) || [],
      statusHistory:
        data.statusHistory?.map((sh: any) => ({
          ...sh,
          changedAt: sh.changedAt?.toDate() || new Date(),
        })) || [],
    } as Appeal);
  });

  return appeals;
}

/**
 * Get a single appeal by ID (Admin SDK)
 */
export async function getAppealAdmin(
  appealId: string,
  userId: string,
  role: string
): Promise<Appeal | null> {
  const appealRef = adminDb.collection('appeals').doc(appealId);
  const appealSnap = await appealRef.get();

  if (!appealSnap.exists) {
    return null;
  }

  const appealData = appealSnap.data();

  // Check permissions
  if (role !== 'admin' && role !== 'moderator' && role !== 'master_admin') {
    if (appealData?.creatorId !== userId) {
      throw new Error('Unauthorized access to this appeal');
    }
  }

  const data = appealSnap.data();
  const appeal: Appeal = {
    id: appealSnap.id,
    ...data,
    createdAt: data?.createdAt?.toDate() || new Date(),
    updatedAt: data?.updatedAt?.toDate() || new Date(),
    resolvedAt: data?.resolvedAt?.toDate(),
    messages:
      data?.messages?.map((msg: any) => ({
        ...msg,
        createdAt: msg.createdAt?.toDate() || new Date(),
      })) || [],
    statusHistory:
      data?.statusHistory?.map((sh: any) => ({
        ...sh,
        changedAt: sh.changedAt?.toDate() || new Date(),
      })) || [],
  } as Appeal;

  // Filter out internal moderator notes for creators
  if (role === 'user' || role === 'creator') {
    appeal.messages = appeal.messages.filter((msg) => !msg.isInternal);
  }

  return appeal;
}

/**
 * Add a message to an appeal thread (Admin SDK)
 */
export async function addAppealMessageAdmin(
  appealId: string,
  senderId: string,
  senderName: string,
  senderRole: 'creator' | 'moderator',
  content: string,
  isInternal: boolean = false
): Promise<string> {
  const appealRef = adminDb.collection('appeals').doc(appealId);
  const appealSnap = await appealRef.get();

  if (!appealSnap.exists) {
    throw new Error('Appeal not found');
  }

  const now = new Date();
  const messageId = `msg_${Date.now()}`;

  const newMessage: AppealMessage = {
    id: messageId,
    senderId,
    senderName,
    senderRole,
    content,
    createdAt: now,
    isInternal,
  };

  // Update appeal with new message
  await appealRef.update({
    messages: [...(appealSnap.data()?.messages || []), newMessage],
    updatedAt: now,
  });

  return messageId;
}

/**
 * Update appeal status (Admin SDK)
 */
export async function updateAppealStatusAdmin(
  appealId: string,
  status: AppealStatus,
  changedBy: string,
  changedByName: string,
  reason?: string
): Promise<void> {
  const appealRef = adminDb.collection('appeals').doc(appealId);
  const appealSnap = await appealRef.get();

  if (!appealSnap.exists) {
    throw new Error('Appeal not found');
  }

  const now = new Date();

  const statusChange: StatusChange = {
    status,
    changedBy,
    changedAt: now,
    reason,
  };

  const updateData: any = {
    status,
    statusHistory: [...(appealSnap.data()?.statusHistory || []), statusChange],
    updatedAt: now,
  };

  // If resolved or rejected, set resolvedAt timestamp
  if (status === 'resolved' || status === 'rejected') {
    updateData.resolvedAt = now;
  }

  await appealRef.update(updateData);
}
