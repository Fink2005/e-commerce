'use server';

import { cookies } from 'next/headers';

export async function createCookie({ name, value }: { name: string; value: any }) {
  const cookieStore = await cookies();
  cookieStore.set({
    name,
    value,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
}

export async function createAuthCookies(authData: {
  user: any;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}) {
  const cookieStore = await cookies();

  // Store user data and access token
  cookieStore.set({
    name: 'authData',
    value: JSON.stringify({
      user: authData.user,
      accessToken: authData.accessToken,
    }),
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: authData.expiresIn,
  });

  // Store refresh token separately with longer expiration
  cookieStore.set({
    name: 'refreshToken',
    value: authData.refreshToken,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

export async function cookieExists(name: string) {
  const cookieStore = await cookies();
  return cookieStore.has(name);
}

export async function getCookie(name: string) {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value || undefined;
}

export async function deleteCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('authData');
  cookieStore.delete('refreshToken');
}
