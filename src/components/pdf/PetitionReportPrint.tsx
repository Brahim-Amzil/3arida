'use client';

import { Petition } from '@/types/petition';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { QRCodeSVG } from 'qrcode.react';

interface PetitionReportPrintProps {
  petition: Petition;
}

export function PetitionReportPrint({ petition }: PetitionReportPrintProps) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reports/verify/${petition.id}`;
  const petitionUrl = `${process.env.NEXT_PUBLIC_APP_URL}/petitions/${petition.id}`;
  const downloadNumber = (petition.reportDownloads || 0) + 1;
  const daysRunning = Math.ceil(
    (new Date().getTime() - new Date(petition.createdAt).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const progress = Math.round(
    (petition.currentSignatures / petition.targetSignatures) * 100,
  );
  const signaturesPerDay = Math.round(
    petition.currentSignatures / Math.max(1, daysRunning),
  );

  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <title>تقرير عريضة - {petition.title}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Cairo', sans-serif; direction: rtl; background: white; color: #000; }
          .page { width: 210mm; min-height: 297mm; padding: 20mm; page-break-after: always; }
          .page:last-child { page-break-after: auto; }
          @media print {
            body { margin: 0; padding: 0; }
            .page { margin: 0; page-break-after: always; }
            .page:last-child { page-break-after: auto; }
          }
          .text-center { text-align: center; }
          .font-bold { font-weight: 700; }
          .font-semibold { font-weight: 600; }
          .mb-2 { margin-bottom: 8px; }
          .mb-4 { margin-bottom: 16px; }
          .mb-6 { margin-bottom: 24px; }
          .mb-8 { margin-bottom: 32px; }
          .mt-8 { margin-top: 32px; }
          .text-sm { font-size: 14px; }
          .text-base { font-size: 16px; }
          .text-lg { font-size: 18px; }
          .text-xl { font-size: 20px; }
          .text-2xl { font-size: 24px; }
          .text-3xl { font-size: 30px; }
          .text-gray-600 { color: #4b5563; }
          .text-gray-700 { color: #374151; }
          .border-b { border-bottom: 1px solid #e5e7eb; }
          .border { border: 1px solid #e5e7eb; }
          .pb-4 { padding-bottom: 16px; }
          .p-3 { padding: 12px; }
          .p-4 { padding: 16px; }
          .grid { display: grid; }
          .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
          .gap-4 { gap: 16px; }
          .flex { display: flex; }
          .justify-center { justify-content: center; }
          .justify-between { justify-content: space-between; }
          .space-y-2 > * + * { margin-top: 8px; }
          .break-all { word-break: break-all; }
          .whitespace-pre-wrap { white-space: pre-wrap; }
          .leading-relaxed { line-height: 1.625; }
        `,
          }}
        />
      </head>
      <body>
        <div className="page">
          <div className="text-center mb-8">
            <div className="text-3xl font-bold mb-2">3arida.org</div>
            <div className="text-lg text-gray-600">
              أول منصة متكاملة مختصة بالعرائض فالوطن العربي
            </div>
          </div>
          <div className="text-center mb-8">
            <div className="text-2xl font-bold mb-4">تقرير عريضة رسمي</div>
            <div className="text-xl mb-2">{petition.title}</div>
          </div>
          <div className="text-center mb-8">
            <div className="text-sm text-gray-600 mb-2">
              الرمز المرجعي للعريضة: {petition.referenceCode}
            </div>
            <div className="text-sm text-gray-600">
              تاريخ الإنشاء:{' '}
              {format(new Date(petition.createdAt), 'dd MMMM yyyy', {
                locale: ar,
              })}
            </div>
          </div>
          <div className="flex justify-center mb-8">
            <QRCodeSVG value={verificationUrl} size={200} level="H" />
          </div>
          <div className="text-center text-sm text-gray-600">
            <div className="mb-2">امسح رمز QR للتحقق من صحة التقرير</div>
            <div style={{ fontSize: '10px' }}>{verificationUrl}</div>
          </div>
          <div
            className="mt-8 text-center"
            style={{ fontSize: '11px', color: '#4b5563' }}
          >
            <div>هذا تقرير رسمي صادر عن منصة 3arida.org</div>
            <div>جميع البيانات موثقة و محمية من التحريف</div>
          </div>
        </div>

        <div className="page">
          <h2 className="text-2xl font-bold mb-6 border-b pb-4">
            تفاصيل العريضة
          </h2>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">المعلومات الأساسية</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold mb-2">العنوان:</div>
                <div className="text-gray-700">{petition.title}</div>
              </div>
              <div>
                <div className="font-semibold mb-2">نوع العريضة:</div>
                <div className="text-gray-700">{petition.petitionType}</div>
              </div>
              <div>
                <div className="font-semibold mb-2">الفئة:</div>
                <div className="text-gray-700">{petition.category}</div>
              </div>
              <div>
                <div className="font-semibold mb-2">الفئة الفرعية:</div>
                <div className="text-gray-700">{petition.subcategory}</div>
              </div>
              <div>
                <div className="font-semibold mb-2">موجهة إلى:</div>
                <div className="text-gray-700">{petition.addressedToType}</div>
              </div>
              <div>
                <div className="font-semibold mb-2">الرمز المرجعي للعريضة:</div>
                <div className="text-gray-700">{petition.referenceCode}</div>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">معلومات الناشر</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold mb-2">نوع الناشر:</div>
                <div className="text-gray-700">{petition.publisherType}</div>
              </div>
              <div>
                <div className="font-semibold mb-2">اسم الناشر:</div>
                <div className="text-gray-700">{petition.creatorName}</div>
              </div>
              <div>
                <div className="font-semibold mb-2">تاريخ الإنشاء:</div>
                <div className="text-gray-700">
                  {format(new Date(petition.createdAt), 'dd MMMM yyyy', {
                    locale: ar,
                  })}
                </div>
              </div>
              <div>
                <div className="font-semibold mb-2">الحالة:</div>
                <div className="text-gray-700">{petition.status}</div>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">معلومات الباقة</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold mb-2">الباقة:</div>
                <div className="text-gray-700">
                  {petition.pricingTier || 'Free'}
                </div>
              </div>
              <div>
                <div className="font-semibold mb-2">الهدف:</div>
                <div className="text-gray-700">
                  {petition.targetSignatures} توقيع
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <div className="font-semibold mb-2">رابط العريضة:</div>
            <div style={{ fontSize: '10px' }} className="break-all">
              {petitionUrl}
            </div>
          </div>
        </div>

        <div className="page">
          <h2 className="text-2xl font-bold mb-6 border-b pb-4">
            محتوى العريضة
          </h2>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">نص العريضة</h3>
            <div className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
              {petition.description}
            </div>
          </div>
        </div>

        <div className="page">
          <h2 className="text-2xl font-bold mb-6 border-b pb-4">
            الإحصائيات والتأثير
          </h2>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              إحصائيات التوقيعات المُوَثَّقة
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border">
                <div className="text-3xl font-bold mb-2">
                  {petition.currentSignatures}
                </div>
                <div className="text-sm text-gray-600">إجمالي التوقيعات</div>
              </div>
              <div className="text-center p-4 border">
                <div className="text-3xl font-bold mb-2">
                  {petition.targetSignatures}
                </div>
                <div className="text-sm text-gray-600">الهدف</div>
              </div>
              <div className="text-center p-4 border">
                <div className="text-3xl font-bold mb-2">{progress}%</div>
                <div className="text-sm text-gray-600">نسبة الإنجاز</div>
              </div>
              <div className="text-center p-4 border">
                <div className="text-3xl font-bold mb-2">
                  {signaturesPerDay}
                </div>
                <div className="text-sm text-gray-600">توقيعات/يوم</div>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">إحصائيات التفاعل</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between p-3 border">
                <span className="font-semibold">إجمالي المشاهدات:</span>
                <span>{petition.viewCount || 0}</span>
              </div>
              <div className="flex justify-between p-3 border">
                <span className="font-semibold">إجمالي المشاركات:</span>
                <span>{petition.shareCount || 0}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">الجدول الزمني</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between p-3 border">
                <span className="font-semibold">تاريخ الإنشاء:</span>
                <span>
                  {format(new Date(petition.createdAt), 'dd MMMM yyyy', {
                    locale: ar,
                  })}
                </span>
              </div>
              {petition.approvedAt && (
                <div className="flex justify-between p-3 border">
                  <span className="font-semibold">تاريخ الموافقة:</span>
                  <span>
                    {format(new Date(petition.approvedAt), 'dd MMMM yyyy', {
                      locale: ar,
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between p-3 border">
                <span className="font-semibold">المدة:</span>
                <span>{daysRunning} يوم</span>
              </div>
            </div>
          </div>
        </div>

        <div className="page">
          <h2 className="text-2xl font-bold mb-6 border-b pb-4">
            التحقق والمعلومات
          </h2>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">معلومات التحقق</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between p-3 border">
                <span className="font-semibold">تاريخ إنشاء التقرير:</span>
                <span>
                  {format(new Date(), 'dd MMMM yyyy - HH:mm', { locale: ar })}
                </span>
              </div>
              <div className="flex justify-between p-3 border">
                <span className="font-semibold">تم الإنشاء بواسطة:</span>
                <span>{petition.creatorName}</span>
              </div>
              <div className="flex justify-between p-3 border">
                <span className="font-semibold">رقم التحميل:</span>
                <span>#{downloadNumber}</span>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">رابط التحقق</h3>
            <div className="p-4 border text-center">
              <div className="text-sm mb-2">
                للتحقق من صحة هذا التقرير، قم بزيارة:
              </div>
              <div
                style={{ fontSize: '10px' }}
                className="break-all text-gray-700"
              >
                {verificationUrl}
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">معلومات المنصة</h3>
            <div className="text-sm text-gray-700">
              <div className="mb-2">
                <span className="font-semibold">المنصة:</span> 3arida.org
              </div>
              <div className="mb-2">
                <span className="font-semibold">الوصف:</span> منصة العرائض
                الرسمية للمغرب
              </div>
              <div>
                <span className="font-semibold">التواصل:</span>{' '}
                support@3arida.org
              </div>
            </div>
          </div>
          <div className="mt-8 p-4 border" style={{ background: '#f9fafb' }}>
            <h3 className="text-base font-semibold mb-3">إشعار قانوني</h3>
            <div
              style={{ fontSize: '11px' }}
              className="text-gray-700 space-y-2"
            >
              <div>
                • هذا التقرير تم إنشاؤه آليا من بيانات موثقة على منصة 3arida.org
              </div>
              <div>• جميع التوقيعات تم التحقق من صحتها</div>
              <div>• امسح رمز QR للتحقق من هذا التقرير عبر الإنترنت</div>
              <div>
                • أي تعديل أو إختلاف بين بيانات هذا التقرير و مِنصّة التَّحقُّق
                يعتبر تحريفاً يتحمل مسؤوليته القانونية مُنشئُ العريضة
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
