"use strict";(()=>{var e={};e.id=386,e.ids=[386],e.modules={30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6005:e=>{e.exports=require("node:crypto")},78144:(e,r,a)=>{a.r(r),a.d(r,{headerHooks:()=>m,originalPathname:()=>h,patchFetch:()=>f,requestAsyncStorage:()=>u,routeModule:()=>p,serverHooks:()=>b,staticGenerationAsyncStorage:()=>v,staticGenerationBailout:()=>g});var s={};a.r(s),a.d(s,{POST:()=>c});var o=a(10884),t=a(16132),i=a(21040),n=a(95798),d=a(86935);let l={general:"استفسار عام",technical:"مشكلة تقنية",petition:"سؤال حول عريضة",account:"مشكلة في الحساب",report:"الإبلاغ عن محتوى",partnership:"شراكة أو تعاون",press:"استفسار صحفي",other:"أخرى"};async function c(e){try{let{name:r,email:a,reason:s,subject:o,message:t,petitionCode:i,reportDetails:c}=await e.json();if(!r||!a||!s||!o||!t)return n.Z.json({error:"جميع الحقول مطلوبة"},{status:400});if("petition"===s&&!i)return n.Z.json({error:"رمز العريضة مطلوب"},{status:400});if("report"===s&&!c)return n.Z.json({error:"تفاصيل البلاغ مطلوبة"},{status:400});if(!process.env.RESEND_API_KEY)return console.error("Resend API key not configured"),n.Z.json({error:"خدمة البريد الإلكتروني غير مكونة"},{status:500});if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a))return n.Z.json({error:"البريد الإلكتروني غير صالح"},{status:400});let p=l[s]||s,u=`
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
                <div class="value">${r}</div>
              </div>
              
              <div class="field">
                <span class="label">البريد الإلكتروني:</span>
                <div class="value">${a}</div>
              </div>
              
              <div class="field">
                <span class="label">سبب التواصل:</span>
                <div class="value">${p}</div>
              </div>
              
              <div class="field">
                <span class="label">الموضوع:</span>
                <div class="value">${o}</div>
              </div>
              
              ${i?`
              <div class="field">
                <span class="label">رمز العريضة:</span>
                <div class="value">${i}</div>
              </div>
              `:""}
              
              ${c?`
              <div class="field">
                <span class="label">تفاصيل البلاغ:</span>
                <div class="message-box">${c}</div>
              </div>
              `:""}
              
              <div class="field">
                <span class="label">الرسالة:</span>
                <div class="message-box">${t}</div>
              </div>
              
              <div class="footer">
                <p>تم إرسال هذه الرسالة من نموذج الاتصال على موقع 3arida.ma</p>
                <p>للرد، استخدم البريد الإلكتروني: ${a}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,v=new d.R(process.env.RESEND_API_KEY),b=process.env.RESEND_FROM_EMAIL||"onboarding@resend.dev",m=process.env.CONTACT_EMAIL||"3aridapp@gmail.com";console.log("Sending email from:",b,"to:",m);let g=await v.emails.send({from:b,to:m,subject:`[3arida Contact Form] [${p}] ${o}`,replyTo:a,html:u});if(g.error)throw console.error("Resend error:",g.error),Error(g.error.message);return n.Z.json({success:!0,messageId:g.data?.id},{status:200})}catch(e){return console.error("Contact form error:",e),console.error("Error details:",e instanceof Error?e.message:"Unknown error"),n.Z.json({error:"حدث خطأ في الخادم",details:void 0},{status:500})}}let p=new o.AppRouteRouteModule({definition:{kind:t.x.APP_ROUTE,page:"/api/contact/route",pathname:"/api/contact",filename:"route",bundlePath:"app/api/contact/route"},resolvedPagePath:"/Users/brahimamzil/Downloads/DEV_APPS/----3arida/3arida-app/src/app/api/contact/route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:u,staticGenerationAsyncStorage:v,serverHooks:b,headerHooks:m,staticGenerationBailout:g}=p,h="/api/contact/route";function f(){return(0,i.patchFetch)({serverHooks:b,staticGenerationAsyncStorage:v})}}};var r=require("../../../webpack-runtime.js");r.C(e);var a=e=>r(r.s=e),s=r.X(0,[3271,8107,6935],()=>a(78144));module.exports=s})();