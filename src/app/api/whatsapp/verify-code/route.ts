import { NextRequest, NextResponse } from 'next/server';
import {
  initApiRequestContext,
  logApiError,
  withRequestId,
} from '@/lib/api-observability';

// This should match the Map in send-verification route
// In production, use Redis or database
const verificationCodes = new Map<
  string,
  { code: string; expiresAt: number }
>();

export async function POST(request: NextRequest) {
  const apiContext = initApiRequestContext(request, 'api/whatsapp/verify-code');

  try {
    const { phoneNumber, code } = await request.json();

    if (!phoneNumber || !code) {
      return withRequestId(
        NextResponse.json(
        { error: 'Phone number and code are required' },
        { status: 400 }
        ),
        apiContext.requestId,
      );
    }

    const stored = verificationCodes.get(phoneNumber);

    if (!stored) {
      return withRequestId(
        NextResponse.json(
        { error: 'No verification code found. Please request a new one.' },
        { status: 400 }
        ),
        apiContext.requestId,
      );
    }

    if (Date.now() > stored.expiresAt) {
      verificationCodes.delete(phoneNumber);
      return withRequestId(
        NextResponse.json(
        { error: 'Verification code expired. Please request a new one.' },
        { status: 400 }
        ),
        apiContext.requestId,
      );
    }

    if (stored.code !== code) {
      return withRequestId(
        NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
        ),
        apiContext.requestId,
      );
    }

    // Code is valid - delete it
    verificationCodes.delete(phoneNumber);

    return withRequestId(
      NextResponse.json({
        success: true,
        message: 'Phone number verified successfully',
      }),
      apiContext.requestId,
    );
  } catch (error: any) {
    logApiError(apiContext, 'Error verifying code', error);
    return withRequestId(
      NextResponse.json({ error: 'Verification failed' }, { status: 500 }),
      apiContext.requestId,
    );
  }
}
