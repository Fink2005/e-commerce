import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const baseConfig: NextConfig = {
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: ['@electric-sql/pglite'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mir-s3-cdn-cf.behance.net',
        port: '',
        pathname: '/project_modules/max_3840_webp/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/736x/f2/3a/38/f23a38384fb8ba462c37e87281bffbd0.jpg',
      },
      {
        protocol: 'https',
        hostname: 'shopflix.co.tz',
        port: '',
        pathname: '/public/uploads/all/WdQAdls0De2TefCYY3vLZWTaJH9Jm7LMDhEbPkTl.jpg',
      }
    ],
  },
};

const config = createNextIntlPlugin('./src/libs/i18n.ts')(baseConfig);

// Final export
export default config;
