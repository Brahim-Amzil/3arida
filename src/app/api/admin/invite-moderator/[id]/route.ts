import { NextRequest, NextResponse } from 'next/server';
import '@/lib/firebase-admin';
import { adminDb } from '@/lib/firebase-admin';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invitationId = params.id;

    if (!invitationId) {
      return NextResponse.json(
        { error: 'Invitation ID is required' },
        { status: 400 }
      );
    }

    const db = adminDb;

    // Check if invitation exists and is pending
    const invitationDoc = await db
      .collection('moderatorInvitations')
      .doc(invitationId)
      .get();

    if (!invitationDoc.exists) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    const invitationData = invitationDoc.data();
    if (invitationData?.status !== 'pending') {
      return NextResponse.json(
        { error: 'Can only cancel pending invitations' },
        { status: 400 }
      );
    }

    // Update invitation status to cancelled
    await db.collection('moderatorInvitations').doc(invitationId).update({
      status: 'cancelled',
      cancelledAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation cancelled successfully',
    });
  } catch (error: any) {
    console.error('Error cancelling invitation:', error);
    return NextResponse.json(
      { error: 'Failed to cancel invitation' },
      { status: 500 }
    );
  }
}
