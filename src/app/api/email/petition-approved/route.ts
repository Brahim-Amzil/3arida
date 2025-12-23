import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';
import { petitionApprovedEmail } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const { userName, userEmail, petitionTitle, petitionId } =
      await request.json();

    if (!userName || !userEmail || !petitionTitle || !petitionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const html = petitionApprovedEmail(
      userName,
      petitionTitle,
      petitionId,
      userEmail
    );
    const result = await sendEmail({
      to: userEmail,
      subject: `✅ تمت الموافقة على عريضتك: ${petitionTitle}`,
      html,
    });

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Petition approved email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
