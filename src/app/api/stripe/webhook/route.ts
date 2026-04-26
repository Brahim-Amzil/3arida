import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { upgradePetition } from '@/lib/petition-upgrade-service';
import { logCouponApplication } from '@/lib/beta-coupon-service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 },
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('✅ Payment succeeded:', paymentIntent.id);
        console.log('   Amount:', paymentIntent.amount / 100, 'MAD');
        console.log('   Metadata:', paymentIntent.metadata);

        const metadata = paymentIntent.metadata;

        // Check if this is an upgrade payment
        if (metadata.isUpgrade === 'true') {
          console.log('[Webhook] Processing upgrade payment');

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
              console.log('[Webhook] Logged beta coupon application');
            } catch (error) {
              console.error('[Webhook] Failed to log coupon:', error);
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
              console.log(
                `[Webhook] Successfully upgraded petition ${petitionId} to ${selectedTier}`,
              );
            } else {
              console.error(
                `[Webhook] Failed to upgrade petition ${petitionId}:`,
                result.error,
              );
              // Failed upgrade entry already created by upgradePetition
            }
          } catch (error) {
            console.error('[Webhook] Error upgrading petition:', error);
          }
        } else {
          // Regular petition creation payment
          console.log('[Webhook] Regular petition payment (not an upgrade)');
          // Your existing petition creation logic here
        }

        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.error('❌ Payment failed:', failedPayment.id);
        console.error('   Error:', failedPayment.last_payment_error?.message);

        // Handle failed payment - maybe send notification to user
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 },
    );
  }
}
