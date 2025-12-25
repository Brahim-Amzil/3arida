import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

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

    const db = getFirestore();

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
