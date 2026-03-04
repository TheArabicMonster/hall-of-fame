import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Poolrooms - Hall of Fame',
  description: 'An immersive liminal space gallery experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=VT323&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        {/* Noise overlay */}
        <div className="noise" />
        {children}
      </body>
    </html>
  );
}
