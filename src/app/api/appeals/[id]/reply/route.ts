import { NextRequest, NextResponse } from 'next/server';
import {
  addAppealMessageAdmin,
  getAppealAdmin,
} from '@/lib/appeals-service-admin';
// import { sendEmail } from '@/lib/email-service';
// import {
//   appealReplyEmail,
//   appealCreatorReplyEmail,
// } from '@/lib/email-templates';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { message, isInternal, userId, userName, userRole, userEmail } = body;

    // Validation
    if (!message || !userId || !userName || !userRole) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate message is not empty or whitespace
    if (!message.trim()) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    // Validate user role
    if (userRole !== 'creator' && userRole !== 'moderator') {
      return NextResponse.json({ error: 'Invalid user role' }, { status: 400 });
    }

    const appealId = params.id;

    // Get appeal to check permissions and get details for email (using Admin SDK)
    const appeal = await getAppealAdmin(
      appealId,
      userId,
      userRole === 'moderator' ? 'moderator' : 'user'
    );

    if (!appeal) {
      return NextResponse.json({ error: 'Appeal not found' }, { status: 404 });
    }

    // Check permissions
    const isCreator = appeal.creatorId === userId;
    const isModerator = userRole === 'moderator';

    if (!isCreator && !isModerator) {
      return NextResponse.json(
        { error: 'You do not have permission to reply to this appeal' },
        { status: 403 }
      );
    }

    // Add message to appeal (using Admin SDK)
    const messageId = await addAppealMessageAdmin(
      appealId,
      userId,
      userName,
      userRole as 'creator' | 'moderator',
      message,
      isInternal || false
    );

    // TODO: Send email notification to the other party
    // if (isModerator && !isInternal) {
    //   // Moderator replied to creator - send email to creator
    //   const emailHtml = appealReplyEmail(
    //     appeal.creatorName,
    //     appeal.petitionTitle,
    //     message,
    //     appealId,
    //     appeal.creatorEmail
    //   );

    //   await sendEmail({
    //     to: appeal.creatorEmail,
    //     subject: `[3arida] رد على طلب الاستئناف - Reply to Your Appeal`,
    //     html: emailHtml,
    //   });
    // } else if (isCreator) {
    //   // Creator replied to moderator - send email to moderators
    //   const moderatorEmail = process.env.CONTACT_EMAIL || '3aridapp@gmail.com';

    //   const emailHtml = appealCreatorReplyEmail(
    //     appeal.petitionTitle,
    //     appeal.creatorName,
    //     message,
    //     appealId
    //   );

    //   await sendEmail({
    //     to: moderatorEmail,
    //     subject: `[3arida Appeals] New Reply from Creator - ${appeal.petitionTitle}`,
    //     html: emailHtml,
    //   });
    // }

    return NextResponse.json(
      {
        success: true,
        messageId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add appeal message error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Failed to add message',
        details:
          process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
