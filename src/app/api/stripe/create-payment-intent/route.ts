import { NextRequest, NextResponse } from 'next/server';
import { getStripeServer, withStripeReceiptEmail } from '@/lib/stripe-server';

export async function POST(request: NextRequest) {
  try {
    const { amount, petitionTitle, targetSignatures, userEmail } =
      await request.json();

    const normalizedEmail =
      typeof userEmail === 'string' ? userEmail.trim() : '';

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Create payment intent
    // Stripe expects amount in cents, but MAD doesn't use cents
    // So we multiply by 100 for Stripe's format
    const paymentIntent = await getStripeServer().paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'mad', // Moroccan Dirham
      ...withStripeReceiptEmail(normalizedEmail),
      metadata: {
        petitionTitle: petitionTitle || 'Petition',
        targetSignatures: targetSignatures?.toString() || '0',
        ...(normalizedEmail ? { userEmail: normalizedEmail } : {}),
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
