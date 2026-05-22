import { escapeHtml } from '@/lib/escape-html';
import {
  formatPetitionLongDate,
  formatPetitionNumber,
  formatReportDate,
  formatReportGeneratedAt,
} from '@/lib/petition-report-formatters';
import {
  formatSignatureProgressPercent,
  getPetitionReportMetrics,
} from '@/lib/petition-report-metrics';
import { getPetitionReportFontFaceCss } from '@/lib/petition-report-pdf-fonts';
import { translateValue } from '@/lib/pdf-translations';
import { generateReportQRCode } from '@/lib/report-qr-generator';
import { fetchImageAsDataUrl } from '@/lib/embed-remote-image-data-url';
import type { ReportVerificationData } from '@/lib/report-verification-server';

type ValidReportVerificationData = Extract<
  ReportVerificationData,
  { valid: true }
>;

function detailRow(label: string, value: string): string {
  return `
    <div class="detail-row">
      <span class="detail-label">${escapeHtml(label)}</span>
      <span class="detail-value">${value}</span>
    </div>`;
}

function statBox(label: string, value: string): string {
  return `
    <div class="stat-box">
      <p class="stat-value">${value}</p>
      <p class="stat-label">${escapeHtml(label)}</p>
    </div>`;
}

export async function buildPetitionReportHtml(
  data: ValidReportVerificationData,
): Promise<string> {
  const { petition, urls } = data;
  const fontFaceCss = getPetitionReportFontFaceCss();
  const qrDataUrl = await generateReportQRCode(petition.id);
  const { daysRunning, signaturesPerDay, downloadNumber } =
    getPetitionReportMetrics(petition);

  const title = escapeHtml(petition.title);
  const description = escapeHtml(petition.description || '—');
  const referenceCode = escapeHtml(petition.referenceCode);
  const creatorName = escapeHtml(petition.creatorName || '—');
  const publisherName = escapeHtml(
    petition.creatorName || petition.publisherName || '—',
  );
  const verificationUrl = escapeHtml(urls.verification);
  const petitionUrl = escapeHtml(urls.petition);
  const progressPercent = escapeHtml(
    formatSignatureProgressPercent(
      petition.currentSignatures,
      petition.targetSignatures,
    ),
  );

  // Include this issuance in PDF stats (counter increments after PDF is saved)
  const displayDownloadCount = (petition.reportDownloads || 0) + 1;

  let coverImageDataUrl: string | null = null;
  if (petition.imageUrl) {
    coverImageDataUrl = await fetchImageAsDataUrl(petition.imageUrl);
  }

  const imageHtml = coverImageDataUrl
    ? `
    <div class="summary-image-wrap">
      <img src="${coverImageDataUrl}" alt="${title}" class="summary-image" />
    </div>`
    : '';

  const approvedAtRow = petition.approvedAt
    ? detailRow(
        'تاريخ الموافقة:',
        escapeHtml(formatPetitionLongDate(petition.approvedAt)),
      )
    : '';

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>تقرير عريضة - ${title}</title>
  <style>
    ${fontFaceCss}

    * { margin: 0; padding: 0; box-sizing: border-box; }

    html {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      font-family: 'Cairo', 'Arial', sans-serif;
      direction: rtl;
      background: white;
      color: #111827;
      line-height: 1.6;
      font-size: 14px;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 16mm;
      page-break-after: always;
    }

    .page:last-child { page-break-after: auto; }

    .cover-page {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    .card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 24px;
      overflow: hidden;
      page-break-inside: avoid;
    }
    .card-header {
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;
    }
    .card-title { font-size: 18px; font-weight: 600; }
    .card-content { padding: 20px; }

    .summary-card-title {
      text-align: center;
      font-size: 18px;
      color: #6b7280;
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
    }

    .summary-image-wrap {
      width: 100%;
      max-height: 288px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 16px;
      background: #f3f4f6;
    }
    .summary-image {
      width: 100%;
      height: auto;
      max-height: 288px;
      object-fit: cover;
      display: block;
    }

    .summary-title { text-align: center; font-size: 20px; font-weight: 600; margin-bottom: 12px; }
    .badges { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 12px; }
    .badge {
      display: inline-block;
      border: 1px solid #e5e7eb;
      border-radius: 999px;
      padding: 4px 12px;
      font-size: 12px;
      background: #fff;
    }
    .badge-secondary { background: #f3f4f6; }
    .summary-created { text-align: center; color: #6b7280; font-size: 14px; margin-bottom: 16px; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
    }
    .stat-box {
      text-align: center;
      padding: 12px;
      border-radius: 8px;
      background: rgba(243, 244, 246, 0.5);
    }
    .stat-value { font-weight: 600; font-size: 16px; margin-bottom: 4px; }
    .stat-label { font-size: 12px; color: #6b7280; }

    .section-block { margin-bottom: 24px; }
    .section-block h3 { font-weight: 600; margin-bottom: 12px; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .stack { display: flex; flex-direction: column; gap: 12px; }

    .detail-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #fff;
    }
    .detail-label { font-size: 14px; color: #6b7280; }
    .detail-value { font-size: 14px; font-weight: 600; text-align: right; word-break: break-all; }

    .brand { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
    .tagline { color: #6b7280; margin-bottom: 32px; font-size: 16px; }
    .report-title { font-size: 22px; font-weight: 700; margin-bottom: 16px; }
    .petition-title { font-size: 18px; margin-bottom: 20px; max-width: 90%; }
    .cover-meta { color: #6b7280; font-size: 14px; margin-bottom: 24px; }
    .cover-meta p + p { margin-top: 6px; }
    .qr-wrap { display: flex; justify-content: center; margin: 24px 0; }
    .qr-wrap img { width: 200px; height: 200px; }
    .verify-link { font-size: 11px; color: #2563eb; word-break: break-all; max-width: 90%; }

    .content-text {
      font-size: 16px;
      line-height: 1.625;
      white-space: pre-wrap;
      color: #6b7280;
    }

    .page-footer {
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      margin-top: 24px;
    }

    @media print {
      body { margin: 0; }
      .page { margin: 0; }
    }
  </style>
</head>
<body>
  <!-- Page 1: QR cover -->
  <div class="page cover-page">
    <div class="brand">3arida.org</div>
    <div class="tagline">منصة العرائض الرسمية للمغرب</div>
    <div class="report-title">تقرير عريضة رسمي</div>
    <div class="petition-title">${title}</div>
    <div class="cover-meta">
      <p>الرمز المرجعي للعريضة: ${referenceCode}</p>
      <p>تاريخ الإنشاء: ${escapeHtml(formatPetitionLongDate(petition.createdAt))}</p>
    </div>
    <div class="qr-wrap">
      <img src="${qrDataUrl}" alt="QR Code" width="200" height="200" />
    </div>
    <p style="color:#6b7280;font-size:14px;margin-bottom:12px">
      امسح رمز QR للتحقق من صحة التقرير
    </p>
    <p class="verify-link">${verificationUrl}</p>
  </div>

  <!-- Page 2: Summary card -->
  <div class="page">
    <div class="card">
      <div class="summary-card-title">3arida.org — تقرير عريضة رسمي</div>
      <div class="card-content">
        ${imageHtml}
        <div class="summary-title">${title}</div>
        <div class="badges">
          <span class="badge">الرقم المرجعي : ${referenceCode}</span>
          <span class="badge badge-secondary">${escapeHtml(translateValue(petition.status, 'status'))}</span>
          <span class="badge">${escapeHtml(translateValue(petition.category, 'category'))}</span>
        </div>
        <p class="summary-created">
          تاريخ الإنشاء: ${escapeHtml(formatReportDate(petition.createdAt))}
        </p>
        <div class="stats-grid">
          ${statBox('التوقيعات', escapeHtml(formatPetitionNumber(petition.currentSignatures)))}
          ${statBox('الهدف', escapeHtml(formatPetitionNumber(petition.targetSignatures)))}
          ${statBox('نسبة الإنجاز من التوقيعات المُستهدفة', progressPercent)}
          ${statBox('التحميلات', escapeHtml(formatPetitionNumber(displayDownloadCount)))}
        </div>
      </div>
    </div>
  </div>

  <!-- Page 3: Details -->
  <div class="page">
    <div class="card">
      <div class="card-header"><div class="card-title">تفاصيل العريضة</div></div>
      <div class="card-content">
        <div class="section-block">
          <h3>المعلومات الأساسية</h3>
          <div class="grid-2">
            ${detailRow('العنوان:', title)}
            ${detailRow('نوع العريضة:', escapeHtml(translateValue(petition.petitionType, 'petitionType')))}
            ${detailRow('الفئة:', escapeHtml(translateValue(petition.category, 'category')))}
            ${detailRow('الفئة الفرعية:', escapeHtml(translateValue(petition.subcategory, 'subcategory')))}
            ${detailRow('موجهة إلى:', escapeHtml(translateValue(petition.addressedToType, 'addressedToType')))}
            ${detailRow('الرمز المرجعي:', referenceCode)}
          </div>
        </div>
        <div class="section-block">
          <h3>معلومات الناشر</h3>
          <div class="grid-2">
            ${detailRow('نوع الناشر:', escapeHtml(translateValue(petition.publisherType, 'publisherType')))}
            ${detailRow('اسم الناشر:', publisherName)}
            ${detailRow('تاريخ الإنشاء:', escapeHtml(formatPetitionLongDate(petition.createdAt)))}
            ${detailRow('الحالة:', escapeHtml(translateValue(petition.status, 'status')))}
          </div>
        </div>
        <div class="section-block">
          <h3>معلومات الباقة</h3>
          <div class="grid-2">
            ${detailRow('الباقة:', escapeHtml(translateValue(petition.pricingTier, 'pricingTier')))}
            ${detailRow('الهدف:', `${escapeHtml(formatPetitionNumber(petition.targetSignatures))} توقيع`)}
          </div>
        </div>
        ${detailRow('رابط العريضة:', `<span class="verify-link">${petitionUrl}</span>`)}
      </div>
    </div>
  </div>

  <!-- Page 4: Content -->
  <div class="page">
    <div class="card">
      <div class="card-header"><div class="card-title">محتوى العريضة</div></div>
      <div class="card-content">
        <h3 style="font-weight:600;margin-bottom:12px">نص العريضة</h3>
        <div class="content-text">${description}</div>
      </div>
    </div>
  </div>

  <!-- Page 5: Statistics -->
  <div class="page">
    <div class="card">
      <div class="card-header"><div class="card-title">الإحصائيات والتأثير</div></div>
      <div class="card-content">
        <div class="section-block">
          <h3>إحصائيات التوقيعات</h3>
          <div class="grid-2">
            ${statBox('إجمالي التوقيعات', escapeHtml(String(petition.currentSignatures)))}
            ${statBox('الهدف', escapeHtml(String(petition.targetSignatures)))}
            ${statBox('نسبة الإنجاز من التوقيعات المُستهدفة', progressPercent)}
            ${statBox('توقيعات/يوم', escapeHtml(String(signaturesPerDay)))}
          </div>
        </div>
        <div class="section-block">
          <h3>إحصائيات التفاعل</h3>
          <div class="grid-2">
            ${detailRow('إجمالي المشاهدات:', escapeHtml(String(petition.viewCount)))}
            ${detailRow('إجمالي المشاركات:', escapeHtml(String(petition.shareCount)))}
          </div>
        </div>
        <div class="section-block">
          <h3>الجدول الزمني</h3>
          <div class="stack">
            ${detailRow('تاريخ الإنشاء:', escapeHtml(formatPetitionLongDate(petition.createdAt)))}
            ${approvedAtRow}
            ${detailRow('المدة:', `${escapeHtml(String(daysRunning))} يوم`)}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Page 6: Verification -->
  <div class="page">
    <div class="card">
      <div class="card-header"><div class="card-title">التحقق والمعلومات</div></div>
      <div class="card-content">
        <div class="section-block">
          <div class="stack">
            ${detailRow('تاريخ إنشاء التقرير:', escapeHtml(formatReportGeneratedAt()))}
            ${detailRow('تم الإنشاء بواسطة:', creatorName)}
            ${detailRow('رقم التحميل:', `#${escapeHtml(String(downloadNumber))}`)}
          </div>
        </div>
        <div class="section-block">
          <h3>رابط التحقق</h3>
          <p style="color:#6b7280;font-size:14px;margin-bottom:8px">
            للتحقق من صحة هذا التقرير، قم بزيارة:
          </p>
          <div class="detail-row">
            <span class="verify-link">${verificationUrl}</span>
          </div>
        </div>
        <div class="section-block" style="font-size:14px">
          <p style="margin-bottom:8px">
            <span style="color:#6b7280">المنصة:</span>
            <span style="font-weight:600"> 3arida.org</span>
          </p>
          <p style="margin-bottom:8px">
            <span style="color:#6b7280">الوصف:</span>
            <span style="font-weight:600"> منصة العرائض الرسمية للمغرب</span>
          </p>
          <p>
            <span style="color:#6b7280">التواصل:</span>
            <span style="font-weight:600;color:#2563eb"> support@3arida.org</span>
          </p>
        </div>
      </div>
    </div>

    <p class="page-footer">
      منصة <span style="font-weight:600">3arida.org</span> — منصة العرائض
      الرسمية في المغرب
    </p>
  </div>
</body>
</html>`;
}
