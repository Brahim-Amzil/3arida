/**
 * Appeals Service
 * Handles all business logic for the appeals management system
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Appeal,
  AppealStatus,
  AppealFilters,
  AppealMessage,
  StatusChange,
  CreateAppealData,
  AppealReplyData,
  AppealStatusUpdateData,
} from '@/types/appeal';

/**
 * Create a new appeal for a petition
 */
export async function createAppeal(
  petitionId: string,
  creatorId: string,
  creatorName: string,
  creatorEmail: string,
  message: string
): Promise<string> {
  // Validate message is not empty or whitespace
  if (!message || message.trim().length === 0) {
    throw new Error('Appeal message cannot be empty');
  }

  // Check if petition exists and get its title
  const petitionRef = doc(db, 'petitions', petitionId);
  const petitionSnap = await getDoc(petitionRef);

  if (!petitionSnap.exists()) {
    throw new Error('Petition not found');
  }

  const petitionData = petitionSnap.data();

  // Validate petition status allows appeals
  if (petitionData.status !== 'paused' && petitionData.status !== 'rejected') {
    throw new Error(
      'Appeals can only be created for paused or rejected petitions'
    );
  }

  // Validate user is the petition creator
  if (petitionData.creatorId !== creatorId) {
    throw new Error('Only the petition creator can create an appeal');
  }

  // Check for existing open appeals
  const hasOpen = await hasOpenAppeal(petitionId);
  if (hasOpen) {
    throw new Error('An open appeal already exists for this petition');
  }

  // Create initial message
  const initialMessage: AppealMessage = {
    id: crypto.randomUUID(),
    senderId: creatorId,
    senderName: creatorName,
    senderRole: 'creator',
    content: message.trim(),
    createdAt: new Date(),
    isInternal: false,
  };

  // Create initial status change
  const initialStatusChange: StatusChange = {
    status: 'pending',
    changedBy: creatorId,
    changedAt: new Date(),
  };

  // Create appeal document
  const now = new Date();
  const appealData = {
    petitionId,
    petitionTitle: petitionData.title,
    creatorId,
    creatorName,
    creatorEmail,
    status: 'pending' as AppealStatus,
    messages: [
      {
        ...initialMessage,
        createdAt: Timestamp.fromDate(initialMessage.createdAt),
      },
    ],
    statusHistory: [
      {
        ...initialStatusChange,
        changedAt: Timestamp.fromDate(initialStatusChange.changedAt),
      },
    ],
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  };

  const appealsRef = collection(db, 'appeals');
  const docRef = await addDoc(appealsRef, appealData);

  return docRef.id;
}

/**
 * Get appeals for a user based on their role
 */
export async function getAppealsForUser(
  userId: string,
  role: string,
  filters?: AppealFilters
): Promise<Appeal[]> {
  try {
    const appealsRef = collection(db, 'appeals');
    let q = query(appealsRef);

    // Role-based filtering
    if (role === 'user' || role === 'creator') {
      // Creators only see their own appeals
      q = query(q, where('creatorId', '==', userId));
    }
    // Moderators and admins see all appeals (no additional filter needed)

    // Status filter
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }

    // Order by creation date (newest first)
    q = query(q, orderBy('createdAt', 'desc'));

    // Pagination
    const pageLimit = filters?.limit || 20;
    q = query(q, limit(pageLimit));

    const snapshot = await getDocs(q);
    const appeals: Appeal[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      appeals.push(convertFirestoreToAppeal(doc.id, data));
    });

    return appeals;
  } catch (error) {
    console.error('Error fetching appeals:', error);
    // If collection doesn't exist yet, return empty array
    if (error instanceof Error && error.message.includes('index')) {
      console.warn(
        'Appeals collection or index not ready yet, returning empty array'
      );
      return [];
    }
    throw error;
  }
}

/**
 * Get a single appeal by ID
 */
