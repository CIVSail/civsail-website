/**
 * @file app/ports/africa/djibouti/camp-lemonnier/page.tsx
 * @description Camp Lemonnier port page (Djibouti)
 *
 * Context: Primary U.S. military base in Africa, strategic Horn of Africa location
 */

import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Camp Lemonnier, Djibouti Port Guide | CIVSail',
  description:
    'Community-built port guide for Camp Lemonnier, Djibouti. Local recommendations, safety tips, and insider knowledge for MSC mariners visiting this strategic Horn of Africa base.',
  keywords: [
    'Camp Lemonnier',
    'Djibouti',
    'MSC',
    '5th Fleet',
    'CIVMAR',
    'Horn of Africa',
    'military base',
    'port guide',
  ],
  openGraph: {
    title: 'Camp Lemonnier Port Guide | CIVSail',
    description: 'Port guide for MSC mariners visiting Camp Lemonnier, Djibouti',
    url: 'https://civsail.com/ports/africa/djibouti/camp-lemonnier',
    siteName: 'CIVSail',
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Camp Lemonnier Port Guide | CIVSail',
    description: 'Community-built guide for mariners',
  },
  alternates: {
    canonical: 'https://civsail.com/ports/africa/djibouti/camp-lemonnier',
  },
};

export default function CampLemonnierPage() {
  return (
    <ComingSoonPortPage
      portName="Camp Lemonnier"
      country="Djibouti"
      countrySlug="djibouti"
      countryFlag="🇩🇯"
      region="Africa"
      regionSlug="africa"
      fleet="5th Fleet AOR"
      coordinates={{ lat: 11.5461, lng: 43.1456 }}
      portType="Naval Base"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Africa', href: '/ports/africa' },
        { label: 'Djibouti', href: '/ports/africa/djibouti' },
        { label: 'Camp Lemonnier', href: '/ports/africa/djibouti/camp-lemonnier' },
      ]}
      relatedPorts={[
        {
          name: 'Port Sudan',
          href: '/ports/africa/sudan/port-sudan',
          status: 'coming-soon',
        },
        {
          name: 'Tema',
          href: '/ports/africa/ghana/tema',
          status: 'coming-soon',
        },
        {
          name: 'Lagos',
          href: '/ports/africa/nigeria/lagos',
          status: 'coming-soon',
        },
      ]}
    />
  );
}
