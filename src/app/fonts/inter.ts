import localFont from 'next/font/local';

export const inter = localFont({
  src: [
    {
      path: './fontsSrc/Inter-VariableFont_opsz,wght.ttf',
    }
  ],
  variable: '--font-inter',
});
