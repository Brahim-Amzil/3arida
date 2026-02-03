import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

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
  try {
    const body = await request.json();
    const {
      name,
      email,
      reason,
      subject,
      message,
      petitionCode,
      reportDetails,
      platform,
      accountUrl,
      followerCount,
      discountTier,
    } = body;

    // Validation
    if (!name || !email || !reason || !subject || !message) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 },
      );
    }

    // Additional validation for petition reason
    if (reason === 'petition' && !petitionCode) {
      return NextResponse.json({ error: 'رمز العريضة مطلوب' }, { status: 400 });
    }

    // Additional validation for report reason
    if (reason === 'report' && !reportDetails) {
      return NextResponse.json(
        { error: 'تفاصيل البلاغ مطلوبة' },
        { status: 400 },
      );
    }

    // Additional validation for influencer coupon reason
    if (reason === 'influencer-coupon') {
      if (!platform || !accountUrl || !followerCount || !discountTier) {
        return NextResponse.json(
          { error: 'جميع معلومات المؤثر مطلوبة' },
          { status: 400 },
        );
      }
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('Resend API key not configured');
      return NextResponse.json(
        { error: 'خدمة البريد الإلكتروني غير مكونة' },
        { status: 500 },
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صالح' },
        { status: 400 },
      );
    }

    const reasonLabel = reasonLabels[reason] || reason;

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
              <h2 style="margin: 0;"># 3arida.ma #</h2>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">الاسم:</span>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <span class="label">البريد الإلكتروني:</span>
                <div class="value">${email}</div>
              </div>
              
              <div class="field">
                <span class="label">سبب التواصل:</span>
                <div class="value">${reasonLabel}</div>
              </div>
              
              <div class="field">
                <span class="label">الموضوع:</span>
                <div class="value">${subject}</div>
              </div>
              
              ${
                petitionCode
                  ? `
              <div class="field">
                <span class="label">رمز العريضة:</span>
                <div class="value">${petitionCode}</div>
              </div>
              `
                  : ''
              }
              
              ${
                reportDetails
                  ? `
              <div class="field">
                <span class="label">تفاصيل البلاغ:</span>
                <div class="message-box">${reportDetails}</div>
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
                    ${discountTier}% خصم
                  </div>
                </div>
                
                <div class="field">
                  <span class="label">المنصة:</span>
                  <div class="value" style="background-color: white;">
                    ${platformLabels[platform] || platform}
                  </div>
                </div>
                
                <div class="field">
                  <span class="label">رابط الحساب / القناة:</span>
                  <div class="value" style="background-color: white; direction: ltr; text-align: left;">
                    <a href="${accountUrl}" target="_blank" style="color: #2563eb; text-decoration: none;">
                      ${accountUrl}
                    </a>
                  </div>
                </div>
                
                <div class="field">
                  <span class="label">عدد المتابعين:</span>
                  <div class="value" style="background-color: white; font-size: 16px; font-weight: bold;">
                    ${followerCount}
                  </div>
                </div>
                
            
              </div>
              `
                  : ''
              }
              
              <div class="field">
                <span class="label">الرسالة:</span>
                <div class="message-box">${message}</div>
              </div>
              
              <div class="footer">
                <p>تم إرسال هذه الرسالة من نموذج الاتصال على موقع 3arida.ma</p>
                <p>للرد، استخدم البريد الإلكتروني: ${email}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

    // Send email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Use verified domain for sender, configurable recipient
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'contact@3arida.ma';
    const toEmail = process.env.CONTACT_EMAIL || 'contact@3arida.ma';

    console.log('Sending email from:', fromEmail, 'to:', toEmail);

    const emailResult = await resend.emails.send({
      from: `3arida Platform <${fromEmail}>`,
      to: toEmail,
      subject: `[${reasonLabel}] ${subject}`,
      replyTo: email,
      html: emailHtml,
    });

    if (emailResult.error) {
      console.error('Resend error:', emailResult.error);
      throw new Error(emailResult.error.message);
    }

    return NextResponse.json(
      { success: true, messageId: emailResult.data?.id },
      { status: 200 },
    );
  } catch (error) {
    console.error('Contact form error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    return NextResponse.json(
      {
        error: 'حدث خطأ في الخادم',
        details:
          process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 },
    );
  }
}
