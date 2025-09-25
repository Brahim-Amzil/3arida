import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface SignatureAttempt {
  id?: string;
  petitionId: string;
  ipAddress: string;
  userAgent: string;
  phoneNumber: string;
  userId?: string;
  timestamp: Date;
  success: boolean;
  reason?: string;
}

export interface IPTrackingData {
  ipAddress: string;
  country?: string;
  city?: string;
  isp?: string;
  isVPN?: boolean;
  isProxy?: boolean;
  riskScore: number;
  firstSeen: Date;
  lastSeen: Date;
  totalRequests: number;
  suspiciousActivity: string[];
}

/**
 * Track signature attempt for duplicate prevention
 */
export const trackSignatureAttempt = async (
  attempt: Omit<SignatureAttempt, 'id' | 'timestamp'>
): Promise<void> => {
  try {
    await addDoc(collection(db, 'signatureAttempts'), {
      ...attempt,
      timestamp: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.error('Error tracking signature attempt:', error);
    // Don't throw error - tracking failure shouldn't block signing
  }
};

/**
 * Check for duplicate signatures by phone number
 */
export const checkDuplicatePhoneSignature = async (
  petitionId: string,
  phoneNumber: string
): Promise<boolean> => {
  try {
    const signaturesRef = collection(db, 'signatures');
    const duplicateQuery = query(
      signaturesRef,
      where('petitionId', '==', petitionId),
      where('signerPhone', '==', phoneNumber)
    );

    const snapshot = await getDocs(duplicateQuery);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking duplicate phone signature:', error);
    return false; // Allow signing if check fails
  }
};

/**
 * Check for duplicate signatures by IP address (rate limiting)
 */
export const checkIPSignatureLimit = async (
  petitionId: string,
  ipAddress: string,
  timeWindowHours: number = 24,
  maxSignatures: number = 5
): Promise<{ allowed: boolean; count: number; reason?: string }> => {
  try {
    const attemptsRef = collection(db, 'signatureAttempts');
    const timeLimit = new Date(Date.now() - timeWindowHours * 60 * 60 * 1000);

    const recentAttemptsQuery = query(
      attemptsRef,
      where('petitionId', '==', petitionId),
      where('ipAddress', '==', ipAddress),
      where('timestamp', '>=', Timestamp.fromDate(timeLimit)),
      where('success', '==', true)
    );

    const snapshot = await getDocs(recentAttemptsQuery);
    const count = snapshot.size;

    if (count >= maxSignatures) {
      return {
        allowed: false,
        count,
        reason: `Too many signatures from this IP address. Maximum ${maxSignatures} signatures per ${timeWindowHours} hours.`,
      };
    }

    return { allowed: true, count };
  } catch (error) {
    console.error('Error checking IP signature limit:', error);
    return { allowed: true, count: 0 }; // Allow if check fails
  }
};

/**
 * Analyze IP address for suspicious activity
 */
export const analyzeIPAddress = async (
  ipAddress: string
): Promise<IPTrackingData> => {
  // In production, integrate with IP geolocation and threat intelligence services
  // For now, return basic analysis

  const defaultData: IPTrackingData = {
    ipAddress,
    riskScore: 0,
    firstSeen: new Date(),
    lastSeen: new Date(),
    totalRequests: 1,
    suspiciousActivity: [],
  };

  try {
    // Check if IP is in our tracking database
    const ipTrackingRef = collection(db, 'ipTracking');
    const ipQuery = query(ipTrackingRef, where('ipAddress', '==', ipAddress));
    const snapshot = await getDocs(ipQuery);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        ipAddress,
        country: data.country,
        city: data.city,
        isp: data.isp,
        isVPN: data.isVPN || false,
        isProxy: data.isProxy || false,
        riskScore: data.riskScore || 0,
        firstSeen: data.firstSeen?.toDate() || new Date(),
        lastSeen: new Date(),
        totalRequests: (data.totalRequests || 0) + 1,
        suspiciousActivity: data.suspiciousActivity || [],
      };
    }

    // For new IPs, perform basic checks
    const riskScore = calculateIPRiskScore(ipAddress);

    return {
      ...defaultData,
      riskScore,
      suspiciousActivity: riskScore > 50 ? ['High risk IP range'] : [],
    };
  } catch (error) {
    console.error('Error analyzing IP address:', error);
    return defaultData;
  }
};

/**
 * Calculate basic risk score for IP address
 */
const calculateIPRiskScore = (ipAddress: string): number => {
  let riskScore = 0;

  // Check for common suspicious IP patterns
  const suspiciousRanges = [
    /^10\./, // Private network
    /^192\.168\./, // Private network
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Private network
    /^127\./, // Loopback
    /^169\.254\./, // Link-local
  ];

  for (const range of suspiciousRanges) {
    if (range.test(ipAddress)) {
      riskScore += 30;
      break;
    }
  }

  // Check for known VPN/proxy ranges (basic check)
  const vpnRanges = [
    /^185\./, // Common VPN range
    /^46\./, // Common VPN range
  ];

  for (const range of vpnRanges) {
    if (range.test(ipAddress)) {
      riskScore += 20;
      break;
    }
  }

  return Math.min(riskScore, 100);
};

/**
 * Check for suspicious user behavior patterns
 */
