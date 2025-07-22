import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { devtools } from 'zustand/middleware';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const withDevTools = (fn: any) =>
  process.env.NEXT_PUBLIC_NOVEL_ENV !== 'prod' ? devtools(fn) : fn;

export function generateBookUrl(bookId: number, slug: string) {
  return `/book/${slug}_${bookId}`;
}

export function getBookNameFromUrl(slug: string, isConverted: boolean = false): string {
  const bookName = slug?.split('_')[0];
  if (!bookName) {
    throw new Error(`Slug not contain id. Slug: ${slug}`);
  }
  const convertedBookName = bookName.replace(/-/g, ' ');
  return isConverted ? convertedBookName : bookName;
}

export function getIdFromUrl(slug: string | null | undefined): number {
  if (!slug) {
    throw new Error(`Slug is null or undefined. Slug: ${slug}`);
  }
  const match = (Array.isArray(slug) ? slug[0] : slug).match(/_(\d+)$/);
  const chapterId = match ? Number(match[1]) : null;

  if (!chapterId) {
    throw new Error(`Slug does not contain id. Slug: ${slug}`);
  }

  return chapterId;
}

export const convertTitleToSlug = (title: string) => {
  return title
    .normalize('NFKD') // handle accents like "é" -> "e"
    .replace(/[\u0300-\u036F]/g, '') // remove accent marks
    .replace(/[^a-z0-9\s-]/gi, '') // remove special characters
    .trim() // trim leading/trailing whitespace
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // collapse multiple hyphens
    .toLowerCase(); // convert to lowercase
};

export const getItemPath = (type: 'tag' | 'category' | 'ranking', itemName: string): string =>
  type === 'category'
    ? `/genres/${itemName}`
    : type === 'tag'
      ? `/tags/${itemName}`
      : `/ranking/${itemName}`;

export const createUrlWithParams = (
  baseUrl: string,
  params: { [key: string]: string | number | boolean },
): string => {
  const url = new URL(baseUrl);

  if (params) {
    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined
        && params[key] !== null
        && params[key] !== ''
      ) {
        url.searchParams.append(key, params[key].toString());
      }
    });
  }
  return url.toString();
};

export const isClient = () => typeof window !== 'undefined';

export function parseSlug(slug: string) {
  // Decode from URL format (e.g., %20 to space)
  const decodedSlug = decodeURIComponent(slug); // "Galaxy fold 3-phone-4"

  // Split by "-" and get the last part as ID
  const parts = decodedSlug.split('-');
  const id = Number.parseInt(parts.pop() || '', 10); // 4

  // The type is the last remaining part after ID
  const type = parts.pop(); // "phone"

  // The name is everything before that
  const name = parts.join(' '); // "Galaxy fold 3"

  return {
    name,
    type,
    id,
  };
}

// Example usage:
// { name: 'Galaxy fold 3', type: 'phone', id: 4 }
