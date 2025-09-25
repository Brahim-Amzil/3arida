import { NextRequest, NextResponse } from 'next/server';

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

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current path is admin-only
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Check if the current path is moderator route
  const isModeratorRoute = moderatorRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Get authentication token from cookies
  const authToken = request.cookies.get('auth-token')?.value;
  const userRole = request.cookies.get('user-role')?.value;

  // If accessing protected route without auth token, redirect to login
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing admin route without admin role, redirect to dashboard
  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If accessing moderator route without moderator or admin role, redirect to dashboard
  if (isModeratorRoute && !['moderator', 'admin'].includes(userRole || '')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If authenticated user tries to access auth pages, redirect to dashboard
  if (authToken && pathname.startsWith('/auth/')) {
    const redirectUrl =
      request.nextUrl.searchParams.get('redirect') || '/dashboard';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
