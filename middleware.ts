import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 100;
const RATE_WINDOW = 60 * 1000;

// Routes that bypass coming soon
const BYPASS_PATHS = [
  '/coming-soon',
  '/maintenance',
  '/admin',
  '/auth',
  '/api',
  '/_next',
  '/favicon',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- COMING SOON MODE ---
  const isComingSoon = true; // Change to false to launch

  if (isComingSoon) {
    const isBypassed = BYPASS_PATHS.some((p) => pathname.startsWith(p));
    if (!isBypassed) {
      const url = request.nextUrl.clone();
      url.pathname = '/coming-soon';
      const response = NextResponse.rewrite(url);
      response.headers.set(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate',
      );
      response.headers.set('x-coming-soon', 'true');
      return response;
    }
  }

  // --- MAINTENANCE MODE ---
  // Set MAINTENANCE_MODE=true in Vercel env vars to enable emergency maintenance
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true';

  if (isMaintenance) {
    const isBypassed = BYPASS_PATHS.some((p) => pathname.startsWith(p));
    if (!isBypassed) {
      const url = request.nextUrl.clone();
      url.pathname = '/maintenance';
      const response = NextResponse.rewrite(url);
      response.headers.set(
        'Cache-Control',
        'no-store, no-cache, must-revalidate',
      );
      return response;
    }
  }

  // --- RATE LIMITING ---
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();

  const rateLimit = rateLimitMap.get(ip);

  if (!rateLimit || now > rateLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
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
