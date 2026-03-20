import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Insure Drive - Parametric Insurance for Riders',
  description: 'AI-driven parametric insurance for delivery riders in Chennai.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen text-slate-100 selection:bg-rose-500/30`}>
        {children}
      </body>
    </html>
  );
}
