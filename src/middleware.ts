import arcjet, { detectBot } from '@arcjet/next';
import { jwtDecode } from 'jwt-decode';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import authRequests from './app/apis/requests/auth';
import { routing } from './libs/i18nRouting';

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = (pathname: string): boolean => {
  return pathname.startsWith('/profile')
    || pathname.startsWith('/account')
    || pathname.startsWith('/orders')
    || pathname.startsWith('/wishlist')
    || pathname.startsWith('/dashboard')
    || pathname.startsWith('/customize-package');
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
    || pathname.startsWith('/product/');
};

const isCheckoutRoute = (pathname: string): boolean => {
  return pathname.startsWith('/checkout')
    || pathname.startsWith('/payment')
    || pathname.startsWith('/cart/checkout');
};

// Check if token is expired (server-side)
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = 30; // 30 seconds buffer to account for network delays

    return decoded.exp <= (currentTime + bufferTime);
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

// Improve security with Arcjet
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
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

  // Skip middleware for specific paths
  if (pathname.startsWith('/request')) {
    return NextResponse.next();
  }

  // Add pathname to headers for recognition
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  interface AccessTokenPayload {
    role?: string;
    isVerified?: boolean;
    exp?: number;
    [key: string]: any;
  }

  // Get tokens from cookies
  const accessTokenCookie = request.cookies.get('access_token');
  const refreshTokenCookie = request.cookies.get('refresh_token');

  let decodedToken: AccessTokenPayload | null = null;
  let isAccessTokenValid = false;

  // Check access token validity
  if (accessTokenCookie) {
    try {
      decodedToken = jwtDecode<AccessTokenPayload>(accessTokenCookie.value);
      isAccessTokenValid = !isTokenExpired(accessTokenCookie.value);
    } catch (error) {
      console.error('Error decoding access token:', error);
      isAccessTokenValid = false;
    }
  }

  // Check refresh token validity
  let isRefreshTokenValid = false;
  if (refreshTokenCookie) {
    try {
      isRefreshTokenValid = !isTokenExpired(refreshTokenCookie.value);
    } catch (error) {
      console.error('Error decoding refresh token:', error);
      isRefreshTokenValid = false;
    }
  }

  const isAuthenticated = decodedToken && isAccessTokenValid;
  const userRole = decodedToken?.role;
  const isEmailConfirmed = decodedToken?.isVerified;

  // Create request with custom headers
  const requestWithHeaders = new NextRequest(request.url, {
    ...request,
    headers: requestHeaders,
  });

  // Verify with Arcjet (for all routes)
  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(request);
    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // Allow all public routes without authentication
  if (isPublicRoute(pathname)) {
    return handleI18nRouting(requestWithHeaders);
  }

  // 🔑 KEY LOGIC: Handle token refresh for protected routes
  const requiresAuth = isProtectedRoute(pathname) || isAdminRoute(pathname) || isCheckoutRoute(pathname);

  if (requiresAuth && !isAuthenticated) {
    // Handle token refresh if we have a valid refresh token
    if ((!accessTokenCookie || !isAccessTokenValid) && refreshTokenCookie && isRefreshTokenValid) {
      try {
        const response = await authRequests.refreshToken(refreshTokenCookie.value);

        if (response?.accessToken && response?.refreshToken) {
          // Create response to continue to the original request
          const res = NextResponse.redirect(request.url);

          // Set the new tokens as cookies
          res.cookies.set('access_token', response.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
          });

          res.cookies.set('refresh_token', response.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
          });

          return res;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }

    // If refresh failed or no valid refresh token, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('error', 'session_expired');
    return NextResponse.redirect(loginUrl);
  }

  // Handle admin route protection
  if (isAdminRoute(pathname)) {
    if (!isAuthenticated || userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url));
    }
  }

  // Handle checkout routes
  if (isCheckoutRoute(pathname)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(pathname)}&action=checkout`, request.url));
    }

    if (!isEmailConfirmed) {
      return NextResponse.redirect(new URL(`/verify-email?redirect=${encodeURIComponent(pathname)}`, request.url));
    }
  }

  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url));
    }

    if (!isEmailConfirmed) {
      return NextResponse.redirect(new URL(`/verify-email?redirect=${encodeURIComponent(pathname)}`, request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage(pathname) && isAuthenticated) {
    const redirectParam = request.nextUrl.searchParams.get('redirect');

    if (redirectParam) {
      if (isEmailConfirmed) {
        return NextResponse.redirect(new URL(redirectParam, request.url));
      }
      if (!isEmailConfirmed && pathname.startsWith('/verify-email')) {
        return handleI18nRouting(requestWithHeaders);
      }
    }

    if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (!isEmailConfirmed && pathname.startsWith('/verify-email')) {
      return handleI18nRouting(requestWithHeaders);
    }

    if (isEmailConfirmed) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Redirect authenticated users away from welcome pages
  if (isWelcomePage(pathname) && isAuthenticated) {
    if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Apply i18n routing
  return handleI18nRouting(requestWithHeaders);
}

export const config = {
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
