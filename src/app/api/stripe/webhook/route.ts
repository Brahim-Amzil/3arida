import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { upgradePetition } from '@/lib/petition-upgrade-service';
import { logCouponApplication } from '@/lib/beta-coupon-service';
import {
  initApiRequestContext,
  logApiError,
  logApiInfo,
  withRequestId,
} from '@/lib/api-observability';
import { recordPaymentWebhookFailure } from '@/lib/payment-webhook-alerting';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  const apiContext = initApiRequestContext(request, 'api/stripe/webhook');

  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

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
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
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
        } else {
          // Regular petition creation payment
          logApiInfo(apiContext, 'Regular petition payment (not upgrade)');
          // Your existing petition creation logic here
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
