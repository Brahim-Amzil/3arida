// reCAPTCHA v3 helper functions

declare global {
  interface Window {
    grecaptcha: {
      // reCAPTCHA v3 methods
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
      // reCAPTCHA v2 methods
      render: (container: Element, parameters: any) => number;
      reset: (widgetId: number) => void;
      getResponse: (widgetId: number) => string;
    };
  }
}

/**
 * Load reCAPTCHA v3 script
 */
export function loadRecaptchaScript(siteKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.grecaptcha) {
      resolve();
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="recaptcha"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      return;
    }

    // Load script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
    document.head.appendChild(script);
  });
}

/**
 * Execute reCAPTCHA v3 and get token
 */
export async function executeRecaptcha(
  siteKey: string,
  action: string = 'submit'
): Promise<string> {
  try {
    // Ensure script is loaded
    await loadRecaptchaScript(siteKey);

    // Wait for reCAPTCHA to be ready and execute
    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(siteKey, { action });
          resolve(token);
        } catch (error) {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('reCAPTCHA execution error:', error);
    throw error;
  }
}

/**
 * Verify reCAPTCHA token with backend
 */
export async function verifyRecaptchaToken(token: string): Promise<{
  success: boolean;
  score?: number;
  error?: string;
}> {
  try {
    const response = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Token verification error:', error);
    return {
      success: false,
      error: 'Verification request failed',
    };
  }
}
