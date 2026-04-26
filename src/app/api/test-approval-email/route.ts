import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';
import { petitionApprovedEmail } from '@/lib/email-templates';

export async function GET(request: NextRequest) {
  try {
    // Test email parameters
    const testEmail =
      request.nextUrl.searchParams.get('email') || 'test@example.com';
    const userName = 'Test User';
    const petitionTitle = 'Test Petition Title';
    const petitionId = 'test-petition-id';

    console.log('🧪 TEST: Sending test approval email to:', testEmail);

    const html = petitionApprovedEmail(
      userName,
      petitionTitle,
      petitionId,
      testEmail,
    );

    const result = await sendEmail({
      to: testEmail,
      subject: `✅ تمت الموافقة على عريضتك: ${petitionTitle}`,
      html,
    });

    console.log('🧪 TEST: Email result:', result);

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? 'Test email sent successfully'
        : 'Failed to send test email',
      details: result,
      testParams: {
        to: testEmail,
        userName,
        petitionTitle,
        petitionId,
      },
    });
  } catch (error) {
    console.error('🧪 TEST: Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
