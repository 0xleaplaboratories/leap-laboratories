import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-primary',
  display: 'swap',
});

export const metadata = {
  title: 'Leap Laboratories',
  description: 'Leap Academy and Leap Labs — learning, research, and system development.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className={jetbrainsMono.className}>
        {children}
      </body>
    </html>
  );
}
