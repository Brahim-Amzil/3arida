import { NextRequest, NextResponse } from 'next/server';
import '@/lib/firebase-admin';
import { sendVerificationEmailForAddress } from '@/lib/send-verification-email-server';
import { enforceRateLimit } from '@/lib/api-rate-limit';
import {
  initApiRequestContext,
  logApiError,
  logApiInfo,
  withRequestId,
} from '@/lib/api-observability';

/**
 * Resend verification email by address (no login required).
 * Used after registration when the session was cleared.
 */
export async function POST(request: NextRequest) {
  const apiContext = initApiRequestContext(
    request,
    'api/auth/request-verification-email',
  );

  const rateLimited = enforceRateLimit(request, {
    keyPrefix: 'request-verification-email',
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (rateLimited) {
    return withRequestId(rateLimited, apiContext.requestId);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === 'string' ? body.email : '';

    if (!email.trim()) {
      return withRequestId(
        NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 }),
        apiContext.requestId,
      );
    }

    const result = await sendVerificationEmailForAddress(email);

    if (!result.success) {
      return withRequestId(
        NextResponse.json({ error: result.error }, { status: result.status }),
        apiContext.requestId,
      );
    }

    logApiInfo(apiContext, 'Verification email requested by address', {
      email: email.trim().toLowerCase(),
    });

    return withRequestId(
      NextResponse.json({
        success: true,
        message:
          'إذا كان الحساب موجوداً وغير مؤكد، تم إرسال رسالة التأكيد من contact@3arida.org',
      }),
      apiContext.requestId,
    );
  } catch (error) {
    logApiError(apiContext, 'request-verification-email error', error);
    return withRequestId(
      NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 }),
      apiContext.requestId,
    );
  }
}
