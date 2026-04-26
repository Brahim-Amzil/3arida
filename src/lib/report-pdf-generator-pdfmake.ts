/**
 * Report PDF Generator Service (PDFMake version)
 *
 * Generates professional PDF reports for petitions with:
 * - Arabic RTL layout
 * - Beautiful Arabic typography
 * - 5-page structure (cover, details, content, statistics, verification)
 * - QR code for verification
 */

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Petition } from '../types/petition';
import { generateReportQRCode } from './report-qr-generator';

// Register fonts
(pdfMake as any).vfs = pdfFonts;

// ============================================================================
// TYPES
// ============================================================================

interface PDFGeneratorOptions {
  downloadNumber: number;
  generatedBy: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const COLORS = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#10b981',
  text: '#1e293b',
  lightGray: '#f1f5f9',
};

// ============================================================================
// PDF GENERATION FUNCTIONS
// ============================================================================

/**
 * Generates a complete PDF report for a petition
 */
export async function generateReport(
  petition: Petition,
  options: PDFGeneratorOptions,
): Promise<Buffer> {
  try {
    console.log('[PDF Generator] Starting PDF generation with pdfmake...');
    
    // Generate QR code
    const qrCode = await generateReportQRCode(petition.id);

    // Create document definition
    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      defaultStyle: {
        font: 'Roboto',
        fontSize: 11,
        lineHeight: 1.5,
      },
      content: [
        // Cover Page
        ...createCoverPage(petition, qrCode, options),
        { text: '', pageBreak: 'after' },
        
        // Details Page
        ...createDetailsPage(petition),
        { text: '', pageBreak: 'after' },
        
        // Content Page
        ...createContentPage(petition),
        { text: '', pageBreak: 'after' },
        
        // Statistics Page
        ...createStatisticsPage(petition),
        { text: '', pageBreak: 'after' },
        
        // Verification Page
        ...createVerificationPage(petition, options),
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          color: COLORS.primary,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          color: COLORS.text,
          margin: [0, 10, 0, 5],
        },
        label: {
          fontSize: 10,
          bold: true,
          color: COLORS.secondary,
        },
        value: {
          fontSize: 11,
          color: COLORS.text,
        },
      },
    };

    console.log('[PDF Generator] Creating PDF document...');
    
    // Generate PDF using getBase64 then convert to buffer
    return new Promise((resolve, reject) => {
      try {
        const pdfDocGenerator = (pdfMake as any).createPdf(docDefinition);
        
        pdfDocGenerator.getBase64((data: string) => {
          try {
            const buffer = Buffer.from(data, 'base64');
            console.log('[PDF Generator] PDF generated successfully, size:', buffer.length, 'bytes');
            resolve(buffer);
          } catch (error) {
            console.error('[PDF Generator] Error converting base64 to buffer:', error);
            reject(error);
          }
        });
      } catch (error) {
        console.error('[PDF Generator] Error creating PDF:', error);
        reject(error);
      }
    });
  } catch (error) {
    console.error('[PDF Generator] Error in generateReport:', error);
    throw new Error('Failed to generate PDF report');
  }
}

/**
 * Creates the cover page
 */
