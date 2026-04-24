import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 100; // requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute

// Routes that bypass coming soon (admin access)
const BYPASS_PATHS = [
  '/coming-soon',
  '/admin',
  '/auth',
  '/api',
  '/_next',
  '/favicon',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- COMING SOON MODE ---
  // Set COMING_SOON=true in Vercel env vars to enable (server-side only, no NEXT_PUBLIC_ prefix)
  const isComingSoon = process.env.COMING_SOON === 'true';

  if (isComingSoon) {
    const isBypassed = BYPASS_PATHS.some((p) => pathname.startsWith(p));
    if (!isBypassed) {
      return NextResponse.redirect(new URL('/coming-soon', request.url));
    }
  }

  // --- RATE LIMITING ---
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();

  const rateLimit = rateLimitMap.get(ip);

  if (!rateLimit || now > rateLimit.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_WINDOW,
    });
  } else {
    rateLimit.count++;

    if (rateLimit.count > RATE_LIMIT) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimit.resetTime - now) / 1000)),
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)',
  ],
};
