import { sfPro } from '@/app/fonts/sfPro';
import RefreshToken from '@/components/refresh-token';
import { Toaster } from '@/components/ui/sonner';
import { routing } from '@/libs/i18nRouting';
import TanstackProviders from '@/libs/providers/TanstackProvider';
import '@/styles/global.css';
import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-96x96.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-96x96.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  return (
    <html lang={locale} className={sfPro.variable}>
      <body className="min-h-screen">
        <div>
          <NextIntlClientProvider>
            <RefreshToken />
            <TanstackProviders>
              {props.children}
            </TanstackProviders>
            <Toaster
              position="top-center"
            />
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
