import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { DM_Serif_Display, Sora, DM_Sans } from 'next/font/google';
import Navigation from '@/components/Navigation';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const dmSerif = DM_Serif_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: '400',
});

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'CIVSail — One Hub for Your Life as a Mariner',
  description:
    'Tools, intelligence, and career infrastructure for U.S. merchant mariners. Ship guides, port pages, pay calculators, and career resources — all in one place.',
  openGraph: {
    title: 'CIVSail — One Hub for Your Life as a Mariner',
    description:
      'Tools, intelligence, and career infrastructure for U.S. merchant mariners.',
    url: 'https://civsail.com',
  },
  alternates: {
    canonical: 'https://civsail.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSerif.variable} ${sora.variable} ${dmSans.variable} antialiased`}
      >
        <Navigation />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
