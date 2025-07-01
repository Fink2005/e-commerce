'use server';

import { cookies } from 'next/headers';

export async function createCookie({ name, value }: { name: string; value: string }) {
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

export async function cookieExists(name: string) {
  const cookieStore = await cookies();
  return cookieStore.has(name);
}

export async function getCookie(name: string) {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value || '';
}

export async function deleteCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}
