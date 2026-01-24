/**
 * @file app/ports/africa/south-africa/cape-town/page.tsx
 * @description Cape Town port page (South Africa)
 *
 * Context: Beautiful port city, tourist-friendly, good infrastructure
 */

import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Cape Town, South Africa Port Guide | CIVSail',
  description:
    'Community-built port guide for Cape Town, South Africa. Local recommendations and insider knowledge for MSC mariners visiting this beautiful, tourist-friendly port city.',
  keywords: [
    'Cape Town',
    'South Africa',
    'MSC',
    '5th Fleet',
    'CIVMAR',
    'port guide',
    'Table Mountain',
    'tourism',
  ],
  openGraph: {
    title: 'Cape Town Port Guide | CIVSail',
    description: 'Port guide for MSC mariners visiting Cape Town, South Africa',
    url: 'https://civsail.com/ports/africa/south-africa/cape-town',
    siteName: 'CIVSail',
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cape Town Port Guide | CIVSail',
    description: 'Community-built guide for mariners',
  },
  alternates: {
    canonical: 'https://civsail.com/ports/africa/south-africa/cape-town',
  },
};

export default function CapeTownPage() {
  return (
    <ComingSoonPortPage
      portName="Cape Town"
      country="South Africa"
      countrySlug="south-africa"
      countryFlag="🇿🇦"
      region="Africa"
      regionSlug="africa"
      fleet="5th Fleet AOR"
      coordinates={{ lat: -33.9249, lng: 18.4241 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Africa', href: '/ports/africa' },
        { label: 'South Africa', href: '/ports/africa/south-africa' },
        { label: 'Cape Town', href: '/ports/africa/south-africa/cape-town' },
      ]}
      relatedPorts={[
        {
          name: 'Port Sudan',
          href: '/ports/africa/sudan/port-sudan',
          status: 'coming-soon',
        },
        {
          name: 'Lagos',
          href: '/ports/africa/nigeria/lagos',
          status: 'coming-soon',
        },
        {
          name: 'Tema',
          href: '/ports/africa/ghana/tema',
          status: 'coming-soon',
        },
      ]}
    />
  );
}
