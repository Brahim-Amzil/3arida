import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeServer } from '@/lib/stripe-server';
import { upgradePetition } from '@/lib/petition-upgrade-service';
import { logCouponApplication } from '@/lib/beta-coupon-service';
import {
  initApiRequestContext,
  logApiError,
  logApiInfo,
  logApiWarn,
  withRequestId,
} from '@/lib/api-observability';
import { recordPaymentWebhookFailure } from '@/lib/payment-webhook-alerting';
import { sendPlatformSupportThankYouEmail } from '@/lib/platform-support-email';

const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();

/** Raw body + Node runtime required for Stripe signature verification. */
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const apiContext = initApiRequestContext(request, 'api/stripe/webhook');

  try {
    if (!webhookSecret) {
      logApiError(
        apiContext,
        'STRIPE_WEBHOOK_SECRET is missing; cannot verify Stripe signatures',
      );
      return withRequestId(
        NextResponse.json(
          { error: 'Webhook not configured (missing signing secret)' },
          { status: 503 },
        ),
        apiContext.requestId,
      );
    }

    const body = await request.text();
    // Use the request object headers (Stripe + Next.js App Router); avoid `headers()` helper here.
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      logApiError(apiContext, 'No Stripe signature found');
      await recordPaymentWebhookFailure('stripe', 'webhook_signature_invalid', {
        requestId: apiContext.requestId,
        message: 'Missing stripe-signature header',
      });
      return withRequestId(
        NextResponse.json({ error: 'No signature' }, { status: 400 }),
        apiContext.requestId,
      );
    }

    let event: Stripe.Event;

    try {
      event = getStripeServer().webhooks.constructEvent(
        body,
        signature,
        webhookSecret,
      );
    } catch (err: any) {
      logApiError(apiContext, 'Webhook signature verification failed', err);
      await recordPaymentWebhookFailure('stripe', 'webhook_signature_invalid', {
        requestId: apiContext.requestId,
        message: err?.message,
      });
      return withRequestId(
        NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 },
        ),
        apiContext.requestId,
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logApiInfo(apiContext, 'Payment succeeded', {
          paymentIntentId: paymentIntent.id,
          amountMad: paymentIntent.amount / 100,
        });

        const metadata = paymentIntent.metadata;

        // Check if this is an upgrade payment
        if (metadata.isUpgrade === 'true') {
          logApiInfo(apiContext, 'Processing upgrade payment', {
            paymentIntentId: paymentIntent.id,
          });

          const {
            petitionId,
            currentTier,
            selectedTier,
            userId,
            originalAmount,
            betaMode,
          } = metadata;

          // Log coupon application if beta mode
          if (betaMode === 'true' && originalAmount) {
            try {
              await logCouponApplication(
                petitionId,
                userId,
                'BETA100',
                parseInt(originalAmount),
                parseInt(originalAmount), // 100% discount
                currentTier === 'free' ? 'free-to-paid' : 'paid-to-paid',
                currentTier,
                selectedTier,
              );
              logApiInfo(apiContext, 'Logged beta coupon application', {
                petitionId,
              });
            } catch (error) {
              logApiError(apiContext, 'Failed to log coupon', error);
              // Continue with upgrade even if logging fails
            }
          }

          // Upgrade the petition
          try {
            const result = await upgradePetition(
              petitionId,
              selectedTier as any,
              paymentIntent.id,
              paymentIntent.amount / 100, // Convert from cents to MAD
            );

            if (result.success) {
              logApiInfo(apiContext, 'Successfully upgraded petition', {
                petitionId,
                selectedTier,
              });
            } else {
              logApiError(apiContext, 'Failed to upgrade petition', result.error);
              // Failed upgrade entry already created by upgradePetition
            }
          } catch (error) {
            logApiError(apiContext, 'Error upgrading petition', error);
          }
        } else if (metadata.type === 'platform_support') {
          if (metadata.thankYouEmailSent === 'true') {
            logApiInfo(apiContext, 'Platform support thank-you email already sent', {
              paymentIntentId: paymentIntent.id,
            });
          } else {
            const donorEmail = metadata.userEmail?.trim();
            const amountMad = paymentIntent.amount / 100;

            if (donorEmail) {
              try {
                const emailResult = await sendPlatformSupportThankYouEmail({
                  userName: metadata.userName || 'Supporter',
                  amount: amountMad,
                  userEmail: donorEmail,
                });

                if (emailResult.success) {
                  await getStripeServer().paymentIntents.update(paymentIntent.id, {
                    metadata: {
                      ...metadata,
                      thankYouEmailSent: 'true',
                    },
                  });
                  logApiInfo(apiContext, 'Platform support thank-you email sent', {
                    paymentIntentId: paymentIntent.id,
                    donorEmail,
                  });
                } else {
                  logApiError(
                    apiContext,
                    'Failed to send platform support thank-you email',
                    emailResult.error,
                  );
                }
              } catch (emailError) {
                logApiError(
                  apiContext,
                  'Error sending platform support thank-you email',
                  emailError,
                );
              }
            } else {
              logApiWarn(apiContext, 'Platform support payment missing donor email', {
                paymentIntentId: paymentIntent.id,
              });
            }
          }
        } else if (metadata.type === 'report_download') {
          logApiInfo(apiContext, 'Report download payment succeeded', {
            paymentIntentId: paymentIntent.id,
            petitionId: metadata.petitionId,
          });
        } else {
          logApiInfo(apiContext, 'Regular petition payment (not upgrade)');
        }

        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        logApiError(apiContext, 'Payment failed', {
          paymentIntentId: failedPayment.id,
          message: failedPayment.last_payment_error?.message,
        });
        await recordPaymentWebhookFailure('stripe', 'payment_failed', {
          requestId: apiContext.requestId,
          paymentId: failedPayment.id,
          eventType: event.type,
          message: failedPayment.last_payment_error?.message,
        });

        // Handle failed payment - maybe send notification to user
        break;

      default:
        logApiInfo(apiContext, 'Unhandled stripe event type', {
          eventType: event.type,
        });
    }

    return withRequestId(
      NextResponse.json({ received: true }),
      apiContext.requestId,
    );
  } catch (error: any) {
    logApiError(apiContext, 'Webhook error', error);
    await recordPaymentWebhookFailure('stripe', 'webhook_processing_failed', {
      requestId: apiContext.requestId,
      message: error?.message,
    });
    return withRequestId(
      NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 },
      ),
      apiContext.requestId,
    );
  }
}
