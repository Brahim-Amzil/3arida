/**
 * Public report verification (QR / PDF links use /reports/verify/{id} without locale).
 */

import { ReportVerificationClient } from '@/components/reports/ReportVerificationClient';
import { getReportVerificationData } from '@/lib/report-verification-server';

interface VerificationPageProps {
  params: {
    petitionId: string;
  };
}

export default async function ReportVerifyPage({ params }: VerificationPageProps) {
  const data = await getReportVerificationData(params.petitionId);
  return <ReportVerificationClient data={data} />;
}
