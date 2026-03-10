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
  title: {
    default: 'CIVSail — Tools, Guides & Career Resources for U.S. Merchant Mariners',
    template: '%s | CIVSail',
  },
  description:
    'CIVSail is the leading career platform for U.S. merchant mariners and MSC CIVMARs. Pay calculators, ship class guides, interactive port maps, credential tracking, Maritime 101 career guides, and tools built by mariners for mariners. Covers Military Sealift Command, commercial shipping, NOAA, tugboats, offshore, and all sectors of the U.S. Merchant Marine.',
  keywords: [
    'merchant mariner',
    'CIVMAR',
    'MSC',
    'Military Sealift Command',
    'mariner pay calculator',
    'ship class guide',
    'port guide',
    'maritime career',
    'merchant marine',
    'USCG credentials',
    'MMC',
    'STCW',
    'TWIC',
    'sea time',
    'maritime jobs',
    'mariner tools',
    'CIVSail',
  ],
  openGraph: {
    type: 'website',
    siteName: 'CIVSail',
    title: 'CIVSail — Tools, Guides & Career Resources for U.S. Merchant Mariners',
    description:
      'Pay calculators, ship class guides, interactive port maps, and career resources for MSC CIVMARs and all U.S. merchant mariners.',
    url: 'https://civsail.com',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CIVSail — Tools & Career Resources for U.S. Merchant Mariners',
    description:
      'Pay calculators, ship class guides, port maps, and career resources for MSC CIVMARs and all U.S. merchant mariners.',
  },
  alternates: {
    canonical: 'https://civsail.com',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://civsail.com/#website',
        url: 'https://civsail.com',
        name: 'CIVSail',
        description:
          'Tools, guides, and career resources for U.S. merchant mariners and MSC CIVMARs.',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://civsail.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://civsail.com/#organization',
        name: 'CIVSail',
        url: 'https://civsail.com',
        description:
          'CIVSail is an independent, mariner-first platform providing pay calculators, ship class guides, port maps, credential tools, and career resources for U.S. merchant mariners. Built by mariners, for mariners. Covers MSC CIVMARs, commercial shipping, NOAA, tugboats, offshore, and all sectors of the U.S. Merchant Marine.',
        sameAs: [],
        knowsAbout: [
          'U.S. Merchant Marine',
          'Military Sealift Command',
          'CIVMAR careers',
          'Maritime credentials',
          'MMC',
          'STCW',
          'TWIC',
          'Merchant mariner pay',
          'Ship class guides',
          'Port guides for mariners',
          'Maritime career paths',
          'Sea time tracking',
          'Commercial shipping careers',
          'Tugboat careers',
          'Offshore maritime careers',
          'NOAA Corps',
          'Maritime training and licensing',
        ],
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
