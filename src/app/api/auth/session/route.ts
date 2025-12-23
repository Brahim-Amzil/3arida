import { NextRequest, NextResponse } from 'next/server';

// Simple session check endpoint
export async function GET(request: NextRequest) {
  try {
    // This is a simple endpoint that returns session status
    // In a real app, you'd check authentication tokens here

    const response = {
      authenticated: false,
      timestamp: new Date().toISOString(),
      message: 'Session endpoint available',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Session check failed:', error);

    return NextResponse.json(
      {
        error: 'Session check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
