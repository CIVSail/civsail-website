/**
 * @file app/ports/africa/ghana/tema/page.tsx
 * @description Tema port page (Ghana)
 *
 * Context: Ghana's largest port, gateway to Accra
 */

import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Tema, Ghana Port Guide | CIVSail',
  description:
    "Community-built port guide for Tema, Ghana. Local recommendations and insider knowledge for MSC mariners visiting Ghana's largest port and gateway to Accra.",
  keywords: [
    'Tema',
    'Ghana',
    'MSC',
    '5th Fleet',
    'CIVMAR',
    'Accra',
    'port guide',
    'West Africa',
  ],
  openGraph: {
    title: 'Tema Port Guide | CIVSail',
    description: 'Port guide for MSC mariners visiting Tema, Ghana',
    url: 'https://civsail.com/ports/africa/ghana/tema',
    siteName: 'CIVSail',
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tema Port Guide | CIVSail',
    description: 'Community-built guide for mariners',
  },
  alternates: {
    canonical: 'https://civsail.com/ports/africa/ghana/tema',
  },
};

export default function TemaPage() {
  return (
    <ComingSoonPortPage
      portName="Tema"
      country="Ghana"
      countrySlug="ghana"
      countryFlag="🇬🇭"
      region="Africa"
      regionSlug="africa"
      fleet="5th Fleet AOR"
      coordinates={{ lat: 5.6215, lng: -0.0167 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Africa', href: '/ports/africa' },
        { label: 'Ghana', href: '/ports/africa/ghana' },
        { label: 'Tema', href: '/ports/africa/ghana/tema' },
      ]}
      relatedPorts={[
        {
          name: 'Lagos',
          href: '/ports/africa/nigeria/lagos',
          status: 'coming-soon',
        },
        {
          name: 'Cape Town',
          href: '/ports/africa/south-africa/cape-town',
          status: 'coming-soon',
        },
        {
          name: 'Camp Lemonnier',
          href: '/ports/africa/djibouti/camp-lemonnier',
          status: 'coming-soon',
        },
      ]}
    />
  );
}
