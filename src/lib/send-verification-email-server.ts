import { adminAuth } from '@/lib/firebase-admin';
import { getPublicAppUrl } from '@/lib/app-url';
import { sendVerificationEmailViaResend } from '@/lib/auth-email-verification';

export async function sendVerificationEmailForAddress(
  email: string,
  displayName = 'مستخدم',
): Promise<{ success: true } | { success: false; error: string; status: number }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    return {
      success: false,
      error: 'البريد الإلكتروني مطلوب',
      status: 400,
    };
  }

  let firebaseUser;
  try {
    firebaseUser = await adminAuth.getUserByEmail(normalizedEmail);
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code;
    if (code === 'auth/user-not-found') {
      // Do not reveal whether the email exists
      return { success: true };
    }
    throw error;
  }

  if (firebaseUser.emailVerified) {
    return { success: true };
  }

  const userEmail = firebaseUser.email || normalizedEmail;
  const continueUrl = `${getPublicAppUrl()}/auth/verify-email`;
  const verificationLink = await adminAuth.generateEmailVerificationLink(
    userEmail,
    {
      url: continueUrl,
      handleCodeInApp: false,
    },
  );

  const name =
    firebaseUser.displayName || displayName || 'مستخدم';

  const emailResult = await sendVerificationEmailViaResend(
    name,
    userEmail,
    verificationLink,
  );

  if (!emailResult.success) {
    return {
      success: false,
      error: 'تعذر إرسال رسالة التأكيد. حاول لاحقاً.',
      status: 500,
    };
  }

  return { success: true };
}
