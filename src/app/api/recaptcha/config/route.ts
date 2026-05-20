import { NextResponse } from 'next/server';

function getRecaptchaSiteKey() {
  return (
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
    process.env.RECAPTCHA_SITE_KEY ||
    ''
  ).trim();
}

export async function GET() {
  const siteKey = getRecaptchaSiteKey();
  const hasSecret = Boolean(process.env.RECAPTCHA_SECRET_KEY?.trim());

  return NextResponse.json({
    configured: Boolean(siteKey && hasSecret),
    siteKey: siteKey || null,
    hasSiteKey: Boolean(siteKey),
    hasSecret,
  });
}