function createCoverPage(
  petition: Petition,
  qrCode: string,
  options: PDFGeneratorOptions,
): any[] {
  const generationDate = new Date().toLocaleDateString('ar-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return [
    {
      text: '3arida.org',
      style: 'header',
      alignment: 'center',
      fontSize: 28,
      margin: [0, 40, 0, 20],
    },
    {
      text: 'تقرير رسمي للعريضة',
      style: 'header',
      alignment: 'center',
      fontSize: 20,
      margin: [0, 0, 0, 40],
    },
    {
      text: petition.title || 'عنوان العريضة',
      style: 'subheader',
      alignment: 'center',
      fontSize: 18,
      margin: [0, 0, 0, 30],
    },
    {
      text: `رمز المرجع: ${petition.referenceCode || 'N/A'}`,
      alignment: 'center',
      margin: [0, 0, 0, 10],
    },
    {
      text: `تاريخ الإنشاء: ${generationDate}`,
      alignment: 'center',
      margin: [0, 0, 0, 10],
    },
    {
      text: `التحميل رقم ${options.downloadNumber}`,
      alignment: 'center',
      margin: [0, 0, 0, 40],
    },
    {
      image: qrCode,
      width: 150,
      alignment: 'center',
      margin: [0, 0, 0, 10],
    },
    {
      text: 'امسح للتحقق من الأصالة',
      alignment: 'center',
      fontSize: 10,
      margin: [0, 0, 0, 5],
    },
    {
      text: `https://3arida.org/reports/verify/${petition.id}`,
      alignment: 'center',
      fontSize: 8,
      color: COLORS.secondary,
    },
  ];
}

/**
 * Creates the details page
 */
function createDetailsPage(petition: Petition): any[] {
  const creationDate = petition.createdAt 
    ? new Date(petition.createdAt).toLocaleDateString('ar-MA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return [
    {
      text: 'تفاصيل العريضة',
      style: 'header',
      alignment: 'right',
    },
    {
      text: 'المعلومات الأساسية',
      style: 'subheader',
      alignment: 'right',
      margin: [0, 20, 0, 10],
    },
    {
      table: {
        widths: ['*', '*'],
        body: [
          [
            { text: petition.petitionType || 'N/A', alignment: 'right' },
            { text: 'نوع العريضة:', style: 'label', alignment: 'right' },
          ],
          [
            { text: petition.category || 'N/A', alignment: 'right' },
            { text: 'الفئة:', style: 'label', alignment: 'right' },
          ],
          [
            { text: petition.subcategory || 'N/A', alignment: 'right' },
            { text: 'الفئة الفرعية:', style: 'label', alignment: 'right' },
          ],
          [
            { text: petition.addressedToType || 'N/A', alignment: 'right' },
            { text: 'موجهة إلى:', style: 'label', alignment: 'right' },
          ],
          [
            { text: petition.addressedToSpecific || 'N/A', alignment: 'right' },
            { text: 'الجهة المحددة:', style: 'label', alignment: 'right' },
          ],
          [
            { text: petition.status || 'N/A', alignment: 'right' },
            { text: 'الحالة:', style: 'label', alignment: 'right' },
          ],
        ],
      },
      layout: {
        fillColor: (rowIndex: number) => rowIndex % 2 === 0 ? COLORS.lightGray : null,
        hLineWidth: () => 0,
        vLineWidth: () => 0,
      },
      margin: [0, 0, 0, 20],
    },
    {
      text: 'معلومات الناشر',
      style: 'subheader',
      alignment: 'right',
      margin: [0, 10, 0, 10],
    },
    {
      table: {
        widths: ['*', '*'],
        body: [
          [
            { text: petition.publisherType || 'N/A', alignment: 'right' },
            { text: 'نوع الناشر:', style: 'label', alignment: 'right' },
          ],
          [
            { text: petition.publisherName || 'N/A', alignment: 'right' },
            { text: 'اسم الناشر:', style: 'label', alignment: 'right' },
          ],
          [
            { text: petition.creatorName || 'N/A', alignment: 'right' },
            { text: 'المنشئ:', style: 'label', alignment: 'right' },
          ],
          [
            { text: creationDate, alignment: 'right' },
            { text: 'تاريخ الإنشاء:', style: 'label', alignment: 'right' },
          ],
        ],
      },
      layout: {
        fillColor: (rowIndex: number) => rowIndex % 2 === 0 ? COLORS.lightGray : null,
        hLineWidth: () => 0,
        vLineWidth: () => 0,
      },
    },
  ];
}

/**
 * Creates the content page
 */
