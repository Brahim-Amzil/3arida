import QRCode from 'qrcode';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { storage, db } from './firebase';

export interface QRCodeOptions {
  size?: number;
  branded?: boolean;
  includeAnalytics?: boolean;
  updatePetition?: boolean;
}

/**
 * Generate QR code data URL for a petition
 */
export const generateQRCodeDataURL = async (
  petitionId: string,
  options: QRCodeOptions = {},
): Promise<string> => {
  const { size = 256, branded = false, includeAnalytics = true } = options;

  try {
    // Create petition URL with analytics tracking if enabled
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || 'https://3arida.ma';
    const petitionUrl = `${baseUrl}/petitions/${petitionId}${
      includeAnalytics ? '?utm_source=qr' : ''
    }`;

    // QR code generation options
    const qrOptions = {
      width: size,
      height: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M' as const,
    };

    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(petitionUrl, qrOptions);

    // If branded, add 3arida branding (simplified version)
    if (branded) {
      return await addBrandingToQR(qrCodeDataURL, size);
    }

    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Generate and store QR code for a petition
 */
export const generateAndStorePetitionQR = async (
  petitionId: string,
  options: QRCodeOptions = {},
): Promise<string> => {
  const { size = 512, branded = false, updatePetition = true } = options;

  try {
    // Generate QR code
    const qrCodeDataURL = await generateQRCodeDataURL(petitionId, {
      size,
      branded,
      includeAnalytics: true,
    });

    // Convert data URL to blob
    const response = await fetch(qrCodeDataURL);
    const blob = await response.blob();

    // Create storage reference
    const fileName = `qr-codes/${petitionId}-${Date.now()}.png`;
    const storageRef = ref(storage, fileName);

    // Upload to Firebase Storage
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    // Update petition document with QR code URL if requested
    if (updatePetition) {
      const petitionRef = doc(db, 'petitions', petitionId);
      await updateDoc(petitionRef, {
        qrCodeUrl: downloadURL,
        hasQrCode: true,
        updatedAt: Timestamp.fromDate(new Date()),
      });
    }

    return downloadURL;
  } catch (error) {
    console.error('Error generating and storing QR code:', error);
    throw new Error('Failed to generate and store QR code');
  }
};

/**
 * Add 3arida branding to QR code (simplified version)
 */
const addBrandingToQR = async (
  qrCodeDataURL: string,
  size: number,
): Promise<string> => {
  try {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    canvas.width = size;
    canvas.height = size + 60; // Extra space for branding

    // Load QR code image
    const qrImage = new Image();
    await new Promise((resolve, reject) => {
      qrImage.onload = resolve;
      qrImage.onerror = reject;
      qrImage.src = qrCodeDataURL;
    });

    // Draw QR code
    ctx.drawImage(qrImage, 0, 0, size, size);

    // Add branding text
    ctx.fillStyle = '#000000';
    ctx.font = `${Math.floor(size * 0.04)}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('3arida.ma', size / 2, size + 30);
    ctx.fillText('Petition Platform', size / 2, size + 50);

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error adding branding to QR code:', error);
    // Return original QR code if branding fails
    return qrCodeDataURL;
  }
};

/**
 * Generate QR code for petition sharing
 */
export const generateShareQR = async (
  petitionId: string,
  petitionTitle: string,
  options: QRCodeOptions = {},
): Promise<string> => {
  const { size = 300, branded = true } = options;

  try {
    const qrCodeDataURL = await generateQRCodeDataURL(petitionId, {
      size,
      branded,
      includeAnalytics: true,
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating شارِك رمز QR الخاص بالعريضة:', error);
    throw new Error('Failed to generate QR code for sharing');
  }
};

/**
 * Download QR code as file
 */
export const downloadQRCode = async (
  petitionId: string,
  petitionTitle: string,
  format: 'png' | 'pdf' = 'png',
  options: QRCodeOptions = {},
): Promise<void> => {
  try {
    const { size = 512, branded = true } = options;

    if (format === 'png') {
      // Generate high-resolution QR code
      const qrCodeDataURL = await generateQRCodeDataURL(petitionId, {
        size,
        branded,
        includeAnalytics: true,
      });

      // Create download link
      const link = document.createElement('a');
      link.href = qrCodeDataURL;
      link.download = `${petitionTitle
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase()}_qr_code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
      // For PDF, we would need a PDF library like jsPDF
      // For now, just download as PNG
      await downloadQRCode(petitionId, petitionTitle, 'png', options);
    }
  } catch (error) {
    console.error('Error downloading QR code:', error);
    throw new Error('Failed to download QR code');
  }
};

/**
 * Get QR code analytics (placeholder for future implementation)
 */
export const getQRCodeAnalytics = async (
  petitionId: string,
): Promise<{
  scans: number;
  uniqueScans: number;
  lastScanned?: Date;
}> => {
  // This would be implemented with proper analytics tracking
  // For now, return mock data
  return {
    scans: 0,
    uniqueScans: 0,
    lastScanned: undefined,
  };
};

/**
 * Validate QR code URL
 */
export const validateQRCodeUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.startsWith('/petitions/');
  } catch {
    return false;
  }
};

/**
 * Extract petition ID from QR code URL
 */
export const extractPetitionIdFromQR = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    if (pathParts[1] === 'petitions' && pathParts[2]) {
      // Extract ID from slug (last 8 characters)
      const slug = pathParts[2];
      const parts = slug.split('-');
      if (parts.length > 0) {
        const lastPart = parts[parts.length - 1];
        if (lastPart.length === 8) {
          return lastPart;
        }
      }
    }
    return null;
  } catch {
    return null;
  }
};
