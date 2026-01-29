import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, petitionTitle, targetSignatures } = await request.json();

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Create payment intent
    // Stripe expects amount in cents, but MAD doesn't use cents
    // So we multiply by 100 for Stripe's format
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'mad', // Moroccan Dirham
      metadata: {
        petitionTitle: petitionTitle || 'Petition',
        targetSignatures: targetSignatures?.toString() || '0',
      },
      description: `Petition: ${petitionTitle} (${targetSignatures} signatures)`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 },
    );
  }
}
