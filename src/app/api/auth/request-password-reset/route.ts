import { NextRequest, NextResponse } from 'next/server';
import '@/lib/firebase-admin';
import { sendPasswordResetEmailForAddress } from '@/lib/send-password-reset-email-server';
import { enforceRateLimit } from '@/lib/api-rate-limit';
import {
  initApiRequestContext,
  logApiError,
  logApiInfo,
  withRequestId,
} from '@/lib/api-observability';

/**
 * Send password reset email by address (no login required).
 * Uses Firebase Admin link + Resend so links open on www.3arida.org, not firebaseapp.com.
 */
export async function POST(request: NextRequest) {
  const apiContext = initApiRequestContext(
    request,
    'api/auth/request-password-reset',
  );

  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === 'string' ? body.email : '';

    if (!email.trim()) {
      return withRequestId(
        NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 }),
        apiContext.requestId,
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const rateLimited = enforceRateLimit(request, {
      keyPrefix: `request-password-reset:${normalizedEmail}`,
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });
    if (rateLimited) {
      return withRequestId(
        NextResponse.json(
          {
            error:
              'طلبات كثيرة لإعادة التعيين. انتظر ساعة ثم حاول مرة أخرى.',
          },
          { status: 429, headers: rateLimited.headers },
        ),
        apiContext.requestId,
      );
    }

    const result = await sendPasswordResetEmailForAddress(email);

    if (!result.success) {
      return withRequestId(
        NextResponse.json({ error: result.error }, { status: result.status }),
        apiContext.requestId,
      );
    }

    logApiInfo(apiContext, 'Password reset email requested', {
      email: email.trim().toLowerCase(),
    });

    return withRequestId(
      NextResponse.json({
        success: true,
        message:
          'إذا كان الحساب موجوداً، تم إرسال رابط إعادة التعيين من contact@3arida.org',
      }),
      apiContext.requestId,
    );
  } catch (error) {
    logApiError(apiContext, 'request-password-reset error', error);
    return withRequestId(
      NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 }),
      apiContext.requestId,
    );
  }
}
