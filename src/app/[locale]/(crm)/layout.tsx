import CRMLayout from '@/templates/CRMTemplate';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function CRMRootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <CRMLayout>
        {props.children}
      </CRMLayout>
    </NextIntlClientProvider>
  );
}
