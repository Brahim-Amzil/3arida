import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
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

export async function POST(request: NextRequest) {
  try {
    const { token, userId } = await request.json();

    if (!token || !userId) {
      return NextResponse.json(
        { error: 'Token and userId are required' },
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

    // Get user information
    const userRecord = await getAuth().getUser(userId);

    // Verify the email matches the invitation
    if (userRecord.email !== invitationData.email) {
      return NextResponse.json(
        { error: 'Email does not match invitation' },
        { status: 403 }
      );
    }

    // Update user role to moderator
    const userRef = db.collection('users').doc(userId);

    // Check if user document exists, if not create it
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      // Create user document with moderator role
      await userRef.set({
        email: userRecord.email,
        name: userRecord.displayName || '',
        role: 'moderator',
        isActive: true,
        verifiedEmail: userRecord.emailVerified || false,
        createdAt: new Date(),
        updatedAt: new Date(),
        moderatorSince: new Date(),
      });
    } else {
      // Update existing user document
      await userRef.update({
        role: 'moderator',
        updatedAt: new Date(),
        moderatorSince: new Date(),
      });
    }

    // Mark invitation as accepted
    await db.collection('moderatorInvitations').doc(invitationDoc.id).update({
      status: 'accepted',
      acceptedAt: new Date(),
      acceptedBy: userId,
    });

    // Create audit log entry
    await db.collection('auditLogs').add({
      action: 'moderator_invitation_accepted',
      userId: userId,
      userEmail: userRecord.email,
      invitationId: invitationDoc.id,
      invitedBy: invitationData.invitedBy,
      timestamp: new Date(),
      metadata: {
        email: invitationData.email,
        name: invitationData.name,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation accepted successfully',
      user: {
        id: userId,
        email: userRecord.email,
        role: 'moderator',
      },
    });
  } catch (error: any) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json(
      { error: 'Failed to accept invitation' },
      { status: 500 }
    );
  }
}