export const detectSuspiciousBehavior = (
  attempts: SignatureAttempt[]
): { suspicious: boolean; reasons: string[] } => {
  const reasons: string[] = [];

  // Check for rapid-fire attempts
  const rapidAttempts = attempts.filter((attempt) => {
    const timeDiff = Date.now() - attempt.timestamp.getTime();
    return timeDiff < 60000; // Within last minute
  });

  if (rapidAttempts.length > 3) {
    reasons.push('Rapid signature attempts detected');
  }

  // Check for multiple failed attempts
  const failedAttempts = attempts.filter((attempt) => !attempt.success);
  if (failedAttempts.length > 5) {
    reasons.push('Multiple failed signature attempts');
  }

  // Check for suspicious user agents
  const suspiciousUserAgents = attempts.filter((attempt) => {
    const userAgent = attempt.userAgent.toLowerCase();
    return (
      userAgent.includes('bot') ||
      userAgent.includes('crawler') ||
      userAgent.includes('spider') ||
      userAgent.includes('curl') ||
      userAgent.includes('wget')
    );
  });

  if (suspiciousUserAgents.length > 0) {
    reasons.push('Suspicious user agent detected');
  }

  return {
    suspicious: reasons.length > 0,
    reasons,
  };
};

/**
 * Validate signature authenticity
 */
export const validateSignatureAuthenticity = async (
  petitionId: string,
  phoneNumber: string,
  ipAddress: string,
  userAgent: string
): Promise<{ valid: boolean; reason?: string }> => {
  // Check for duplicate phone number
  const isDuplicatePhone = await checkDuplicatePhoneSignature(
    petitionId,
    phoneNumber
  );
  if (isDuplicatePhone) {
    return {
      valid: false,
      reason: 'This phone number has already been used to sign this petition',
    };
  }

  // Check IP rate limiting
  const ipCheck = await checkIPSignatureLimit(petitionId, ipAddress);
  if (!ipCheck.allowed) {
    return {
      valid: false,
      reason: ipCheck.reason,
    };
  }

  // Analyze IP for suspicious activity
  const ipAnalysis = await analyzeIPAddress(ipAddress);
  if (ipAnalysis.riskScore > 80) {
    return {
      valid: false,
      reason: 'Signature blocked due to high-risk IP address',
    };
  }

  // Check user agent
  if (isSuspiciousUserAgent(userAgent)) {
    return {
      valid: false,
      reason: 'Signature blocked due to suspicious user agent',
    };
  }

  return { valid: true };
};

/**
 * Check if user agent is suspicious
 */
const isSuspiciousUserAgent = (userAgent: string): boolean => {
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /requests/i,
    /http/i,
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(userAgent));
};

/**
 * Generate signature fingerprint for additional validation
 */
export const generateSignatureFingerprint = (
  phoneNumber: string,
  ipAddress: string,
  userAgent: string,
  timestamp: Date
): string => {
  const crypto = require('crypto');
  const data = `${phoneNumber}:${ipAddress}:${userAgent}:${timestamp.getTime()}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Verify signature fingerprint
 */
export const verifySignatureFingerprint = (
  fingerprint: string,
  phoneNumber: string,
  ipAddress: string,
  userAgent: string,
  timestamp: Date
): boolean => {
  const expectedFingerprint = generateSignatureFingerprint(
    phoneNumber,
    ipAddress,
    userAgent,
    timestamp
  );
  return fingerprint === expectedFingerprint;
};

/**
 * Clean up old tracking data
 */
export const cleanupOldTrackingData = async (
  daysToKeep: number = 30
): Promise<void> => {
  try {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

    // Clean up signature attempts
    const attemptsRef = collection(db, 'signatureAttempts');
    const oldAttemptsQuery = query(
      attemptsRef,
      where('timestamp', '<', Timestamp.fromDate(cutoffDate))
    );

    const snapshot = await getDocs(oldAttemptsQuery);
    console.log(`Cleaning up ${snapshot.size} old signature attempts`);

    // In production, use batch operations for better performance
    // This is a simplified version
  } catch (error) {
    console.error('Error cleaning up old tracking data:', error);
  }
};

/**
 * Get signature statistics for a petition
 */
export const getSignatureStatistics = async (
  petitionId: string
): Promise<{
  totalAttempts: number;
  successfulSignatures: number;
  failedAttempts: number;
  uniqueIPs: number;
  suspiciousAttempts: number;
}> => {
  try {
    const attemptsRef = collection(db, 'signatureAttempts');
    const petitionAttemptsQuery = query(
      attemptsRef,
      where('petitionId', '==', petitionId)
    );

    const snapshot = await getDocs(petitionAttemptsQuery);
    const attempts = snapshot.docs.map((doc) => doc.data());

    const uniqueIPs = new Set(attempts.map((attempt) => attempt.ipAddress))
      .size;
    const successfulSignatures = attempts.filter(
      (attempt) => attempt.success
    ).length;
    const failedAttempts = attempts.filter(
      (attempt) => !attempt.success
    ).length;

    // Count suspicious attempts (basic heuristic)
    const suspiciousAttempts = attempts.filter(
      (attempt) =>
        isSuspiciousUserAgent(attempt.userAgent) ||
        attempt.reason?.includes('suspicious')
    ).length;

    return {
      totalAttempts: attempts.length,
      successfulSignatures,
      failedAttempts,
      uniqueIPs,
      suspiciousAttempts,
    };
  } catch (error) {
    console.error('Error getting signature statistics:', error);
    return {
      totalAttempts: 0,
      successfulSignatures: 0,
      failedAttempts: 0,
      uniqueIPs: 0,
      suspiciousAttempts: 0,
    };
  }
};
