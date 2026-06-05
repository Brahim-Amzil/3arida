import { adminAuth } from '@/lib/firebase-admin';
import { getPublicAppUrl } from '@/lib/app-url';
import { sendPasswordResetEmailViaResend } from '@/lib/auth-password-reset-email';
import { rewriteFirebaseActionLinkToApp } from '@/lib/firebase-action-link';

function hasPasswordProvider(
  providerData: Array<{ providerId?: string }> | undefined,
): boolean {
  return (
    providerData?.some((provider) => provider.providerId === 'password') ?? false
  );
}

export async function sendPasswordResetEmailForAddress(
  email: string,
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

  if (!hasPasswordProvider(firebaseUser.providerData)) {
    // Google-only accounts cannot reset password this way
    return { success: true };
  }

  const userEmail = firebaseUser.email || normalizedEmail;
  const continueUrl = `${getPublicAppUrl()}/auth/reset-password`;
  const firebaseLink = await adminAuth.generatePasswordResetLink(userEmail, {
    url: continueUrl,
    handleCodeInApp: false,
  });
  const resetLink = rewriteFirebaseActionLinkToApp(firebaseLink);

  const name = firebaseUser.displayName || 'مستخدم';
  const emailResult = await sendPasswordResetEmailViaResend(
    name,
    userEmail,
    resetLink,
  );

  if (!emailResult.success) {
    return {
      success: false,
      error: 'تعذر إرسال رسالة إعادة التعيين. حاول لاحقاً.',
      status: 500,
    };
  }

  return { success: true };
}
