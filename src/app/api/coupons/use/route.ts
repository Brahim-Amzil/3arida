import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { code, userId } = await request.json();

    if (!code || !userId) {
      return NextResponse.json(
        { error: 'كود الكوبون ومعرف المستخدم مطلوبان' },
        { status: 400 },
      );
    }

    console.log('🎟️ Marking coupon as used:', code, 'by user:', userId);

    // Import Firebase client SDK dynamically
    const { db } = await import('@/lib/firebase');
    const {
      collection,
      query,
      where,
      getDocs,
      doc,
      updateDoc,
      arrayUnion,
      increment,
    } = await import('firebase/firestore');

    // Debug: Check if we can read ANY coupons
    const couponsRef = collection(db, 'coupons');
    const allCouponsSnapshot = await getDocs(couponsRef);
    console.log('📊 Total coupons in database:', allCouponsSnapshot.size);

    if (allCouponsSnapshot.size > 0) {
      console.log('📋 Coupons in database:');
      allCouponsSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`  - Code: "${data.code}" (type: ${typeof data.code})`);
      });
    }

    console.log(
      '🔍 Searching for code:',
      `"${code.toUpperCase().trim()}"`,
      `(type: ${typeof code})`,
    );

    // Find the coupon
    const q = query(couponsRef, where('code', '==', code.toUpperCase().trim()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('❌ Coupon not found');
      return NextResponse.json(
        { error: 'كود الكوبون غير موجود' },
        { status: 404 },
      );
    }

    const couponDoc = querySnapshot.docs[0];
    const coupon = couponDoc.data();
    console.log('📄 Current coupon data:', coupon);

    // Check if user already used this coupon
    if (coupon.usedBy && coupon.usedBy.includes(userId)) {
      console.log('❌ User already used this coupon');
      return NextResponse.json(
        { error: 'لقد استخدمت هذا الكوبون من قبل' },
        { status: 400 },
      );
    }

    // Update coupon usage
    const updateData: any = {
      usedCount: increment(1),
      usedBy: arrayUnion(userId),
      lastUsedAt: new Date(),
    };

    // Calculate new usage count
    const newUsedCount = coupon.usedCount + 1;
    console.log('📊 Usage stats:');
    console.log('  - Current usedCount:', coupon.usedCount);
    console.log('  - New usedCount:', newUsedCount);
    console.log('  - Max uses:', coupon.maxUses);
    console.log(
      '  - Will reach limit?',
      coupon.maxUses && newUsedCount >= coupon.maxUses,
    );

    // Mark as used if it reached max uses
    if (coupon.maxUses && newUsedCount >= coupon.maxUses) {
      updateData.status = 'used';
      console.log('🔒 Setting status to "used" (limit reached)');
    } else {
      console.log('✅ Status remains "active" (limit not reached)');
    }

    console.log('📝 Update data:', updateData);

    const couponDocRef = doc(db, 'coupons', couponDoc.id);
    await updateDoc(couponDocRef, updateData);

    console.log('✅ Coupon marked as used successfully');
    return NextResponse.json({
      success: true,
      message: 'تم استخدام الكوبون بنجاح',
    });
  } catch (error: any) {
    console.error('❌ Coupon usage error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { error: 'حدث خطأ في استخدام الكوبون' },
      { status: 500 },
    );
  }
}
