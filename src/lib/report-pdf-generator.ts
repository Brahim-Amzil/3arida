/**
 * Report PDF Generator Service
 *
 * Generates professional PDF reports for petitions with:
 * - Arabic RTL layout
 * - 5-page structure (cover, details, content, statistics, verification)
 * - QR code for verification
 * - Professional formatting
 */

import { jsPDF } from 'jspdf';
import { Petition } from '../types/petition';
import { generateReportQRCode } from './report-qr-generator';

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

const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm
const MARGIN = 20;
const LINE_HEIGHT = 7;

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
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Generate QR code
    const qrCode = await generateReportQRCode(petition.id);

    // Generate all pages
    console.log("[PDF Generator] Starting cover page...");
    await createCoverPage(doc, petition, qrCode, options);
    console.log("[PDF Generator] Cover page complete");
    doc.addPage();
    console.log("[PDF Generator] Starting details page...");
    await createDetailsPage(doc, petition);
    console.log("[PDF Generator] Details page complete");
    doc.addPage();
    console.log("[PDF Generator] Starting content page...");
    await createContentPage(doc, petition);
    console.log("[PDF Generator] Content page complete");
    doc.addPage();
    console.log("[PDF Generator] Starting statistics page...");
    await createStatisticsPage(doc, petition);
    console.log("[PDF Generator] Statistics page complete");
    doc.addPage();
    console.log("[PDF Generator] Starting verification page...");
    await createVerificationPage(doc, petition, options);
    console.log("[PDF Generator] Verification page complete");

    // Convert to buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw new Error('Failed to generate PDF report');
  }
}

/**
 * Creates the cover page
 */
async function createCoverPage(
  doc: jsPDF,
  petition: Petition,
  qrCode: string,
  options: PDFGeneratorOptions,
): Promise<void> {
  const centerX = PAGE_WIDTH / 2;
  let y = 30;

  // Logo placeholder (you can add actual logo later)
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('3arida.org', centerX, y, { align: 'center' });
  y += 15;

  // Title
  doc.setFontSize(18);
  doc.text('OFFICIAL PETITION REPORT', centerX, y, { align: 'center' });
  y += 20;

  // Petition Title (with word wrap)
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(petition.title, PAGE_WIDTH - 2 * MARGIN);
  doc.text(titleLines, centerX, y, { align: 'center' });
  y += titleLines.length * 8 + 10;

  // Reference Code
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Reference Code: ${petition.referenceCode || 'N/A'}`, centerX, y, {
    align: 'center',
  });
  y += 10;

  // Generation Date
  const generationDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Generated: ${generationDate}`, centerX, y, { align: 'center' });
  y += 10;

  // Download Number
  doc.text(`Download #${options.downloadNumber}`, centerX, y, { align: 'center' });
  y += 20;

  // QR Code
  if (qrCode) {
    const qrSize = 60;
    const qrX = centerX - qrSize / 2;
    doc.addImage(qrCode, 'PNG', qrX, y, qrSize, qrSize);
    y += qrSize + 10;
  }

  // Verification text
  doc.setFontSize(10);
  doc.text('Scan to verify authenticity', centerX, y, { align: 'center' });
  y += 5;
  doc.text(`https://3arida.org/reports/verify/${petition.id}`, centerX, y, {
    align: 'center',
  });
}

/**
 * Creates the details page
 */
async function createDetailsPage(doc: jsPDF, petition: Petition): Promise<void> {
  let y = MARGIN;

  // Page title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Petition Details', MARGIN, y);
  y += 15;

  // Basic Information Section
  doc.setFontSize(14);
  doc.text('Basic Information', MARGIN, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const details = [
    ['Petition Type', petition.petitionType || 'N/A'],
    ['Category', petition.category],
    ['Subcategory', petition.subcategory || 'N/A'],
    ['Addressed To Type', petition.addressedToType || 'N/A'],
    ['Addressed To', petition.addressedToSpecific || 'N/A'],
    ['Reference Code', petition.referenceCode || 'N/A'],
    ['Status', petition.status],
  ];

  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, MARGIN + 50, y);
    y += LINE_HEIGHT;
  });

  y += 10;

  // Publisher Information Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Publisher Information', MARGIN, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const publisherDetails = [
    ['Publisher Type', petition.publisherType || 'N/A'],
    ['Publisher Name', petition.publisherName || 'N/A'],
    ['Creator', petition.creatorName || 'N/A'],
    [
      'Creation Date',
      new Date(petition.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    ],
  ];

  publisherDetails.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, MARGIN + 50, y);
    y += LINE_HEIGHT;
  });

  y += 10;

  // Tier Information Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Tier Information', MARGIN, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const tierDetails = [
    ['Pricing Tier', petition.pricingTier.toUpperCase()],
    ['Target Signatures', petition.targetSignatures.toLocaleString()],
    ['Amount Paid', `${petition.amountPaid} MAD`],
  ];

  tierDetails.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, MARGIN + 50, y);
    y += LINE_HEIGHT;
  });
}

