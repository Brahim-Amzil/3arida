import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Invitation token is required' },
        { status: 400 }
      );
    }

    const db = getFirestore();

    // Find invitation by token
    const invitationSnapshot = await db
      .collection('moderatorInvitations')
      .where('invitationToken', '==', token)
      .where('status', '==', 'pending')
      .get();

    if (invitationSnapshot.empty) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      );
    }

    const invitationDoc = invitationSnapshot.docs[0];
    const invitationData = invitationDoc.data();

    // Check if invitation has expired
    const expiresAt = invitationData.expiresAt?.toDate();
    if (expiresAt && expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      invitation: {
        id: invitationDoc.id,
        email: invitationData.email,
        name: invitationData.name,
        invitedBy: invitationData.invitedBy,
        createdAt: invitationData.createdAt?.toDate?.()?.toISOString(),
        expiresAt: invitationData.expiresAt?.toDate?.()?.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error validating invitation:', error);
    return NextResponse.json(
      { error: 'Failed to validate invitation' },
      { status: 500 }
    );
  }
}
