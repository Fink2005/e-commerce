import localFont from 'next/font/local';

export const poppins = localFont({
  src: [
    {
      path: './fontsSrc/Poppins-Regular.ttf',
    }
  ],
  variable: '--font-poppins',
});
