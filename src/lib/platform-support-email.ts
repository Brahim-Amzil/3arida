import { sendEmail } from '@/lib/email-service';
import { platformSupportThankYouEmail } from '@/lib/email-templates';

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

  const html = platformSupportThankYouEmail(
    userName || 'Supporter',
    amount,
    trimmedEmail,
  );

  return sendEmail({
    to: trimmedEmail,
    subject: `🙏 شكراً على دعمك للمنصة - Thank You for Your Support`,
    html,
  });
}
