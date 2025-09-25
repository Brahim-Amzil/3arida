import { NextRequest } from 'next/server';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore: RateLimitStore = {};

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach((key) => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });
}, 60000); // Clean up every minute

/**
 * Rate limiting function
 */
export const rateLimit = (config: RateLimitConfig) => {
  const {
    maxRequests,
    windowMs,
    message = 'Too many requests, please try again later.',
  } = config;

  return (
    identifier: string
  ): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    message?: string;
  } => {
    const now = Date.now();
    const key = `rate_limit:${identifier}`;

    // Get or create rate limit entry
    let entry = rateLimitStore[key];

    if (!entry || entry.resetTime < now) {
      // Create new entry or reset expired entry
      entry = {
        count: 0,
        resetTime: now + windowMs,
      };
      rateLimitStore[key] = entry;
    }

    // Check if limit exceeded
    if (entry.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        message,
      };
    }

    // Increment counter
    entry.count++;

    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  };
};

/**
 * Get client identifier from request
 */
export const getClientIdentifier = (request: NextRequest): string => {
  // Try to get real IP from headers (for production behind proxy)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare

  let ip =
    forwardedFor?.split(',')[0] ||
    realIp ||
    cfConnectingIp ||
    request.ip ||
    'unknown';

  // For development, use a fallback
  if (ip === 'unknown' || ip === '::1' || ip === '127.0.0.1') {
    ip = 'dev-client';
  }

  return ip;
};

/**
 * Get user identifier (IP + User ID if authenticated)
 */
export const getUserIdentifier = (
  request: NextRequest,
  userId?: string
): string => {
  const ip = getClientIdentifier(request);
  return userId ? `${ip}:${userId}` : ip;
};

// Pre-configured rate limiters for different actions
export const createPetitionLimiter = rateLimit({
  maxRequests: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'You can only create 3 petitions per hour. Please try again later.',
});

export const signPetitionLimiter = rateLimit({
  maxRequests: 10,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'You can only sign 10 petitions per hour. Please try again later.',
});

export const commentLimiter = rateLimit({
  maxRequests: 20,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'You can only post 20 comments per hour. Please try again later.',
});

export const authLimiter = rateLimit({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many authentication attempts. Please try again in 15 minutes.',
});

export const passwordResetLimiter = rateLimit({
  maxRequests: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'You can only request 3 password resets per hour.',
});

export const emailVerificationLimiter = rateLimit({
  maxRequests: 5,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'You can only request 5 email verifications per hour.',
});

export const phoneVerificationLimiter = rateLimit({
  maxRequests: 5,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'You can only request 5 phone verifications per hour.',
});

export const generalApiLimiter = rateLimit({
  maxRequests: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many API requests. Please try again later.',
});

/**
 * IP-based blocking for suspicious activity
 */
interface BlockedIP {
  ip: string;
  reason: string;
  blockedAt: number;
  expiresAt: number;
}

const blockedIPs: Map<string, BlockedIP> = new Map();

export const blockIP = (
  ip: string,
  reason: string,
  durationMs: number = 24 * 60 * 60 * 1000
) => {
  const now = Date.now();
  blockedIPs.set(ip, {
    ip,
    reason,
    blockedAt: now,
    expiresAt: now + durationMs,
  });
};

export const isIPBlocked = (
  ip: string
): { blocked: boolean; reason?: string; expiresAt?: number } => {
  const blockedIP = blockedIPs.get(ip);

  if (!blockedIP) {
    return { blocked: false };
  }

  if (Date.now() > blockedIP.expiresAt) {
    blockedIPs.delete(ip);
    return { blocked: false };
  }

  return {
    blocked: true,
    reason: blockedIP.reason,
    expiresAt: blockedIP.expiresAt,
  };
};

/**
 * Suspicious activity detection
 */
export const detectSuspiciousActivity = (
  ip: string,
  action: string,
  metadata?: Record<string, any>
): boolean => {
  // Check for rapid requests from same IP
  const rapidRequestsKey = `rapid:${ip}`;
  const rapidRequests = rateLimitStore[rapidRequestsKey];

  if (rapidRequests && rapidRequests.count > 50) {
    blockIP(ip, 'Rapid requests detected', 60 * 60 * 1000); // 1 hour block
    return true;
  }

  // Check for suspicious patterns in user agent
  const userAgent = metadata?.userAgent?.toLowerCase() || '';
  const suspiciousPatterns = [
    'bot',
    'crawler',
    'spider',
    'scraper',
    'curl',
    'wget',
    'python',
    'requests',
  ];

  if (suspiciousPatterns.some((pattern) => userAgent.includes(pattern))) {
    blockIP(ip, 'Suspicious user agent', 24 * 60 * 60 * 1000); // 24 hour block
    return true;
  }

  return false;
};

/**
 * Content-based spam detection
 */
export const detectSpamContent = (
  content: string
): { isSpam: boolean; reason?: string } => {
  const spamIndicators = [
    { pattern: /https?:\/\/[^\s]+/gi, threshold: 3, reason: 'Too many URLs' },
    {
      pattern: /\b\d{10,}\b/g,
      threshold: 2,
      reason: 'Suspicious phone numbers',
    },
    { pattern: /(.)\1{10,}/g, threshold: 1, reason: 'Repeated characters' },
    { pattern: /[A-Z]{20,}/g, threshold: 1, reason: 'Excessive caps' },
    {
      pattern:
        /\b(buy|sell|cheap|free|money|cash|prize|winner|congratulations)\b/gi,
      threshold: 5,
      reason: 'Spam keywords',
    },
  ];

  for (const indicator of spamIndicators) {
    const matches = content.match(indicator.pattern);
    if (matches && matches.length >= indicator.threshold) {
      return { isSpam: true, reason: indicator.reason };
    }
  }

  return { isSpam: false };
};

/**
 * Honeypot field validation
 */
export const validateHoneypot = (honeypotValue: string): boolean => {
  // Honeypot field should be empty (hidden from real users, filled by bots)
  return honeypotValue === '' || honeypotValue === undefined;
};

/**
 * Time-based validation (prevent too-fast form submissions)
 */
export const validateSubmissionTiming = (
  startTime: number,
  minTimeMs: number = 3000
): boolean => {
  const submissionTime = Date.now() - startTime;
  return submissionTime >= minTimeMs;
};

/**
 * CSRF token validation
 */
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const validateCSRFToken = (
  token: string,
  sessionToken: string
): boolean => {
  return token === sessionToken && token.length > 10;
};

/**
 * Request signature validation
 */
export const generateRequestSignature = (
  data: string,
  timestamp: number,
  secret: string
): string => {
  const crypto = require('crypto');
  const payload = `${data}:${timestamp}`;
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
};

export const validateRequestSignature = (
  data: string,
  timestamp: number,
  signature: string,
  secret: string,
  maxAgeMs: number = 5 * 60 * 1000 // 5 minutes
): boolean => {
  // Check timestamp
  if (Date.now() - timestamp > maxAgeMs) {
    return false;
  }

  // Verify signature
  const expectedSignature = generateRequestSignature(data, timestamp, secret);
  return signature === expectedSignature;
};
