import { NextRequest, NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe-server';

export async function POST(request: NextRequest) {
  try {
    const { amount, userId, userName, userEmail } = await request.json();

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Create payment intent for platform support (tips)
    const normalizedEmail =
      typeof userEmail === 'string' ? userEmail.trim() : '';

    // Do not set receipt_email — Stripe would send its own receipt.
    // Donors only receive our thank-you email via the webhook (platform_support).
    const paymentIntent = await getStripeServer().paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents (Stripe format)
      currency: 'mad', // Moroccan Dirham
      metadata: {
        type: 'platform_support',
        userId: userId || 'anonymous',
        userName: userName || 'Anonymous',
        userEmail: normalizedEmail,
        supportedAt: new Date().toISOString(),
      },
      description: `Platform Support - ${amount} MAD`,
      statement_descriptor_suffix: 'TIPS', // Shows on bank statement as "3ARIDA* TIPS"
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Error creating donation payment intent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create donation payment intent' },
      { status: 500 },
    );
  }
}
