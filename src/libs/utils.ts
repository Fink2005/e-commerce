import authRequests from '@/app/apis/requests/auth';
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { jwtDecode } from 'jwt-decode';
import { twMerge } from 'tailwind-merge';
import { devtools } from 'zustand/middleware';
import { deleteCookie, getCookie } from '../app/actions/cookie';

interface TokenPayload {
  userId: number;
  isVerified: boolean;
  role: string;
  iat: number;
  exp: number;
}

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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const decodeToken = (token: string) => {
  return jwtDecode(token) as TokenPayload;
};

export const withDevTools = (fn: any) =>
  process.env.NEXT_PUBLIC_NOVEL_ENV !== 'prod' ? devtools(fn) : fn;

export function NumberFormat(number: number): string {
  const formatted = number.toLocaleString('de-DE');

  return formatted;
}

export const isClient = typeof window !== 'undefined';

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
  force?: boolean;
}) => {
  // Không nên đưa logic lấy access và refresh token ra khỏi cái function `checkAndRefreshToken`
  // Vì để mỗi lần mà checkAndRefreshToken() được gọi thì chúng ta se có một access và refresh token mới
  // Tránh hiện tượng bug nó lấy access và refresh token cũ ở lần đầu rồi gọi cho các lần tiếp theo
  const accessToken = await getCookie('access_token');
  const refreshToken = await getCookie('refresh_token');
  // Chưa đăng nhập thì cũng không cho chạy
  if (!accessToken || !refreshToken) {
    return;
  }
  const decodedAccessToken = decodeToken(accessToken);
  const decodedRefreshToken = decodeToken(refreshToken);
  // Thời điểm hết hạn của token là tính theo epoch time (s)
  // Còn khi các bạn dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)
  const now = Math.round(new Date().getTime() / 1000);
  // trường hợp refresh token hết hạn thì cho logout
  if (decodedRefreshToken.exp <= now) {
    deleteCookie('refresh_token');
    return param?.onError && param.onError();
  }
  // Ví dụ access token của chúng ta có thời gian hết hạn là 10s
  // thì mình sẽ kiểm tra còn 1/3 thời gian (3s) thì mình sẽ cho refresh token lại
  // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
  // Thời gian hết hạn của access token dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat

  // console.log( decodedAccessToken.exp - now ,  (decodedAccessToken.exp - decodedAccessToken.iat) ,
  //   (decodedAccessToken.exp - decodedAccessToken.iat) );
  //   console.log(accessToken, 'access ne');
  if (
    param?.force
    || decodedAccessToken.exp - now
    < (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    // Gọi API refresh token
    try {
      const tokens = await authRequests.serverRefreshToken();

      if (!tokens) {
        return param?.onError && param.onError();
      }
      param?.onSuccess && param.onSuccess();
    } catch {
      param?.onError && param.onError();
    }
  }
};
