import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';

export type AuditAction =
  // Petition actions
  | 'petition.approved'
  | 'petition.rejected'
  | 'petition.paused'
  | 'petition.resumed'
  | 'petition.deleted'
  | 'petition.archived'
  | 'petition.unarchived'
  // User actions
  | 'user.promoted_to_moderator'
  | 'user.demoted_from_moderator'
  | 'user.deactivated'
  | 'user.activated'
  | 'user.role_changed'
  // System actions
  | 'admin.login'
  | 'moderator.login';

export interface AuditLogEntry {
  id?: string;
  timestamp: any;
  actorId: string;
  actorName: string;
  actorEmail: string;
  actorRole: 'admin' | 'moderator';
  action: AuditAction;
  targetType: 'petition' | 'user' | 'system';
  targetId: string;
  targetName?: string;
  details?: {
    oldValue?: any;
    newValue?: any;
    reason?: string;
    metadata?: Record<string, any>;
  };
}

/**
 * Log an admin/moderator action to the audit trail
 * This runs asynchronously and won't block the main operation
 */
export async function logAuditAction(
  entry: Omit<AuditLogEntry, 'timestamp'>
): Promise<void> {
  try {
    await addDoc(collection(db, 'auditLogs'), {
      ...entry,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    // Log error but don't throw - audit logging should never break the main flow
    console.error('Failed to log audit action:', error);
  }
}

/**
 * Get audit logs with optional filters
 */
export async function getAuditLogs(options?: {
  actorId?: string;
  targetId?: string;
  action?: AuditAction;
  targetType?: 'petition' | 'user' | 'system';
  limitCount?: number;
}): Promise<AuditLogEntry[]> {
  try {
    const logsRef = collection(db, 'auditLogs');
    let q = query(logsRef, orderBy('timestamp', 'desc'));

    // Apply filters
    if (options?.actorId) {
      q = query(q, where('actorId', '==', options.actorId));
    }
    if (options?.targetId) {
      q = query(q, where('targetId', '==', options.targetId));
    }
    if (options?.action) {
      q = query(q, where('action', '==', options.action));
    }
    if (options?.targetType) {
      q = query(q, where('targetType', '==', options.targetType));
    }

    // Apply limit
    if (options?.limitCount) {
      q = query(q, limit(options.limitCount));
    } else {
      q = query(q, limit(100)); // Default limit
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date(),
    })) as AuditLogEntry[];
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return [];
  }
}

/**
 * Get recent activity for a specific moderator
 */
export async function getModeratorActivity(
  moderatorId: string,
  limitCount: number = 50
): Promise<AuditLogEntry[]> {
  return getAuditLogs({ actorId: moderatorId, limitCount });
}

/**
 * Get audit trail for a specific petition
 */
export async function getPetitionAuditTrail(
  petitionId: string
): Promise<AuditLogEntry[]> {
  return getAuditLogs({ targetId: petitionId, targetType: 'petition' });
}

/**
 * Get audit trail for a specific user
 */
export async function getUserAuditTrail(
  userId: string
): Promise<AuditLogEntry[]> {
  return getAuditLogs({ targetId: userId, targetType: 'user' });
}
