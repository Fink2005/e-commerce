import arcjet, { detectBot } from '@arcjet/next';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './libs/i18nRouting';

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = (pathname: string): boolean => {
  return pathname.startsWith('/profile')
    || pathname.startsWith('/account')
    || pathname.startsWith('/orders')
    || pathname.startsWith('/wishlist')
    || pathname.startsWith('/dashboard');
};

const isAdminRoute = (pathname: string): boolean => {
  return pathname.startsWith('/admin');
};

const isAuthPage = (pathname: string): boolean => {
  return pathname.startsWith('/login')
    || pathname.startsWith('/register')
    || pathname.startsWith('/verify-email')
    || pathname.startsWith('/forgot-password');
};

const isWelcomePage = (pathname: string): boolean => {
  return pathname.startsWith('/welcome')
    || pathname.startsWith('/introduction')
    || pathname.startsWith('/policy-terms');
};

const isPublicRoute = (pathname: string): boolean => {
  return pathname === '/'
    || pathname.startsWith('/products')
    || pathname.startsWith('/product/'); // Individual product pages
};

// Routes that require authentication before proceeding (like checkout)
const isCheckoutRoute = (pathname: string): boolean => {
  return pathname.startsWith('/checkout')
    || pathname.startsWith('/payment')
    || pathname.startsWith('/cart/checkout');
};

// Improve security with Arcjet
const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Use environment variable directly
  rules: [
    detectBot({
      mode: 'LIVE',
      // Block all bots except the following
      allow: [
        // See https://docs.arcjet.com/bot-protection/identifying-bots
        'CATEGORY:SEARCH_ENGINE', // Allow search engines
        'CATEGORY:PREVIEW', // Allow preview links to show OG images
        'CATEGORY:MONITOR', // Allow uptime monitoring services
      ],
    }),
  ],
});

export default async function middleware(
  request: NextRequest,
) {
  const pathname = request.nextUrl.pathname;

  // Add pathname to headers for recognition
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // Get user info from cookie (for middleware decisions)
  const userInfoCookie = request.cookies.get('userInfo');
  const accessTokenCookie = request.cookies.get('access_token');

  // Get authentication data from cookies (set by backend)
  const isAuthenticated = !!accessTokenCookie;
  let userRole = null;
  let isEmailConfirmed = false;
  let userEmail = '';

  if (userInfoCookie) {
    try {
      const userInfo = JSON.parse(userInfoCookie.value);
      userRole = userInfo.role;
      isEmailConfirmed = userInfo.isEmailConfirmed;
      userEmail = userInfo.email;
    } catch (error) {
      console.error('Error parsing userInfo cookie:', error);
    }
  }

  // Create a new request with custom headers
  const requestWithHeaders = new NextRequest(request.url, {
    ...request,
    headers: requestHeaders,
  });

  // Verify the request with Arcjet (for all routes)
  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  if (pathname.startsWith('/login')) {
    if (!isAuthenticated) {
      // No valid session, redirect to login
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect based on role and email confirmation (your original logic)
    if (userRole === 'ADMIN') {
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    } else if (!isEmailConfirmed) {
      const verifyUrl = new URL(`/verify-email?email=${encodeURIComponent(userEmail)}`, request.url);
      return NextResponse.redirect(verifyUrl);
    } else {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // Allow all public routes without authentication (like Amazon/Shopee)
  if (isPublicRoute(pathname)) {
    return handleI18nRouting(requestWithHeaders);
  }

  // Handle admin route protection
  if (isAdminRoute(pathname)) {
    if (!isAuthenticated || userRole !== 'ADMIN') {
      const loginUrl = new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle checkout routes - require authentication but show login prompt
  if (isCheckoutRoute(pathname)) {
    if (!isAuthenticated) {
      // Redirect to login with return URL for checkout
      const loginUrl = new URL(`/login?redirect=${encodeURIComponent(pathname)}&action=checkout`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Check email confirmation for checkout
    if (!isEmailConfirmed) {
      const verifyUrl = new URL(`/verify-email?redirect=${encodeURIComponent(pathname)}`, request.url);
      return NextResponse.redirect(verifyUrl);
    }
  }

  // Handle protected routes (user account features)
  if (isProtectedRoute(pathname)) {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      const loginUrl = new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Check if email is confirmed for account features
    if (!isEmailConfirmed) {
      const verifyUrl = new URL(`/verify-email?redirect=${encodeURIComponent(pathname)}`, request.url);
      return NextResponse.redirect(verifyUrl);
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage(pathname) && isAuthenticated) {
    // Check for redirect parameter first
    const redirectParam = request.nextUrl.searchParams.get('redirect');

    if (redirectParam) {
      // If email confirmed, go to original destination
      if (isEmailConfirmed) {
        const redirectUrl = new URL(redirectParam, request.url);
        return NextResponse.redirect(redirectUrl);
      }
      // If email not confirmed and trying to access verify-email, allow it
      if (!isEmailConfirmed && pathname.startsWith('/verify-email')) {
        return handleI18nRouting(requestWithHeaders);
      }
    }

    // Default redirects for authenticated users on auth pages
    if (userRole === 'ADMIN') {
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }

    // If email not confirmed, allow access to verify-email page
    if (!isEmailConfirmed && pathname.startsWith('/verify-email')) {
      return handleI18nRouting(requestWithHeaders);
    }

    // If email is confirmed, redirect to home
    if (isEmailConfirmed) {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // Redirect authenticated users away from welcome pages
  if (isWelcomePage(pathname) && isAuthenticated) {
    if (userRole === 'ADMIN') {
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    } else {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // Apply i18n routing
  return handleI18nRouting(requestWithHeaders);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
