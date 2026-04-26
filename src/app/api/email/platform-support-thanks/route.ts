import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';
import { platformSupportThankYouEmail } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const { userName, amount, userEmail } = await request.json();

    console.log('📧 Platform support thank you email request:', {
      userName,
      amount,
      userEmail,
    });

    if (!userEmail || !amount) {
      console.error('❌ Missing required fields:', { userEmail, amount });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const html = platformSupportThankYouEmail(
      userName || 'Supporter',
      amount,
      userEmail,
    );

    console.log('📧 Sending email via Resend...');

    const result = await sendEmail({
      to: userEmail,
      subject: `🙏 شكراً على دعمك للمنصة - Thank You for Your Support`,
      html,
    });

    console.log('📧 Email send result:', result);

    if (result.success) {
      console.log('✅ Thank you email sent successfully');
      return NextResponse.json({ success: true, data: result.data });
    } else {
      console.error('❌ Failed to send email:', result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error('❌ Error sending platform support thank you email:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
