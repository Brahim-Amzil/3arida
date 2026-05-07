import { assertTrustedExternalUrl } from '@/lib/external-url-validation';

type VerifyRecaptchaOptions = {
  minScore?: number;
  expectedAction?: string;
};

type VerifyRecaptchaResult = {
  success: boolean;
  score?: number;
  error?: string;
};

export async function verifyRecaptchaServerToken(
  token: string,
  options: VerifyRecaptchaOptions = {},
): Promise<VerifyRecaptchaResult> {
  const { minScore = 0.5, expectedAction } = options;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    return { success: false, error: 'reCAPTCHA server key is not configured' };
  }

  if (!token?.trim()) {
    return { success: false, error: 'Missing reCAPTCHA token' };
  }

  const verifyUrl = assertTrustedExternalUrl(
    'https://www.google.com/recaptcha/api/siteverify',
    ['www.google.com'],
  );

  const requestBody = new URLSearchParams({
    secret: secretKey,
    response: token.trim(),
  });

  const response = await fetch(verifyUrl.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: requestBody.toString(),
  });

  if (!response.ok) {
    return {
      success: false,
      error: `reCAPTCHA provider error (${response.status})`,
    };
  }

  const data = await response.json();
  const score = typeof data?.score === 'number' ? data.score : undefined;
  const action = typeof data?.action === 'string' ? data.action : undefined;

  if (!data?.success) {
    return { success: false, score, error: 'reCAPTCHA verification failed' };
  }

  if (typeof score === 'number' && score < minScore) {
    return { success: false, score, error: 'reCAPTCHA score too low' };
  }

  if (expectedAction && action && action !== expectedAction) {
    return { success: false, score, error: 'reCAPTCHA action mismatch' };
  }

  return { success: true, score };
}
