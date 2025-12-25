import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Check if Stripe is configured
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-12-15.clover',
    })
  : null;

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!stripe || !stripeSecretKey || !webhookSecret) {
    return NextResponse.json(
      {
        error:
          'Stripe webhook is not configured. Please set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET environment variables.',
      },
      { status: 503 }
    );
  }
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(failedPayment);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { petitionId, pricingTier } = paymentIntent.metadata;

    if (!petitionId) {
      console.error('No petitionId in payment metadata');
      return;
    }

    // Update petition with payment success
    const petitionRef = doc(db, 'petitions', petitionId);
    await updateDoc(petitionRef, {
      paymentStatus: 'paid',
      amountPaid: paymentIntent.amount / 100, // Convert from cents
      pricingTier: pricingTier,
      hasQrUpgrade: true,
      qrUpgradePaidAt: new Date(),
      stripePaymentIntentId: paymentIntent.id,
      updatedAt: new Date(),
    });

    console.log(`Payment successful for petition ${petitionId}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { petitionId } = paymentIntent.metadata;

    if (!petitionId) {
      console.error('No petitionId in payment metadata');
      return;
    }

    // Update petition with payment failure
    const petitionRef = doc(db, 'petitions', petitionId);
    await updateDoc(petitionRef, {
      paymentStatus: 'unpaid',
      stripePaymentIntentId: paymentIntent.id,
      updatedAt: new Date(),
    });

    console.log(`Payment failed for petition ${petitionId}`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}
