import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptchaServerToken } from '@/lib/server-recaptcha';
import { sendEmail } from '@/lib/email-service';
import {
  initApiRequestContext,
  logApiError,
  logApiInfo,
  withRequestId,
} from '@/lib/api-observability';

const reasonLabels: Record<string, string> = {
  general: 'استفسار عام',
  technical: 'مشكلة تقنية',
  petition: 'سؤال حول عريضة',
  account: 'مشكلة في الحساب',
  report: 'الإبلاغ عن محتوى',
  partnership: 'شراكة أو تعاون',
  press: 'استفسار صحفي',
  'influencer-coupon': 'طلب كوبون مؤثر',
  other: 'أخرى',
};

const CONTACT_INBOX_EMAIL = 'contact@3arida.org';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const platformLabels: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  x: 'X (Twitter)',
  facebook: 'Facebook',
  snapchat: 'Snapchat',
  other: 'أخرى',
};

export async function POST(request: NextRequest) {
  const apiContext = initApiRequestContext(request, 'api/contact');

  try {
    const body = await request.json();
    const {
      name,
      email,
      reason,
      subject,
      message,
      recaptchaToken,
      petitionCode,
      reportDetails,
      platform,
      accountUrl,
      followerCount,
      discountTier,
    } = body;

    const recaptchaResult = await verifyRecaptchaServerToken(recaptchaToken, {
      minScore: 0.3,
      expectedAction: 'contact_form_submit',
    });

    if (!recaptchaResult.success) {
      logApiError(apiContext, 'Contact form reCAPTCHA failed', {
        error: recaptchaResult.error,
        score: recaptchaResult.score,
      });
      return withRequestId(
        NextResponse.json(
          {
            error:
              'فشل التحقق الأمني. يرجى تحديث الصفحة والمحاولة مرة أخرى.',
            code: 'recaptcha_failed',
            details:
              process.env.NODE_ENV === 'development'
                ? recaptchaResult.error
                : undefined,
          },
          { status: 400 },
        ),
        apiContext.requestId,
      );
    }

    // Validation
    if (!name || !email || !reason || !subject || !message) {
      return withRequestId(
        NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 },
        ),
        apiContext.requestId,
      );
    }

    // Additional validation for petition reason
    if (reason === 'petition' && !petitionCode) {
      return withRequestId(
        NextResponse.json({ error: 'رمز العريضة مطلوب' }, { status: 400 }),
        apiContext.requestId,
      );
    }

    // Additional validation for report reason
    if (reason === 'report' && !reportDetails) {
      return withRequestId(
        NextResponse.json(
        { error: 'تفاصيل البلاغ مطلوبة' },
        { status: 400 },
        ),
        apiContext.requestId,
      );
    }

    // Additional validation for influencer coupon reason
    if (reason === 'influencer-coupon') {
      if (!platform || !accountUrl || !followerCount || !discountTier) {
        return withRequestId(
          NextResponse.json(
          { error: 'جميع معلومات المؤثر مطلوبة' },
          { status: 400 },
          ),
          apiContext.requestId,
        );
      }
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      logApiError(apiContext, 'Resend API key not configured');
      return withRequestId(
        NextResponse.json(
        { error: 'خدمة البريد الإلكتروني غير مكونة' },
        { status: 500 },
        ),
        apiContext.requestId,
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return withRequestId(
        NextResponse.json(
        { error: 'البريد الإلكتروني غير صالح' },
        { status: 400 },
        ),
        apiContext.requestId,
      );
    }

    const reasonLabel = reasonLabels[reason] || reason;
    const safeName = escapeHtml(String(name));
    const safeEmail = escapeHtml(String(email));
    const safeSubject = escapeHtml(String(subject));
    const safeMessage = escapeHtml(String(message));
    const safeReasonLabel = escapeHtml(reasonLabel);
    const safePetitionCode = petitionCode
      ? escapeHtml(String(petitionCode))
      : '';
    const safeReportDetails = reportDetails
      ? escapeHtml(String(reportDetails))
      : '';
    const safeAccountUrl = accountUrl ? escapeHtml(String(accountUrl)) : '';
    const safeFollowerCount = followerCount
      ? escapeHtml(String(followerCount))
      : '';
    const safeDiscountTier = discountTier
      ? escapeHtml(String(discountTier))
      : '';
    const safePlatformLabel = platform
      ? escapeHtml(platformLabels[platform] || String(platform))
      : '';

    const emailHtml = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              direction: rtl;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #16a34a;
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f9fafb;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .field {
              margin-bottom: 20px;
            }
            .label {
              font-weight: bold;
              color: #374151;
              display: block;
              margin-bottom: 5px;
            }
            .value {
              background-color: white;
              padding: 10px;
              border-radius: 4px;
              border: 1px solid #d1d5db;
            }
            .message-box {
              background-color: white;
              padding: 15px;
              border-radius: 4px;
              border: 1px solid #d1d5db;
              white-space: pre-wrap;
              min-height: 100px;
            }
            .footer {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;"># 3arida.org #</h2>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">الاسم:</span>
                <div class="value">${safeName}</div>
              </div>
              
              <div class="field">
                <span class="label">البريد الإلكتروني:</span>
                <div class="value">${safeEmail}</div>
              </div>
              
              <div class="field">
                <span class="label">سبب التواصل:</span>
                <div class="value">${safeReasonLabel}</div>
              </div>
              
              <div class="field">
                <span class="label">الموضوع:</span>
                <div class="value">${safeSubject}</div>
              </div>
              
              ${
                petitionCode
                  ? `
              <div class="field">
                <span class="label">رمز العريضة:</span>
                <div class="value">${safePetitionCode}</div>
              </div>
              `
                  : ''
              }
              
              ${
                reportDetails
                  ? `
              <div class="field">
                <span class="label">تفاصيل البلاغ:</span>
                <div class="message-box">${safeReportDetails}</div>
              </div>
              `
                  : ''
              }
              
              ${
                reason === 'influencer-coupon'
                  ? `
              <div style="background-color: #f3e8ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 2px solid #a855f7;">
                <h3 style="color: #7c3aed; margin-top: 0;">🌟 معلومات المؤثر</h3>
                
                <div class="field">
                  <span class="label">فئة الخصم المطلوبة:</span>
                  <div class="value" style="background-color: white; font-size: 18px; font-weight: bold; color: #7c3aed;">
                    ${safeDiscountTier}% خصم
                  </div>
                </div>
                
                <div class="field">
                  <span class="label">المنصة:</span>
                  <div class="value" style="background-color: white;">
                    ${safePlatformLabel}
                  </div>
                </div>
                
                <div class="field">
                  <span class="label">رابط الحساب / القناة:</span>
                  <div class="value" style="background-color: white; direction: ltr; text-align: left;">
                    <a href="${safeAccountUrl}" target="_blank" style="color: #2563eb; text-decoration: none;">
                      ${safeAccountUrl}
                    </a>
                  </div>
                </div>
                
                <div class="field">
                  <span class="label">عدد المتابعين:</span>
                  <div class="value" style="background-color: white; font-size: 16px; font-weight: bold;">
                    ${safeFollowerCount}
                  </div>
                </div>
                
            
              </div>
              `
                  : ''
              }
              
              <div class="field">
                <span class="label">الرسالة:</span>
                <div class="message-box">${safeMessage}</div>
              </div>
              
              <div class="footer">
                <p>تم إرسال هذه الرسالة من نموذج الاتصال على موقع 3arida.org</p>
                <p>للرد، استخدم البريد الإلكتروني: ${safeEmail}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

    const toEmail = process.env.CONTACT_EMAIL || CONTACT_INBOX_EMAIL;

    logApiInfo(apiContext, 'Sending contact email', { toEmail });

    const emailResult = await sendEmail({
      to: toEmail,
      subject: `[${reasonLabel}] ${subject}`,
      html: emailHtml,
      replyTo: email,
    });

    if (!emailResult.success) {
      const resendMessage =
        emailResult.error &&
        typeof emailResult.error === 'object' &&
        'message' in emailResult.error
          ? String((emailResult.error as { message: string }).message)
          : 'Email send failed';
      logApiError(apiContext, 'Contact email send failed', emailResult.error);
      return withRequestId(
        NextResponse.json(
          {
            error:
              'تعذر إرسال الرسالة حالياً. يرجى المحاولة لاحقاً أو مراسلتنا على contact@3arida.org',
            code: 'email_send_failed',
            details:
              process.env.NODE_ENV === 'development' ? resendMessage : undefined,
          },
          { status: 500 },
        ),
        apiContext.requestId,
      );
    }

    return withRequestId(
      NextResponse.json(
        { success: true, messageId: emailResult.data?.id },
        { status: 200 },
      ),
      apiContext.requestId,
    );
  } catch (error) {
    logApiError(apiContext, 'Contact form error', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return withRequestId(
      NextResponse.json(
      {
        error: 'حدث خطأ في الخادم',
        details:
          process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 },
      ),
      apiContext.requestId,
    );
  }
}
