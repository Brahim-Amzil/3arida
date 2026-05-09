import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'كود الكوبون مطلوب' }, { status: 400 });
    }

    console.log('🔍 Validating coupon:', code);
    console.log('🔍 Trimmed/uppercase:', code.toUpperCase().trim());

    // Import Firebase client SDK dynamically to avoid SSR issues
    const { db } = await import('@/lib/firebase');
    const { collection, query, where, getDocs, limit } =
      await import('firebase/firestore');

    const couponsRef = collection(db, 'coupons');
    const q = query(
      couponsRef,
      where('code', '==', code.toUpperCase().trim()),
      limit(1),
    );
    const querySnapshot = await getDocs(q);

    console.log('✅ Query complete. Found:', querySnapshot.size, 'documents');

    if (querySnapshot.empty) {
      console.log('❌ Coupon not found');
      return NextResponse.json(
        { error: 'كود الكوبون غير صالح' },
        { status: 404 },
      );
    }

    const couponDoc = querySnapshot.docs[0];
    const coupon = couponDoc.data();
    console.log('📄 Coupon data:', coupon);

    // Check if coupon is active
    if (coupon.status !== 'active') {
      console.log('❌ Coupon not active:', coupon.status);
      return NextResponse.json(
        { error: 'هذا الكوبون غير نشط' },
        { status: 400 },
      );
    }

    // Check expiration
    if (coupon.expiresAt) {
      const now = new Date();
      const expiryDate = coupon.expiresAt.toDate();
      if (expiryDate < now) {
        console.log('❌ Coupon expired');
        return NextResponse.json(
          { error: 'انتهت صلاحية هذا الكوبون' },
          { status: 400 },
        );
      }
    }

    // Check usage limit
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      console.log('❌ Coupon usage limit reached');
      return NextResponse.json(
        { error: 'تم استخدام هذا الكوبون بالكامل' },
        { status: 400 },
      );
    }

    console.log('✅ Coupon valid!');
    // Return valid coupon
    return NextResponse.json({
      valid: true,
      discount: coupon.discount,
      code: coupon.code,
      type: coupon.type,
    });
  } catch (error: any) {
    console.error('❌ Coupon validation error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { error: 'حدث خطأ في التحقق من الكوبون' },
      { status: 500 },
    );
  }
}
