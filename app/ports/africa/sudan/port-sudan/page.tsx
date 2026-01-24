/**
 * @file app/ports/africa/sudan/port-sudan/page.tsx
 * @description Port Sudan port page (Sudan)
 *
 * Context: Red Sea port, strategic location
 */

import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Port Sudan, Sudan Port Guide | CIVSail',
  description:
    'Community-built port guide for Port Sudan, Sudan. Local recommendations and insider knowledge for MSC mariners visiting this strategic Red Sea port.',
  keywords: [
    'Port Sudan',
    'Sudan',
    'MSC',
    '5th Fleet',
    'CIVMAR',
    'port guide',
    'Red Sea',
    'strategic port',
  ],
  openGraph: {
    title: 'Port Sudan Port Guide | CIVSail',
    description: 'Port guide for MSC mariners visiting Port Sudan, Sudan',
    url: 'https://civsail.com/ports/africa/sudan/port-sudan',
    siteName: 'CIVSail',
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Port Sudan Port Guide | CIVSail',
    description: 'Community-built guide for mariners',
  },
  alternates: {
    canonical: 'https://civsail.com/ports/africa/sudan/port-sudan',
  },
};

export default function PortSudanPage() {
  return (
    <ComingSoonPortPage
      portName="Port Sudan"
      country="Sudan"
      countrySlug="sudan"
      countryFlag="🇸🇩"
      region="Africa"
      regionSlug="africa"
      fleet="5th Fleet AOR"
      coordinates={{ lat: 19.6158, lng: 37.2164 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Africa', href: '/ports/africa' },
        { label: 'Sudan', href: '/ports/africa/sudan' },
        { label: 'Port Sudan', href: '/ports/africa/sudan/port-sudan' },
      ]}
      relatedPorts={[
        {
          name: 'Camp Lemonnier',
          href: '/ports/africa/djibouti/camp-lemonnier',
          status: 'coming-soon',
        },
        {
          name: 'Cape Town',
          href: '/ports/africa/south-africa/cape-town',
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
