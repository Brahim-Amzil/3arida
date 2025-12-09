import { NextRequest, NextResponse } from 'next/server';
import { createAppealAdmin } from '@/lib/appeals-service-admin';
// import { sendEmail } from '@/lib/email-service';
// import { appealCreatedEmail } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { petitionId, message, userId, userName, userEmail } = body;

    // Validation
    if (!petitionId || !message || !userId || !userName || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate message is not empty or whitespace
    if (!message.trim()) {
      return NextResponse.json(
        { error: 'Appeal message cannot be empty' },
        { status: 400 }
      );
    }

    // Create appeal using Admin SDK
    const appealId = await createAppealAdmin(
      petitionId,
      userId,
      userName,
      userEmail,
      message
    );

    // TODO: Send email notification to moderators
    // const moderatorEmail = process.env.CONTACT_EMAIL || '3aridapp@gmail.com';
    // await sendEmail({
    //   to: moderatorEmail,
    //   subject: `[3arida Appeals] New Appeal Request - ${petitionId}`,
    //   html: `New appeal from ${userName} for petition ${petitionId}`,
    // });

    return NextResponse.json(
      {
        success: true,
        appealId,
        message: 'Appeal created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create appeal error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorCode = (error as any)?.code;

    return NextResponse.json(
      {
        error: 'Failed to create appeal',
        details: errorMessage,
        code: errorCode,
        stack:
          process.env.NODE_ENV === 'development'
            ? (error as any)?.stack
            : undefined,
      },
      { status: 500 }
    );
  }
}
