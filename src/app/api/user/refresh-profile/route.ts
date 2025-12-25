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

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const db = getFirestore();

    // Get user document from Firestore
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();

    if (!userData) {
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        isActive: userData.isActive,
        verifiedEmail: userData.verifiedEmail,
        verifiedPhone: userData.verifiedPhone,
        createdAt: userData.createdAt?.toDate?.()?.toISOString(),
        updatedAt: userData.updatedAt?.toDate?.()?.toISOString(),
        moderatorSince: userData.moderatorSince?.toDate?.()?.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error refreshing user profile:', error);
    return NextResponse.json(
      { error: 'Failed to refresh user profile' },
      { status: 500 }
    );
  }
}
