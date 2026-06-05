import { getPublicAppUrl, emailButtonInlineStyle } from '@/lib/app-url';
import { sendEmail } from '@/lib/email-service';

export function buildPasswordResetHtml(
  userName: string,
  resetLink: string,
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
            <h1 style="margin:0;font-size:22px;">إعادة تعيين كلمة المرور — 3arida</h1>
          </div>
          <div style="padding:28px;color:#1f2937;line-height:1.8;text-align:right;">
            <p>مرحباً <strong>${safeName}</strong>،</p>
            <p>تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك على <strong>3arida</strong>.</p>
            <p style="text-align:center;margin:28px 0;">
              <a href="${resetLink}" style="${emailButtonInlineStyle}">تعيين كلمة مرور جديدة</a>
            </p>
            <p style="font-size:13px;color:#6b7280;word-break:break-all;">
              إذا لم يعمل الزر، انسخ هذا الرابط إلى متصفحك:<br />
              <a href="${resetLink}" style="color:#047857;">${resetLink}</a>
            </p>
            <p style="font-size:13px;color:#6b7280;">
              إذا لم تطلب إعادة التعيين، تجاهل هذه الرسالة. تنتهي صلاحية الرابط بعد فترة محدودة.
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

export function buildPasswordResetPlainText(
  userName: string,
  resetLink: string,
): string {
  return [
    `مرحباً ${userName || 'مستخدم'}،`,
    '',
    'لإعادة تعيين كلمة المرور على منصة 3arida، افتح الرابط التالي:',
    '',
    resetLink,
    '',
    'إذا لم تطلب إعادة التعيين، تجاهل هذه الرسالة.',
  ].join('\n');
}

export async function sendPasswordResetEmailViaResend(
  userName: string,
  userEmail: string,
  resetLink: string,
) {
  return sendEmail({
    to: userEmail,
    subject: 'إعادة تعيين كلمة المرور — #عريـــضة',
    html: buildPasswordResetHtml(userName, resetLink),
    text: buildPasswordResetPlainText(userName, resetLink),
    replyTo: process.env.CONTACT_EMAIL || 'support@3arida.org',
  });
}
