'use client';
import { checkAndRefreshToken } from '@/libs/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const UNAUTHENTICATED_PATH = ['/login', '/refresh-token', '/welcome', '/introduction', '/policy-terms', '/verify-email', '/verified', '/kyc'];

const RefreshToken = () => {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) {
      return;
    }
    let interval: any = null;
    const onRefreshToken = (force?: boolean) => {
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval);
          router.push('/login');
        },
        force
      });
    };
    onRefreshToken();
    // Timeout interval phải bé hơn thời gian hết hạn của access token
    // Ví dụ thời gian hết hạn access token là 10s thì 1s mình sẽ cho check 1 lần
    const TIMEOUT = 15000; // 15s;
    interval = setInterval(onRefreshToken, TIMEOUT);

    return () => {
      clearInterval(interval);
    };
  }, [pathname, router]);

  return null;
};

export default RefreshToken;
