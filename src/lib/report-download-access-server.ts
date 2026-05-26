import {
  canGenerateReport,
  getDownloadPrice,
  requiresPayment,
} from '@/lib/report-access-control';
import { verifyReportDownloadPayment } from '@/lib/report-download-payment-server';
import type { Petition } from '@/types/petition';

export type ReportDownloadAccessResult =
  | { allowed: true }
  | {
      allowed: false;
      status: 403 | 402;
      code: string;
      message: string;
      requiresUpgrade?: boolean;
      requiresPayment?: boolean;
      price?: number;
    };

/**
 * Server-side gate for creator report PDF downloads.
 * Must run before recordDownload / PDF generation.
 */
export async function evaluateReportDownloadAccess(
  petition: Petition,
  userId: string,
  paymentId?: string | null,
): Promise<ReportDownloadAccessResult> {
  const access = canGenerateReport(petition, userId);

  if (!access.allowed) {
    if (access.requiresUpgrade) {
      return {
        allowed: false,
        status: 403,
        code: 'UPGRADE_REQUIRED',
        message: 'Report downloads require a paid petition tier',
        requiresUpgrade: true,
      };
    }

    return {
      allowed: false,
      status: 403,
      code: access.reason || 'ACCESS_DENIED',
      message: 'You do not have permission to download this report',
    };
  }

  if (requiresPayment(petition)) {
    if (!paymentId?.trim()) {
      const price = getDownloadPrice(petition);
      return {
        allowed: false,
        status: 402,
        code: 'PAYMENT_REQUIRED',
        message: `Payment of ${price} MAD required for additional downloads`,
        requiresPayment: true,
        price,
      };
    }

    const verification = await verifyReportDownloadPayment(
      paymentId,
      petition,
      userId,
    );

    if (!verification.valid) {
      const price = getDownloadPrice(petition);
      return {
        allowed: false,
        status: 402,
        code: 'PAYMENT_INVALID',
        message: verification.message || 'Payment verification failed',
        requiresPayment: true,
        price,
      };
    }
  }

  return { allowed: true };
}
