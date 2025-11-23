"use strict";(()=>{var e={};e.id=8359,e.ids=[8359],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6005:e=>{e.exports=require("node:crypto")},22358:(e,t,r)=>{r.r(t),r.d(t,{headerHooks:()=>g,originalPathname:()=>f,patchFetch:()=>b,requestAsyncStorage:()=>h,routeModule:()=>c,serverHooks:()=>v,staticGenerationAsyncStorage:()=>u,staticGenerationBailout:()=>m});var a={};r.r(a),r.d(a,{POST:()=>p});var i=r(95419),o=r(69108),n=r(99678),s=r(78070),l=r(59631),d=r(64348);async function p(e){try{let{userName:t,userEmail:r,petitionTitle:a,petitionId:i}=await e.json();if(!t||!r||!a||!i)return s.Z.json({error:"Missing required fields"},{status:400});let o=(0,d.Kh)(t,a,i,r);if((await (0,l.C)({to:r,subject:`✅ تمت الموافقة على عريضتك: ${a}`,html:o})).success)return s.Z.json({success:!0});return s.Z.json({error:"Failed to send email"},{status:500})}catch(e){return console.error("Petition approved email error:",e),s.Z.json({error:"Internal server error"},{status:500})}}let c=new i.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/email/petition-approved/route",pathname:"/api/email/petition-approved",filename:"route",bundlePath:"app/api/email/petition-approved/route"},resolvedPagePath:"/Users/brahimamzil/Downloads/DEV_APPS/----3arida/3arida-app/src/app/api/email/petition-approved/route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:h,staticGenerationAsyncStorage:u,serverHooks:v,headerHooks:g,staticGenerationBailout:m}=c,f="/api/email/petition-approved/route";function b(){return(0,n.patchFetch)({serverHooks:v,staticGenerationAsyncStorage:u})}},59631:(e,t,r)=>{r.d(t,{C:()=>o,q:()=>n});var a=r(75180);let i=null;async function o({to:e,subject:t,html:r}){let o=(!i&&process.env.RESEND_API_KEY&&(i=new a.R(process.env.RESEND_API_KEY)),i);if(!o)return console.warn("Resend API key not configured - email not sent"),{success:!1,error:"Email service not configured"};try{let a=await o.emails.send({from:process.env.EMAIL_FROM||"onboarding@resend.dev",to:e,subject:t,html:r});return console.log("Email sent successfully:",a),{success:!0,data:a}}catch(e){return console.error("Failed to send email:",e),{success:!1,error:e}}}function n(){return`
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
      .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    </style>
  `}},64348:(e,t,r)=>{r.d(t,{DN:()=>n,FG:()=>i,Kh:()=>o,Qn:()=>s,rs:()=>l});var a=r(59631);function i(e,t){return`
    <!DOCTYPE html>
    <html>
      <head>
        ${(0,a.q)()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 مرحبا بك في 3arida</h1>
            <p>Welcome to 3arida Platform</p>
          </div>
          <div class="content">
            <h2>مرحبا ${e}!</h2>
            <p>شكرا لانضمامك إلى منصة 3arida - منصة العرائض الرقمية للمغرب.</p>
            <p>Thank you for joining 3arida - Morocco's digital petition platform.</p>
            
            <h3>ماذا يمكنك أن تفعل الآن؟</h3>
            <ul>
              <li>إنشاء عريضة جديدة</li>
              <li>التوقيع على العرائض الموجودة</li>
              <li>مشاركة العرائض مع أصدقائك</li>
              <li>متابعة تقدم العرائض</li>
            </ul>
            
            <a href="http://localhost:3000/petitions" class="button">تصفح العرائض</a>
            
            <p>إذا كان لديك أي أسئلة، لا تتردد في التواصل معنا.</p>
          </div>
          <div class="footer">
            <p>\xa9 2025 3arida Platform. All rights reserved.</p>
            <p><a href="http://localhost:3000/unsubscribe?email=${t}">إلغاء الاشتراك</a></p>
          </div>
        </div>
      </body>
    </html>
  `}function o(e,t,r,i){return`
    <!DOCTYPE html>
    <html>
      <head>
        ${(0,a.q)()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ تمت الموافقة على عريضتك</h1>
            <p>Your Petition Has Been Approved</p>
          </div>
          <div class="content">
            <h2>مبروك ${e}!</h2>
            <p>تمت الموافقة على عريضتك "<strong>${t}</strong>" ونشرها على المنصة.</p>
            <p>Your petition "<strong>${t}</strong>" has been approved and is now live on the platform.</p>
            
            <h3>الخطوات التالية:</h3>
            <ul>
              <li>شارك عريضتك مع أصدقائك وعائلتك</li>
              <li>انشر رابط العريضة على وسائل التواصل الاجتماعي</li>
              <li>تابع عدد التوقيعات والتعليقات</li>
              <li>أضف تحديثات لإبقاء الموقعين على اطلاع</li>
            </ul>
            
            <a href="http://localhost:3000/petitions/${r}" class="button">عرض العريضة</a>
            
            <p>نتمنى لك التوفيق في حملتك!</p>
          </div>
          <div class="footer">
            <p>\xa9 2025 3arida Platform. All rights reserved.</p>
            <p><a href="http://localhost:3000/unsubscribe?email=${i}">إلغاء الاشتراك</a></p>
          </div>
        </div>
      </body>
    </html>
  `}function n(e,t,r,i){return`
    <!DOCTYPE html>
    <html>
      <head>
        ${(0,a.q)()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✍️ شكرا على توقيعك</h1>
            <p>Thank You for Your Signature</p>
          </div>
          <div class="content">
            <h2>شكرا ${e}!</h2>
            <p>تم تسجيل توقيعك على العريضة "<strong>${t}</strong>".</p>
            <p>Your signature on "<strong>${t}</strong>" has been recorded.</p>
            
            <p>صوتك مهم ويساهم في إحداث التغيير!</p>
            <p>Your voice matters and contributes to making change!</p>
            
            <h3>ساعد في نشر الكلمة:</h3>
            <ul>
              <li>شارك العريضة مع أصدقائك</li>
              <li>انشرها على وسائل التواصل الاجتماعي</li>
              <li>شجع الآخرين على التوقيع</li>
            </ul>
            
            <a href="http://localhost:3000/petitions/${r}" class="button">عرض العريضة</a>
          </div>
          <div class="footer">
            <p>\xa9 2025 3arida Platform. All rights reserved.</p>
            <p><a href="http://localhost:3000/unsubscribe?email=${i}">إلغاء الاشتراك</a></p>
          </div>
        </div>
      </body>
    </html>
  `}function s(e,t,r,i,o,n){return`
    <!DOCTYPE html>
    <html>
      <head>
        ${(0,a.q)()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📢 تحديث جديد على العريضة</h1>
            <p>New Petition Update</p>
          </div>
          <div class="content">
            <h2>مرحبا ${e}!</h2>
            <p>هناك تحديث جديد على العريضة "<strong>${t}</strong>" التي وقعت عليها.</p>
            <p>There's a new update on "<strong>${t}</strong>" that you signed.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>${i}</h3>
              <p>${o.substring(0,200)}${o.length>200?"...":""}</p>
            </div>
            
            <a href="http://localhost:3000/petitions/${r}" class="button">قراءة التحديث الكامل</a>
          </div>
          <div class="footer">
            <p>\xa9 2025 3arida Platform. All rights reserved.</p>
            <p><a href="http://localhost:3000/unsubscribe?email=${n}">إلغاء الاشتراك</a></p>
          </div>
        </div>
      </body>
    </html>
  `}function l(e,t,r,i,o,n,s){return`
    <!DOCTYPE html>
    <html>
      <head>
        ${(0,a.q)()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 تم الوصول إلى هدف جديد!</h1>
            <p>Milestone Reached!</p>
          </div>
          <div class="content">
            <h2>مبروك ${e}!</h2>
            <p>عريضتك "<strong>${t}</strong>" وصلت إلى ${i}% من الهدف!</p>
            <p>Your petition "<strong>${t}</strong>" has reached ${i}% of its goal!</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h1 style="color: #667eea; margin: 0;">${o.toLocaleString()}</h1>
              <p style="margin: 10px 0;">من ${n.toLocaleString()} توقيع</p>
              <div style="background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 100%; width: ${i}%;"></div>
              </div>
            </div>
            
            <p>استمر في المشاركة للوصول إلى الهدف الكامل!</p>
            
            <a href="http://localhost:3000/petitions/${r}" class="button">عرض العريضة</a>
          </div>
          <div class="footer">
            <p>\xa9 2025 3arida Platform. All rights reserved.</p>
            <p><a href="http://localhost:3000/unsubscribe?email=${s}">إلغاء الاشتراك</a></p>
          </div>
        </div>
      </body>
    </html>
  `}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[1638,6206,5180],()=>r(22358));module.exports=a})();