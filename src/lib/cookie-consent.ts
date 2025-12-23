export interface CookieConsent {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  timestamp: string;
}

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null;

  const consent = localStorage.getItem('cookie-consent');
  if (!consent) return null;

  try {
    return JSON.parse(consent);
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent(): boolean {
  const consent = getCookieConsent();
  return consent?.analytics ?? false;
}

export function hasFunctionalConsent(): boolean {
  const consent = getCookieConsent();
  return consent?.functional ?? false;
}

export function clearCookieConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('cookie-consent');
}
