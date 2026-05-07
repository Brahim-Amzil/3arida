import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 100;
const RATE_WINDOW = 60 * 1000;

const TEST_BYPASS_PATH = '/bsk';
const TEST_BYPASS_COOKIE = 'bsk_access';

const COMMON_BYPASS_PATHS = [
  '/coming-soon',
  '/maintenance',
  '/_next',
  '/favicon',
  '/.well-known',
];

const MAINTENANCE_BYPASS_PATHS = [
  ...COMMON_BYPASS_PATHS,
  '/api/health',
  '/api/stripe/webhook',
  '/api/paypal/webhook',
  '/api/whatsapp/webhook',
];

// Coming-soon allows manual tester bypass via /bsk.
const COMING_SOON_BYPASS_PATHS = [
  ...MAINTENANCE_BYPASS_PATHS,
  TEST_BYPASS_PATH,
];

function applyNoCacheHeaders(response: NextResponse) {
  response.headers.set(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
  );
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  response.headers.set('Surrogate-Control', 'no-store');
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Private tester bypass entrypoint: visiting /bsk grants temporary access.
  if (
    pathname === TEST_BYPASS_PATH ||
    pathname.startsWith(`${TEST_BYPASS_PATH}/`)
  ) {
    const targetPath =
      pathname === TEST_BYPASS_PATH
        ? '/'
        : pathname.slice(TEST_BYPASS_PATH.length);
    const url = request.nextUrl.clone();
    url.pathname = targetPath || '/';

    const response = NextResponse.redirect(url);
    response.cookies.set(TEST_BYPASS_COOKIE, '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  }

  const hasTesterBypass = request.cookies.get(TEST_BYPASS_COOKIE)?.value === '1';

  // --- MAINTENANCE MODE ---
  // Set MAINTENANCE_MODE=true in Vercel env vars to enable emergency maintenance
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true';

  if (isMaintenance) {
    const isBypassed = MAINTENANCE_BYPASS_PATHS.some((p) =>
      pathname.startsWith(p),
    );
    if (!isBypassed) {
      const url = request.nextUrl.clone();
      url.pathname = '/maintenance';
      const response = NextResponse.rewrite(url);
      applyNoCacheHeaders(response);
      response.headers.set('x-maintenance-mode', 'true');
      return response;
    }
  }

  // --- COMING SOON MODE ---
  const isComingSoon = process.env.COMING_SOON_MODE === 'true';

  if (isComingSoon) {
    const isBypassed =
      hasTesterBypass ||
      COMING_SOON_BYPASS_PATHS.some((p) => pathname.startsWith(p));
    if (!isBypassed) {
      const url = request.nextUrl.clone();
      url.pathname = '/coming-soon';
      const response = NextResponse.rewrite(url);
      applyNoCacheHeaders(response);
      response.headers.set('x-coming-soon', 'true');
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
