import { detectSpamContent } from './rate-limiting';

// Profanity filter for Arabic, French, and English
const PROFANITY_WORDS = [
  // English profanity (basic list)
  'spam',
  'scam',
  'fake',
  'fraud',
  'cheat',
  'lie',
  'liar',

  // French profanity (basic list)
  'arnaque',
  'faux',
  'mensonge',
  'menteur',
  'trompeur',

  // Arabic profanity (basic list - add more as needed)
  'كذب',
  'خداع',
  'احتيال',
  'نصب',

  // Common spam terms
  'click here',
  'free money',
  'get rich',
  'make money fast',
  'buy now',
  'limited time',
  'act now',
  'urgent',
];

// Suspicious patterns that might indicate spam or abuse
const SUSPICIOUS_PATTERNS = [
  /https?:\/\/[^\s]+/gi, // URLs
  /\b\d{10,}\b/g, // Long numbers (potential phone numbers)
  /(.)\1{5,}/g, // Repeated characters (5 or more)
  /[A-Z]{10,}/g, // Long sequences of capital letters
  /\b(buy|sell|cheap|free|money|cash|prize|winner|congratulations)\b/gi, // Spam keywords
  /\b(viagra|cialis|pharmacy|pills|medication)\b/gi, // Pharmaceutical spam
  /\b(casino|gambling|poker|lottery|jackpot)\b/gi, // Gambling spam
];

// Hate speech and offensive content patterns
const HATE_SPEECH_PATTERNS = [
  // Add patterns for hate speech detection
  // This should be comprehensive and regularly updated
];

export interface ModerationResult {
  approved: boolean;
  confidence: number;
  reasons: string[];
  suggestions?: string[];
}

export interface ModerationOptions {
  checkProfanity?: boolean;
  checkSpam?: boolean;
  checkHateSpeech?: boolean;
  strictMode?: boolean;
  language?: 'ar' | 'fr' | 'en' | 'auto';
}

/**
 * Moderate text content for profanity, spam, and other issues
 */
export const moderateContent = (
  content: string,
  options: ModerationOptions = {}
): ModerationResult => {
  const {
    checkProfanity = true,
    checkSpam = true,
    checkHateSpeech = true,
    strictMode = false,
    language = 'auto',
  } = options;

  const reasons: string[] = [];
  let confidence = 1.0;

  // Normalize content for analysis
  const normalizedContent = content.toLowerCase().trim();

  // Check for profanity
  if (checkProfanity) {
    const profanityResult = checkForProfanity(normalizedContent);
    if (profanityResult.found) {
      reasons.push(
        `Contains inappropriate language: ${profanityResult.words.join(', ')}`
      );
      confidence -= 0.3;
    }
  }

  // Check for spam
  if (checkSpam) {
    const spamResult = detectSpamContent(content);
    if (spamResult.isSpam) {
      reasons.push(`Detected as spam: ${spamResult.reason}`);
      confidence -= 0.4;
    }

    // Additional spam checks
    const suspiciousResult = checkSuspiciousPatterns(content);
    if (suspiciousResult.found) {
      reasons.push(
        `Contains suspicious patterns: ${suspiciousResult.patterns.join(', ')}`
      );
      confidence -= 0.2;
    }
  }

  // Check for hate speech
  if (checkHateSpeech) {
    const hateSpeechResult = checkForHateSpeech(normalizedContent);
    if (hateSpeechResult.found) {
      reasons.push(`Contains hate speech or offensive content`);
      confidence -= 0.5;
    }
  }

  // Additional checks for strict mode
  if (strictMode) {
    // Check for excessive capitalization
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (capsRatio > 0.5 && content.length > 20) {
      reasons.push('Excessive use of capital letters');
      confidence -= 0.1;
    }

    // Check for excessive punctuation
    const punctuationRatio =
      (content.match(/[!?.,;:]/g) || []).length / content.length;
    if (punctuationRatio > 0.2) {
      reasons.push('Excessive punctuation');
      confidence -= 0.1;
    }
  }

  // Determine approval based on confidence threshold
  const approved = confidence >= (strictMode ? 0.8 : 0.6);

  return {
    approved,
    confidence: Math.max(0, confidence),
    reasons,
    suggestions: approved ? undefined : generateSuggestions(reasons),
  };
};

/**
 * Check for profanity in content
 */
const checkForProfanity = (
  content: string
): { found: boolean; words: string[] } => {
  const foundWords: string[] = [];

  for (const word of PROFANITY_WORDS) {
    if (content.includes(word.toLowerCase())) {
      foundWords.push(word);
    }
  }

  return {
    found: foundWords.length > 0,
    words: foundWords,
  };
};

/**
 * Check for suspicious patterns
 */
