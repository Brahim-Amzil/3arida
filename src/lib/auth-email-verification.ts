import type { User as FirebaseUser } from 'firebase/auth';
import { getPublicAppUrl, emailButtonInlineStyle } from '@/lib/app-url';
import { sendEmail } from '@/lib/email-service';
import type { User } from '@/types/petition';

export const EMAIL_NOT_VERIFIED_CODE = 'auth/email-not-verified';

export function isDisposableOrInvalidEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalized)) {
    return true;
  }
  const domain = normalized.split('@')[1] || '';
  if (domain.length < 4 || !domain.includes('.')) {
    return true;
  }
  return false;
}

export function isEmailPasswordUser(firebaseUser: FirebaseUser): boolean {
  return firebaseUser.providerData.some(
    (provider) => provider.providerId === 'password',
  );
}

export function requiresEmailVerification(
  firebaseUser: FirebaseUser | null,
  _userProfile?: User | null,
): boolean {
  if (!firebaseUser?.email) {
    return false;
  }
  if (!isEmailPasswordUser(firebaseUser)) {
    return false;
  }
  return !firebaseUser.emailVerified;
}

export function assertEmailVerifiedForPlatformAction(
  firebaseUser: FirebaseUser | null,
): void {
  if (requiresEmailVerification(firebaseUser)) {
    throw new Error(
      'يجب تأكيد بريدك الإلكتروني قبل إنشاء عريضة أو التوقيع. افتح صفحة تأكيد البريد.',
    );
  }
}

export function buildEmailVerificationHtml(
  userName: string,
  verificationLink: string,
): string {
  const appUrl = getPublicAppUrl();
  const safeName = userName || 'مستخدم';

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="font-family: Cairo, Arial, sans-serif; background:#f3f4f6; margin:0; padding:24px; direction:rtl;">
        <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <div style="background:linear-gradient(135deg,#059669 0%,#047857 100%);color:#fff;padding:28px;text-align:center;">
            <h1 style="margin:0;font-size:22px;">تأكيد بريدك الإلكتروني — 3arida</h1>
          </div>
          <div style="padding:28px;color:#1f2937;line-height:1.8;text-align:right;">
            <p>مرحباً <strong>${safeName}</strong>،</p>
            <p>شكراً لتسجيلك في <strong>3arida</strong>. يجب تأكيد بريدك الإلكتروني قبل استخدام المنصة.</p>
            <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:16px;margin:20px 0;">
              <p style="margin:0;color:#92400e;font-weight:700;">مهم</p>
              <p style="margin:8px 0 0;color:#78350f;">
                بدون تأكيد البريد الإلكتروني <strong>لا يمكنك</strong> إنشاء عريضة أو التوقيع على العرائض.
              </p>
            </div>
            <p style="text-align:center;margin:28px 0;">
              <a href="${verificationLink}" style="${emailButtonInlineStyle}">تأكيد البريد الإلكتروني</a>
            </p>
            <p style="font-size:13px;color:#6b7280;word-break:break-all;">
              إذا لم يعمل الزر، انسخ هذا الرابط إلى متصفحك:<br />
              <a href="${verificationLink}" style="color:#047857;">${verificationLink}</a>
            </p>
            <p style="font-size:13px;color:#6b7280;">
              إذا لم تطلب هذا الحساب، تجاهل هذه الرسالة.
            </p>
          </div>
          <div style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#6b7280;">
            <p style="margin:0;">© 3arida — <a href="${appUrl}" style="color:#047857;">${appUrl}</a></p>
            <p style="margin:8px 0 0;">للدعم: <a href="mailto:support@3arida.org" style="color:#047857;">support@3arida.org</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function buildEmailVerificationPlainText(
  userName: string,
  verificationLink: string,
): string {
  return [
    `مرحباً ${userName || 'مستخدم'}،`,
    '',
    'يرجى تأكيد بريدك الإلكتروني على منصة 3arida.',
    '',
    'بدون التأكيد لا يمكنك إنشاء عريضة أو التوقيع على العرائض.',
    '',
    `رابط التأكيد: ${verificationLink}`,
    '',
    'إذا لم تطلب هذا الحساب، تجاهل هذه الرسالة.',
  ].join('\n');
}

export async function sendVerificationEmailViaResend(
  userName: string,
  userEmail: string,
  verificationLink: string,
) {
  return sendEmail({
    to: userEmail,
    subject: 'تأكيد بريدك الإلكتروني — #عريـــضة',
    html: buildEmailVerificationHtml(userName, verificationLink),
    text: buildEmailVerificationPlainText(userName, verificationLink),
    replyTo: process.env.CONTACT_EMAIL || 'support@3arida.org',
  });
}
