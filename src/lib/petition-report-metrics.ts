import type { ReportPetitionSnapshot } from '@/lib/report-verification-server';

/** Uncapped progress vs targetSignatures (e.g. 20k/10k → 200%). */
export function getSignatureProgressPercent(
  currentSignatures: number,
  targetSignatures: number,
): number {
  if (targetSignatures <= 0) return 0;
  return (currentSignatures / targetSignatures) * 100;
}

export function formatSignatureProgressPercent(
  currentSignatures: number,
  targetSignatures: number,
): string {
  return `${getSignatureProgressPercent(currentSignatures, targetSignatures).toFixed(1)}%`;
}

export function getPetitionReportMetrics(petition: ReportPetitionSnapshot) {
  const createdMs = petition.createdAt
    ? new Date(petition.createdAt).getTime()
    : Date.now();
  const daysRunning = Math.max(
    1,
    Math.ceil((Date.now() - createdMs) / (1000 * 60 * 60 * 24)),
  );
  const progress = Math.round(
    getSignatureProgressPercent(
      petition.currentSignatures,
      petition.targetSignatures,
    ),
  );
  const signaturesPerDay = Math.round(
    petition.currentSignatures / daysRunning,
  );
  const downloadNumber = petition.reportDownloads + 1;

  return { daysRunning, progress, signaturesPerDay, downloadNumber };
}
