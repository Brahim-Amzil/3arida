import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

export async function POST(request: NextRequest) {
  try {
    const {
      amount,
      currency = 'mad',
      petitionId,
      pricingTier,
    } = await request.json();

    // Validate required fields
    if (!amount || !petitionId || !pricingTier) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, petitionId, pricingTier' },
        { status: 400 }
      );
    }

    // Convert amount to cents (Stripe expects amounts in smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      metadata: {
        petitionId,
        pricingTier,
        platform: '3arida',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Stripe payment intent creation error:', error);

    return NextResponse.json(
      {
        error: 'Failed to create payment intent',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