const checkSuspiciousPatterns = (
  content: string
): { found: boolean; patterns: string[] } => {
  const foundPatterns: string[] = [];

  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(content)) {
      foundPatterns.push(pattern.source);
    }
  }

  return {
    found: foundPatterns.length > 0,
    patterns: foundPatterns,
  };
};

/**
 * Check for hate speech
 */
const checkForHateSpeech = (
  content: string
): { found: boolean; patterns: string[] } => {
  const foundPatterns: string[] = [];

  for (const pattern of HATE_SPEECH_PATTERNS) {
    if (pattern.test(content)) {
      foundPatterns.push(pattern.source);
    }
  }

  return {
    found: foundPatterns.length > 0,
    patterns: foundPatterns,
  };
};

/**
 * Generate suggestions for improving content
 */
const generateSuggestions = (reasons: string[]): string[] => {
  const suggestions: string[] = [];

  if (reasons.some((r) => r.includes('inappropriate language'))) {
    suggestions.push(
      'Please remove inappropriate language and use respectful terms'
    );
  }

  if (reasons.some((r) => r.includes('spam'))) {
    suggestions.push(
      'Please remove promotional content, URLs, and phone numbers'
    );
  }

  if (reasons.some((r) => r.includes('hate speech'))) {
    suggestions.push(
      'Please ensure your content is respectful and does not target any group'
    );
  }

  if (reasons.some((r) => r.includes('capital letters'))) {
    suggestions.push('Please use normal capitalization instead of ALL CAPS');
  }

  if (reasons.some((r) => r.includes('punctuation'))) {
    suggestions.push('Please reduce excessive punctuation marks');
  }

  return suggestions;
};

/**
 * Clean content by removing or replacing problematic elements
 */
export const cleanContent = (content: string): string => {
  let cleaned = content;

  // Remove URLs
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/gi, '[URL removed]');

  // Remove long numbers (potential phone numbers)
  cleaned = cleaned.replace(/\b\d{10,}\b/g, '[number removed]');

  // Normalize excessive punctuation
  cleaned = cleaned.replace(/[!]{3,}/g, '!!!');
  cleaned = cleaned.replace(/[?]{3,}/g, '???');
  cleaned = cleaned.replace(/[.]{4,}/g, '...');

  // Normalize excessive capitalization
  cleaned = cleaned.replace(
    /[A-Z]{5,}/g,
    (match) => match.charAt(0) + match.slice(1).toLowerCase()
  );

  // Remove excessive repeated characters
  cleaned = cleaned.replace(/(.)\1{4,}/g, '$1$1$1');

  // Trim and normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
};

/**
 * Moderate petition content specifically
 */
export const moderatePetition = (
  title: string,
  description: string
): ModerationResult => {
  const titleResult = moderateContent(title, { strictMode: true });
  const descriptionResult = moderateContent(description, { strictMode: false });

  const combinedReasons = [
    ...titleResult.reasons,
    ...descriptionResult.reasons,
  ];
  const combinedConfidence = Math.min(
    titleResult.confidence,
    descriptionResult.confidence
  );

  return {
    approved: titleResult.approved && descriptionResult.approved,
    confidence: combinedConfidence,
    reasons: combinedReasons,
    suggestions:
      combinedReasons.length > 0
        ? generateSuggestions(combinedReasons)
        : undefined,
  };
};

/**
 * Moderate comment content
 */
export const moderateComment = (content: string): ModerationResult => {
  return moderateContent(content, {
    strictMode: false,
    checkProfanity: true,
    checkSpam: true,
    checkHateSpeech: true,
  });
};

/**
 * Auto-moderate content and take action
 */
export const autoModerate = async (
  content: string,
  contentType: 'petition' | 'comment' | 'profile',
  userId: string
): Promise<{ action: 'approve' | 'flag' | 'reject'; reason?: string }> => {
  const result = moderateContent(content, {
    strictMode: contentType === 'petition',
  });

  if (result.confidence >= 0.9) {
    return { action: 'approve' };
  } else if (result.confidence >= 0.5) {
    return {
      action: 'flag',
      reason: `Flagged for manual review: ${result.reasons.join(', ')}`,
    };
  } else {
    return {
      action: 'reject',
      reason: `Rejected: ${result.reasons.join(', ')}`,
    };
  }
};

/**
 * Get content safety score (0-100)
 */
export const getContentSafetyScore = (content: string): number => {
  const result = moderateContent(content);
  return Math.round(result.confidence * 100);
};

/**
 * Check if content needs human review
 */
export const needsHumanReview = (content: string): boolean => {
  const result = moderateContent(content);
  return result.confidence < 0.8 && result.confidence > 0.3;
};
