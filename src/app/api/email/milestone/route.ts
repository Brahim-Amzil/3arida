import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';
import { milestoneReachedEmail } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const {
      userName,
      userEmail,
      petitionTitle,
      petitionId,
      milestone,
      currentSignatures,
      targetSignatures,
    } = await request.json();

    if (
      !userName ||
      !userEmail ||
      !petitionTitle ||
      !petitionId ||
      !milestone ||
      !currentSignatures ||
      !targetSignatures
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const html = milestoneReachedEmail(
      userName,
      petitionTitle,
      petitionId,
      milestone,
      currentSignatures,
      targetSignatures,
      userEmail
    );
    const result = await sendEmail({
      to: userEmail,
      subject: `🎯 عريضتك وصلت إلى ${milestone}%: ${petitionTitle}`,
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
    console.error('Milestone email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