export async function getAppeal(
  appealId: string,
  userId: string,
  role: string
): Promise<Appeal | null> {
  const appealRef = doc(db, 'appeals', appealId);
  const appealSnap = await getDoc(appealRef);

  if (!appealSnap.exists()) {
    return null;
  }

  const appealData = appealSnap.data();

  // Check permissions
  const isCreator = appealData.creatorId === userId;
  const isModerator = role === 'moderator' || role === 'admin';

  if (!isCreator && !isModerator) {
    throw new Error('You do not have permission to view this appeal');
  }

  const appeal = convertFirestoreToAppeal(appealSnap.id, appealData);

  // Filter out internal moderator notes for creators
  if (isCreator && !isModerator) {
    appeal.messages = appeal.messages.filter((msg) => !msg.isInternal);
  }

  return appeal;
}

/**
 * Add a message to an appeal thread
 */
export async function addAppealMessage(
  appealId: string,
  senderId: string,
  senderName: string,
  senderRole: 'creator' | 'moderator',
  message: string,
  isInternal: boolean = false
): Promise<string> {
  // Validate message
  if (!message || message.trim().length === 0) {
    throw new Error('Message cannot be empty');
  }

  const appealRef = doc(db, 'appeals', appealId);
  const appealSnap = await getDoc(appealRef);

  if (!appealSnap.exists()) {
    throw new Error('Appeal not found');
  }

  const appealData = appealSnap.data();

  // Check if appeal is resolved and prevent non-moderator replies
  if (appealData.status === 'resolved' && senderRole !== 'moderator') {
    throw new Error('Cannot reply to a resolved appeal');
  }

  // Create new message
  const newMessage: AppealMessage = {
    id: crypto.randomUUID(),
    senderId,
    senderName,
    senderRole,
    content: message.trim(),
    createdAt: new Date(),
    isInternal,
  };

  // Update appeal
  const updates: any = {
    messages: [
      ...appealData.messages,
      {
        ...newMessage,
        createdAt: Timestamp.fromDate(newMessage.createdAt),
      },
    ],
    updatedAt: Timestamp.fromDate(new Date()),
  };

  // If appeal is pending and moderator is replying, change status to in-progress
  if (appealData.status === 'pending' && senderRole === 'moderator') {
    updates.status = 'in-progress';

    // Add status change to history
    const statusChange: StatusChange = {
      status: 'in-progress',
      changedBy: senderId,
      changedAt: new Date(),
    };

    updates.statusHistory = [
      ...appealData.statusHistory,
      {
        ...statusChange,
        changedAt: Timestamp.fromDate(statusChange.changedAt),
      },
    ];
  }

  await updateDoc(appealRef, updates);

  return newMessage.id;
}

/**
 * Update appeal status
 */
export async function updateAppealStatus(
  appealId: string,
  status: AppealStatus,
  moderatorId: string,
  moderatorName: string,
  reason?: string
): Promise<void> {
  // Validate rejection reason
  if (status === 'rejected' && (!reason || reason.trim().length === 0)) {
    throw new Error('Rejection reason is required');
  }

  const appealRef = doc(db, 'appeals', appealId);
  const appealSnap = await getDoc(appealRef);

  if (!appealSnap.exists()) {
    throw new Error('Appeal not found');
  }

  const appealData = appealSnap.data();

  // Create status change record
  const statusChange: StatusChange = {
    status,
    changedBy: moderatorId,
    changedAt: new Date(),
    reason: reason?.trim(),
  };

  // Prepare updates
  const updates: any = {
    status,
    statusHistory: [
      ...appealData.statusHistory,
      {
        ...statusChange,
        changedAt: Timestamp.fromDate(statusChange.changedAt),
      },
    ],
    updatedAt: Timestamp.fromDate(new Date()),
  };

  // If resolving, set resolved metadata
  if (status === 'resolved') {
    updates.resolvedAt = Timestamp.fromDate(new Date());
    updates.resolvedBy = moderatorId;
    if (reason) {
      updates.resolutionNotes = reason.trim();
    }
  }

  await updateDoc(appealRef, updates);
}

/**
 * Check if a petition has an open appeal
 */
