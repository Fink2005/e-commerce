import { decodeToken } from '@/libs/utils';
import arcjet, { detectBot } from '@arcjet/next';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './libs/i18nRouting';

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = (pathname: string): boolean => {
  return pathname.startsWith('/checkout')
    || pathname === '/customize-package'
    || pathname.startsWith('/profile');
};

const isAdminRoute = (pathname: string): boolean => {
  return pathname.startsWith('/admin');
};

const isAuthPage = (pathname: string): boolean => {
  return pathname.startsWith('/login')
    || pathname.startsWith('/verify-email')
    || pathname.startsWith('/forgot-password')
    || pathname.startsWith('/register')
    || pathname.startsWith('/reset-password');
};

// Arcjet security setup
const aj = arcjet({
  key: process.env.NEXT_PUBLIC_ARCJET_KEY!,
  rules: [
    detectBot({
      mode: 'LIVE',
      allow: [
        'CATEGORY:SEARCH_ENGINE',
        'CATEGORY:PREVIEW',
        'CATEGORY:MONITOR',
      ],
    }),
  ],
});

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameAndSearchParams = pathname + request.nextUrl.search;

  // Skip middleware for request routes
  if (pathname.startsWith('/request') || pathname === '/refresh-token') {
    return NextResponse.next();
  }

  // Set custom header with pathname
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  const requestWithHeaders = new NextRequest(request.url, {
    ...request,
    headers: requestHeaders,
  });

  // Arcjet protection
  if (process.env.NEXT_PUBLIC_ARCJET_KEY) {
    try {
      const decision = await aj.protect(request);
      if (decision.isDenied()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } catch (error) {
      console.error('❌ Arcjet error:', error);
      return NextResponse.json({ error: 'Internal Error (Arcjet)' }, { status: 500 });
    }
  }

  // Get tokens
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // Determine authentication status
  let userRole: string | null = null;
  let isTokenExpired = false;
  const now = Math.round(new Date().getTime() / 1000);

  if (accessToken) {
    try {
      const decoded = decodeToken(accessToken);
      isTokenExpired = decoded.exp < now;

      if (!isTokenExpired) {
        userRole = decoded?.role || null;
      }
    } catch (error) {
      console.error('❌ Failed to decode access token:', error);
      isTokenExpired = true;
    }
  }

  const isAuthenticated = !!userRole;

  // Route protection logic
  if (isProtectedRoute(pathname)) {
    // Redirect unauthenticated users to login
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathnameAndSearchParams);
      return NextResponse.redirect(loginUrl);
    }

    // Handle token refresh for protected routes
    if (isTokenExpired && refreshToken) {
      const refreshUrl = new URL('/refresh-token', request.url);
      refreshUrl.searchParams.set('refreshToken', refreshToken);
      refreshUrl.searchParams.set('redirect', pathnameAndSearchParams);
      return NextResponse.redirect(refreshUrl);
    }
  }

  if (isAdminRoute(pathname)) {
    // Admin routes require authentication and admin role
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathnameAndSearchParams);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== 'ADMIN') {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // Redirect authenticated users away from auth pages (but respect redirect parameter)
  if (isAuthPage(pathname) && isAuthenticated) {
    const redirectParam = request.nextUrl.searchParams.get('redirect');

    if (redirectParam) {
      // If there's a redirect parameter, redirect to that destination
      const redirectUrl = new URL(redirectParam, request.url);
      return NextResponse.redirect(redirectUrl);
    } else {
      // If no redirect parameter, go to home page
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // Apply i18n routing
  return handleI18nRouting(requestWithHeaders);
}

// Middleware matcher
export const config = {
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
