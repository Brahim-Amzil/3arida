import { NextRequest, NextResponse } from 'next/server';
import { getAppealAdmin } from '@/lib/appeals-service-admin';
import { adminDb } from '@/lib/firebase-admin';

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

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    const appealId = params.id;

    // Get appeal using Admin SDK
    const appeal = await getAppealAdmin(appealId, userId, userRole);

    if (!appeal) {
      return NextResponse.json({ error: 'Appeal not found' }, { status: 404 });
    }

    // Get related petition data using Admin SDK
    const petitionRef = adminDb.collection('petitions').doc(appeal.petitionId);
    const petitionSnap = await petitionRef.get();

    if (!petitionSnap.exists) {
      return NextResponse.json(
        { error: 'Related petition not found' },
        { status: 404 }
      );
    }

    const petitionData = petitionSnap.data();

    return NextResponse.json(
      {
        appeal,
        petition: {
          id: appeal.petitionId,
          title: petitionData?.title,
          status: petitionData?.status,
          moderationNotes: petitionData?.moderationNotes,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get appeal error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    // Check if it's a permission error
    if (
      errorMessage.includes('permission') ||
      errorMessage.includes('Unauthorized')
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to view this appeal' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch appeal',
        details:
          process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
