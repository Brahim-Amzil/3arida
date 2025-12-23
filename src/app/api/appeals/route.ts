import { NextRequest, NextResponse } from 'next/server';
import { getAppealsForUserAdmin } from '@/lib/appeals-service-admin';
import { AppealFilters, AppealStatus } from '@/types/appeal';

// Mark as dynamic route to allow searchParams
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Get user info from query params (in production, this would come from auth token)
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('userRole') || 'user';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    // Build filters
    const statusFilter = searchParams.get('status') as AppealStatus | null;

    // Get appeals using Admin SDK
    const appeals = await getAppealsForUserAdmin(
      userId,
      userRole,
      statusFilter || undefined
    );

    return NextResponse.json(
      {
        appeals,
        total: appeals.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get appeals error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        error: 'Failed to fetch appeals',
        details:
          process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}
