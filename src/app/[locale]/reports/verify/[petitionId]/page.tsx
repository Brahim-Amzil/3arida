import { redirect } from 'next/navigation';

interface LocaleVerificationRedirectProps {
  params: {
    locale: string;
    petitionId: string;
  };
}

/** QR/PDF URLs use locale-free /reports/verify/{id} — redirect legacy locale paths. */
export default function LocaleReportVerifyRedirect({
  params,
}: LocaleVerificationRedirectProps) {
  redirect(`/reports/verify/${params.petitionId}`);
}
