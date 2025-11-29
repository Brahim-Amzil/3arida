// WhatsApp Phone Verification Service
import { db } from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

export interface VerificationCode {
  code: string;
  phoneNumber: string;
  userId: string;
  createdAt: any;
  expiresAt: any;
  verified: boolean;
}

// Generate a 4-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Store verification code in Firestore
export async function createVerificationCode(
  userId: string,
  phoneNumber: string
): Promise<string> {
  const code = generateVerificationCode();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

  const verificationData: VerificationCode = {
    code,
    phoneNumber,
    userId,
    createdAt: serverTimestamp(),
    expiresAt,
    verified: false,
  };

  // Store with code as document ID for easy lookup
  await setDoc(doc(db, 'phoneVerifications', code), verificationData);

  return code;
}

// Verify code from WhatsApp message
export async function verifyWhatsAppCode(
  phoneNumber: string,
  code: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    const verificationDoc = await getDoc(doc(db, 'phoneVerifications', code));

    if (!verificationDoc.exists()) {
      return { success: false, error: 'Invalid verification code' };
    }

    const data = verificationDoc.data() as VerificationCode;

    // Check if expired
    const now = new Date();
    const expiresAt = data.expiresAt.toDate();
    if (now > expiresAt) {
      await deleteDoc(doc(db, 'phoneVerifications', code));
      return { success: false, error: 'Verification code expired' };
    }

    // Check if phone number matches
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    const normalizedStoredPhone = normalizePhoneNumber(data.phoneNumber);

    if (normalizedPhone !== normalizedStoredPhone) {
      return { success: false, error: 'Phone number mismatch' };
    }

    // Check if already verified
    if (data.verified) {
      return { success: false, error: 'Code already used' };
    }

    // Mark as verified
    await setDoc(
      doc(db, 'phoneVerifications', code),
      { verified: true },
      { merge: true }
    );

    // Clean up after successful verification
    setTimeout(() => {
      deleteDoc(doc(db, 'phoneVerifications', code));
    }, 5000);

    return { success: true, userId: data.userId };
  } catch (error) {
    console.error('Error verifying WhatsApp code:', error);
    return { success: false, error: 'Verification failed' };
  }
}

// Normalize phone number for comparison
function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let normalized = phone.replace(/\D/g, '');

  // Remove leading zeros
  normalized = normalized.replace(/^0+/, '');

  // If starts with country code, keep it
  // Otherwise assume Morocco (+212)
  if (!normalized.startsWith('212')) {
    normalized = '212' + normalized;
  }

  return normalized;
}

// Generate WhatsApp deep link
export function generateWhatsAppLink(
  code: string,
  businessNumber: string = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER ||
    ''
): string {
  const message = encodeURIComponent(
    `Verify my 3arida account with code: ${code}`
  );
  return `https://wa.me/${businessNumber}?text=${message}`;
}

// Clean up expired verification codes (run periodically)
export async function cleanupExpiredCodes(): Promise<void> {
  // This should be called from a scheduled function
  // For now, it's a placeholder for future implementation
  console.log('Cleanup expired codes - implement with Cloud Functions');
}
