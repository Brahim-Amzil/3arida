import { getStripeServer, withStripeReceiptEmail } from '@/lib/stripe-server';
import {
  canGenerateReport,
  getDownloadPrice,
  requiresPayment,
} from '@/lib/report-access-control';
import type { Petition } from '@/types/petition';

export async function createReportDownloadPaymentIntent(
  petition: Petition,
  userId: string,
  userEmail?: string,
): Promise<{ clientSecret: string; paymentIntentId: string; price: number }> {
  const access = canGenerateReport(petition, userId);
  if (!access.allowed) {
    throw new Error('You do not have permission to pay for this report download');
  }

  if (!requiresPayment(petition)) {
    throw new Error('No payment required for the next report download');
  }

  const price = getDownloadPrice(petition);
  if (price <= 0) {
    throw new Error('Invalid report download price');
  }

  const normalizedEmail =
    typeof userEmail === 'string' ? userEmail.trim() : '';

  const paymentIntent = await getStripeServer().paymentIntents.create({
    amount: Math.round(price * 100),
    currency: 'mad',
    ...withStripeReceiptEmail(normalizedEmail),
    metadata: {
      type: 'report_download',
      petitionId: petition.id,
      userId,
      pricingTier: petition.pricingTier || 'free',
      priceMad: String(price),
      ...(normalizedEmail ? { userEmail: normalizedEmail } : {}),
    },
    description: `Report PDF download for petition ${petition.referenceCode || petition.id}`,
  });

  if (!paymentIntent.client_secret) {
    throw new Error('Failed to create payment session');
  }

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    price,
  };
}

export async function verifyReportDownloadPayment(
  paymentId: string,
  petition: Petition,
  userId: string,
): Promise<{ valid: boolean; message?: string }> {
  try {
    const paymentIntent = await getStripeServer().paymentIntents.retrieve(
      paymentId.trim(),
    );

    if (paymentIntent.status !== 'succeeded') {
      return { valid: false, message: 'Payment has not completed yet' };
    }

    const metadata = paymentIntent.metadata || {};
    if (metadata.type !== 'report_download') {
      return { valid: false, message: 'Invalid payment type for report download' };
    }

    if (metadata.petitionId !== petition.id) {
      return { valid: false, message: 'Payment does not match this petition' };
    }

    if (metadata.userId !== userId) {
      return { valid: false, message: 'Payment does not match this user' };
    }

    const expectedPrice = getDownloadPrice(petition);
    if (paymentIntent.amount !== Math.round(expectedPrice * 100)) {
      return { valid: false, message: 'Payment amount does not match report price' };
    }

    const history = petition.reportDownloadHistory || [];
    const alreadyUsed = history.some(
      (entry) => entry.paymentId === paymentIntent.id,
    );
    if (alreadyUsed) {
      return { valid: false, message: 'This payment was already used for a download' };
    }

    return { valid: true };
  } catch (error) {
    console.error('[Report download payment] Verification failed:', error);
    return { valid: false, message: 'Could not verify payment' };
  }
}
