/** Production domain used in QR codes, PDFs, emails, and share links. */
export const CANONICAL_SITE_URL = 'https://3arida.org';

/**
 * Canonical public site URL for emails, PDFs, and share links.
 * Ignores localhost and *.vercel.app so staging env does not leak into user-facing URLs.
 */
export function getPublicAppUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
  ];

  for (const raw of candidates) {
    const normalized = normalizeAppUrl(raw);
    if (normalized && isProductionSiteUrl(normalized)) {
      return normalized;
    }
  }

  return CANONICAL_SITE_URL;
}

function normalizeAppUrl(value?: string): string | null {
  if (!value?.trim()) {
    return null;
  }
  return value.trim().replace(/\/$/, '');
}

function isLocalDevUrl(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
}

function isProductionSiteUrl(url: string): boolean {
  if (isLocalDevUrl(url) || /\.vercel\.app/i.test(url)) {
    return false;
  }
  try {
    return /(^|\.)3arida\.org$/i.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

/** Inline styles for email CTA buttons (many clients ignore class-based link colors). */
export const emailButtonInlineStyle =
  'display:inline-block;background-color:#ffffff;color:#1e3a8a !important;border:2px solid #667eea;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:700;font-family:Cairo,Arial,sans-serif;';
