'use server';

import { cookies } from 'next/headers';

export async function createCookie({ name, value, maxAge }: { name: string; value: any; maxAge: number }) {
  const cookieStore = await cookies();
  cookieStore.set({
    name,
    value,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    ...(maxAge && { maxAge }),
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
