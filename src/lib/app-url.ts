/**
 * Canonical public site URL for emails, PDFs, and share links.
 * Ignores localhost values in production so misconfigured env does not leak into user emails.
 */
export function getPublicAppUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
  ];

  for (const raw of candidates) {
    const normalized = normalizeAppUrl(raw);
    if (normalized && !isLocalDevUrl(normalized)) {
      return normalized;
    }
  }

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    const host = vercelHost.replace(/^https?:\/\//, '');
    return `https://${host}`;
  }

  return 'https://www.3arida.org';
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

/** Inline styles for email CTA buttons (many clients ignore class-based link colors). */
export const emailButtonInlineStyle =
  'display:inline-block;background-color:#ffffff;color:#1e3a8a !important;border:2px solid #667eea;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:700;font-family:Cairo,Arial,sans-serif;';
