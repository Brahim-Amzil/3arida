import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { petitionId, message, userId, userName, userEmail } = body;

    // Validation
    if (!petitionId || !message || !userId || !userName || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Validate message is not empty or whitespace
    if (!message.trim()) {
      return NextResponse.json(
        { error: 'Appeal message cannot be empty' },
        { status: 400 },
      );
    }

    // Get petition data
    const petitionRef = adminDb.collection('petitions').doc(petitionId);
    const petitionSnap = await petitionRef.get();

    if (!petitionSnap.exists) {
      return NextResponse.json(
        { error: 'Petition not found' },
        { status: 404 },
      );
    }

    const petitionData = petitionSnap.data();

    // Create appeal document
    const now = new Date();
    const appealData = {
      petitionId,
      petitionTitle: petitionData?.title || 'Unknown Petition',
      creatorId: userId,
      creatorName: userName,
      creatorEmail: userEmail,
      status: 'pending',
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: userId,
          senderName: userName,
          senderRole: 'creator',
          content: message.trim(),
          createdAt: now,
          isInternal: false,
        },
      ],
      statusHistory: [
        {
          status: 'pending',
          changedBy: userId,
          changedAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection('appeals').add(appealData);

    return NextResponse.json(
      {
        success: true,
        appealId: docRef.id,
        message: 'Appeal created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Create appeal error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Failed to create appeal',
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
