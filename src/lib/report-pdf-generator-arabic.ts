/**
 * Report PDF Generator with Arabic Support
 * 
 * Generates PDFs with proper Arabic text rendering
 */

import { jsPDF } from 'jspdf';
import { Petition } from '../types/petition';
import { generateReportQRCode } from './report-qr-generator';
import { prepareArabicText, wrapArabicText } from './arabic-text-helper';

interface PDFGeneratorOptions {
  downloadNumber: number;
  generatedBy: string;
}

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 20;
const LINE_HEIGHT = 7;

export async function generateReport(
  petition: Petition,
  options: PDFGeneratorOptions,
): Promise<Buffer> {
  try {
    console.log('[PDF Generator] Starting Arabic PDF generation...');
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const qrCode = await generateReportQRCode(petition.id);

    // Generate all pages
    console.log('[PDF Generator] Creating cover page...');
    await createCoverPage(doc, petition, qrCode, options);
    doc.addPage();
    
    console.log('[PDF Generator] Creating details page...');
    await createDetailsPage(doc, petition);
    doc.addPage();
    
    console.log('[PDF Generator] Creating content page...');
    await createContentPage(doc, petition);
    doc.addPage();
    
    console.log('[PDF Generator] Creating statistics page...');
    await createStatisticsPage(doc, petition);
    doc.addPage();
    
    console.log('[PDF Generator] Creating verification page...');
    await createVerificationPage(doc, petition, options);

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    console.log('[PDF Generator] PDF generated successfully');
    return pdfBuffer;
  } catch (error) {
    console.error('[PDF Generator] Error:', error);
    throw new Error('Failed to generate PDF report');
  }
}

async function createCoverPage(
  doc: jsPDF,
  petition: Petition,
  qrCode: string,
  options: PDFGeneratorOptions,
): Promise<void> {
  const centerX = PAGE_WIDTH / 2;
  let y = 30;

  // Logo
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('3arida.org', centerX, y, { align: 'center' });
  y += 15;

  // Title in Arabic
  doc.setFontSize(18);
  const arabicTitle = prepareArabicText('تقرير رسمي للعريضة');
  doc.text(arabicTitle, centerX, y, { align: 'center' });
  y += 20;

  // Petition Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const petitionTitle = prepareArabicText(petition.title || 'عنوان العريضة');
  const titleLines = wrapArabicText(petitionTitle, PAGE_WIDTH - 2 * MARGIN, 16);
  titleLines.forEach(line => {
    doc.text(line, centerX, y, { align: 'center' });
    y += 8;
  });
  y += 10;

  // Reference Code
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const refLabel = prepareArabicText('رمز المرجع:');
  doc.text(`${refLabel} ${petition.referenceCode || 'N/A'}`, centerX, y, { align: 'center' });
  y += 10;

  // Generation Date
  const dateLabel = prepareArabicText('تاريخ الإنشاء:');
  const generationDate = new Date().toLocaleDateString('ar-MA');
  doc.text(`${dateLabel} ${generationDate}`, centerX, y, { align: 'center' });
  y += 10;

  // Download Number
  const downloadLabel = prepareArabicText('التحميل رقم');
  doc.text(`${downloadLabel} ${options.downloadNumber}`, centerX, y, { align: 'center' });
  y += 30;

  // QR Code
  const qrSize = 80;
  const qrX = (PAGE_WIDTH - qrSize) / 2;
  doc.addImage(qrCode, 'PNG', qrX, y, qrSize, qrSize);
  y += qrSize + 10;

  // QR Instructions
  doc.setFontSize(10);
  const qrLabel = prepareArabicText('امسح للتحقق من الأصالة');
  doc.text(qrLabel, centerX, y, { align: 'center' });
  y += 7;
  doc.text(`https://3arida.org/reports/verify/${petition.id}`, centerX, y, { align: 'center' });
}

