import { NextRequest, NextResponse } from 'next/server';

// This should match the Map in send-verification route
// In production, use Redis or database
const verificationCodes = new Map<
  string,
  { code: string; expiresAt: number }
>();

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, code } = await request.json();

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: 'Phone number and code are required' },
        { status: 400 }
      );
    }

    const stored = verificationCodes.get(phoneNumber);

    if (!stored) {
      return NextResponse.json(
        { error: 'No verification code found. Please request a new one.' },
        { status: 400 }
      );
    }

    if (Date.now() > stored.expiresAt) {
      verificationCodes.delete(phoneNumber);
      return NextResponse.json(
        { error: 'Verification code expired. Please request a new one.' },
        { status: 400 }
      );
    }

    if (stored.code !== code) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Code is valid - delete it
    verificationCodes.delete(phoneNumber);

    return NextResponse.json({
      success: true,
      message: 'Phone number verified successfully',
    });
  } catch (error: any) {
    console.error('Error verifying code:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
