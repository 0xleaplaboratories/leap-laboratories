import './globals.css';

export const metadata = {
  title: 'Leap Laboratories',
  description: 'Leap Academy and Leap Labs — learning, research, and system development.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