async function createDetailsPage(doc: jsPDF, petition: Petition): Promise<void> {
  let y = MARGIN;

  // Page Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const pageTitle = prepareArabicText('تفاصيل العريضة');
  doc.text(pageTitle, PAGE_WIDTH - MARGIN, y, { align: 'right' });
  y += 15;

  // Basic Information Section
  doc.setFontSize(14);
  const basicInfoTitle = prepareArabicText('المعلومات الأساسية');
  doc.text(basicInfoTitle, PAGE_WIDTH - MARGIN, y, { align: 'right' });
  y += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  // Details
  const details = [
    [prepareArabicText('نوع العريضة:'), petition.petitionType || 'N/A'],
    [prepareArabicText('الفئة:'), petition.category || 'N/A'],
    [prepareArabicText('الفئة الفرعية:'), petition.subcategory || 'N/A'],
    [prepareArabicText('موجهة إلى:'), petition.addressedToType || 'N/A'],
    [prepareArabicText('الجهة المحددة:'), prepareArabicText(petition.addressedToSpecific || 'N/A')],
    [prepareArabicText('الحالة:'), petition.status || 'N/A'],
  ];

  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, PAGE_WIDTH - MARGIN, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(value, PAGE_WIDTH - MARGIN - 60, y, { align: 'right' });
    y += LINE_HEIGHT;
  });

  y += 10;

  // Publisher Information
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const publisherTitle = prepareArabicText('معلومات الناشر');
  doc.text(publisherTitle, PAGE_WIDTH - MARGIN, y, { align: 'right' });
  y += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const publisherDetails = [
    [prepareArabicText('نوع الناشر:'), petition.publisherType || 'N/A'],
    [prepareArabicText('اسم الناشر:'), prepareArabicText(petition.publisherName || 'N/A')],
    [prepareArabicText('المنشئ:'), prepareArabicText(petition.creatorName || 'N/A')],
    [prepareArabicText('تاريخ الإنشاء:'), petition.createdAt ? new Date(petition.createdAt).toLocaleDateString('ar-MA') : 'N/A'],
  ];

  publisherDetails.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, PAGE_WIDTH - MARGIN, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(value, PAGE_WIDTH - MARGIN - 60, y, { align: 'right' });
    y += LINE_HEIGHT;
  });
}

async function createContentPage(doc: jsPDF, petition: Petition): Promise<void> {
  let y = MARGIN;

  // Page Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const pageTitle = prepareArabicText('محتوى العريضة');
  doc.text(pageTitle, PAGE_WIDTH - MARGIN, y, { align: 'right' });
  y += 15;

  // Description
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const description = petition.description || prepareArabicText('لا يوجد وصف');
  const descLines = wrapArabicText(description, PAGE_WIDTH - 2 * MARGIN, 11);
  
  descLines.forEach(line => {
    if (y > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
    doc.text(line, PAGE_WIDTH - MARGIN, y, { align: 'right' });
    y += LINE_HEIGHT;
  });
}

async function createStatisticsPage(doc: jsPDF, petition: Petition): Promise<void> {
  let y = MARGIN;

  // Page Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const pageTitle = prepareArabicText('إحصائيات العريضة');
  doc.text(pageTitle, PAGE_WIDTH - MARGIN, y, { align: 'right' });
  y += 15;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const signatureCount = petition.signatureCount || 0;
  const targetSignatures = petition.targetSignatures || 0;
  const progress = targetSignatures > 0 ? Math.round((signatureCount / targetSignatures) * 100) : 0;

  const stats = [
    [prepareArabicText('عدد التوقيعات:'), signatureCount.toLocaleString('ar-MA')],
    [prepareArabicText('الهدف:'), targetSignatures.toLocaleString('ar-MA')],
    [prepareArabicText('نسبة الإنجاز:'), `${progress}%`],
    [prepareArabicText('الباقة:'), petition.pricingTier || 'N/A'],
  ];

  stats.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, PAGE_WIDTH - MARGIN, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(value, PAGE_WIDTH - MARGIN - 60, y, { align: 'right' });
    y += LINE_HEIGHT + 2;
  });
}

async function createVerificationPage(doc: jsPDF, petition: Petition, options: PDFGeneratorOptions): Promise<void> {
  let y = MARGIN;

  // Page Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const pageTitle = prepareArabicText('التحقق والمصادقة');
  doc.text(pageTitle, PAGE_WIDTH - MARGIN, y, { align: 'right' });
  y += 15;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const verificationText = prepareArabicText('هذا تقرير رسمي تم إنشاؤه من منصة 3arida.org');
  doc.text(verificationText, PAGE_WIDTH - MARGIN, y, { align: 'right' });
  y += 15;

  const verificationDetails = [
    [prepareArabicText('رقم التحميل:'), options.downloadNumber.toString()],
    [prepareArabicText('تاريخ الإنشاء:'), new Date().toLocaleString('ar-MA')],
    [prepareArabicText('معرف العريضة:'), petition.referenceCode || petition.id],
  ];

  verificationDetails.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, PAGE_WIDTH - MARGIN, y, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(value, PAGE_WIDTH - MARGIN - 60, y, { align: 'right' });
    y += LINE_HEIGHT;
  });

  y += 15;

  const verifyLabel = prepareArabicText('للتحقق من صحة هذا التقرير، يرجى زيارة:');
  doc.text(verifyLabel, PAGE_WIDTH - MARGIN, y, { align: 'right' });
  y += 10;

  doc.setFontSize(10);
  doc.text(`https://3arida.org/reports/verify/${petition.id}`, PAGE_WIDTH / 2, y, { align: 'center' });
}

export function getReportFilename(petition: Petition): string {
  const date = new Date().toISOString().split('T')[0];
  const referenceCode = petition.referenceCode || petition.id.substring(0, 8);
  return `petition-report-${referenceCode}-${date}.pdf`;
}