/**
 * Creates the content page
 */
async function createContentPage(doc: jsPDF, petition: Petition): Promise<void> {
  let y = MARGIN;

  // Page title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Petition Content', MARGIN, y);
  y += 15;

  // Description
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const maxWidth = PAGE_WIDTH - 2 * MARGIN;
  const descriptionLines = doc.splitTextToSize(petition.description, maxWidth);

  descriptionLines.forEach((line: string) => {
    if (y > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
    doc.text(line, MARGIN, y);
    y += LINE_HEIGHT;
  });
}

/**
 * Creates the statistics page
 */
async function createStatisticsPage(doc: jsPDF, petition: Petition): Promise<void> {
  let y = MARGIN;

  // Page title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Statistics & Impact', MARGIN, y);
  y += 15;

  // Signature Statistics
  doc.setFontSize(14);
  doc.text('Signature Statistics', MARGIN, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const progress = ((petition.currentSignatures / petition.targetSignatures) * 100).toFixed(1);

  const signatureStats = [
    ['Total Signatures', petition.currentSignatures.toLocaleString()],
    ['Target Signatures', petition.targetSignatures.toLocaleString()],
    ['Progress', `${progress}%`],
  ];

  signatureStats.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, MARGIN + 50, y);
    y += LINE_HEIGHT;
  });

  y += 10;

  // Engagement Statistics
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Engagement Statistics', MARGIN, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const engagementStats = [
    ['Total Views', petition.viewCount.toLocaleString()],
    ['Total Shares', petition.shareCount.toLocaleString()],
  ];

  engagementStats.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, MARGIN + 50, y);
    y += LINE_HEIGHT;
  });

  y += 10;

  // Timeline
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Timeline', MARGIN, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const formatDate = (date: Date | undefined) =>
    date
      ? new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'N/A';

  const timeline = [
    ['Created', formatDate(petition.createdAt)],
    ['Approved', formatDate(petition.approvedAt)],
    ['Closed', formatDate(petition.closedAt)],
  ];

  timeline.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, MARGIN + 50, y);
    y += LINE_HEIGHT;
  });
}

/**
 * Creates the verification page
 */
async function createVerificationPage(
  doc: jsPDF,
  petition: Petition,
  options: PDFGeneratorOptions,
): Promise<void> {
  let y = MARGIN;

  // Page title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Verification & Legal Notice', MARGIN, y);
  y += 15;

  // Verification Information
  doc.setFontSize(14);
  doc.text('Report Generation Information', MARGIN, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const generationDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const verificationInfo = [
    ['Report Generated', generationDate],
    ['Generated By', options.generatedBy],
    ['Download Number', `#${options.downloadNumber}`],
    ['Verification URL', `https://3arida.org/reports/verify/${petition.id}`],
  ];

  verificationInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    const valueLines = doc.splitTextToSize(value, PAGE_WIDTH - MARGIN - 60);
    doc.text(valueLines, MARGIN + 50, y);
    y += LINE_HEIGHT * valueLines.length;
  });

  y += 15;

  // Platform Information
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Platform Information', MARGIN, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const platformInfo = [
    'Platform: 3arida.org',
    'Official Petition Platform for Morocco',
    'Contact: support@3arida.org',
  ];

  platformInfo.forEach((line) => {
    doc.text(line, MARGIN, y);
    y += LINE_HEIGHT;
  });

  y += 15;

  // Legal Notice
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Legal Notice', MARGIN, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const legalNotice = [
    'This report is generated from verified data on 3arida.org platform.',
    'All signatures are verified for authenticity.',
    'Scan the QR code on the cover page to verify this report online.',
    '',
    'This document is an official representation of the petition data at the time of generation.',
    'For the most current information, please visit the verification URL above.',
  ];

  legalNotice.forEach((line) => {
    const lines = doc.splitTextToSize(line, PAGE_WIDTH - 2 * MARGIN);
    lines.forEach((l: string) => {
      doc.text(l, MARGIN, y);
      y += LINE_HEIGHT;
    });
  });
}

/**
 * Gets the filename for the PDF report
 */
export function getReportFilename(petition: Petition): string {
  const date = new Date().toISOString().split('T')[0];
  const referenceCode = petition.referenceCode || petition.id.substring(0, 8);
  return `petition-report-${referenceCode}-${date}.pdf`;
}

// ============================================================================
// EXPORTS
// ============================================================================

export const ReportPDFGenerator = {
  generateReport,
  getReportFilename,
} as const;

export default ReportPDFGenerator;
