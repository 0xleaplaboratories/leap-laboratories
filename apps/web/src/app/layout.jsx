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
  description: 'Leap Academy and Leap Labs — learning, research, and development.',
  google: 'notranslate',
  icons: {
    icon: '/logo-square.png',
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
