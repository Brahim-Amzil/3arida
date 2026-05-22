/**
 * Report Download Tracker Service
 *
 * Manages download tracking for petition reports:
 * - Records downloads with metadata
 * - Maintains download history
 * - Provides download statistics
 */

import { adminDb as db } from './firebase-admin';
import { coerceFirestoreDate } from './report-verification-dates';
import { Petition } from '../types/petition';

// ============================================================================
// TYPES
// ============================================================================

export interface DownloadRecord {
  downloadedAt: Date;
  downloadedBy: string;
  downloadNumber: number;
  paymentId?: string;
  ipAddress?: string;
}

// ============================================================================
// HELPERS
// ============================================================================

/** Firestore rejects undefined in nested array fields — strip them on every write. */
function normalizeDownloadHistoryEntry(
  entry: unknown,
): Record<string, unknown> | null {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const record = entry as Record<string, unknown>;
  const downloadedAt =
    coerceFirestoreDate(record.downloadedAt) ?? new Date();

  const normalized: Record<string, unknown> = {
    downloadedAt,
    downloadedBy: String(record.downloadedBy ?? ''),
    downloadNumber: Number(record.downloadNumber ?? 0),
  };

  if (record.paymentId) {
    normalized.paymentId = String(record.paymentId);
  }
  if (record.ipAddress) {
    normalized.ipAddress = String(record.ipAddress);
  }

  return normalized;
}

function normalizeDownloadHistory(history: unknown[]): Record<string, unknown>[] {
  return history
    .map((entry) => normalizeDownloadHistoryEntry(entry))
    .filter((entry): entry is Record<string, unknown> => entry !== null);
}

function buildDownloadRecord(
  userId: string,
  downloadNumber: number,
  paymentId?: string,
  ipAddress?: string,
): Record<string, unknown> {
  const record: Record<string, unknown> = {
    downloadedAt: new Date(),
    downloadedBy: userId,
    downloadNumber,
  };

  if (paymentId?.trim()) {
    record.paymentId = paymentId.trim();
  }
  if (ipAddress?.trim() && ipAddress !== 'unknown') {
    record.ipAddress = ipAddress.trim();
  }

  return record;
}

// ============================================================================
// DOWNLOAD TRACKING FUNCTIONS
// ============================================================================

/**
 * Records a download and updates tracking data atomically
 */
export async function recordDownload(
  petitionId: string,
  userId: string,
  paymentId?: string,
  ipAddress?: string,
): Promise<void> {
  const petitionRef = db.collection('petitions').doc(petitionId);

  try {
    await db.runTransaction(async (transaction) => {
      const petitionDoc = await transaction.get(petitionRef);

      if (!petitionDoc.exists) {
        throw new Error('Petition not found');
      }

      const petition = petitionDoc.data() as Petition;
      const currentDownloads = petition.reportDownloads || 0;
      const downloadHistory = normalizeDownloadHistory(
        petition.reportDownloadHistory || [],
      );
      const newRecord = buildDownloadRecord(
        userId,
        currentDownloads + 1,
        paymentId,
        ipAddress,
      );

      transaction.update(petitionRef, {
        reportDownloads: currentDownloads + 1,
        reportDownloadHistory: [...downloadHistory, newRecord],
        updatedAt: new Date(),
      });
    });
  } catch (error) {
    console.error('Error recording download:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to record download',
    );
  }
}

/**
 * Gets download history for a petition
 */
export async function getDownloadHistory(
  petitionId: string,
): Promise<DownloadRecord[]> {
  try {
    const petitionDoc = await db.collection('petitions').doc(petitionId).get();

    if (!petitionDoc.exists) {
      throw new Error('Petition not found');
    }

    const petition = petitionDoc.data() as Petition;
    return (petition.reportDownloadHistory || []) as DownloadRecord[];
  } catch (error) {
    console.error('Error fetching download history:', error);
    throw new Error('Failed to fetch download history');
  }
}

/**
 * Gets current download count
 */
export async function getDownloadCount(petitionId: string): Promise<number> {
  try {
    const petitionDoc = await db.collection('petitions').doc(petitionId).get();

    if (!petitionDoc.exists) {
      throw new Error('Petition not found');
    }

    const petition = petitionDoc.data() as Petition;
    return petition.reportDownloads || 0;
  } catch (error) {
    console.error('Error fetching download count:', error);
    throw new Error('Failed to fetch download count');
  }
}

/**
 * Gets last download date
 */
export async function getLastDownloadDate(
  petitionId: string,
): Promise<Date | null> {
  try {
    const history = await getDownloadHistory(petitionId);

    if (history.length === 0) {
      return null;
    }

    const lastDownload = history[history.length - 1];
    return coerceFirestoreDate(lastDownload.downloadedAt);
  } catch (error) {
    console.error('Error fetching last download date:', error);
    return null;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const ReportDownloadTracker = {
  recordDownload,
  getDownloadHistory,
  getDownloadCount,
  getLastDownloadDate,
} as const;

export default ReportDownloadTracker;
