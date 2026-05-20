import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { getPublicAppUrl } from '@/lib/app-url';
import { sendVerificationEmailViaResend } from '@/lib/auth-email-verification';
import { authenticateApiRequest } from '@/lib/api-auth';
import { enforceRateLimit } from '@/lib/api-rate-limit';
import {
  initApiRequestContext,
  logApiError,
  logApiInfo,
  withRequestId,
} from '@/lib/api-observability';

export async function POST(request: NextRequest) {
  const apiContext = initApiRequestContext(
    request,
    'api/auth/send-verification-email',
  );

  const rateLimited = enforceRateLimit(request, {
    keyPrefix: 'send-verification-email',
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (rateLimited) {
    return withRequestId(rateLimited, apiContext.requestId);
  }

  try {
    const authResult = await authenticateApiRequest(request);
    if ('error' in authResult) {
      return withRequestId(authResult.error, apiContext.requestId);
    }

    const firebaseUser = await adminAuth.getUser(authResult.user.uid);

    if (firebaseUser.emailVerified) {
      return withRequestId(
        NextResponse.json({ success: true, alreadyVerified: true }),
        apiContext.requestId,
      );
    }

    const email = firebaseUser.email;
    if (!email) {
      return withRequestId(
        NextResponse.json({ error: 'لا يوجد بريد إلكتروني لهذا الحساب' }, { status: 400 }),
        apiContext.requestId,
      );
    }

    const continueUrl = `${getPublicAppUrl()}/auth/verify-email`;
    const verificationLink = await adminAuth.generateEmailVerificationLink(
      email,
      {
        url: continueUrl,
        handleCodeInApp: false,
      },
    );

    const displayName =
      firebaseUser.displayName || authResult.user.name || 'مستخدم';

    const emailResult = await sendVerificationEmailViaResend(
      displayName,
      email,
      verificationLink,
    );

    if (!emailResult.success) {
      logApiError(apiContext, 'Verification email send failed', emailResult.error);
      return withRequestId(
        NextResponse.json(
          { error: 'تعذر إرسال رسالة التأكيد. حاول لاحقاً.' },
          { status: 500 },
        ),
        apiContext.requestId,
      );
    }

    logApiInfo(apiContext, 'Verification email sent via Resend', { email });

    return withRequestId(
      NextResponse.json({ success: true }),
      apiContext.requestId,
    );
  } catch (error) {
    logApiError(apiContext, 'send-verification-email error', error);
    return withRequestId(
      NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 }),
      apiContext.requestId,
    );
  }
}
