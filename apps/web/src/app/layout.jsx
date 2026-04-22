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
  description: 'Leap Laboratories - A system development and educational platform dedicated to advancing research, technical learning, and innovative software engineering.',
  authors: [{ name: 'Angga Sudarman' }],
  google: 'notranslate',
  icons: {
    icon: '/logo-square.png',
  },
  openGraph: {
    title: 'Leap Laboratories',
    description: 'Leap Laboratories - A System development and educational platform dedicated to advancing research, technical learning, and innovative software engineering.',
    url: SITE_URL,
    siteName: 'Leap Laboratories',
    images: [
      {
        url: '/assets/images/logo-bg.png',
        alt: 'Leap Laboratories System Development and Educational Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leap Laboratories',
    description: 'Leap Laboratories - A premier system development and educational platform dedicated to advancing research, technical learning, and innovative software engineering through Leap Academy.',
    images: ['/assets/images/logo-bg.png'],
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
