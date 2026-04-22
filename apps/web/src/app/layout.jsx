import { JetBrains_Mono } from 'next/font/google';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/atom-one-dark.css';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-primary',
  display: 'swap',
});

export const metadata = {
  title: 'Leap Laboratories',
  description: 'Leap Laboratories - System Development and Educational Platform.',
  google: 'notranslate',
  icons: {
    icon: '/logo-square.png',
  },
  openGraph: {
    title: 'Leap Laboratories',
    description: 'Leap Laboratories - System Development and Educational Platform.',
    url: 'https://leaplabs-pi.vercel.app',
    siteName: 'Leap Laboratories',
    images: [
      {
        url: '/hero-bg.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leap Laboratories',
    description: 'Leap Laboratories - System Development and Educational Platform.',
    images: ['/hero-bg.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} notranslate`} suppressHydrationWarning>
      <body className={jetbrainsMono.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
