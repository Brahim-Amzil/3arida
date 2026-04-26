/**
 * Report QR Code Generator Service
 *
 * Generates QR codes for petition report verification
 * QR codes link to: https://3arida.org/reports/verify/{petitionId}
 */

import * as QRCode from 'qrcode';

// ============================================================================
// CONSTANTS
// ============================================================================

const BASE_VERIFICATION_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://3arida.org';
const QR_CODE_OPTIONS = {
  errorCorrectionLevel: 'M' as const,
  type: 'image/png' as const,
  quality: 0.92,
  margin: 1,
  width: 300,
  color: {
    dark: '#000000',
    light: '#FFFFFF',
  },
};

// ============================================================================
// QR CODE GENERATION FUNCTIONS
// ============================================================================

/**
 * Generates a QR code for petition report verification
 * Returns base64 data URL for embedding in PDF
 */
export async function generateReportQRCode(petitionId: string): Promise<string> {
  try {
    const verificationUrl = getVerificationUrl(petitionId);
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, QR_CODE_OPTIONS);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generates a QR code as a buffer (for server-side use)
 */
export async function generateReportQRCodeBuffer(petitionId: string): Promise<Buffer> {
  try {
    const verificationUrl = getVerificationUrl(petitionId);
    const qrCodeBuffer = await QRCode.toBuffer(verificationUrl, {
      ...QR_CODE_OPTIONS,
      type: 'png',
    });
    return qrCodeBuffer;
  } catch (error) {
    console.error('Error generating QR code buffer:', error);
    throw new Error('Failed to generate QR code buffer');
  }
}

/**
 * Gets the verification URL for a petition
 */
export function getVerificationUrl(petitionId: string): string {
  return `${BASE_VERIFICATION_URL}/reports/verify/${petitionId}`;
}

/**
 * Validates a verification URL format
 */
export function isValidVerificationUrl(url: string): boolean {
  const pattern = new RegExp(`^${BASE_VERIFICATION_URL}/reports/verify/[a-zA-Z0-9_-]+$`);
  return pattern.test(url);
}

/**
 * Extracts petition ID from verification URL
 */
export function extractPetitionIdFromUrl(url: string): string | null {
  const match = url.match(/\/reports\/verify\/([a-zA-Z0-9_-]+)$/);
  return match ? match[1] : null;
}

// ============================================================================
// EXPORTS
// ============================================================================

export const ReportQRGenerator = {
  generateReportQRCode,
  generateReportQRCodeBuffer,
  getVerificationUrl,
  isValidVerificationUrl,
  extractPetitionIdFromUrl,
} as const;

export default ReportQRGenerator;
