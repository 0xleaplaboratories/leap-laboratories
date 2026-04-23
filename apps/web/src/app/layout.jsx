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

const SITE_URL = 'https://leaplabs-pi.vercel.app';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Leap Laboratories',
  description: 'An advanced ecosystem for system development and technical education, dedicated to bridging the gap between technical knowledge and innovative software engineering.',
  authors: [{ name: 'Angga Sudarman' }],
  google: 'notranslate',
  icons: {
    icon: '/logo-square.png',
  },
  openGraph: {
    title: 'Leap Laboratories',
    description: 'An advanced ecosystem for system development and technical education, dedicated to bridging the gap between technical knowledge and innovative software engineering.',
    url: SITE_URL,
    siteName: 'Leap Laboratories',
    images: [
      {
        url: '/assets/images/share-icon.png',
        width: 1024,
        height: 1024,
        alt: 'Leap Laboratories logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leap Laboratories',
    description: 'An advanced ecosystem for system development and technical education, dedicated to bridging the gap between technical knowledge and innovative software engineering.',
    images: ['/assets/images/share-icon.png'],
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
