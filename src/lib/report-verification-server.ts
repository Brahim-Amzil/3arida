import '@/lib/firebase-admin';
import { adminDb } from '@/lib/firebase-admin';
import { getLastDownloadDate } from '@/lib/report-download-tracker';
import { coerceFirestoreDate } from '@/lib/report-verification-dates';
import { serializeFirestoreDocument } from '@/lib/serialize-petition-firestore';
import { getPublicAppUrl } from '@/lib/app-url';
import type { Petition } from '@/types/petition';

export { formatReportDate } from '@/lib/report-verification-dates';

function getPetitionCoverImageUrl(petition: Petition): string | null {
  const url = petition.mediaUrls?.find(
    (item) => typeof item === 'string' && item.trim().length > 0,
  );
  return url?.trim() || null;
}

export type ReportPetitionSnapshot = {
  id: string;
  title: string;
  description: string;
  referenceCode: string;
  petitionType?: string;
  category: string;
  subcategory?: string;
  addressedToType?: string;
  addressedToSpecific?: string;
  publisherType?: string;
  publisherName?: string;
  creatorName?: string;
  status: string;
  pricingTier?: string;
  targetSignatures: number;
  currentSignatures: number;
  viewCount: number;
  shareCount: number;
  createdAt: string;
  approvedAt: string | null;
  imageUrl: string | null;
  reportDownloads: number;
};

export type ReportVerificationData =
  | {
      valid: true;
      petition: ReportPetitionSnapshot;
      urls: {
        verification: string;
        petition: string;
        pdfDownload: string;
      };
      reportInfo: {
        totalDownloads: number;
        lastDownloaded: string | null;
      };
    }
  | { valid: false };

function buildPetitionSnapshot(
  petition: Petition,
  raw: Record<string, unknown>,
): ReportPetitionSnapshot {
  const createdAt = coerceFirestoreDate(petition.createdAt);
  const approvedAt = coerceFirestoreDate(
    raw.approvedAt ?? petition.approvedAt,
  );

  return {
    id: petition.id,
    title: petition.title,
    description: petition.description || '',
    referenceCode: petition.referenceCode || 'N/A',
    petitionType: petition.petitionType,
    category: petition.category,
    subcategory: petition.subcategory,
    addressedToType: petition.addressedToType,
    addressedToSpecific: petition.addressedToSpecific,
    publisherType: petition.publisherType,
    publisherName: petition.publisherName,
    creatorName: petition.creatorName,
    status: petition.status,
    pricingTier: petition.pricingTier,
    targetSignatures: petition.targetSignatures,
    currentSignatures: petition.currentSignatures,
    viewCount: petition.viewCount || 0,
    shareCount: petition.shareCount || 0,
    createdAt: createdAt?.toISOString() ?? '',
    approvedAt: approvedAt?.toISOString() ?? null,
    imageUrl: getPetitionCoverImageUrl(petition),
    reportDownloads: petition.reportDownloads || 0,
  };
}

export async function getReportVerificationData(
  petitionId: string,
): Promise<ReportVerificationData> {
  const petitionDoc = await adminDb.collection('petitions').doc(petitionId).get();

  if (!petitionDoc.exists) {
    return { valid: false };
  }

  const raw = serializeFirestoreDocument(
    petitionDoc.data() as Record<string, unknown>,
  );
  const petition = { id: petitionDoc.id, ...raw } as Petition;
  const lastDownloaded = await getLastDownloadDate(petitionId);
  const lastDownloadedDate = coerceFirestoreDate(lastDownloaded);

  const appUrl = getPublicAppUrl();

  return {
    valid: true,
    petition: buildPetitionSnapshot(petition, raw),
    urls: {
      verification: `${appUrl}/reports/verify/${petition.id}`,
      petition: `${appUrl}/petitions/${petition.id}`,
      pdfDownload: `/api/reports/verify/${petition.id}/download`,
    },
    reportInfo: {
      totalDownloads: petition.reportDownloads || 0,
      lastDownloaded: lastDownloadedDate?.toISOString() ?? null,
    },
  };
}
