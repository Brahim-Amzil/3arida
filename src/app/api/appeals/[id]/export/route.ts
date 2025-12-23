import { NextRequest, NextResponse } from 'next/server';
import { exportAppealData, getAppeal } from '@/lib/appeals-service';

// Mark as dynamic route to allow searchParams
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Get user info from query params (in production, this would come from auth token)
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('userRole') || 'user';
    const format = (searchParams.get('format') || 'json') as 'json' | 'csv';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const appealId = params.id;

    // Verify user has permission to view this appeal
    const appeal = await getAppeal(appealId, userId, userRole);

    if (!appeal) {
      return NextResponse.json(
        { error: 'Appeal not found or access denied' },
        { status: 404 }
      );
    }

    // Export the appeal data
    const exportData = await exportAppealData(appealId, format);

    // Set appropriate headers based on format
    const headers: Record<string, string> = {
      'Content-Type': format === 'json' ? 'application/json' : 'text/csv',
      'Content-Disposition': `attachment; filename="appeal-${appealId}.${format}"`,
    };

    return new NextResponse(exportData, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Export appeal error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Failed to export appeal',
        details:
          process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
