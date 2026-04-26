import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';
import { petitionPausedEmail } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const { userName, userEmail, petitionTitle, petitionId, reason } =
      await request.json();

    if (!userName || !userEmail || !petitionTitle || !petitionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const html = petitionPausedEmail(
      userName,
      petitionTitle,
      petitionId,
      reason || 'No reason provided',
      userEmail,
    );
    const result = await sendEmail({
      to: userEmail,
      subject: `⏸️ تم إيقاف عريضتك مؤقتًا: ${petitionTitle}`,
      html,
    });

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Petition paused email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
