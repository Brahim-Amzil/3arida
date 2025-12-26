import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { Resend } from 'resend';

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

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, name, invitedBy, resend: isResend } = await request.json();

    if (!email || !invitedBy) {
      return NextResponse.json(
        { error: 'Email and invitedBy are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const db = getFirestore();

    // Check if user already exists
    try {
      const existingUser = await getAuth().getUserByEmail(email);
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
    } catch (error: any) {
      // User doesn't exist, which is what we want
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    // If resending, cancel existing pending invitation
    if (isResend) {
      const existingInvitations = await db
        .collection('moderatorInvitations')
        .where('email', '==', email)
        .where('status', '==', 'pending')
        .get();

      for (const doc of existingInvitations.docs) {
        await doc.ref.update({
          status: 'cancelled',
          cancelledAt: new Date(),
        });
      }
    } else {
      // Check if invitation already exists
      const existingInvitation = await db
        .collection('moderatorInvitations')
        .where('email', '==', email)
        .where('status', '==', 'pending')
        .get();

      if (!existingInvitation.empty) {
        return NextResponse.json(
          { error: 'Invitation already sent to this email' },
          { status: 409 }
        );
      }
    }

    // Generate invitation token
    const invitationToken =
      Math.random().toString(36).substring(2) +
      Math.random().toString(36).substring(2);

    // Create invitation record
    const invitationData = {
      email,
      name: name || '',
      invitedBy,
      invitationToken,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    const invitationRef = await db
      .collection('moderatorInvitations')
      .add(invitationData);

    // Create invitation link - prefer production domain over deployment URL
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl && process.env.VERCEL_URL) {
      // If we have a Vercel URL, check if it's a production domain or deployment URL
      const vercelUrl = process.env.VERCEL_URL;
      if (vercelUrl.includes('3arida.vercel.app')) {
        // Use the clean production domain
        baseUrl = 'https://3arida.vercel.app';
      } else {
        // Use the deployment URL as fallback
        baseUrl = `https://${vercelUrl}`;
      }
    }

    if (!baseUrl) {
      baseUrl = 'http://localhost:3000';
    }

    const invitationLink = `${baseUrl}/moderator/welcome?token=${invitationToken}`;

    // Send invitation email in Arabic
    const emailSubject = name
      ? `${name}، تمت دعوتك لتكون مشرفاً على منصة عريضة`
      : 'تمت دعوتك لتكون مشرفاً على منصة عريضة';

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl; text-align: right;">
        <h1 style="color: #16a34a; text-align: center;">مرحباً بك في فريق الإشراف على عريضة!</h1>
        
        <p>مرحباً${name ? ` ${name}` : ''},</p>
        
        <p>تمت دعوتك للانضمام إلى فريق الإشراف على منصة عريضة. كمشرف، ستساعد في الحفاظ على جودة وسلامة العرائض على منصتنا.</p>
        
        <p><strong>مسؤولياتك ستشمل:</strong></p>
        <ul style="text-align: right;">
          <li>مراجعة العرائض الجديدة والموافقة عليها أو رفضها</li>
          <li>إدارة حسابات المستخدمين وحل النزاعات</li>
          <li>الحفاظ على جودة المحتوى ومعايير المجتمع</li>
          <li>التعامل مع طعون المستخدمين</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${invitationLink}" 
             style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            قبول الدعوة
          </a>
        </div>
        
        <p><strong>مهم:</strong> ستنتهي صلاحية هذه الدعوة خلال 7 أيام. إذا لم تقبلها بحلول ذلك الوقت، ستحتاج إلى طلب دعوة جديدة.</p>
        
        <p>إذا كان لديك أي أسئلة، يرجى الاتصال بفريق الدعم لدينا.</p>
        
        <p>مع أطيب التحيات،<br>فريق عريضة</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          إذا لم تكن تتوقع هذه الدعوة، يمكنك تجاهل هذا البريد الإلكتروني بأمان.
        </p>
      </div>
    `;

    await resend.emails.send({
      from: 'noreply@3arida.ma',
      to: email,
      subject: emailSubject,
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      invitationId: invitationRef.id,
      message: isResend
        ? 'Invitation resent successfully'
        : 'Invitation sent successfully',
    });
  } catch (error: any) {
    console.error('Error sending moderator invitation:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = getFirestore();

    // Get all pending invitations
    const invitationsSnapshot = await db
      .collection('moderatorInvitations')
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .get();

    const invitations = invitationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      expiresAt: doc.data().expiresAt?.toDate?.()?.toISOString() || null,
    }));

    return NextResponse.json({ invitations });
  } catch (error: any) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}
