import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';
import { petitionDeletedEmail } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const { userName, userEmail, petitionTitle, reason } = await request.json();

    if (!userName || !userEmail || !petitionTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const html = petitionDeletedEmail(
      userName,
      petitionTitle,
      reason || 'No reason provided',
      userEmail,
    );
    const result = await sendEmail({
      to: userEmail,
      subject: `🗑️ تم حذف عريضتك: ${petitionTitle}`,
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
    console.error('Petition deleted email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
