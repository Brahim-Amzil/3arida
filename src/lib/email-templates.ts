import { getBaseEmailStyles } from './email-service';

export function welcomeEmail(userName: string, userEmail: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        ${getBaseEmailStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 مرحبا بك في 3arida</h1>
            <p>Welcome to 3arida Platform</p>
          </div>
          <div class="content">
            <h2>مرحبا ${userName}!</h2>
            <p>شكرا لانضمامك إلى منصة 3arida - منصة العرائض الرقمية للمغرب.</p>
            <p>Thank you for joining 3arida - Morocco's digital petition platform.</p>
            
            <h3>ماذا يمكنك أن تفعل الآن؟</h3>
            <ul>
              <li>إنشاء عريضة جديدة</li>
              <li>التوقيع على العرائض الموجودة</li>
              <li>مشاركة العرائض مع أصدقائك</li>
              <li>متابعة تقدم العرائض</li>
            </ul>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/petitions" class="button">تصفح العرائض</a>
            
            <p>إذا كان لديك أي أسئلة، لا تتردد في التواصل معنا.</p>
          </div>
          <div class="footer">
            <p>© 2026 3arida Platform. All rights reserved.</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${userEmail}">إلغاء الاشتراك</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function petitionApprovedEmail(
  userName: string,
  petitionTitle: string,
  petitionId: string,
  userEmail: string,
) {
  return `
    <!DOCTYPE html>
    <html dir="rtl">
      <head>
        ${getBaseEmailStyles()}
      </head>
      <body style="font-family: 'Cairo', sans-serif; direction: rtl; text-align: right; margin: 0; padding: 0;">
        <div class="container" style="font-family: 'Cairo', sans-serif; direction: rtl;">
          <div class="header" style="font-family: 'Cairo', sans-serif;">
            <h1 style="font-family: 'Cairo', sans-serif;">✅ تمت الموافقة على عريضتك</h1>
          </div>
          <div class="content" style="font-family: 'Cairo', sans-serif; direction: rtl; text-align: right;">
            <h2 style="font-family: 'Cairo', sans-serif; text-align: right;">مبروك ${userName}!</h2>
            <p style="font-family: 'Cairo', sans-serif; text-align: right;">تمت الموافقة على عريضتك "<strong>${petitionTitle}</strong>" ونشرها على المنصة.</p>
            
            <h3 style="font-family: 'Cairo', sans-serif; text-align: right;">الخطوات التالية:</h3>
            <ul style="font-family: 'Cairo', sans-serif; text-align: right; padding-right: 20px; padding-left: 0;">
              <li style="font-family: 'Cairo', sans-serif; text-align: right;">شارك عريضتك مع أصدقائك وعائلتك</li>
              <li style="font-family: 'Cairo', sans-serif; text-align: right;">انشر رابط العريضة على وسائل التواصل الاجتماعي</li>
              <li style="font-family: 'Cairo', sans-serif; text-align: right;">تابع عدد التوقيعات والتعليقات</li>
              <li style="font-family: 'Cairo', sans-serif; text-align: right;">أضف تحديثات لإبقاء الموقعين على اطلاع</li>
            </ul>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/petitions/${petitionId}" class="button" style="font-family: 'Cairo', sans-serif;">عرض العريضة</a>
            
            <p style="font-family: 'Cairo', sans-serif; text-align: right;">نتمنى لك التوفيق في حملتك!</p>
          </div>
          <div class="footer" style="font-family: 'Cairo', sans-serif;">
            <p style="font-family: 'Cairo', sans-serif;">© 2026 منصة عريضة. جميع الحقوق محفوظة.</p>
            <p style="font-family: 'Cairo', sans-serif;"><a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${userEmail}" style="font-family: 'Cairo', sans-serif;">إلغاء الاشتراك</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function signatureConfirmationEmail(
  userName: string,
  petitionTitle: string,
  petitionId: string,
  userEmail: string,
) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        ${getBaseEmailStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✍️ شكرا على توقيعك</h1>
            <p>Thank You for Your Signature</p>
          </div>
          <div class="content">
            <h2>شكرا ${userName}!</h2>
            <p>تم تسجيل توقيعك على العريضة "<strong>${petitionTitle}</strong>".</p>
            <p>صوتك مهم ويساهم في إحداث التغيير!</p>  
            <h3>ساعد في نشر الكلمة:</h3>
            <ul>
              <li>شارك العريضة مع أصدقائك</li>
              <li>انشرها على وسائل التواصل الاجتماعي</li>
              <li>شجع الآخرين على التوقيع</li>
            </ul>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/petitions/${petitionId}" class="button">عرض العريضة</a>
          </div>
          <div class="footer">
            <p>© 2026 3arida Platform. All rights reserved.</p>
            <p><a href="3arida.org">3arida.org</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function petitionUpdateEmail(
  userName: string,
  petitionTitle: string,
  petitionId: string,
  updateTitle: string,
  updateContent: string,
  userEmail: string,
) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        ${getBaseEmailStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📢 تحديث جديد على العريضة</h1>
            <p>New Petition Update</p>
          </div>
          <div class="content">
            <h2>مرحبا ${userName}!</h2>
            <p>هناك تحديث جديد على العريضة "<strong>${petitionTitle}</strong>" التي وقعت عليها.</p>
            <p>There's a new update on "<strong>${petitionTitle}</strong>" that you signed.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>${updateTitle}</h3>
              <p>${updateContent.substring(0, 200)}${updateContent.length > 200 ? '...' : ''}</p>
            </div>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/petitions/${petitionId}" class="button">قراءة التحديث الكامل</a>
          </div>
          <div class="footer">
            <p>© 2026 3arida Platform. All rights reserved.</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${userEmail}">إلغاء الاشتراك</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function milestoneReachedEmail(
  userName: string,
  petitionTitle: string,
  petitionId: string,
  milestone: number,
  currentSignatures: number,
  targetSignatures: number,
  userEmail: string,
) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        ${getBaseEmailStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 تم الوصول إلى هدف جديد!</h1>
            <p>Milestone Reached!</p>
          </div>
          <div class="content">
            <h2>مبروك ${userName}!</h2>
            <p>عريضتك "<strong>${petitionTitle}</strong>" وصلت إلى ${milestone}% من مُوَجهة لِ!</p>
            <p>Your petition "<strong>${petitionTitle}</strong>" has reached ${milestone}% of its goal!</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h1 style="color: #667eea; margin: 0;">${currentSignatures.toLocaleString()}</h1>
              <p style="margin: 10px 0;">من ${targetSignatures.toLocaleString()} توقيع</p>
              <div style="background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 100%; width: ${milestone}%;"></div>
              </div>
            </div>
            
            <p>استمر في المشاركة للوصول إلى مُوَجهة لِ الكامل!</p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/petitions/${petitionId}" class="button">عرض العريضة</a>
          </div>
          <div class="footer">
            <p>© 2026 3arida Platform. All rights reserved.</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${userEmail}">إلغاء الاشتراك</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function platformSupportThankYouEmail(
  userName: string,
  amount: number,
  userEmail: string,
) {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Cairo', sans-serif !important; }
          body { background: #faf9fb; padding: 20px; direction: rtl; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(147, 51, 234, 0.08); }
          .header { background: linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%); padding: 20px; text-align: center; }
          .header-icon { font-size: 40px; margin-bottom: 10px; }
          .header-title { color: #9333ea; font-size: 24px; font-weight: 700; margin: 0; }
          .content { padding: 25px; }
          .greeting { font-size: 18px; color: #1f2937; margin-bottom: 12px; text-align: right; font-weight: 600; direction: rtl; }
          .message { font-size: 15px; color: #4b5563; line-height: 1.7; margin-bottom: 20px; text-align: right; direction: rtl; }
          .amount-box { background: linear-gradient(135deg, rgba(147, 51, 234, 0.95) 0%, rgba(79, 70, 229, 0.95) 100%); border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
          .amount-icon { font-size: 32px; margin-bottom: 8px; }
          .amount-label { color: rgba(255, 255, 255, 0.95); font-size: 14px; margin-bottom: 6px; direction: rtl; }
          .amount-value { color: white; font-size: 36px; font-weight: 700; margin: 8px 0; direction: ltr; }
          .amount-subtitle { color: rgba(255, 255, 255, 0.95); font-size: 13px; direction: rtl; }
          .benefits { background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border-radius: 10px; padding: 20px; margin: 20px 0; }
          .benefits-title { color: #059669; font-size: 16px; font-weight: 700; margin-bottom: 12px; text-align: right; direction: rtl; }
          .benefits-list { list-style: none; padding: 0; margin: 0; }
          .benefits-list li { color: #374151; font-size: 14px; line-height: 1.7; margin-bottom: 10px; text-align: right; padding-right: 22px; position: relative; direction: rtl; }
          .benefits-list li:before { content: "✓"; position: absolute; right: 0; color: #059669; font-weight: bold; font-size: 15px; }
          .benefits-list strong { color: #1f2937; font-weight: 600; }
          .closing { font-size: 14px; color: #4b5563; line-height: 1.7; margin: 20px 0; text-align: right; direction: rtl; }
          .button { display: inline-block; background: linear-gradient(135deg, #debaff 0%, #d1cfff 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 10px; font-size: 15px; font-weight: 700; margin: 15px 0; }
          .final-message { text-align: center; font-size: 18px; color: #9333ea; font-weight: 700; margin: 20px 0; direction: rtl; }
          .footer { background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; }
          .footer-text { color: #6b7280; font-size: 12px; margin-bottom: 6px; direction: rtl; }
          .footer-link { color: #9333ea; text-decoration: none; font-size: 12px; direction: rtl; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-icon">🙏</div>
            <h1 class="header-title">شكراً جزيلاً!</h1>
          </div>
          <div class="content">
            <h2 class="greeting">عزيزي ${userName}،</h2>
            <p class="message">نشكرك على دعمِــك لـ #منصة_عريضة. تقديرك لخدماتنا يعني الكثير لنا.</p>
            <div class="amount-box">
              <div class="amount-icon">💝</div>
              <div class="amount-label">إكراميتك</div>
              <div class="amount-value">${amount} DH</div>
              <div class="amount-subtitle">تم إستلام الدفع بنجاح</div>
            </div>
            <div class="benefits">
              <div class="benefits-title">💚 كيف نستخدم دعمك المالي؟</div>
              <ul class="benefits-list">
                <li><strong>تطوير المنصة:</strong> تحسين الميزات وإضافة وظائف جديدة</li>
                <li><strong>الاستضافة والبنية التحتية:</strong> ضمان أداء سريع وموثوق</li>
                <li><strong>الدعم الفني:</strong> مساعدة المستخدمين وحل المشاكل</li>
                <li><strong>تحسين الخدمة:</strong> تقديم تجربة أفضل للجميع</li>
              </ul>
            </div>
            <p class="closing">دعمُك يُساعدنا على تقديم خدمة أفضل للمجتمع المغربي وتحسين تجربة المستخدمين.</p>
            <center><a href="${process.env.NEXT_PUBLIC_APP_URL}/petitions" class="button">تصفح العرائض</a></center>
            <div class="final-message">شكراً لكونك جزءاً من مجتمع #منصة_عريضة! 🙏</div>
          </div>
          <div class="footer">
            <p class="footer-text">© 2026 منصة عريضة. جميع الحقوق محفوظة.</p>
<a href="https://3arida.org" class="footer-link">3arida.org</a>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function petitionRejectedEmail(
  userName: string,
  petitionTitle: string,
  petitionId: string,
  reason: string,
  userEmail: string,
) {
  return `
    <!DOCTYPE html>
    <html dir="rtl">
      <head>
        ${getBaseEmailStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header" style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);">
            <h1>❌ تم رفض عريضتك</h1>
          </div>
          <div class="content">
            <h2>${userName}</h2>
            <p>نأسف لإبلاغك بأن عريضتك "<strong>${petitionTitle}</strong>" لم تتم الموافقة عليها.</p>
            
            <div style="background-color: #fef2f2; border-right: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin-top: 0; color: #991b1b;">السبب:</h3>
              <p style="margin-bottom: 0;">${reason || 'لم يتم تقديم سبب'}</p>
            </div>
            
            <h3>ماذا يمكنك أن تفعل؟</h3>
            <ul>
              <li>راجع سبب الرفض بعناية</li>
              <li>قم بتعديل عريضتك وفقًا للملاحظات</li>
              <li>أعد تقديم العريضة (يمكنك إعادة التقديم حتى 3 مرات)</li>
              <li>تأكد من إتِّباع إرشادات المنصة</li>
            </ul>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/petitions/${petitionId}" class="button" style="background: linear-gradient(135deg, #f59f9f 0%, #c47272 100%);">عرض العريضة و طلب إعادة التقديم</a>
            
            <p>إذا كان لديك أي أسئلة، يمكنك التواصل مع فريق الدعم.</p>
          </div>
          <div class="footer">
            <p>© 2026 منصة عريضة. جميع الحقوق محفوظة.</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${userEmail}">إلغاء الاشتراك</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function petitionPausedEmail(
  userName: string,
  petitionTitle: string,
  petitionId: string,
  reason: string,
  userEmail: string,
) {
  return `
    <!DOCTYPE html>
    <html dir="rtl">
      <head>
        ${getBaseEmailStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header" style="background: linear-gradient(135deg, #fad8a5 0%, #e6b66e 100%);">
            <h1>⏸️ تم إيقاف عريضتك مؤقتًا</h1>
          </div>
          <div class="content">
            <h2>${userName}</h2>
            <p>تم إيقاف عريضتك "<strong>${petitionTitle}</strong>" مؤقتًا من قبل فريق الإشراف.</p>
            
            <div style="background-color: #fffbeb; border-right: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin-top: 0; color: #d97706;">السبب:</h3>
              <p style="margin-bottom: 0;">${reason || 'لم يتم تقديم سبب'}</p>
            </div>
            
            <h3>ماذا يعني هذا؟</h3>
            <ul>
              <li>عريضتك غير مرئية للجمهور حاليًا</li>
              <li>لن يتمكن المستخدمون من التوقيع عليها</li>
              <li>يمكن إعادة تفعيلها بعد المراجعة</li>
              <li>جميع التوقيعات الحالية محفوظة</li>
            </ul>
            
            <h3>الخطوات التالية:</h3>
            <ul>
              <li>راجع سبب الإيقاف</li>
              <li>تواصل مع فريق الإشراف إذا كان لديك أسئلة</li>
              <li>قم بإجراء التعديلات اللازمة إذا طُلب منك ذلك</li>
            </ul>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact" class="button" style="background: linear-gradient(135deg,  #fad8a5 0%, #e6b66e 100%);">تواصل مع فريق الإشراف</a>
            
            <p>نحن هنا لمساعدتك في حل أي مشاكل.</p>
          </div>
          <div class="footer">
            <p>© 2026 منصة عريضة. جميع الحقوق محفوظة.</p>
            <p><a href="3arida.org">3arida.org</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function petitionDeletedEmail(
  userName: string,
  petitionTitle: string,
  reason: string,
  userEmail: string,
) {
  return `
    <!DOCTYPE html>
    <html dir="rtl">
      <head>
        ${getBaseEmailStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header" style="background: linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%);">
            <h1>🗑️ تم حذف عريضتك</h1>
          </div>
          <div class="content">
            <h2>${userName}</h2>
            <p>تم حذف عريضتك "<strong>${petitionTitle}</strong>" من المنصة.</p>
            
            <div style="background-color: #fef2f2; border-right: 4px solid #7f1d1d; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin-top: 0; color: #7f1d1d;">السبب:</h3>
              <p style="margin-bottom: 0;">${reason || 'لم يتم تقديم سبب'}</p>
            </div>
            
            <h3>ماذا يعني هذا؟</h3>
            <ul>
              <li>تم إزالة العريضة نهائيًا من المنصة</li>
              <li>لن تكون مرئية للجمهور</li>
              <li>لا يمكن استعادتها</li>
              <li>يمكنك إنشاء عريضة جديدة إذا رغبت</li>
            </ul>
            
            <h3>إذا كنت تعتقد أن هذا خطأ:</h3>
            <ul>
              <li>تواصل مع فريق الدعم</li>
              <li>قدم استئنافًا مع التفاصيل</li>
              <li>سنراجع حالتك في أقرب وقت ممكن</li>
            </ul>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact" class="button" style="background: linear-gradient(135deg, #a9c1f5 0%, #6686cc 100%);">تواصل مع الدعم</a>
            
            <p>نأسف لأي إزعاج قد يسببه هذا.</p>
          </div>
          <div class="footer">
            <p>© 2026 منصة عريضة. جميع الحقوق محفوظة.</p>
<p><a href="3arida.org">3arida.org</a></p>          </div>
        </div>
      </body>
    </html>
  `;
}
