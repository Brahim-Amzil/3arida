import { NextRequest, NextResponse } from 'next/server';
import { sendPlatformSupportThankYouEmail } from '@/lib/platform-support-email';

export async function POST(request: NextRequest) {
  try {
    const { userName, amount, userEmail } = await request.json();

    if (!userEmail?.trim() || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const result = await sendPlatformSupportThankYouEmail({
      userName: userName || 'Supporter',
      amount,
      userEmail,
    });

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data });
    }

    return NextResponse.json(
      { error: String(result.error) || 'Failed to send email' },
      { status: 500 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    console.error('Error sending platform support thank you email:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