function createContentPage(petition: Petition): any[] {
  return [
    {
      text: 'محتوى العريضة',
      style: 'header',
      alignment: 'right',
    },
    {
      text: petition.description || 'لا يوجد وصف',
      alignment: 'right',
      margin: [0, 20, 0, 20],
      lineHeight: 1.8,
    },
    ...(petition.demands ? [
      {
        text: 'المطالب:',
        style: 'subheader',
        alignment: 'right',
        margin: [0, 20, 0, 10],
      },
      {
        ul: Array.isArray(petition.demands) 
          ? petition.demands 
          : [petition.demands],
        alignment: 'right',
        margin: [0, 0, 20, 0],
      },
    ] : []),
  ];
}

/**
 * Creates the statistics page
 */
function createStatisticsPage(petition: Petition): any[] {
  const signatureCount = petition.signatureCount || 0;
  const targetSignatures = petition.targetSignatures || 0;
  const progress = targetSignatures > 0 
    ? Math.round((signatureCount / targetSignatures) * 100) 
    : 0;

  return [
    {
      text: 'إحصائيات العريضة',
      style: 'header',
      alignment: 'right',
    },
    {
      table: {
        widths: ['*', '*'],
        body: [
          [
            { text: signatureCount.toLocaleString('ar-MA'), alignment: 'right', fontSize: 14, bold: true },
            { text: 'عدد التوقيعات:', style: 'label', alignment: 'right' },
          ],
          [
            { text: targetSignatures.toLocaleString('ar-MA'), alignment: 'right', fontSize: 14 },
            { text: 'الهدف:', style: 'label', alignment: 'right' },
          ],
          [
            { text: `${progress}%`, alignment: 'right', fontSize: 14, color: COLORS.success },
            { text: 'نسبة الإنجاز:', style: 'label', alignment: 'right' },
          ],
          [
            { text: petition.pricingTier || 'N/A', alignment: 'right' },
            { text: 'الباقة:', style: 'label', alignment: 'right' },
          ],
        ],
      },
      layout: {
        fillColor: (rowIndex: number) => rowIndex % 2 === 0 ? COLORS.lightGray : null,
        hLineWidth: () => 0,
        vLineWidth: () => 0,
      },
      margin: [0, 20, 0, 0],
    },
  ];
}

/**
 * Creates the verification page
 */
function createVerificationPage(petition: Petition, options: PDFGeneratorOptions): any[] {
  return [
    {
      text: 'التحقق والمصادقة',
      style: 'header',
      alignment: 'right',
    },
    {
      text: 'هذا تقرير رسمي تم إنشاؤه من منصة 3arida.org',
      alignment: 'right',
      margin: [0, 20, 0, 20],
    },
    {
      table: {
        widths: ['*', '*'],
        body: [
          [
            { text: options.downloadNumber.toString(), alignment: 'right' },
            { text: 'رقم التحميل:', style: 'label', alignment: 'right' },
          ],
          [
            { text: new Date().toLocaleString('ar-MA'), alignment: 'right' },
            { text: 'تاريخ الإنشاء:', style: 'label', alignment: 'right' },
          ],
          [
            { text: petition.referenceCode || petition.id, alignment: 'right' },
            { text: 'معرف العريضة:', style: 'label', alignment: 'right' },
          ],
        ],
      },
      layout: {
        fillColor: (rowIndex: number) => rowIndex % 2 === 0 ? COLORS.lightGray : null,
        hLineWidth: () => 0,
        vLineWidth: () => 0,
      },
    },
    {
      text: 'للتحقق من صحة هذا التقرير، يرجى زيارة:',
      alignment: 'right',
      margin: [0, 30, 0, 10],
    },
    {
      text: `https://3arida.org/reports/verify/${petition.id}`,
      alignment: 'center',
      color: COLORS.primary,
      decoration: 'underline',
    },
  ];
}

/**
 * Gets the report filename
 */
export function getReportFilename(petition: Petition): string {
  const date = new Date().toISOString().split('T')[0];
  const referenceCode = petition.referenceCode || petition.id.substring(0, 8);
  return `petition-report-${referenceCode}-${date}.pdf`;
}
