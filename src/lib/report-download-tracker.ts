/**
 * Report Download Tracker Service
 *
 * Manages download tracking for petition reports:
 * - Records downloads with metadata
 * - Maintains download history
 * - Provides download statistics
 */

import { adminDb as db } from './firebase-admin';
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
      const downloadHistory = petition.reportDownloadHistory || [];

      // Create new download record - only include defined values
      const newRecord: any = {
        downloadedAt: new Date(),
        downloadedBy: userId,
        downloadNumber: currentDownloads + 1,
      };

      // Only add optional fields if they have values
      if (paymentId) {
        newRecord.paymentId = paymentId;
      }
      if (ipAddress) {
        newRecord.ipAddress = ipAddress;
      }

      // Update both fields atomically
      transaction.update(petitionRef, {
        reportDownloads: currentDownloads + 1,
        reportDownloadHistory: [...downloadHistory, newRecord],
        updatedAt: new Date(),
      });
    });
  } catch (error) {
    console.error('Error recording download:', error);
    throw new Error('Failed to record download');
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
    return petition.reportDownloadHistory || [];
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

    // Get the most recent download
    const lastDownload = history[history.length - 1];
    return lastDownload.downloadedAt;
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
