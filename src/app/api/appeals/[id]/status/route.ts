import { NextRequest, NextResponse } from 'next/server';
import {
  updateAppealStatusAdmin,
  getAppealAdmin,
} from '@/lib/appeals-service-admin';
// import { sendEmail } from '@/lib/email-service';
// import { appealStatusChangeEmail } from '@/lib/email-templates';
import { AppealStatus } from '@/types/appeal';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, reason, userId, userName, userRole } = body;

    // Validation
    if (!status || !userId || !userName || !userRole) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate user is moderator/admin
    if (userRole !== 'moderator' && userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Only moderators and admins can update appeal status' },
        { status: 403 }
      );
    }

    // Validate status value
    const validStatuses: AppealStatus[] = [
      'pending',
      'in-progress',
      'resolved',
      'rejected',
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Validate rejection reason
    if (status === 'rejected' && (!reason || !reason.trim())) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    const appealId = params.id;

    // Get appeal to get creator details for email (using Admin SDK)
    const appeal = await getAppealAdmin(appealId, userId, userRole);

    if (!appeal) {
      return NextResponse.json({ error: 'Appeal not found' }, { status: 404 });
    }

    // Update appeal status (using Admin SDK)
    await updateAppealStatusAdmin(appealId, status, userId, userName, reason);

    // TODO: Send email notification to creator
    // const emailHtml = appealStatusChangeEmail(
    //   appeal.creatorName,
    //   appeal.petitionTitle,
    //   status,
    //   reason,
    //   appealId,
    //   appeal.creatorEmail
    // );

    // await sendEmail({
    //   to: appeal.creatorEmail,
    //   subject: `[3arida] تحديث حالة الاستئناف - Appeal Status Update`,
    //   html: emailHtml,
    // });

    return NextResponse.json(
      {
        success: true,
        message: 'Appeal status updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update appeal status error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Failed to update appeal status',
        details:
          process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
