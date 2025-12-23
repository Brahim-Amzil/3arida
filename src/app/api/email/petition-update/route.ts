import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';
import { petitionUpdateEmail } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const {
      userName,
      userEmail,
      petitionTitle,
      petitionId,
      updateTitle,
      updateContent,
    } = await request.json();

    if (
      !userName ||
      !userEmail ||
      !petitionTitle ||
      !petitionId ||
      !updateTitle ||
      !updateContent
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const html = petitionUpdateEmail(
      userName,
      petitionTitle,
      petitionId,
      updateTitle,
      updateContent,
      userEmail
    );
    const result = await sendEmail({
      to: userEmail,
      subject: `📢 تحديث جديد: ${petitionTitle}`,
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
    console.error('Petition update email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
