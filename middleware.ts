import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './src/i18n';

// Create the internationalization middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Only add locale prefix when not default
});

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/petitions/create',
  '/profile',
  '/admin',
  '/moderator',
];

// Define admin-only routes
const adminRoutes = ['/admin'];

// Define moderator routes (accessible by moderators and admins)
const moderatorRoutes = ['/moderator', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // First, handle internationalization
  const intlResponse = intlMiddleware(request);

  // Extract locale from pathname or use default
  const locale = pathname.split('/')[1];
  const isValidLocale = locales.includes(locale as any);
  const pathWithoutLocale = isValidLocale ? pathname.slice(3) : pathname; // Remove /ar or /fr

  // Check if the current path is protected (without locale prefix)
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // Check if the current path is admin-only (without locale prefix)
  const isAdminRoute = adminRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // Check if the current path is moderator route (without locale prefix)
  const isModeratorRoute = moderatorRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // Get authentication token from cookies
  const authToken = request.cookies.get('auth-token')?.value;
  const userRole = request.cookies.get('user-role')?.value;

  // If accessing protected route without auth token, redirect to login
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL(
      `${isValidLocale ? `/${locale}` : ''}/auth/login`,
      request.url
    );
    loginUrl.searchParams.set('redirect', pathWithoutLocale);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing admin route without admin role, redirect to dashboard
  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.redirect(
      new URL(`${isValidLocale ? `/${locale}` : ''}/dashboard`, request.url)
    );
  }

  // If accessing moderator route without moderator or admin role, redirect to dashboard
  if (isModeratorRoute && !['moderator', 'admin'].includes(userRole || '')) {
    return NextResponse.redirect(
      new URL(`${isValidLocale ? `/${locale}` : ''}/dashboard`, request.url)
    );
  }

  // If authenticated user tries to access auth pages, redirect to dashboard
  if (authToken && pathWithoutLocale.startsWith('/auth/')) {
    const redirectUrl =
      request.nextUrl.searchParams.get('redirect') || '/dashboard';
    return NextResponse.redirect(
      new URL(`${isValidLocale ? `/${locale}` : ''}${redirectUrl}`, request.url)
    );
  }

  // Return the internationalization response
  return intlResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - sw.js (service worker)
     * - workbox (service worker files)
     * - firebase-messaging-sw.js (Firebase service worker)
     * - public folder files (icons, images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox|firebase-messaging-sw.js|icon-.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg|.*\\.png|.*\\.gif|public).*)',
  ],
};
