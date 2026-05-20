import { getPublicAppUrl } from '@/lib/app-url';
import { sendEmail } from '@/lib/email-service';
import { platformSupportThankYouEmail } from '@/lib/email-templates';

function platformSupportThankYouPlainText(
  userName: string,
  amount: number,
): string {
  const appUrl = getPublicAppUrl();
  return [
    `عزيزي ${userName}،`,
    '',
    'نشكرك على دعمك لمنصة عريضة. تم استلام مساهمتك بنجاح.',
    '',
    `المبلغ: ${amount} DH`,
    '',
    'دعمك يساعدنا على تطوير المنصة وخدمة المجتمع.',
    '',
    `تصفح العرائض: ${appUrl}/petitions`,
    '',
    'مع التقدير،',
    'فريق 3arida',
    '',
    '---',
    `Dear ${userName}, thank you for supporting 3arida. We received your ${amount} MAD contribution.`,
  ].join('\n');
}

export async function sendPlatformSupportThankYouEmail(params: {
  userName: string;
  amount: number;
  userEmail: string;
}) {
  const { userName, amount, userEmail } = params;
  const trimmedEmail = userEmail?.trim();

  if (!trimmedEmail || !amount) {
    return {
      success: false,
      error: 'Missing required fields',
    };
  }

  const displayName = userName || 'Supporter';
  const html = platformSupportThankYouEmail(displayName, amount, trimmedEmail);
  const text = platformSupportThankYouPlainText(displayName, amount);

  return sendEmail({
    to: trimmedEmail,
    subject: `شكراً على دعمك لمنصة عريضة (${amount} DH)`,
    html,
    text,
    replyTo: process.env.CONTACT_EMAIL || 'contact@3arida.org',
  });
}
