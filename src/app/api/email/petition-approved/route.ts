import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';
import { petitionApprovedEmail } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  console.log('🔔 API: petition-approved endpoint called');
  try {
    const body = await request.json();
    console.log('🔔 API: Request body:', body);
    const { userName, userEmail, petitionTitle, petitionId } = body;

    if (!userName || !userEmail || !petitionTitle || !petitionId) {
      console.error('🔔 API: Missing required fields:', {
        userName: !!userName,
        userEmail: !!userEmail,
        petitionTitle: !!petitionTitle,
        petitionId: !!petitionId,
      });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    console.log('🔔 API: Generating email HTML...');
    const html = petitionApprovedEmail(
      userName,
      petitionTitle,
      petitionId,
      userEmail,
    );
    console.log('🔔 API: Sending email to:', userEmail);
    const result = await sendEmail({
      to: userEmail,
      subject: `✅ تمت الموافقة على عريضتك: ${petitionTitle}`,
      html,
    });
    console.log('🔔 API: Email send result:', result);

    if (result.success) {
      console.log('🔔 API: Email sent successfully');
      return NextResponse.json({ success: true });
    } else {
      console.error('🔔 API: Email failed to send:', result.error);
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('🔔 API: Petition approved email error:', error);
    console.error(
      '🔔 API: Error stack:',
      error instanceof Error ? error.stack : error,
    );
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
