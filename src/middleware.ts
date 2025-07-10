import arcjet, { detectBot } from '@arcjet/next';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './libs/i18nRouting';

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = (pathname: string): boolean => {
  return pathname.startsWith('/numerology') || pathname === '/' || pathname.startsWith('/ranking');
};

const isAuthPage = (pathname: string): boolean => {
  return pathname.startsWith('/login') || pathname.startsWith('/verify-email') || pathname.startsWith('/verified') || pathname.startsWith('/kyc');
};

const isWelcomePage = (pathname: string): boolean => {
  return pathname.startsWith('/welcome')
    || pathname.startsWith('/introduction')
    || pathname.startsWith('/policy-terms');
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

  // Check wallet authentication
  const authDataCookie = request.cookies.get('authData');
  const isAuthenticated = authDataCookie ? JSON.parse(authDataCookie.value)?.user.isKyc : undefined;

  // Create a new request with custom headers
  const requestWithHeaders = new NextRequest(request.url, {
    ...request,
    headers: requestHeaders,
  });

  // Verify the request with Arcjet
  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // Handle authentication logic
  if (isProtectedRoute(pathname)) {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from auth/welcome pages
  if (((isAuthPage(pathname)) && isAuthenticated) || (isWelcomePage(pathname) && isAuthenticated)) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
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
