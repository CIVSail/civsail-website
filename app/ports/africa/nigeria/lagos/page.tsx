/**
 * @file app/ports/africa/nigeria/lagos/page.tsx
 * @description Lagos port page (Nigeria)
 *
 * Context: Largest city in Africa, major commercial hub, security considerations
 */

import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Lagos, Nigeria Port Guide | CIVSail',
  description:
    "Community-built port guide for Lagos, Nigeria. Local recommendations, safety tips, and insider knowledge for MSC mariners visiting Africa's largest city and major commercial hub.",
  keywords: [
    'Lagos',
    'Nigeria',
    'MSC',
    '5th Fleet',
    'CIVMAR',
    'port guide',
    'West Africa',
    'commercial port',
  ],
  openGraph: {
    title: 'Lagos Port Guide | CIVSail',
    description: 'Port guide for MSC mariners visiting Lagos, Nigeria',
    url: 'https://civsail.com/ports/africa/nigeria/lagos',
    siteName: 'CIVSail',
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lagos Port Guide | CIVSail',
    description: 'Community-built guide for mariners',
  },
  alternates: {
    canonical: 'https://civsail.com/ports/africa/nigeria/lagos',
  },
};

export default function LagosPage() {
  return (
    <ComingSoonPortPage
      portName="Lagos"
      country="Nigeria"
      countrySlug="nigeria"
      countryFlag="🇳🇬"
      region="Africa"
      regionSlug="africa"
      fleet="5th Fleet AOR"
      coordinates={{ lat: 6.4541, lng: 3.3947 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Africa', href: '/ports/africa' },
        { label: 'Nigeria', href: '/ports/africa/nigeria' },
        { label: 'Lagos', href: '/ports/africa/nigeria/lagos' },
      ]}
      relatedPorts={[
        {
          name: 'Tema',
          href: '/ports/africa/ghana/tema',
          status: 'coming-soon',
        },
        {
          name: 'Cape Town',
          href: '/ports/africa/south-africa/cape-town',
          status: 'coming-soon',
        },
        {
          name: 'Port Sudan',
          href: '/ports/africa/sudan/port-sudan',
          status: 'coming-soon',
        },
      ]}
    />
  );
}
