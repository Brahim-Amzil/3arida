import '@/lib/firebase-admin';
import { adminDb } from '@/lib/firebase-admin';
import { getLastDownloadDate } from '@/lib/report-download-tracker';
import type { Petition } from '@/types/petition';

export type ReportVerificationData =
  | {
      valid: true;
      petition: {
        id: string;
        title: string;
        referenceCode: string;
        createdAt: string | Date;
        currentSignatures: number;
        targetSignatures: number;
        status: string;
        category: string;
      };
      reportInfo: {
        totalDownloads: number;
        lastDownloaded: string | Date | null;
      };
    }
  | { valid: false };

export async function getReportVerificationData(
  petitionId: string,
): Promise<ReportVerificationData> {
  const petitionDoc = await adminDb.collection('petitions').doc(petitionId).get();

  if (!petitionDoc.exists) {
    return { valid: false };
  }

  const petition = { id: petitionDoc.id, ...petitionDoc.data() } as Petition;
  const lastDownloaded = await getLastDownloadDate(petitionId);

  return {
    valid: true,
    petition: {
      id: petition.id,
      title: petition.title,
      referenceCode: petition.referenceCode || 'N/A',
      createdAt: petition.createdAt,
      currentSignatures: petition.currentSignatures,
      targetSignatures: petition.targetSignatures,
      status: petition.status,
      category: petition.category,
    },
    reportInfo: {
      totalDownloads: petition.reportDownloads || 0,
      lastDownloaded: lastDownloaded || null,
    },
  };
}
