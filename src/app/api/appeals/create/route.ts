import { NextRequest, NextResponse } from 'next/server';

// This route acts as a pass-through to allow client-side creation
// The actual creation happens client-side with Firestore security rules
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { petitionId, message, userId, userName, userEmail } = body;

    // Validation only - actual creation happens client-side
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

    // Return success - client will handle the actual creation
    return NextResponse.json(
      {
        success: true,
        message: 'Validation passed',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Validate appeal error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Validation failed',
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