export async function hasOpenAppeal(petitionId: string): Promise<boolean> {
  const appealsRef = collection(db, 'appeals');
  const q = query(
    appealsRef,
    where('petitionId', '==', petitionId),
    where('status', 'in', ['pending', 'in-progress'])
  );

  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

/**
 * Export appeal data in JSON or CSV format
 */
export async function exportAppealData(
  appealId: string,
  format: 'json' | 'csv' = 'json'
): Promise<string> {
  const appealRef = doc(db, 'appeals', appealId);
  const appealSnap = await getDoc(appealRef);

  if (!appealSnap.exists()) {
    throw new Error('Appeal not found');
  }

  const appeal = convertFirestoreToAppeal(appealSnap.id, appealSnap.data());

  if (format === 'json') {
    return JSON.stringify(appeal, null, 2);
  }

  // CSV format
  const csvLines: string[] = [];

  // Header
  csvLines.push('Appeal Export');
  csvLines.push('');

  // Basic Info
  csvLines.push('Appeal Information');
  csvLines.push('Field,Value');
  csvLines.push(`Appeal ID,${appeal.id}`);
  csvLines.push(`Petition ID,${appeal.petitionId}`);
  csvLines.push(`Petition Title,"${appeal.petitionTitle.replace(/"/g, '""')}"`);
  csvLines.push(`Creator ID,${appeal.creatorId}`);
  csvLines.push(`Creator Name,"${appeal.creatorName.replace(/"/g, '""')}"`);
  csvLines.push(`Creator Email,${appeal.creatorEmail}`);
  csvLines.push(`Status,${appeal.status}`);
  csvLines.push(`Created At,${appeal.createdAt.toISOString()}`);
  csvLines.push(`Updated At,${appeal.updatedAt.toISOString()}`);
  if (appeal.resolvedAt) {
    csvLines.push(`Resolved At,${appeal.resolvedAt.toISOString()}`);
  }
  if (appeal.resolvedBy) {
    csvLines.push(`Resolved By,${appeal.resolvedBy}`);
  }
  if (appeal.resolutionNotes) {
    csvLines.push(
      `Resolution Notes,"${appeal.resolutionNotes.replace(/"/g, '""')}"`
    );
  }
  csvLines.push('');

  // Messages
  csvLines.push('Messages');
  csvLines.push(
    'Message ID,Sender ID,Sender Name,Sender Role,Content,Created At,Is Internal'
  );
  appeal.messages.forEach((msg) => {
    csvLines.push(
      `${msg.id},${msg.senderId},"${msg.senderName.replace(/"/g, '""')}",${msg.senderRole},"${msg.content.replace(/"/g, '""')}",${msg.createdAt.toISOString()},${msg.isInternal || false}`
    );
  });
  csvLines.push('');

  // Status History
  csvLines.push('Status History');
  csvLines.push('Status,Changed By,Changed At,Reason');
  appeal.statusHistory.forEach((change) => {
    csvLines.push(
      `${change.status},${change.changedBy},${change.changedAt.toISOString()},"${change.reason ? change.reason.replace(/"/g, '""') : ''}"`
    );
  });

  return csvLines.join('\n');
}

/**
 * Helper function to convert Firestore data to Appeal interface
 */
function convertFirestoreToAppeal(id: string, data: any): Appeal {
  return {
    id,
    petitionId: data.petitionId,
    petitionTitle: data.petitionTitle,
    creatorId: data.creatorId,
    creatorName: data.creatorName,
    creatorEmail: data.creatorEmail,
    status: data.status,
    messages: data.messages.map((msg: any) => ({
      ...msg,
      createdAt: msg.createdAt.toDate(),
    })),
    statusHistory: data.statusHistory.map((change: any) => ({
      ...change,
      changedAt: change.changedAt.toDate(),
    })),
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
    resolvedAt: data.resolvedAt?.toDate(),
    resolvedBy: data.resolvedBy,
    resolutionNotes: data.resolutionNotes,
  };
}
