import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    if (!code) {
      return NextResponse.json({ error: 'رمز العريضة مطلوب' }, { status: 400 });
    }

    // Query Firestore for petition with this reference code
    const petitionsRef = collection(db, 'petitions');
    const q = query(petitionsRef, where('referenceCode', '==', code), limit(1));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'العريضة غير موجودة' },
        { status: 404 }
      );
    }

    const petitionDoc = querySnapshot.docs[0];
    const petitionData: any = {
      id: petitionDoc.id,
      ...petitionDoc.data(),
    };

    // Return only necessary fields for preview
    return NextResponse.json({
      id: petitionData.id,
      title: petitionData.title,
      referenceCode: petitionData.referenceCode,
      signatureCount: petitionData.signatureCount || 0,
      status: petitionData.status,
      category: petitionData.category,
    });
  } catch (error) {
    console.error('Error fetching petition:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
