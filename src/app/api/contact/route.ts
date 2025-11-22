import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const reasonLabels: Record<string, string> = {
  general: 'استفسار عام',
  technical: 'مشكلة تقنية',
  petition: 'سؤال حول عريضة',
  account: 'مشكلة في الحساب',
  report: 'الإبلاغ عن محتوى',
  partnership: 'شراكة أو تعاون',
  press: 'استفسار صحفي',
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
    } = body;

    // Validation
    if (!name || !email || !reason || !subject || !message) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
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
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return NextResponse.json(
        { error: 'خدمة البريد الإلكتروني غير مكونة' },
        { status: 500 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صالح' },
        { status: 400 }
      );
    }

    const reasonLabel = reasonLabels[reason] || reason;

    // Send email using Resend
    // Note: Using onboarding@resend.dev for testing. Replace with verified domain in production.
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email, // Send to user's email for now (testing)
      replyTo: email,
      subject: `[3arida Contact Form] [${reasonLabel}] ${subject}`,
      html: `
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
              <h2 style="margin: 0;">رسالة جديدة من نموذج الاتصال</h2>
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
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      // Return a more user-friendly error
      return NextResponse.json(
        {
          error: 'فشل إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى لاحقًا.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
