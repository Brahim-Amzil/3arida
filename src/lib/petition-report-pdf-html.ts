import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { getPublicAppUrl } from '@/lib/app-url';
import { escapeHtml } from '@/lib/escape-html';
import { getSignatureProgressPercent } from '@/lib/petition-report-metrics';
import { getPetitionReportFontFaceCss } from '@/lib/petition-report-pdf-fonts';
import { translateValue } from '@/lib/pdf-translations';
import { generateReportQRCode } from '@/lib/report-qr-generator';
import { REPORT_PDF_LEGAL_NOTICE_ITEMS } from '@/lib/report-legal-notice-items';
import type { Petition } from '@/types/petition';

function petitionDate(value: Petition['createdAt'] | Petition['approvedAt']): Date {
  if (!value) return new Date();
  return value instanceof Date ? value : new Date(value);
}

function formatReportDate(date: Date): string {
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'dd MMMM yyyy', { locale: ar });
}

function formatReportDateTime(date: Date): string {
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'dd MMMM yyyy، HH:mm', { locale: ar });
}

export async function buildPetitionReportHtml(petition: Petition): Promise<string> {
  const appUrl = getPublicAppUrl();
  const verificationUrl = `${appUrl}/reports/verify/${petition.id}`;
  const petitionUrl = `${appUrl}/petitions/${petition.id}`;
  const qrDataUrl = await generateReportQRCode(petition.id);
  const fontFaceCss = getPetitionReportFontFaceCss();
  const title = escapeHtml(petition.title);
  const description = escapeHtml(petition.description || '');
  const referenceCode = escapeHtml(petition.referenceCode || petition.id);
  const creatorName = escapeHtml(petition.creatorName || petition.publisherName || '—');
  const downloadNumber = (petition.reportDownloads || 0) + 1;
  const createdAt = petitionDate(petition.createdAt);
  const daysRunning = Math.ceil(
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
  );
  const progress = Math.round(
    getSignatureProgressPercent(
      petition.currentSignatures,
      petition.targetSignatures,
    ),
  );
  const signaturesPerDay = Math.round(
    petition.currentSignatures / Math.max(1, daysRunning),
  );
  const approvedAtHtml = petition.approvedAt
    ? `
        <div class="flex justify-between p-3 border">
          <span class="font-semibold">تاريخ الموافقة:</span>
          <span>${formatReportDate(petitionDate(petition.approvedAt))}</span>
        </div>
        `
    : '';

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>تقرير عريضة - ${title}</title>
  <style>
    ${fontFaceCss}
    
    * { 
      margin: 0; 
      padding: 0; 
      box-sizing: border-box; 
    }
    
    html {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    body { 
      font-family: 'Cairo', 'Arial', sans-serif;
      direction: rtl;
      background: white; 
      color: #000;
      line-height: 1.6;
    }
    
    .page { 
      width: 210mm; 
      min-height: 297mm; 
      padding: 20mm; 
      page-break-after: always;
      background: white;
    }
    
    .page:last-child { 
      page-break-after: auto; 
    }
    
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
  </style>
</head>
<body>
  <!-- Page 1: Cover -->
  <div class="page">
    <div class="text-center mb-8">
      <div class="text-3xl font-bold mb-2">3arida.org</div>
      <div class="text-lg text-gray-600">منصة العرائض الرسمية للمغرب</div>
    </div>
    <div class="text-center mb-8">
      <div class="text-2xl font-bold mb-4">تقرير عريضة رسمي</div>
      <div class="text-xl mb-2">${title}</div>
    </div>
    <div class="text-center mb-8">
      <div class="text-sm text-gray-600 mb-2">الرمز المرجعي للعريضة: ${referenceCode}</div>
      <div class="text-sm text-gray-600">
        تاريخ الإنشاء: ${formatReportDate(createdAt)}
      </div>
    </div>
    <div class="flex justify-center mb-8">
      <img 
        src="${qrDataUrl}"
        alt="QR Code"
        width="200"
        height="200"
      />
    </div>
    <div class="text-center text-sm text-gray-600">
      <div class="mb-2">امسح رمز QR للتحقق من صحة التقرير</div>
      <div style="font-size: 10px">${verificationUrl}</div>
    </div>
    <div class="mt-8 text-center" style="font-size: 11px; color: #4b5563">
      <div>هذا تقرير رسمي صادر عن منصة 3arida.org</div>
      <div>جميع البيانات موثقة و محمية من التحريف</div>
    </div>
  </div>

  <!-- Page 2: Details -->
  <div class="page">
    <h2 class="text-2xl font-bold mb-6 border-b pb-4">تفاصيل العريضة</h2>
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-4">المعلومات الأساسية</h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div><div class="font-semibold mb-2">العنوان:</div><div class="text-gray-700">${title}</div></div>
        <div><div class="font-semibold mb-2">نوع العريضة:</div><div class="text-gray-700">${escapeHtml(translateValue(petition.petitionType, 'petitionType'))}</div></div>
        <div><div class="font-semibold mb-2">الفئة:</div><div class="text-gray-700">${escapeHtml(translateValue(petition.category, 'category'))}</div></div>
        <div><div class="font-semibold mb-2">الفئة الفرعية:</div><div class="text-gray-700">${escapeHtml(translateValue(petition.subcategory, 'subcategory'))}</div></div>
        <div><div class="font-semibold mb-2">موجهة إلى:</div><div class="text-gray-700">${escapeHtml(translateValue(petition.addressedToType, 'addressedToType'))}</div></div>
        <div><div class="font-semibold mb-2">الرمز المرجعي للعريضة:</div><div class="text-gray-700">${referenceCode}</div></div>
      </div>
    </div>
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-4">معلومات الناشر</h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div><div class="font-semibold mb-2">نوع الناشر:</div><div class="text-gray-700">${escapeHtml(translateValue(petition.publisherType, 'publisherType'))}</div></div>
        <div><div class="font-semibold mb-2">اسم الناشر:</div><div class="text-gray-700">${creatorName}</div></div>
        <div><div class="font-semibold mb-2">تاريخ الإنشاء:</div><div class="text-gray-700">${formatReportDate(createdAt)}</div></div>
        <div><div class="font-semibold mb-2">الحالة:</div><div class="text-gray-700">${escapeHtml(translateValue(petition.status, 'status'))}</div></div>
      </div>
    </div>
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-4">معلومات الباقة</h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div><div class="font-semibold mb-2">الباقة:</div><div class="text-gray-700">${escapeHtml(translateValue(petition.pricingTier, 'pricingTier'))}</div></div>
        <div><div class="font-semibold mb-2">الهدف:</div><div class="text-gray-700">${petition.targetSignatures} توقيع</div></div>
      </div>
    </div>
    <div class="text-sm text-gray-600">
      <div class="font-semibold mb-2">رابط العريضة:</div>
      <div style="font-size: 10px" class="break-all">${petitionUrl}</div>
    </div>
  </div>

  <!-- Page 3: Content -->
  <div class="page">
    <h2 class="text-2xl font-bold mb-6 border-b pb-4">محتوى العريضة</h2>
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-4">نص العريضة</h3>
      <div class="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">${description}</div>
    </div>
  </div>

  <!-- Page 4: Statistics -->
  <div class="page">
    <h2 class="text-2xl font-bold mb-6 border-b pb-4">الإحصائيات والتأثير</h2>
    <div class="mb-8">
      <h3 class="text-lg font-semibold mb-4">إحصائيات التوقيعات</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="text-center p-4 border">
          <div class="text-3xl font-bold mb-2">${petition.currentSignatures}</div>
          <div class="text-sm text-gray-600">إجمالي التوقيعات</div>
        </div>
        <div class="text-center p-4 border">
          <div class="text-3xl font-bold mb-2">${petition.targetSignatures}</div>
          <div class="text-sm text-gray-600">الهدف</div>
        </div>
        <div class="text-center p-4 border">
          <div class="text-3xl font-bold mb-2">${progress}%</div>
          <div class="text-sm text-gray-600">نسبة الإنجاز من التوقيعات المُستهدفة</div>
        </div>
        <div class="text-center p-4 border">
          <div class="text-3xl font-bold mb-2">${signaturesPerDay}</div>
          <div class="text-sm text-gray-600">توقيعات/يوم</div>
        </div>
      </div>
    </div>
    <div class="mb-8">
      <h3 class="text-lg font-semibold mb-4">إحصائيات التفاعل</h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="flex justify-between p-3 border"><span class="font-semibold">إجمالي المشاهدات:</span><span>${petition.viewCount || 0}</span></div>
        <div class="flex justify-between p-3 border"><span class="font-semibold">إجمالي المشاركات:</span><span>${petition.shareCount || 0}</span></div>
      </div>
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-4">الجدول الزمني</h3>
      <div class="text-sm space-y-2">
        <div class="flex justify-between p-3 border">
          <span class="font-semibold">تاريخ الإنشاء:</span>
          <span>${formatReportDate(createdAt)}</span>
        </div>
        ${approvedAtHtml}
        <div class="flex justify-between p-3 border">
          <span class="font-semibold">المدة:</span>
          <span>${daysRunning} يوم</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Page 5: Verification -->
  <div class="page">
    <h2 class="text-2xl font-bold mb-6 border-b pb-4">التحقق والمعلومات</h2>
    <div class="mb-8">
      <h3 class="text-lg font-semibold mb-4">معلومات التحقق</h3>
      <div class="text-sm space-y-2">
        <div class="flex justify-between p-3 border">
          <span class="font-semibold">تاريخ إنشاء التقرير:</span>
          <span>${formatReportDateTime(new Date())}</span>
        </div>
        <div class="flex justify-between p-3 border">
          <span class="font-semibold">تم الإنشاء بواسطة:</span>
          <span>${creatorName}</span>
        </div>
        <div class="flex justify-between p-3 border">
          <span class="font-semibold">رقم التحميل:</span>
          <span>#${downloadNumber}</span>
        </div>
      </div>
    </div>
    <div class="mb-8">
      <h3 class="text-lg font-semibold mb-4">رابط التحقق</h3>
      <div class="p-4 border text-center">
        <div class="text-sm mb-2">للتحقق من صحة هذا التقرير، قم بزيارة:</div>
        <div style="font-size: 10px" class="break-all text-gray-700">${verificationUrl}</div>
      </div>
    </div>
    <div class="mb-8">
      <h3 class="text-lg font-semibold mb-4">معلومات المنصة</h3>
      <div class="text-sm text-gray-700">
        <div class="mb-2"><span class="font-semibold">المنصة:</span> 3arida.org</div>
        <div class="mb-2"><span class="font-semibold">الوصف:</span> منصة العرائض الرسمية للمغرب</div>
        <div><span class="font-semibold">التواصل:</span> support@3arida.org</div>
      </div>
    </div>
    <div class="mt-8 p-4 border" style="background:rgb(247, 170, 185)">
      <h3 class="text-base font-semibold mb-3">إشعار قانوني</h3>
      <div style="font-size: 11px" class="text-gray-700 space-y-2">
        ${REPORT_PDF_LEGAL_NOTICE_ITEMS.map((item) => `<div>• ${escapeHtml(item)}</div>`).join('\n        ')}
      </div>
    </div>
  </div>
</body>
</html>`;
}
