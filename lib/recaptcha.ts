import env from './env';
import { ApiError } from './errors';

export const validateRecaptcha = async (token?: string) => {
  if (!env.recaptcha.siteKey || !env.recaptcha.secretKey) {
    throw new ApiError(500, 'reCAPTCHA configuration missing');
  }

  if (!token) {
    throw new ApiError(400, 'reCAPTCHA token is required');
  }

  // Use reCAPTCHA v2 API for validation
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      secret: env.recaptcha.secretKey,
      response: token,
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new ApiError(400, 'Invalid captcha. Please try again.');
  }

  // reCAPTCHA validation successful
  return result;
};
