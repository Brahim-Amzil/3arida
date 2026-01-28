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
            <p>© 2025 3arida Platform. All rights reserved.</p>
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
    <html>
      <head>
        ${getBaseEmailStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ تمت الموافقة على عريضتك</h1>
            <p>Your Petition Has Been Approved</p>
          </div>
          <div class="content">
            <h2>مبروك ${userName}!</h2>
            <p>تمت الموافقة على عريضتك "<strong>${petitionTitle}</strong>" ونشرها على المنصة.</p>
            <p>Your petition "<strong>${petitionTitle}</strong>" has been approved and is now live on the platform.</p>
            
            <h3>الخطوات التالية:</h3>
            <ul>
              <li>شارك عريضتك مع أصدقائك وعائلتك</li>
              <li>انشر رابط العريضة على وسائل التواصل الاجتماعي</li>
              <li>تابع عدد التوقيعات والتعليقات</li>
              <li>أضف تحديثات لإبقاء الموقعين على اطلاع</li>
            </ul>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/petitions/${petitionId}" class="button">عرض العريضة</a>
            
            <p>نتمنى لك التوفيق في حملتك!</p>
          </div>
          <div class="footer">
            <p>© 2025 3arida Platform. All rights reserved.</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${userEmail}">إلغاء الاشتراك</a></p>
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
            <p>Your signature on "<strong>${petitionTitle}</strong>" has been recorded.</p>
            
            <p>صوتك مهم ويساهم في إحداث التغيير!</p>
            <p>Your voice matters and contributes to making change!</p>
            
            <h3>ساعد في نشر الكلمة:</h3>
            <ul>
              <li>شارك العريضة مع أصدقائك</li>
              <li>انشرها على وسائل التواصل الاجتماعي</li>
              <li>شجع الآخرين على التوقيع</li>
            </ul>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/petitions/${petitionId}" class="button">عرض العريضة</a>
          </div>
          <div class="footer">
            <p>© 2025 3arida Platform. All rights reserved.</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${userEmail}">إلغاء الاشتراك</a></p>
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
            <p>© 2025 3arida Platform. All rights reserved.</p>
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
            <p>© 2025 3arida Platform. All rights reserved.</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${userEmail}">إلغاء الاشتراك</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}
